import express from 'express';
import userAnalyticsService from '../services/userAnalyticsService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Track user interaction with content
router.post('/track', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      contentId,
      interactionType,
      watchTime,
      totalDuration,
      completionPercentage,
      rating,
      quizResults,
      metadata
    } = req.body;

    if (!contentId || !interactionType) {
      return res.status(400).json({
        success: false,
        message: 'contentId and interactionType are required'
      });
    }

    const result = await userAnalyticsService.trackInteraction(userId, {
      contentId,
      interactionType,
      watchTime,
      totalDuration,
      completionPercentage,
      rating,
      quizResults,
      metadata: {
        ...metadata,
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Error tracking interaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track interaction',
      error: error.message
    });
  }
});

// Get user analytics
router.get('/user/:timeframe?', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const timeframe = parseInt(req.params.timeframe) || 30;

    const result = await userAnalyticsService.getUserAnalytics(userId, timeframe);
    res.json(result);
  } catch (error) {
    console.error('Error getting user analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user analytics',
      error: error.message
    });
  }
});

// Get user's watch history
router.get('/watch-history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, skip = 0, contentType } = req.query;

    const UserContentInteraction = (await import('../models/UserContentInteraction.js')).default;
    const history = await UserContentInteraction.getWatchHistory(userId, {
      limit: parseInt(limit),
      skip: parseInt(skip),
      contentType
    });

    res.json({
      success: true,
      history,
      pagination: {
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: history.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error getting watch history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get watch history',
      error: error.message
    });
  }
});

// Get user quiz statistics
router.get('/quiz/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await userAnalyticsService.getUserQuizStats(userId);
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error getting quiz stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get quiz statistics',
      error: error.message
    });
  }
});

// Get learning insights
router.get('/insights', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get comprehensive learning insights
    const analytics = await userAnalyticsService.getUserAnalytics(userId, 30);
    
    if (!analytics.success) {
      return res.status(500).json(analytics);
    }

    // Generate actionable insights
    const insights = {
      learningVelocity: analytics.analytics.overview.totalContent > 10 ? 'high' : 'moderate',
      strongAreas: analytics.analytics.skillProgress
        .filter(skill => skill.avgQuizScore >= 80)
        .map(skill => skill._id),
      improvementAreas: analytics.analytics.skillProgress
        .filter(skill => skill.avgQuizScore < 70)
        .map(skill => skill._id),
      recommendations: []
    };

    // Generate personalized recommendations
    if (insights.improvementAreas.length > 0) {
      insights.recommendations.push({
        type: 'skill_improvement',
        message: `Focus on improving ${insights.improvementAreas.slice(0, 2).join(' and ')}`,
        action: 'Take more quizzes in these areas'
      });
    }

    if (analytics.analytics.learningStreak < 3) {
      insights.recommendations.push({
        type: 'consistency',
        message: 'Build a consistent learning habit',
        action: 'Try to learn something new every day'
      });
    }

    res.json({
      success: true,
      insights,
      analytics: analytics.analytics
    });
  } catch (error) {
    console.error('Error getting learning insights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get learning insights',
      error: error.message
    });
  }
});

export default router;