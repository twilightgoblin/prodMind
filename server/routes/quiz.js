import express from 'express';
import { getQuizQuestions, submitQuizAnswers, getQuizHistory, deleteQuiz, clearQuizHistory } from '../services/quizService.js';

const router = express.Router();

// Get quiz questions based on topic/keyword
router.post('/generate', async (req, res) => {
  try {
    const { topic, keyword } = req.body;
    
    if (!topic && !keyword) {
      return res.status(400).json({ 
        error: 'Either topic or keyword is required' 
      });
    }

    console.log('Generating quiz for topic:', topic || keyword);
    const quiz = await getQuizQuestions(topic || keyword);
    
    res.json({
      success: true,
      quiz
    });
  } catch (error) {
    console.error('Quiz generation error:', error);
    console.error('Error stack:', error.stack);
    
    // Return more specific error for insufficient questions
    if (error.message.includes('Insufficient questions') || 
        error.message.includes('No question bank found') ||
        error.message.includes('No questions available')) {
      return res.status(404).json({ 
        error: 'Topic not available',
        message: error.message,
        suggestion: 'This topic does not have enough questions yet. Try another topic like: java, javascript, python, nodejs, react, or cpp.'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate quiz',
      message: error.message 
    });
  }
});

// Submit quiz answers and get results
router.post('/submit', async (req, res) => {
  try {
    const { quizId, answers, userId } = req.body;
    
    if (!quizId || !answers) {
      return res.status(400).json({ 
        error: 'Quiz ID and answers are required' 
      });
    }

    const result = await submitQuizAnswers(quizId, answers, userId);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ 
      error: 'Failed to submit quiz',
      message: error.message 
    });
  }
});

// Get user's quiz history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await getQuizHistory(userId);
    
    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Quiz history error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch quiz history',
      message: error.message 
    });
  }
});

// Delete a specific quiz from history
router.delete('/history/:userId/:quizId', async (req, res) => {
  try {
    const { userId, quizId } = req.params;
    const result = await deleteQuiz(userId, quizId);
    
    res.json({
      success: true,
      message: 'Quiz deleted successfully',
      result
    });
  } catch (error) {
    console.error('Quiz deletion error:', error);
    res.status(500).json({ 
      error: 'Failed to delete quiz',
      message: error.message 
    });
  }
});

// Clear all quiz history for a user
router.delete('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await clearQuizHistory(userId);
    
    res.json({
      success: true,
      message: 'Quiz history cleared successfully',
      result
    });
  } catch (error) {
    console.error('Quiz history clear error:', error);
    res.status(500).json({ 
      error: 'Failed to clear quiz history',
      message: error.message 
    });
  }
});

export default router;
