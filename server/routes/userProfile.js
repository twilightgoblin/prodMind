import express from 'express';
import User from '../models/User.js';
import recommendationService from '../services/recommendationService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/user/profile/:id
 * Get user profile with learning analytics
 */
router.get('/profile/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify user access
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const user = await User.findById(id).select('-password -embedding');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate additional analytics
    const analytics = {
      profileCompleteness: calculateProfileCompleteness(user),
      learningStreak: calculateLearningStreak(user),
      skillProgression: calculateSkillProgression(user),
      recommendationReadiness: user.learningProfile?.interests?.length > 0
    };

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
          preferences: user.preferences,
          learningProfile: user.learningProfile,
          behaviorAnalytics: user.behaviorAnalytics,
          usage: user.usage,
          subscription: user.subscription,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        },
        analytics
      }
    });

  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/user/profile/update
 * Update user learning profile and preferences
 */
router.post('/profile/update', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      learningProfile,
      preferences,
      behaviorAnalytics
    } = req.body;

    const updateData = {};

    // Update learning profile
    if (learningProfile) {
      if (learningProfile.interests) {
        updateData['learningProfile.interests'] = learningProfile.interests.map(interest => ({
          topic: interest.topic,
          proficiency: interest.proficiency || 'intermediate',
          priority: Math.max(1, Math.min(10, interest.priority || 5))
        }));
      }

      if (learningProfile.learningGoals) {
        updateData['learningProfile.learningGoals'] = learningProfile.learningGoals.map(goal => ({
          title: goal.title,
          description: goal.description || '',
          targetDate: goal.targetDate ? new Date(goal.targetDate) : null,
          progress: Math.max(0, Math.min(100, goal.progress || 0)),
          createdAt: goal.createdAt || new Date()
        }));
      }

      if (learningProfile.preferredContentTypes) {
        const validTypes = ['video', 'article', 'podcast', 'course'];
        updateData['learningProfile.preferredContentTypes'] = learningProfile.preferredContentTypes
          .filter(type => validTypes.includes(type));
      }

      if (learningProfile.learningStyle) {
        const validStyles = ['visual', 'auditory', 'kinesthetic', 'reading'];
        if (validStyles.includes(learningProfile.learningStyle)) {
          updateData['learningProfile.learningStyle'] = learningProfile.learningStyle;
        }
      }

      if (learningProfile.availableTime) {
        updateData['learningProfile.availableTime'] = {
          dailyMinutes: Math.max(5, Math.min(480, learningProfile.availableTime.dailyMinutes || 60)),
          preferredTimes: learningProfile.availableTime.preferredTimes?.filter(time => 
            ['morning', 'afternoon', 'evening'].includes(time)
          ) || []
        };
      }
    }

    // Update preferences
    if (preferences) {
      if (preferences.theme && ['light', 'dark', 'system'].includes(preferences.theme)) {
        updateData['preferences.theme'] = preferences.theme;
      }

      if (preferences.notifications) {
        updateData['preferences.notifications'] = {
          email: Boolean(preferences.notifications.email),
          push: Boolean(preferences.notifications.push),
          scheduler: Boolean(preferences.notifications.scheduler)
        };
      }

      if (preferences.dashboard) {
        updateData['preferences.dashboard'] = {
          layout: preferences.dashboard.layout || 'grid',
          itemsPerPage: Math.max(6, Math.min(24, preferences.dashboard.itemsPerPage || 12))
        };
      }
    }

    // Update behavior analytics (admin only or specific fields)
    if (behaviorAnalytics && req.user.role === 'admin') {
      Object.keys(behaviorAnalytics).forEach(key => {
        if (key !== 'lastAnalyticsUpdate') {
          updateData[`behaviorAnalytics.${key}`] = behaviorAnalytics[key];
        }
      });
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -embedding');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Regenerate user embedding if learning profile changed
    if (learningProfile) {
      await recommendationService.generateUserEmbedding(userId);
    }

    res.json({
      success: true,
      data: {
        user: updatedUser,
        embeddingRegenerated: !!learningProfile
      }
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/user/learning-goals
 * Add or update learning goals
 */
router.post('/learning-goals', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { goals } = req.body;

    if (!Array.isArray(goals)) {
      return res.status(400).json({
        success: false,
        message: 'Goals must be an array'
      });
    }

    const validatedGoals = goals.map(goal => ({
      title: goal.title,
      description: goal.description || '',
      targetDate: goal.targetDate ? new Date(goal.targetDate) : null,
      progress: Math.max(0, Math.min(100, goal.progress || 0)),
      createdAt: goal.createdAt || new Date()
    }));

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { 'learningProfile.learningGoals': validatedGoals } },
      { new: true, runValidators: true }
    ).select('learningProfile.learningGoals');

    // Regenerate user embedding
    await recommendationService.generateUserEmbedding(userId);

    res.json({
      success: true,
      data: {
        learningGoals: updatedUser.learningProfile.learningGoals,
        embeddingRegenerated: true
      }
    });

  } catch (error) {
    console.error('Error updating learning goals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update learning goals',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PUT /api/user/learning-goals/:goalIndex/progress
 * Update progress for a specific learning goal
 */
router.put('/learning-goals/:goalIndex/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { goalIndex } = req.params;
    const { progress } = req.body;

    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be between 0 and 100'
      });
    }

    const user = await User.findById(userId);
    if (!user || !user.learningProfile?.learningGoals?.[goalIndex]) {
      return res.status(404).json({
        success: false,
        message: 'User or learning goal not found'
      });
    }

    const updatePath = `learningProfile.learningGoals.${goalIndex}.progress`;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { [updatePath]: progress } },
      { new: true }
    ).select('learningProfile.learningGoals');

    res.json({
      success: true,
      data: {
        goalIndex: parseInt(goalIndex),
        progress,
        learningGoals: updatedUser.learningProfile.learningGoals
      }
    });

  } catch (error) {
    console.error('Error updating goal progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update goal progress',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/user/dashboard/:userId
 * Get personalized dashboard data
 */
router.get('/dashboard/:userId', authenticateToken, async (req, res) => {
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

    // Get personalized recommendations
    const recommendations = await recommendationService.getPersonalizedRecommendations(
      userId,
      { limit: 6 }
    );

    // Get trending content with personalization
    const trending = await recommendationService.getTrendingWithPersonalization(
      userId,
      { limit: 4 }
    );

    // Calculate dashboard widgets data
    const dashboardData = {
      user: {
        firstName: user.firstName,
        avatar: user.avatar,
        learningProfile: user.learningProfile,
        behaviorAnalytics: user.behaviorAnalytics
      },
      widgets: {
        learningGoalsTracker: {
          goals: user.learningProfile?.learningGoals || [],
          completedGoals: user.learningProfile?.learningGoals?.filter(g => g.progress >= 100).length || 0,
          activeGoals: user.learningProfile?.learningGoals?.filter(g => g.progress < 100).length || 0
        },
        recommendedContent: recommendations.slice(0, 6),
        trendingContent: trending.slice(0, 4),
        skillProgress: calculateSkillProgression(user),
        learningInsights: generateLearningInsights(user),
        weeklyStats: {
          contentConsumed: user.usage?.videosWatched || 0,
          notesCreated: user.usage?.notesCreated || 0,
          averageSessionTime: user.behaviorAnalytics?.averageSessionDuration || 0,
          completionRate: user.behaviorAnalytics?.contentCompletionRate || 0
        }
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper functions

function calculateProfileCompleteness(user) {
  let score = 0;
  const maxScore = 100;

  // Basic info (20 points)
  if (user.firstName && user.lastName) score += 10;
  if (user.avatar) score += 10;

  // Learning profile (60 points)
  if (user.learningProfile?.interests?.length > 0) score += 20;
  if (user.learningProfile?.learningGoals?.length > 0) score += 15;
  if (user.learningProfile?.preferredContentTypes?.length > 0) score += 10;
  if (user.learningProfile?.learningStyle) score += 10;
  if (user.learningProfile?.availableTime?.dailyMinutes > 0) score += 5;

  // Preferences (20 points)
  if (user.preferences?.theme) score += 5;
  if (user.preferences?.notifications) score += 5;
  if (user.preferences?.dashboard) score += 10;

  return Math.min(maxScore, score);
}

function calculateLearningStreak(user) {
  // This would require tracking daily learning activities
  // For now, return a placeholder based on recent activity
  const daysSinceLastLogin = user.lastLogin ? 
    Math.floor((Date.now() - new Date(user.lastLogin).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  
  return Math.max(0, 7 - daysSinceLastLogin); // Simple streak calculation
}

function calculateSkillProgression(user) {
  if (!user.learningProfile?.interests?.length) return [];

  return user.learningProfile.interests.map(interest => ({
    topic: interest.topic,
    proficiency: interest.proficiency,
    priority: interest.priority,
    progress: Math.min(100, (interest.priority * 10) + Math.random() * 20) // Placeholder calculation
  }));
}

function generateLearningInsights(user) {
  const insights = [];

  // Completion rate insight
  const completionRate = user.behaviorAnalytics?.contentCompletionRate || 0;
  if (completionRate < 0.5) {
    insights.push({
      type: 'improvement',
      title: 'Boost Your Completion Rate',
      message: 'Try shorter content or break longer sessions into smaller chunks.',
      priority: 'high'
    });
  } else if (completionRate > 0.8) {
    insights.push({
      type: 'achievement',
      title: 'Excellent Completion Rate!',
      message: 'You\'re consistently finishing the content you start.',
      priority: 'low'
    });
  }

  // Learning velocity insight
  const velocity = user.behaviorAnalytics?.learningVelocity || 1;
  if (velocity > 1.5) {
    insights.push({
      type: 'suggestion',
      title: 'Ready for Advanced Content',
      message: 'Consider exploring more challenging topics to match your learning pace.',
      priority: 'medium'
    });
  }

  // Goal progress insight
  const activeGoals = user.learningProfile?.learningGoals?.filter(g => g.progress < 100) || [];
  if (activeGoals.length > 3) {
    insights.push({
      type: 'suggestion',
      title: 'Focus Your Learning',
      message: 'Consider focusing on 2-3 goals at a time for better results.',
      priority: 'medium'
    });
  }

  return insights;
}

export default router;