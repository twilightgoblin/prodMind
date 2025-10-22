import mongoose from 'mongoose';

const scheduledContentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contentId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  thumbnail: String,
  url: {
    type: String,
    required: true
  },
  channelTitle: String,
  duration: String,
  source: {
    type: String,
    default: 'youtube'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'in-progress'],
    default: 'scheduled'
  },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  tags: [String],
  notes: String,
  reminderSent: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  estimatedDuration: Number, // in minutes
  actualDuration: Number, // in minutes
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String
}, {
  timestamps: true
});

// Index for efficient queries
scheduledContentSchema.index({ userId: 1, scheduledDate: 1 });
scheduledContentSchema.index({ userId: 1, status: 1 });

export default mongoose.model('ScheduledContent', scheduledContentSchema);