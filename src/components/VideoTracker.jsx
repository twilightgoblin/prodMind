import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const VideoTracker = ({ 
  contentId, 
  videoUrl, 
  onQuizAvailable, 
  onWatchComplete 
}) => {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const [watchData, setWatchData] = useState({
    startTime: Date.now(),
    watchTime: 0,
    totalDuration: 0,
    completionPercentage: 0,
    pauseCount: 0,
    rewindCount: 0,
    speedChanges: []
  });
  const [lastCurrentTime, setLastCurrentTime] = useState(0);
  const trackingIntervalRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !user) return;

    const video = videoRef.current;
    
    // Initialize tracking
    const initializeTracking = () => {
      setWatchData(prev => ({
        ...prev,
        totalDuration: video.duration || 0
      }));
      
      // Start periodic tracking
      trackingIntervalRef.current = setInterval(() => {
        trackProgress();
      }, 5000); // Track every 5 seconds
    };

    const trackProgress = () => {
      if (!video.currentTime) return;
      
      const currentTime = video.currentTime;
      const duration = video.duration || 0;
      const completionPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
      
      setWatchData(prev => {
        const newWatchTime = prev.watchTime + (currentTime - lastCurrentTime);
        
        return {
          ...prev,
          watchTime: Math.max(newWatchTime, prev.watchTime),
          completionPercentage: Math.max(completionPercentage, prev.completionPercentage)
        };
      });
      
      setLastCurrentTime(currentTime);
    };

    const handlePause = () => {
      setWatchData(prev => ({
        ...prev,
        pauseCount: prev.pauseCount + 1
      }));
      trackProgress();
    };

    const handleSeeking = () => {
      const currentTime = video.currentTime;
      if (currentTime < lastCurrentTime) {
        setWatchData(prev => ({
          ...prev,
          rewindCount: prev.rewindCount + 1
        }));
      }
      setLastCurrentTime(currentTime);
    };

    const handleRateChange = () => {
      setWatchData(prev => ({
        ...prev,
        speedChanges: [...prev.speedChanges, {
          timestamp: video.currentTime,
          speed: video.playbackRate
        }]
      }));
    };

    const handleEnded = () => {
      trackProgress();
      setWatchData(prev => ({
        ...prev,
        completionPercentage: 100
      }));
      
      // Trigger quiz generation if watch completion is high
      if (watchData.completionPercentage >= 80) {
        generateQuiz();
      }
      
      onWatchComplete?.(watchData);
    };

    // Event listeners
    video.addEventListener('loadedmetadata', initializeTracking);
    video.addEventListener('pause', handlePause);
    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('ratechange', handleRateChange);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', trackProgress);

    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
      
      video.removeEventListener('loadedmetadata', initializeTracking);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('ratechange', handleRateChange);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', trackProgress);
      
      // Send final tracking data
      sendTrackingData();
    };
  }, [user, contentId]);

  const sendTrackingData = async () => {
    if (!user || !contentId) return;

    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          contentId,
          interactionType: 'view',
          watchTime: watchData.watchTime,
          totalDuration: watchData.totalDuration,
          completionPercentage: watchData.completionPercentage,
          metadata: {
            pauseCount: watchData.pauseCount,
            rewindCount: watchData.rewindCount,
            speedChanges: watchData.speedChanges,
            sessionDuration: Date.now() - watchData.startTime
          }
        })
      });

      if (!response.ok) {
        console.error('Failed to send tracking data');
      }
    } catch (error) {
      console.error('Error sending tracking data:', error);
    }
  };

  const generateQuiz = async () => {
    if (!user || !contentId) return;

    try {
      const response = await fetch('/api/analytics/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ contentId })
      });

      const result = await response.json();
      
      if (result.success && result.quiz) {
        onQuizAvailable?.(result.quiz);
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
    }
  };

  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^#&?]*)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1] && match[1].length === 11) {
        return match[1];
      }
    }
    
    return null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  if (!videoId) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-red-400">Invalid video URL: {videoUrl}</p>
        <p className="text-gray-400 text-sm mt-2">
          Please provide a valid YouTube URL or video ID
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* YouTube Embed with Enhanced Tracking */}
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
        <iframe
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&rel=0&modestbranding=1`}
          title="Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      
      {/* Progress indicator */}
      {user && (
        <div className="mt-4 bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
          <div className="flex justify-between items-center text-sm text-gray-300 mb-2">
            <span>Learning Progress</span>
            <span>{Math.round(watchData.completionPercentage)}% complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${watchData.completionPercentage}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-400">
            <div className="text-center">
              <div className="text-white font-medium">{Math.round(watchData.watchTime / 60)}m</div>
              <div>Watch Time</div>
            </div>
            <div className="text-center">
              <div className="text-white font-medium">{watchData.pauseCount}</div>
              <div>Pauses</div>
            </div>
            <div className="text-center">
              <div className="text-white font-medium">{watchData.rewindCount}</div>
              <div>Rewinds</div>
            </div>
          </div>
          
          {/* Quiz availability indicator */}
          {watchData.completionPercentage >= 80 && (
            <div className="mt-3 p-2 bg-green-900/20 border border-green-800/30 rounded-lg">
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Quiz will be available soon!</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Sign-in prompt for non-authenticated users */}
      {!user && (
        <div className="mt-4 bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 text-center">
          <p className="text-blue-200 text-sm mb-3">
            Sign in to track your learning progress and unlock quizzes
          </p>
          <button
            onClick={() => window.location.href = '/signin'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoTracker;