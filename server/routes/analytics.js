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

// Generate post-content quiz
router.post('/quiz/generate', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { contentId } = req.body;

    console.log(`🎯 Quiz generation request - User: ${userId}, Content: ${contentId}`);

    if (!contentId) {
      console.log('❌ Missing contentId in quiz generation request');
      return res.status(400).json({
        success: false,
        message: 'contentId is required'
      });
    }

    console.log('🔄 Generating quiz...');
    const result = await userAnalyticsService.generatePostContentQuiz(userId, contentId);
    
    if (result.success) {
      console.log(`✅ Quiz generated successfully: ${result.quiz.title} (${result.quiz.questions.length} questions)`);
    } else {
      console.log('❌ Quiz generation failed:', result.message);
    }
    
    res.json(result);
  } catch (error) {
    console.error('❌ Error generating quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate quiz',
      error: error.message
    });
  }
});

// Submit quiz results
router.post('/quiz/submit', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { contentId, quizId, answers, timeToComplete } = req.body;

    // Calculate quiz score
    const Quiz = (await import('../models/Quiz.js')).default;
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    let correctAnswers = 0;
    const detailedResults = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[question.id];
      const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer);
      
      if (isCorrect) correctAnswers++;
      
      detailedResults.push({
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      });
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    // Track quiz interaction
    const quizResults = {
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeToComplete,
      conceptsUnderstood: detailedResults
        .filter(r => r.isCorrect)
        .map(r => quiz.questions.find(q => q.id === r.questionId)?.concepts || [])
        .flat(),
      conceptsToReview: detailedResults
        .filter(r => !r.isCorrect)
        .map(r => quiz.questions.find(q => q.id === r.questionId)?.concepts || [])
        .flat()
    };

    await userAnalyticsService.trackInteraction(userId, {
      contentId,
      interactionType: 'complete',
      quizResults,
      metadata: {
        quizId,
        detailedResults
      }
    });

    res.json({
      success: true,
      results: {
        score,
        passed: score >= quiz.passingScore,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        detailedResults,
        conceptsToReview: quizResults.conceptsToReview
      }
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz',
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