import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  avatar: {
    type: String,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'dark'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      scheduler: { type: Boolean, default: true }
    },
    dashboard: {
      layout: { type: String, default: 'grid' },
      itemsPerPage: { type: Number, default: 12 }
    }
  },
  learningProfile: {
    interests: [{
      topic: { type: String, required: true },
      proficiency: { 
        type: String, 
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate'
      },
      priority: { type: Number, min: 1, max: 10, default: 5 }
    }],
    learningGoals: [{
      title: { type: String, required: true },
      description: String,
      targetDate: Date,
      progress: { type: Number, min: 0, max: 100, default: 0 },
      createdAt: { type: Date, default: Date.now }
    }],
    preferredContentTypes: [{
      type: String,
      enum: ['video', 'article', 'podcast', 'course']
    }],
    learningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'kinesthetic', 'reading'],
      default: 'visual'
    },
    availableTime: {
      dailyMinutes: { type: Number, default: 60 },
      preferredTimes: [{
        type: String,
        enum: ['morning', 'afternoon', 'evening']
      }]
    }
  },
  behaviorAnalytics: {
    contentCompletionRate: { type: Number, default: 0, min: 0, max: 1 },
    averageSessionDuration: { type: Number, default: 0 }, // in minutes
    preferredContentDifficulty: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate' 
    },
    mostActiveHours: [{ type: Number, min: 0, max: 23 }],
    learningVelocity: { type: Number, default: 1, min: 0.1, max: 3 },
    retentionRate: { type: Number, default: 0.8, min: 0, max: 1 },
    totalContentConsumed: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    lastAnalyticsUpdate: { type: Date, default: Date.now }
  },
  embedding: {
    type: [Number],
    default: null,
    select: false // Don't include in regular queries for performance
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled'],
      default: 'active'
    },
    expiresAt: Date,
    stripeCustomerId: String
  },
  usage: {
    videosWatched: { type: Number, default: 0 },
    notesCreated: { type: Number, default: 0 },
    scheduledItems: { type: Number, default: 0 },
    apiCalls: { type: Number, default: 0 }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Index for performance (email index is created by unique: true)
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLogin: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Static method to find user by email with password
userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Check if account is locked
  if (user.isLocked) {
    await user.incLoginAttempts();
    throw new Error('Account temporarily locked due to too many failed login attempts');
  }
  
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    await user.incLoginAttempts();
    throw new Error('Invalid credentials');
  }
  
  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }
  
  // Update last login
  user.lastLogin = new Date();
  await user.save();
  
  return user;
};

// Static method to get user stats
userSchema.statics.getUserStats = async function(userId) {
  const user = await this.findById(userId);
  if (!user) throw new Error('User not found');
  
  return {
    totalUsers: await this.countDocuments(),
    userSince: user.createdAt,
    usage: user.usage,
    subscription: user.subscription
  };
};

const User = mongoose.model('User', userSchema);

export default User;