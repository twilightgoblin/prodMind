import React, { useState, useEffect } from 'react';
import { Clock, Trophy, TrendingUp, Calendar, Trash2 } from 'lucide-react';
import quizService from '../services/quizService';

const QuizHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('QuizHistory: userId =', userId); // Debug log
    if (userId) {
      loadHistory();
    } else {
      console.log('QuizHistory: No userId provided');
      setLoading(false);
    }
  }, [userId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      console.log('QuizHistory: Loading history for userId:', userId);
      const response = await quizService.getQuizHistory(userId);
      console.log('QuizHistory: Response:', response);
      setHistory(response.history || []);
    } catch (err) {
      console.error('Failed to load quiz history:', err);
      setError('Failed to load quiz history');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz result?')) {
      return;
    }

    try {
      await quizService.deleteQuiz(userId, quizId);
      // Reload history after deletion
      loadHistory();
    } catch (err) {
      console.error('Failed to delete quiz:', err);
      alert('Failed to delete quiz');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL quiz history? This cannot be undone.')) {
      return;
    }

    try {
      await quizService.clearQuizHistory(userId);
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear quiz history:', err);
      alert('Failed to clear quiz history');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-900/30';
    if (score >= 60) return 'bg-yellow-900/30';
    return 'bg-red-900/30';
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateStats = () => {
    if (history.length === 0) return null;

    const totalQuizzes = history.length;
    const averageScore = Math.round(
      history.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes
    );
    const bestScore = Math.max(...history.map(q => q.score));
    const topicCounts = history.reduce((acc, quiz) => {
      acc[quiz.topic] = (acc[quiz.topic] || 0) + 1;
      return acc;
    }, {});
    const favoriteTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      totalQuizzes,
      averageScore,
      bestScore,
      favoriteTopic: favoriteTopic ? favoriteTopic[0] : 'N/A'
    };
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 text-center">
        <div className="text-white">Loading quiz history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 text-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 text-center">
        <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Quiz History</h3>
        <p className="text-gray-400">Take your first quiz to see your progress here!</p>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Trophy className="w-4 h-4" />
            <span className="text-sm">Total Quizzes</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalQuizzes}</div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Average Score</span>
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
            {stats.averageScore}%
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Trophy className="w-4 h-4" />
            <span className="text-sm">Best Score</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.bestScore}%</div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Favorite Topic</span>
          </div>
          <div className="text-lg font-bold text-white capitalize">{stats.favoriteTopic}</div>
        </div>
      </div>

      {/* Quiz History List */}
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Quizzes</h3>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
        <div className="space-y-3">
          {history.slice().reverse().map((quiz, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${getScoreBg(quiz.score)} border border-gray-800`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-semibold capitalize">{quiz.topic}</h4>
                    <span className={`text-2xl font-bold ${getScoreColor(quiz.score)}`}>
                      {quiz.score}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {quiz.correctAnswers}/{quiz.totalQuestions} correct
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(quiz.completedAt)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteQuiz(quiz.quizId)}
                  className="ml-4 p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete this quiz"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizHistory;
