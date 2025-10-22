import mongoose from 'mongoose';

const videoNotesSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    index: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: true,
    maxlength: 5000 // Limit notes to 5000 characters
  },
  userId: {
    type: String,
    default: 'default_user', // For now, using default user
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index for efficient queries
videoNotesSchema.index({ videoId: 1, userId: 1 });

// Update the updatedAt field on save
videoNotesSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const VideoNotes = mongoose.model('VideoNotes', videoNotesSchema);

export default VideoNotes;