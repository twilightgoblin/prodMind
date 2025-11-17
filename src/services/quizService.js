import api from './api';

class QuizService {
  /**
   * Generate a quiz based on topic or keyword
   */
  async generateQuiz(topicOrKeyword) {
    try {
      const response = await api.post('/quiz/generate', {
        topic: topicOrKeyword,
        keyword: topicOrKeyword
      });
      return response;
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      throw error;
    }
  }

  /**
   * Submit quiz answers
   */
  async submitQuiz(quizId, answers, userId = null) {
    try {
      const response = await api.post('/quiz/submit', {
        quizId,
        answers,
        userId
      });
      return response;
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      throw error;
    }
  }

  /**
   * Get quiz history for a user
   */
  async getQuizHistory(userId) {
    try {
      const response = await api.get(`/quiz/history/${userId}`);
      return response;
    } catch (error) {
      console.error('Failed to get quiz history:', error);
      throw error;
    }
  }

  /**
   * Delete a specific quiz from history
   */
  async deleteQuiz(userId, quizId) {
    try {
      const response = await api.delete(`/quiz/history/${userId}/${quizId}`);
      return response;
    } catch (error) {
      console.error('Failed to delete quiz:', error);
      throw error;
    }
  }

  /**
   * Clear all quiz history for a user
   */
  async clearQuizHistory(userId) {
    try {
      const response = await api.delete(`/quiz/history/${userId}`);
      return response;
    } catch (error) {
      console.error('Failed to clear quiz history:', error);
      throw error;
    }
  }

  /**
   * Get available topics
   */
  getAvailableTopics() {
    return [
      'java',
      'cpp',
      'javascript',
      'nodejs',
      'python',
      'typescript',
      'express',
      'react',
      'nextjs'
    ];
  }
}

export const quizService = new QuizService();
export default quizService;
