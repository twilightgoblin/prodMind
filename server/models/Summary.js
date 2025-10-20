import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema({
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  mode: {
    type: String,
    enum: ['tldr', 'insight', 'detailed'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  keyInsights: [{
    type: String
  }],
  actionableItems: [{
    type: String
  }],
  mentalModels: [{
    type: String
  }],
  relatedTopics: [{
    type: String
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  timeToRead: {
    type: Number, // in minutes
    default: 5
  },
  originalContent: {
    title: String,
    source: String,
    url: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  notes: {
    type: String,
    default: ''
  },
  userId: {
    type: String,
    default: 'default'
  }
}, {
  timestamps: true
});

// Indexes
summarySchema.index({ contentId: 1 });
summarySchema.index({ userId: 1, createdAt: -1 });
summarySchema.index({ mode: 1 });
summarySchema.index({ tags: 1 });

export default mongoose.model('Summary', summarySchema);