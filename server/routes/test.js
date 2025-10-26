import express from 'express';
import Quiz from '../models/Quiz.js';
import UserContentInteraction from '../models/UserContentInteraction.js';
import userAnalyticsService from '../services/userAnalyticsService.js';

const router = express.Router();

// Test content data
const testContent = {
  'test_js_basics': {
    contentId: 'test_js_basics',
    title: 'JavaScript Tutorial for Beginners',
    description: 'Learn JavaScript fundamentals including variables, functions, and DOM manipulation.',
    url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
    duration: 3600,
    category: 'Programming',
    difficulty: 'beginner',
    tags: ['javascript', 'programming', 'web-development'],
    thumbnail: 'https://img.youtube.com/vi/PkZNo7MFNFg/maxresdefault.jpg'
  }
};

// Get test content by ID
router.get('/content/:contentId', (req, res) => {
  try {
    const { contentId } = req.params;
    const content = testContent[contentId];
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Test content not found'
      });
    }
    
    res.json({
      success: true,
      content
    });
  } catch (error) {
    console.error('Error getting test content:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test quiz generation
router.post('/quiz/:contentId', async (req, res) => {
  try {
    const { contentId } = req.params;
    
    const quiz = await Quiz.generateFromContent(contentId, {
      difficulty: 'intermediate'
    });
    
    await quiz.save();
    
    res.json({
      success: true,
      quiz,
      message: 'Quiz generated successfully'
    });
  } catch (error) {
    console.error('Error generating test quiz:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test interaction tracking
router.post('/interaction', async (req, res) => {
  try {
    const {
      userId = '507f1f77bcf86cd799439011', // Mock user ID
      contentId,
      interactionType = 'view',
      watchTime = 300,
      completionPercentage = 100
    } = req.body;

    const result = await userAnalyticsService.trackInteraction(userId, {
      contentId,
      interactionType,
      watchTime,
      completionPercentage,
      metadata: {
        test: true,
        timestamp: new Date()
      }
    });

    res.json({
      success: true,
      result,
      message: 'Interaction tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking test interaction:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all interactions for testing
router.get('/interactions', async (req, res) => {
  try {
    const interactions = await UserContentInteraction.find({})
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      interactions,
      count: interactions.length
    });
  } catch (error) {
    console.error('Error getting test interactions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all quizzes for testing
router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find({})
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      quizzes,
      count: quizzes.length
    });
  } catch (error) {
    console.error('Error getting test quizzes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;