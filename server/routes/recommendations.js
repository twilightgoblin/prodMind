import express from 'express';
import recommendationService from '../services/recommendationService.js';
import Content from '../models/Content.js';
import User from '../models/User.js';
import embeddingUtils from '../utils/embeddingUtils.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/recommendations/trending/:userId?
 * Get trending content with optional personalization
 */
router.get('/trending/:userId?', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;

    const trending = await recommendationService.getTrendingWithPersonalization(
      userId,
      { limit: parseInt(limit) }
    );

    res.json({
      success: true,
      data: {
        trending,
        count: trending.length,
        personalized: !!userId
      }
    });

  } catch (error) {
    console.error('Error getting trending content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trending content',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/recommendations/:userId
 * Get personalized content recommendations for a user
 */
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      limit = 10,
      excludeViewed = 'true',
      contentTypes,
      difficulty,
      maxDuration
    } = req.query;

    // Verify user access
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const options = {
      limit: parseInt(limit),
      excludeViewed: excludeViewed === 'true',
      contentTypes: contentTypes ? contentTypes.split(',') : null,
      difficulty: difficulty || null,
      maxDuration: maxDuration ? parseInt(maxDuration) : null
    };

    const recommendations = await recommendationService.getPersonalizedRecommendations(
      userId,
      options
    );

    res.json({
      success: true,
      data: {
        recommendations,
        count: recommendations.length,
        userId,
        options
      }
    });

  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/recommendations/interaction
 * Record user interaction with content and update embeddings
 */
router.post('/interaction', authenticateToken, async (req, res) => {
  try {
    const {
      contentId,
      interactionType, // 'view', 'complete', 'rate', 'bookmark'
      rating,
      timeSpent,
      completed,
      bookmarked
    } = req.body;

    const userId = req.user.id;

    if (!contentId || !interactionType) {
      return res.status(400).json({
        success: false,
        message: 'Content ID and interaction type are required'
      });
    }

    // Update content consumption stats
    const statsUpdate = {};
    if (rating !== undefined) statsUpdate.rating = rating;
    if (timeSpent !== undefined) statsUpdate.retentionSec = timeSpent;
    if (completed !== undefined) statsUpdate.completed = completed;

    if (Object.keys(statsUpdate).length > 0) {
      await Content.updateConsumptionStats(contentId, statsUpdate);
    }

    // Update user embedding based on interaction
    const interaction = {
      rating: rating || 0,
      timeSpent: timeSpent || 0,
      completed: completed || false,
      bookmarked: bookmarked || false
    };

    const embeddingUpdated = await recommendationService.updateUserEmbeddingFromInteraction(
      userId,
      contentId,
      interaction
    );

    // Update user behavior analytics
    const user = await User.findById(userId);
    if (user && timeSpent) {
      const currentAvgDuration = user.behaviorAnalytics.averageSessionDuration || 0;
      const totalSessions = user.usage.videosWatched || 1;
      
      const newAvgDuration = ((currentAvgDuration * totalSessions) + (timeSpent / 60)) / (totalSessions + 1);
      
      const updates = {
        'behaviorAnalytics.averageSessionDuration': newAvgDuration,
        'behaviorAnalytics.lastAnalyticsUpdate': new Date()
      };

      if (completed) {
        const currentCompletionRate = user.behaviorAnalytics.contentCompletionRate || 0;
        const newCompletionRate = ((currentCompletionRate * totalSessions) + 1) / (totalSessions + 1);
        updates['behaviorAnalytics.contentCompletionRate'] = newCompletionRate;
      }

      await User.findByIdAndUpdate(userId, { $set: updates });
    }

    res.json({
      success: true,
      data: {
        interactionRecorded: true,
        embeddingUpdated,
        contentId,
        interactionType
      }
    });

  } catch (error) {
    console.error('Error recording interaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record interaction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/recommendations/refresh-embedding/:userId
 * Regenerate user embedding based on current profile
 */
router.post('/refresh-embedding/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user access
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const success = await recommendationService.generateUserEmbedding(userId);

    if (success) {
      res.json({
        success: true,
        data: {
          embeddingGenerated: true,
          userId
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to generate user embedding'
      });
    }

  } catch (error) {
    console.error('Error refreshing user embedding:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh embedding',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/recommendations/similar/:contentId
 * Get content similar to a specific piece of content
 */
router.get('/similar/:contentId', async (req, res) => {
  try {
    const { contentId } = req.params;
    const { limit = 5 } = req.query;

    const content = await Content.findOne({ contentId }).select('embedding');
    if (!content?.embedding) {
      return res.status(404).json({
        success: false,
        message: 'Content not found or no embedding available'
      });
    }

    const similarContent = await Content.findSimilar(
      content.embedding,
      parseInt(limit) + 1, // +1 to exclude the original content
      { contentId: { $ne: contentId } }
    );

    res.json({
      success: true,
      data: {
        similar: similarContent.slice(0, parseInt(limit)),
        count: similarContent.length,
        originalContentId: contentId
      }
    });

  } catch (error) {
    console.error('Error getting similar content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get similar content',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/recommendations/content/ingest
 * Ingest new content and generate embedding
 */
router.post('/content/ingest', authenticateToken, async (req, res) => {
  try {
    const {
      contentId,
      title,
      description,
      source,
      url,
      metadata = {},
      aiAnalysis = {}
    } = req.body;

    if (!contentId || !title || !source || !url) {
      return res.status(400).json({
        success: false,
        message: 'Content ID, title, source, and URL are required'
      });
    }

    // Check if content already exists
    const existingContent = await Content.findOne({ contentId });
    if (existingContent) {
      return res.status(409).json({
        success: false,
        message: 'Content already exists'
      });
    }

    // Generate embedding for the content
    const contentData = {
      title,
      description,
      metadata,
      aiAnalysis
    };

    const embedding = await embeddingUtils.generateContentEmbedding(contentData);

    // Create content document
    const content = new Content({
      contentId,
      title,
      description,
      source,
      url,
      embedding,
      metadata: {
        durationSec: metadata.durationSec || 0,
        lengthCategory: metadata.lengthCategory || 'medium',
        tags: metadata.tags || [],
        publishedAt: metadata.publishedAt || new Date(),
        difficulty: metadata.difficulty || 'intermediate',
        category: metadata.category || 'other',
        language: metadata.language || 'en',
        transcript: metadata.transcript,
        keyTopics: metadata.keyTopics || []
      },
      aiAnalysis: {
        summary: aiAnalysis.summary,
        keyPoints: aiAnalysis.keyPoints || [],
        learningObjectives: aiAnalysis.learningObjectives || [],
        prerequisites: aiAnalysis.prerequisites || [],
        estimatedLearningTime: aiAnalysis.estimatedLearningTime || 0,
        complexityScore: aiAnalysis.complexityScore || 5
      },
      createdBy: req.user.id
    });

    await content.save();

    res.status(201).json({
      success: true,
      data: {
        content: {
          contentId: content.contentId,
          title: content.title,
          source: content.source,
          metadata: content.metadata,
          embeddingGenerated: true
        }
      }
    });

  } catch (error) {
    console.error('Error ingesting content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to ingest content',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/recommendations/analytics/:userId
 * Get recommendation analytics for a user
 */
router.get('/analytics/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user access
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get recent recommendations performance
    // This would require a RecommendationHistory model to track clicks/views
    // For now, return user analytics

    const analytics = {
      learningProfile: {
        interestsCount: user.learningProfile?.interests?.length || 0,
        goalsCount: user.learningProfile?.learningGoals?.length || 0,
        activeGoals: user.learningProfile?.learningGoals?.filter(g => g.progress < 100).length || 0,


        dailyTimeAvailable: user.learningProfile?.availableTime?.dailyMinutes || 0
      },
      behaviorAnalytics: user.behaviorAnalytics,
      usage: user.usage,
      embeddingStatus: {
        hasEmbedding: !!user.embedding,
        lastUpdated: user.behaviorAnalytics?.lastAnalyticsUpdate
      }
    };

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Error getting recommendation analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;