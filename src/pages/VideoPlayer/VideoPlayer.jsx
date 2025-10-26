import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import VideoTracker from '../../components/VideoTracker';
import SimpleVideoPlayer from '../../components/SimpleVideoPlayer';
import PostVideoQuiz from '../../components/PostVideoQuiz';
import { ArrowLeft, BookOpen, Clock, Star, Tag } from 'lucide-react';

const VideoPlayer = () => {
  const { user } = useAuth();
  const { contentId } = useParams();
  const [searchParams] = useSearchParams();
  const [content, setContent] = useState(null);
  const [availableQuiz, setAvailableQuiz] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get video details from URL params or fetch from API
  useEffect(() => {
    const videoUrl = searchParams.get('url');
    const title = searchParams.get('title');
    const thumbnail = searchParams.get('thumbnail');
    const channelTitle = searchParams.get('channelTitle');
    const description = searchParams.get('description');

    if (videoUrl && title) {
      // Use URL params if available
      setContent({
        contentId: contentId || extractVideoId(videoUrl),
        url: videoUrl,
        title: decodeURIComponent(title),
        thumbnail: thumbnail ? decodeURIComponent(thumbnail) : null,
        channelTitle: channelTitle ? decodeURIComponent(channelTitle) : null,
        description: description ? decodeURIComponent(description) : null
      });
      setLoading(false);
    } else if (contentId) {
      // Fetch content details from API
      fetchContentDetails(contentId);
    } else {
      setError('No video specified');
      setLoading(false);
    }
  }, [contentId, searchParams]);

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const fetchContentDetails = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/content/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch content details');
      }

      const data = await response.json();
      setContent(data.content);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAvailable = (quiz) => {
    setAvailableQuiz(quiz);
    // Show notification that quiz is available
    if (user) {
      showQuizNotification();
    }
  };

  const showQuizNotification = () => {
    // Create a toast notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
        <span>Quiz available! Test your knowledge</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  };

  const handleWatchComplete = (watchData) => {
    console.log('Watch completed:', watchData);
    // Could trigger additional actions here
  };

  const handleQuizComplete = (results) => {
    setQuizResults(results);
    setShowQuiz(false);
    
    // Show results notification
    const message = results.passed 
      ? `Great job! You scored ${results.score}%` 
      : `You scored ${results.score}%. Review the concepts and try again!`;
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${results.passed ? 'bg-green-600' : 'bg-yellow-600'} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${results.passed ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'}"></path>
        </svg>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060010] pt-20 flex items-center justify-center">
        <div className="text-white text-lg">Loading video...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#060010] pt-20 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-200 mb-2">Error Loading Video</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-[#060010] pt-20 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Video Not Found</h2>
          <p className="text-gray-400 mb-4">The requested video could not be found.</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060010] pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-white">Video Player</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Area */}
          <div className="lg:col-span-2">
            {/* Video Player with Tracking */}
            <div className="mb-6">
              <SimpleVideoPlayer
                contentId={content.contentId}
                videoUrl={content.url}
                title={content.title}
                thumbnail={content.thumbnail}
                onQuizAvailable={handleQuizAvailable}
                onWatchComplete={handleWatchComplete}
              />
            </div>

            {/* Video Info */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-3">{content.title}</h2>
              
              {content.channelTitle && (
                <p className="text-gray-400 mb-4">by {content.channelTitle}</p>
              )}

              {content.description && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{content.description}</p>
                </div>
              )}

              {content.metadata?.tags && content.metadata.tags.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {content.metadata.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-900/30 text-blue-300 text-sm rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quiz Status */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Learning Assessment
              </h3>
              
              {!user ? (
                <div className="text-center py-4">
                  <p className="text-gray-400 mb-3">Sign in to track your progress and take quizzes</p>
                  <button
                    onClick={() => window.location.href = '/signin'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              ) : availableQuiz ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Quiz Available!</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    Test your understanding of this video content
                  </p>
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Take Quiz
                  </button>
                  
                  {quizResults && (
                    <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-300 mb-1">Previous Score:</p>
                      <div className="flex items-center gap-2">
                        <Star className={`w-4 h-4 ${quizResults.passed ? 'text-green-400' : 'text-yellow-400'}`} />
                        <span className={`font-medium ${quizResults.passed ? 'text-green-400' : 'text-yellow-400'}`}>
                          {quizResults.score}%
                        </span>
                        <span className="text-xs text-gray-400">
                          ({quizResults.correctAnswers}/{quizResults.totalQuestions})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">
                    Watch at least 80% of the video to unlock the quiz
                  </p>
                </div>
              )}
            </div>

            {/* Learning Tips */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Learning Tips</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Take notes while watching to improve retention</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Pause and reflect on key concepts</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Complete the quiz to test your understanding</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Review concepts you missed in the quiz</span>
                </li>
              </ul>
            </div>

            {/* Video Stats */}
            {content.metadata && (
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Video Details</h3>
                <div className="space-y-3 text-sm">
                  {content.metadata.durationSec && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">
                        {Math.floor(content.metadata.durationSec / 60)}:{(content.metadata.durationSec % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  )}
                  {content.metadata.difficulty && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Difficulty:</span>
                      <span className={`capitalize ${
                        content.metadata.difficulty === 'beginner' ? 'text-green-400' :
                        content.metadata.difficulty === 'intermediate' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {content.metadata.difficulty}
                      </span>
                    </div>
                  )}
                  {content.metadata.category && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white capitalize">{content.metadata.category}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && availableQuiz && (
        <PostVideoQuiz
          quiz={availableQuiz}
          contentId={content.contentId}
          onComplete={handleQuizComplete}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
};

export default VideoPlayer;