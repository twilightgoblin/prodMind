import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    required: true
  },
  source: {
    type: String,
    enum: ['youtube', 'article', 'custom', 'audio'],
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'article', 'audio', 'custom'],
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  channelTitle: {
    type: String,
    default: ''
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // in seconds
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  summary: {
    type: String,
    default: ''
  },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'archived'],
    default: 'pending'
  },
  userId: {
    type: String, // For future user authentication
    default: 'default'
  },
  metadata: {
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
contentSchema.index({ userId: 1, createdAt: -1 });
contentSchema.index({ tags: 1 });
contentSchema.index({ priority: -1 });
contentSchema.index({ status: 1 });

export default mongoose.model('Content', contentSchema);