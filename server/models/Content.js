import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  contentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    required: true,
    enum: ['youtube', 'article', 'podcast', 'course', 'custom'],
    index: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnail: String,
  
  // Embedding for semantic similarity
  embedding: {
    type: [Number],
    required: true,
    select: false // Don't include in regular queries for performance
  },
  
  metadata: {
    durationSec: { type: Number, default: 0 },
    lengthCategory: {
      type: String,
      enum: ['short', 'medium', 'long'],
      default: 'medium'
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    publishedAt: Date,
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    },
    category: {
      type: String,
      enum: ['programming', 'productivity', 'business', 'science', 'technology', 'design', 'other'],
      default: 'other'
    },
    language: { type: String, default: 'en' },
    transcript: { type: String, select: false }, // Store for embedding generation
    keyTopics: [String] // Extracted key topics for filtering
  },
  
  consumptionStats: {
    views: { type: Number, default: 0 },
    avgRetentionSec: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    completionRate: { type: Number, default: 0, min: 0, max: 1 },
    lastViewed: Date
  },
  
  aiAnalysis: {
    summary: String,
    keyPoints: [String],
    learningObjectives: [String],
    prerequisites: [String],
    estimatedLearningTime: Number, // in minutes
    complexityScore: { type: Number, min: 1, max: 10, default: 5 }
  },
  
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
contentSchema.index({ source: 1, 'metadata.category': 1 });
contentSchema.index({ 'metadata.tags': 1 });
contentSchema.index({ 'metadata.difficulty': 1 });
contentSchema.index({ 'metadata.publishedAt': -1 });
contentSchema.index({ 'consumptionStats.avgRating': -1 });
contentSchema.index({ createdAt: -1 });

// Virtual for formatted duration
contentSchema.virtual('formattedDuration').get(function() {
  if (!this.metadata.durationSec) return 'Unknown';
  
  const hours = Math.floor(this.metadata.durationSec / 3600);
  const minutes = Math.floor((this.metadata.durationSec % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
});

// Virtual for engagement score
contentSchema.virtual('engagementScore').get(function() {
  const rating = this.consumptionStats.avgRating || 0;
  const completion = this.consumptionStats.completionRate || 0;
  const views = Math.min(this.consumptionStats.views / 100, 1); // Normalize views
  
  return (rating * 0.4 + completion * 0.4 + views * 0.2) * 2; // Scale to 0-10
});

// Static method to find similar content
contentSchema.statics.findSimilar = async function(embedding, limit = 10, filters = {}) {
  const pipeline = [
    {
      $match: {
        isActive: true,
        ...filters
      }
    },
    {
      $addFields: {
        similarity: {
          $let: {
            vars: {
              dotProduct: {
                $sum: {
                  $map: {
                    input: { $range: [0, { $size: "$embedding" }] },
                    as: "i",
                    in: {
                      $multiply: [
                        { $arrayElemAt: ["$embedding", "$$i"] },
                        { $arrayElemAt: [embedding, "$$i"] }
                      ]
                    }
                  }
                }
              }
            },
            in: "$$dotProduct"
          }
        }
      }
    },
    { $sort: { similarity: -1 } },
    { $limit: limit },
    {
      $project: {
        embedding: 0,
        'metadata.transcript': 0
      }
    }
  ];
  
  return this.aggregate(pipeline);
};

// Static method to update consumption stats
contentSchema.statics.updateConsumptionStats = async function(contentId, stats) {
  const content = await this.findOne({ contentId });
  if (!content) return null;
  
  const currentStats = content.consumptionStats;
  
  // Update stats with weighted averages
  const updates = {
    'consumptionStats.views': currentStats.views + 1,
    'consumptionStats.lastViewed': new Date()
  };
  
  if (stats.retentionSec !== undefined) {
    const totalViews = currentStats.views + 1;
    updates['consumptionStats.avgRetentionSec'] = 
      ((currentStats.avgRetentionSec * currentStats.views) + stats.retentionSec) / totalViews;
  }
  
  if (stats.rating !== undefined) {
    const totalRatings = currentStats.totalRatings + 1;
    updates['consumptionStats.totalRatings'] = totalRatings;
    updates['consumptionStats.avgRating'] = 
      ((currentStats.avgRating * currentStats.totalRatings) + stats.rating) / totalRatings;
  }
  
  if (stats.completed !== undefined) {
    const totalViews = currentStats.views + 1;
    const completionValue = stats.completed ? 1 : 0;
    updates['consumptionStats.completionRate'] = 
      ((currentStats.completionRate * currentStats.views) + completionValue) / totalViews;
  }
  
  return this.findOneAndUpdate(
    { contentId },
    { $set: updates },
    { new: true }
  );
};

const Content = mongoose.model('Content', contentSchema);

export default Content;