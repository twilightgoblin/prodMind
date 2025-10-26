import mongoose from 'mongoose';

const userContentInteractionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  contentId: {
    type: String,
    required: true,
    index: true
  },
  interactionType: {
    type: String,
    enum: ['view', 'like', 'dislike', 'bookmark', 'share', 'complete', 'skip'],
    required: true
  },
  
  // Viewing behavior
  watchTime: { type: Number, default: 0 }, // seconds watched
  totalDuration: { type: Number, default: 0 }, // total content duration
  completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
  watchedSegments: [{ // Track which parts were watched
    start: Number,
    end: Number
  }],
  
  // Engagement metrics
  rating: { type: Number, min: 1, max: 5 },
  feedback: String,
  timeSpent: { type: Number, default: 0 }, // total time on content page
  
  // Learning context
  learningGoalId: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningGoal' },
  sessionId: String, // Group interactions by learning session
  deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet'] },
  
  // Quiz/Assessment results (for post-video quizzes)
  quizResults: {
    score: { type: Number, min: 0, max: 100 },
    totalQuestions: Number,
    correctAnswers: Number,
    timeToComplete: Number, // seconds
    attempts: { type: Number, default: 1 },
    conceptsUnderstood: [String], // Topics user demonstrated understanding
    conceptsToReview: [String] // Topics user needs to review
  },
  
  // Behavioral insights
  pauseCount: { type: Number, default: 0 },
  rewindCount: { type: Number, default: 0 },
  speedChanges: [{ // Track playback speed changes
    timestamp: Number,
    speed: Number
  }],
  
  metadata: {
    userAgent: String,
    referrer: String,
    timestamp: { type: Date, default: Date.now },
    location: String // Geographic location if available
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
userContentInteractionSchema.index({ userId: 1, contentId: 1 });
userContentInteractionSchema.index({ userId: 1, interactionType: 1 });
userContentInteractionSchema.index({ userId: 1, createdAt: -1 });
userContentInteractionSchema.index({ contentId: 1, interactionType: 1 });

// Static method to get user's watch history
userContentInteractionSchema.statics.getWatchHistory = async function(userId, options = {}) {
  const { limit = 50, skip = 0, contentType = null } = options;
  
  const pipeline = [
    { $match: { userId: new mongoose.Types.ObjectId(userId), interactionType: 'view' } },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: 'contents',
        localField: 'contentId',
        foreignField: 'contentId',
        as: 'content'
      }
    },
    { $unwind: '$content' }
  ];
  
  if (contentType) {
    pipeline[0].$match['content.source'] = contentType;
  }
  
  return this.aggregate(pipeline);
};

// Static method to get learning analytics
userContentInteractionSchema.statics.getLearningAnalytics = async function(userId, timeframe = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - timeframe);
  
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalWatchTime: { $sum: '$watchTime' },
        totalContent: { $sum: 1 },
        avgCompletionRate: { $avg: '$completionPercentage' },
        avgRating: { $avg: '$rating' },
        totalQuizzes: { $sum: { $cond: [{ $ne: ['$quizResults.score', null] }, 1, 0] } },
        avgQuizScore: { $avg: '$quizResults.score' }
      }
    }
  ]);
};

export default mongoose.model('UserContentInteraction', userContentInteractionSchema);