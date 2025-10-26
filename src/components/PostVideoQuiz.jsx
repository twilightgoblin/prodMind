import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Award, RotateCcw } from 'lucide-react';

const PostVideoQuiz = ({ quiz, contentId, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    const timeToComplete = Math.round((Date.now() - startTime) / 1000);

    try {
      const response = await fetch('/api/analytics/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          contentId,
          quizId: quiz._id,
          answers,
          timeToComplete
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setResults(result.results);
        onComplete?.(result.results);
      } else {
        console.error('Failed to submit quiz:', result.message);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return <Award className="w-8 h-8 text-green-400" />;
    if (score >= 70) return <CheckCircle className="w-8 h-8 text-yellow-400" />;
    return <XCircle className="w-8 h-8 text-red-400" />;
  };

  if (results) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Results Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Quiz Results</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Score Display */}
          <div className="p-6 text-center border-b border-gray-700">
            <div className="flex items-center justify-center mb-4">
              {getScoreIcon(results.score)}
            </div>
            <h3 className={`text-4xl font-bold mb-2 ${getScoreColor(results.score)}`}>
              {results.score}%
            </h3>
            <p className="text-gray-300 mb-4">
              {results.correctAnswers} out of {results.totalQuestions} correct
            </p>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              results.passed 
                ? 'bg-green-900/30 text-green-400 border border-green-800' 
                : 'bg-red-900/30 text-red-400 border border-red-800'
            }`}>
              {results.passed ? 'Passed' : 'Failed'}
            </div>
          </div>

          {/* Detailed Results */}
          <div className="p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Question Review</h4>
            <div className="space-y-4">
              {results.detailedResults.map((result, index) => {
                const question = quiz.questions.find(q => q.id === result.questionId);
                return (
                  <div key={result.questionId} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        result.isCorrect ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {result.isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <XCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium mb-2">
                          {index + 1}. {question?.question}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-400">Your answer: </span>
                            <span className={result.isCorrect ? 'text-green-400' : 'text-red-400'}>
                              {Array.isArray(result.userAnswer) 
                                ? result.userAnswer.join(', ') 
                                : result.userAnswer}
                            </span>
                          </div>
                          {!result.isCorrect && (
                            <div>
                              <span className="text-gray-400">Correct answer: </span>
                              <span className="text-green-400">
                                {Array.isArray(result.correctAnswer) 
                                  ? result.correctAnswer.join(', ') 
                                  : result.correctAnswer}
                              </span>
                            </div>
                          )}
                          {result.explanation && (
                            <div className="mt-2 p-3 bg-blue-900/20 border border-blue-800/30 rounded">
                              <p className="text-blue-200 text-sm">{result.explanation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Concepts to Review */}
            {results.conceptsToReview?.length > 0 && (
              <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-800/30 rounded-lg">
                <h5 className="text-yellow-200 font-medium mb-2">Concepts to Review:</h5>
                <div className="flex flex-wrap gap-2">
                  {results.conceptsToReview.map((concept, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-yellow-800/30 text-yellow-200 rounded-full text-sm"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Continue Learning
              </button>
              {!results.passed && (
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Quiz Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">{quiz.title}</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-4 h-4" />
                <span className={timeLeft < 60 ? 'text-red-400' : ''}>{formatTime(timeLeft)}</span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>

        {/* Question Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6">{question.question}</h3>
          
          {question.type === 'multiple-choice' && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <label 
                  key={index}
                  className="flex items-center p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="mr-3 text-blue-600"
                  />
                  <span className="text-gray-200">{option}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'true-false' && (
            <div className="space-y-3">
              {['True', 'False'].map((option) => (
                <label 
                  key={option}
                  className="flex items-center p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="mr-3 text-blue-600"
                  />
                  <span className="text-gray-200">{option}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'short-answer' && (
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Enter your answer..."
              className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="p-6 border-t border-gray-700 flex justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitted}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isSubmitted ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostVideoQuiz;