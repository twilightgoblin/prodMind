import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import { logger } from '../middleware/logger.js';
import { AppError, ValidationError, UnauthorizedError } from '../middleware/errorHandler.js';

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 signup attempts per hour
  message: {
    error: 'Too many signup attempts, please try again later.',
    retryAfter: '1 hour'
  }
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      issuer: 'prodmind-api',
      audience: 'prodmind-app'
    }
  );
};

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new UnauthorizedError('Access token required');
    }

    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
    );

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new UnauthorizedError('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new UnauthorizedError('Token expired'));
    } else {
      next(error);
    }
  }
};

// Optional auth middleware (doesn't throw error if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
      );
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // Silently continue without user
    next();
  }
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', signupLimiter, async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      throw new ValidationError('All fields are required');
    }

    if (password !== confirmPassword) {
      throw new ValidationError('Passwords do not match');
    }

    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }

    // Check password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      throw new ValidationError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ValidationError('User with this email already exists');
    }

    // Create new user
    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/signin
// @desc    Authenticate user and get token
// @access  Public
router.post('/signin', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Find user and check password
    const user = await User.findByCredentials(email.toLowerCase(), password);

    // Generate token
    const token = generateToken(user._id);

    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.loginAttempts;
    delete userResponse.lockUntil;

    logger.info(`User signed in: ${user.email}`);

    res.json({
      success: true,
      message: 'Signed in successfully',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/signout
// @desc    Sign out user (client-side token removal)
// @access  Private
router.post('/signout', authenticateToken, async (req, res, next) => {
  try {
    logger.info(`User signed out: ${req.user.email}`);
    
    res.json({
      success: true,
      message: 'Signed out successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      data: {
        user: userResponse
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, async (req, res, next) => {
  try {
    const { firstName, lastName, preferences } = req.body;
    const user = req.user;

    // Update allowed fields
    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    logger.info(`User profile updated: ${user.email}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: userResponse
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', authenticateToken, async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new ValidationError('All password fields are required');
    }

    if (newPassword !== confirmPassword) {
      throw new ValidationError('New passwords do not match');
    }

    if (newPassword.length < 8) {
      throw new ValidationError('New password must be at least 8 characters long');
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', authenticateToken, async (req, res, next) => {
  try {
    const stats = await User.getUserStats(req.user._id);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

export default router;