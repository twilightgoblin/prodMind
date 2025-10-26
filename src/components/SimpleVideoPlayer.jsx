import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Play, ExternalLink, Clock, CheckCircle, Calendar, BookOpen, Save } from 'lucide-react';
import ScheduleModal from './ScheduleModal';

const SimpleVideoPlayer = ({ 
  contentId, 
  videoUrl, 
  title,
  thumbnail,
  onQuizAvailable, 
  onWatchComplete 
}) => {
  const { user } = useAuth();
  const [watchStarted, setWatchStarted] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [quizGenerated, setQuizGenerated] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [showEmbeddedPlayer, setShowEmbeddedPlayer] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const playerRef = useRef(null);
  const timerRef = useRef(null);

  // Load existing notes when component mounts
  useEffect(() => {
    if (user && contentId) {
      loadExistingNotes();
    }
  }, [user, contentId]);

  // Timer effect - only runs when explicitly activated
  useEffect(() => {
    if (timerActive && !isCompleted) {
      timerRef.current = setInterval(() => {
        setWatchTime(prev => {
          const newTime = prev + 1;
          
          // Simulate completion at 5 minutes for demo purposes
          if (newTime >= 300) {
            setIsCompleted(true);
            setTimerActive(false);
            handleWatchComplete(newTime);
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerActive, isCompleted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const extractVideoId = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^#&?]*)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1] && match[1].length === 11) {
        return match[1];
      }
    }
    
    console.warn('Could not extract video ID from URL:', url);
    return null;
  };

  const handleStartWatching = () => {
    setWatchStarted(true);
    setShowEmbeddedPlayer(true);
    
    // Timer will be started by iframe onLoad event
    
    // Track interaction
    if (user && contentId) {
      trackInteraction('view', { started: true });
    }
  };

  const loadExistingNotes = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`/api/video-notes/${contentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setNotes(data.data.notes || '');
          setSavedNotes(data.data.notes || '');
        }
      } else if (response.status !== 404) {
        // 404 is expected if no notes exist yet
        console.warn('Failed to load notes:', response.status);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNotes = async () => {
    if (!user || !contentId) return;
    
    setSavingNotes(true);
    try {
      const response = await fetch('/api/video-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          videoId: contentId,
          videoUrl: videoUrl,
          title: title,
          notes: notes
        })
      });

      if (response.ok) {
        setSavedNotes(notes);
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = 'Notes saved successfully!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleSchedule = () => {
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = 'Content scheduled successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  const handleMarkComplete = () => {
    setIsCompleted(true);
    setTimerActive(false);
    if (watchTime < 300) {
      setWatchTime(300); // Assume 5 minutes watched
    }
    handleWatchComplete(watchTime);
  };

  const handleWatchComplete = async (totalWatchTime) => {
    if (user && contentId) {
      // Track completion
      await trackInteraction('view', { 
        completed: true, 
        watchTime: totalWatchTime,
        completionPercentage: 100 
      });
      
      // Only generate quiz if user watched for a reasonable amount of time
      if (totalWatchTime >= 120 && !quizGenerated) { // At least 2 minutes
        await generateQuiz();
        setQuizGenerated(true);
      }
    }
    
    onWatchComplete?.({
      watchTime: totalWatchTime,
      completionPercentage: 100,
      completed: true
    });
  };

  const trackInteraction = async (interactionType, data) => {
    if (!user) return; // Skip if user not authenticated
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.warn('No auth token available for tracking');
        return;
      }

      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contentId,
          interactionType,
          watchTime: data.watchTime || watchTime,
          completionPercentage: data.completionPercentage || (watchTime / 300) * 100,
          metadata: {
            ...data,
            playerType: 'simple',
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to track interaction:', response.status, errorData);
      } else {
        console.log('Interaction tracked successfully');
      }
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  const generateQuiz = async () => {
    if (!user) return; // Skip if user not authenticated
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.warn('No auth token available for quiz generation');
        return;
      }

      const response = await fetch('/api/analytics/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ contentId })
      });

      const result = await response.json();
      
      if (response.ok && result.success && result.quiz) {
        onQuizAvailable?.(result.quiz);
        console.log('Quiz generated successfully');
      } else {
        console.warn('Quiz generation failed:', result);
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const videoId = extractVideoId(videoUrl);

  return (
    <div className="space-y-6">
      {/* Video Player Area */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="relative">
          <div className="aspect-video bg-gray-800 flex items-center justify-center">
            {showEmbeddedPlayer && videoId ? (
              <div className="w-full h-full relative bg-black">
                <iframe
                  ref={playerRef}
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?controls=1&rel=0&modestbranding=1&fs=1&enablejsapi=1`}
                  title={title}
                  style={{ border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onLoad={() => {
                    console.log('YouTube iframe loaded successfully');
                    // Start timer after iframe loads
                    if (!timerActive && watchStarted) {
                      setTimeout(() => setTimerActive(true), 2000);
                    }
                  }}
                  onError={(e) => {
                    console.error('YouTube iframe failed to load:', e);
                  }}
                />
                {/* Fallback link */}
                <div className="absolute bottom-4 right-4">
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-300 hover:text-white bg-black/70 px-2 py-1 rounded backdrop-blur-sm"
                  >
                    Open in YouTube
                  </a>
                </div>
              </div>
            ) : thumbnail ? (
              <img 
                src={thumbnail} 
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 text-center">
                <Play className="w-16 h-16 mx-auto mb-2" />
                <p>Video Thumbnail</p>
              </div>
            )}
            
            {/* Play Overlay */}
            {!showEmbeddedPlayer && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <button
                  onClick={handleStartWatching}
                  className="flex items-center gap-3 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Play className="w-6 h-6" />
                  <span>Start Watching</span>
                </button>
              </div>
            )}
            
            {/* Completion Overlay */}
            {isCompleted && (
              <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Completed
              </div>
            )}
          </div>
        </div>

        {/* Progress and Controls */}
        <div className="p-4">
          {user ? (
            <div className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span className="flex items-center gap-2">
                    Progress
                    {timerActive && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </span>
                  <span>{formatTime(watchTime)} watched</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((watchTime / 300) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {!watchStarted ? (
                  <button
                    onClick={handleStartWatching}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Start Watching
                  </button>
                ) : !isCompleted ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTimerActive(!timerActive)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        timerActive 
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {timerActive ? (
                        <>
                          <Clock className="w-4 h-4" />
                          Pause Timer
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Resume Timer
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleMarkComplete}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Complete
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Video completed!</span>
                  </div>
                )}
                
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule
                </button>
                
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in YouTube
                </a>
              </div>

              {/* Quiz Status */}
              {isCompleted && (
                <div className="p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-400 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>
                      {quizGenerated ? 'Quiz is ready!' : 'Generating personalized quiz...'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-3">Sign in to track your learning progress</p>
              <button
                onClick={() => window.location.href = '/signin'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notes Section */}
      {user && (
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Learning Notes
            </h3>
            <button
              onClick={saveNotes}
              disabled={savingNotes || notes === savedNotes}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {savingNotes ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
          
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Take notes while watching the video. Your notes will be saved automatically..."
            className="w-full h-32 bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
          />
          
          {notes !== savedNotes && (
            <p className="text-yellow-400 text-sm mt-2">You have unsaved changes</p>
          )}
        </div>
      )}

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        content={{
          id: contentId,
          title: title,
          url: videoUrl,
          thumbnail: thumbnail
        }}
        onSchedule={handleSchedule}
      />
    </div>
  );
};

export default SimpleVideoPlayer;