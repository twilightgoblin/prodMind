import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, CheckCircle, ThumbsUp, Eye, MessageCircle, Share2, BookOpen } from 'lucide-react';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Get video data from URL params or fetch from API
  useEffect(() => {
    const title = searchParams.get('title');
    const channelTitle = searchParams.get('channel');
    const thumbnail = searchParams.get('thumbnail');
    const url = searchParams.get('url');
    const duration = searchParams.get('duration');
    const scheduledId = searchParams.get('scheduledId');

    if (title && url) {
      // Use URL params data
      setVideoData({
        id: videoId,
        title: decodeURIComponent(title),
        channelTitle: channelTitle ? decodeURIComponent(channelTitle) : 'Unknown Channel',
        thumbnail: decodeURIComponent(thumbnail || ''),
        url: decodeURIComponent(url),
        duration,
        scheduledId,
        // Extract additional data from URL if available
        viewCount: searchParams.get('views'),
        likeCount: searchParams.get('likes'),
        commentCount: searchParams.get('comments'),
        priority: searchParams.get('priority'),
        tags: searchParams.get('tags') ? searchParams.get('tags').split(',') : []
      });
      setLoading(false);
      // Load existing notes
      loadExistingNotes();
    } else {
      // Fallback: try to fetch from API if we have the video ID
      fetchVideoData();
    }
  }, [videoId, searchParams]);

  const loadExistingNotes = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiBaseUrl}/video-notes/${videoId}`);
      
      if (response.ok) {
        const data = await response.json();
        setNotes(data.data.notes || '');
      }
      // If no notes found (404), that's fine - just keep notes empty
    } catch (error) {
      console.error('Error loading existing notes:', error);
      // Don't show error to user - just keep notes empty
    }
  };

  const fetchVideoData = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiBaseUrl}/content/${videoId}`);
      if (response.ok) {
        const data = await response.json();
        setVideoData(data);
        // Load existing notes
        await loadExistingNotes();
      }
    } catch (error) {
      console.error('Error fetching video data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0&modestbranding=1`;
    }
    
    return null;
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    const number = parseInt(num);
    if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
    if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
    return number.toString();
  };

  const formatDuration = (duration) => {
    if (!duration) return null;
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;
    
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    
    if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const saveNotes = async () => {
    if (!notes.trim()) return;
    
    setSaveStatus('saving');
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiBaseUrl}/video-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: videoData.id,
          videoUrl: videoData.url,
          title: videoData.title,
          notes: notes,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(''), 2000);
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const handleMarkComplete = async () => {
    if (!videoData.scheduledId) {
      setShowCompleteModal(true);
      return;
    }

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiBaseUrl}/scheduler/${videoData.scheduledId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: notes || 'Watched via video player'
        })
      });

      if (response.ok) {
        // Save notes if any
        if (notes.trim()) {
          await saveNotes();
        }
        alert('Great job! Content marked as completed.');
        navigate('/smart-scheduler');
      }
    } catch (error) {
      console.error('Error marking content as complete:', error);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: videoData.title,
      text: `Check out this video: ${videoData.title}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060010] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading video...</p>
        </div>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="min-h-screen bg-[#060010] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 mb-4">Video not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(videoData.url);

  return (
    <div className="min-h-screen bg-[#060010] text-white">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-gray-800 p-3 sm:p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
            <span className="sm:inline">Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              title="Share"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              {embedUrl ? (
                <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                  <iframe
                    src={embedUrl}
                    title={videoData.title}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-800">
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">Unable to embed video</p>
                    <a
                      href={videoData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                    >
                      <ExternalLink size={16} />
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-white mb-2">{videoData.title}</h1>
              <p className="text-gray-400 mb-4">{videoData.channelTitle}</p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                {videoData.duration && (
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatDuration(videoData.duration)}
                  </div>
                )}
                {videoData.viewCount && (
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    {formatNumber(videoData.viewCount)} views
                  </div>
                )}
                {videoData.likeCount && (
                  <div className="flex items-center gap-1">
                    <ThumbsUp size={14} />
                    {formatNumber(videoData.likeCount)}
                  </div>
                )}
                {videoData.commentCount && (
                  <div className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    {formatNumber(videoData.commentCount)}
                  </div>
                )}
                {videoData.priority && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    Priority: {videoData.priority}/10
                  </div>
                )}
              </div>

              {/* Tags */}
              {videoData.tags && videoData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {videoData.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-900/30 text-blue-300 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowCompleteModal(true)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  Mark as Complete
                </button>
                
                <button
                  onClick={() => navigate('/smart-scheduler')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar size={16} />
                  View Schedule
                </button>
                
                <button
                  onClick={() => navigate('/notes')}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen size={16} />
                  All Notes
                </button>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">Learning Notes</h3>
                {saveStatus && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    saveStatus === 'saved' ? 'bg-green-900/30 text-green-300' :
                    saveStatus === 'saving' ? 'bg-blue-900/30 text-blue-300' :
                    'bg-red-900/30 text-red-300'
                  }`}>
                    {saveStatus === 'saved' ? 'Saved!' : 
                     saveStatus === 'saving' ? 'Saving...' : 'Error saving'}
                  </span>
                )}
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={saveNotes}
                placeholder="Add your notes about this video... (auto-saves when you click away)"
                className="w-full h-32 bg-gray-800 text-white p-3 rounded border border-gray-700 focus:border-blue-500 focus:outline-none resize-none text-sm notes-textarea"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-400">Notes are automatically saved</p>
                <button
                  onClick={saveNotes}
                  disabled={!notes.trim() || saveStatus === 'saving'}
                  className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 max-w-md w-full">
            <h3 className="text-white font-semibold mb-4">Mark as Complete</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What did you learn? Any key takeaways?"
                  className="w-full h-20 bg-gray-800 text-white p-3 rounded border border-gray-700 focus:border-blue-500 focus:outline-none resize-none text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleMarkComplete}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Complete
              </button>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;