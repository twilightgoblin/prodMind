import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get topic from location state or query params
  const topic = location.state?.topic || new URLSearchParams(location.search).get('topic');
  const keyword = location.state?.keyword || new URLSearchParams(location.search).get('keyword');
  const videoTitle = location.state?.videoTitle || null;

  useEffect(() => {
    if (!topic && !keyword) {
      setError('No topic or keyword provided');
      setLoading(false);
      return;
    }
    
    generateQuiz();
  }, [topic, keyword]);

  useEffect(() => {
    if (!quiz || result) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, result]);

  const generateQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/quiz/generate', {
        topic: topic || keyword,
        keyword
      });

      setQuiz(response.quiz);
      setTimeLeft(response.quiz.timeLimit || 600);
    } catch (err) {
      console.error('Failed to generate quiz:', err);
      setError(err.response?.data?.error || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion + 1]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Get userId from auth context or localStorage - try multiple fields
      const userId = user?._id || user?.id || user?.email || localStorage.getItem('userId') || 'default-user';
      
      console.log('Submitting quiz with userId:', userId); // Debug log
      console.log('User object:', user); // Debug log
      
      const response = await api.post('/quiz/submit', {
        quizId: quiz.quizId,
        answers: selectedAnswers,
        userId: userId
      });

      setResult(response.result);
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      setError('Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060010] pt-20 flex items-center justify-center">
        <div className="text-white text-xl">Loading quiz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#060010] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-[#060010] pt-20 px-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="bg-gray-900 rounded-lg p-8 text-white">
            <h1 className="text-3xl font-bold mb-6 text-center">Quiz Results</h1>
            
            <div className="text-center mb-8">
              <div className="text-6xl font-bold mb-4">
                {result.score}%
              </div>
              <div className="text-xl">
                {result.correctAnswers} out of {result.totalQuestions} correct
              </div>
            </div>

            <div className="space-y-6">
              {result.results.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    item.isCorrect ? 'bg-green-900/30' : 'bg-red-900/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`text-2xl ${item.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                      {item.isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold mb-2">
                        Q{item.questionId}: {item.question}
                      </div>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="text-gray-400">Your answer: </span>
                          <span className={item.isCorrect ? 'text-green-400' : 'text-red-400'}>
                            {item.userAnswer || 'Not answered'}
                          </span>
                        </div>
                        {!item.isCorrect && (
                          <div>
                            <span className="text-gray-400">Correct answer: </span>
                            <span className="text-green-400">{item.correctAnswer}</span>
                          </div>
                        )}
                        {item.explanation && (
                          <div className="mt-2 text-gray-300 italic">
                            {item.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Retake Quiz
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#060010] pt-20 px-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {videoTitle || `${quiz.topic.toUpperCase()} Quiz`}
              </h1>
              {videoTitle && (
                <p className="text-sm text-gray-400 mt-1">Topic: {quiz.topic.toUpperCase()}</p>
              )}
            </div>
            <div className={`text-xl font-mono ${timeLeft < 60 ? 'text-red-500' : ''}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-400 mt-2">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-900 rounded-lg p-8 text-white mb-6">
          <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestion + 1] === option
                    ? 'border-blue-500 bg-blue-900/30'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="text-white">
            {Object.keys(selectedAnswers).length} / {quiz.questions.length} answered
          </div>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
