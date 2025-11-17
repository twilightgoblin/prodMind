import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import SimpleVideoPlayer from '../../components/SimpleVideoPlayer';
import { ArrowLeft, BookOpen, Tag, Save, Brain } from 'lucide-react';
import apiClient from '../../utils/api.js';

const VideoPlayer = () => {
  const { user } = useAuth();
  const { contentId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Notes state
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Load existing notes when component mounts
  useEffect(() => {
    if (user && content?.contentId) {
      loadExistingNotes();
    }
  }, [user, content?.contentId]);

  // Get video details from URL params or fetch from API
  useEffect(() => {
    const videoUrl = searchParams.get('url');
    const title = searchParams.get('title');
    const thumbnail = searchParams.get('thumbnail');
    const channelTitle = searchParams.get('channelTitle');
    const description = searchParams.get('description');

    if (videoUrl && title) {
      // Use URL params if available
      const videoContent = {
        contentId: contentId || extractVideoId(videoUrl),
        url: videoUrl,
        title: title,
        thumbnail: thumbnail || null,
        channelTitle: channelTitle || null,
        description: description || null
      };
      
      setContent(videoContent);
      setLoading(false);
    } else if (contentId) {
      // Fetch content details from API
      fetchContentDetails(contentId);
    } else {
      setError('No video specified');
      setLoading(false);
    }
  }, [contentId, searchParams]);

  const loadExistingNotes = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      await apiClient.initialize();
      
      const response = await fetch(`${apiClient.baseURL}/api/video-notes/${content.contentId}`, {
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
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNotes = async () => {
    if (!user || !content?.contentId) return;
    
    setSavingNotes(true);
    try {
      await apiClient.initialize();
      
      const response = await fetch(`${apiClient.baseURL}/api/video-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          videoId: content.contentId,
          videoUrl: content.url,
          title: content.title,
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

  const extractVideoId = (url) => {
    if (!url) return null;
    
    let cleanUrl = url.trim();
    if (cleanUrl.includes('%')) {
      try {
        cleanUrl = decodeURIComponent(cleanUrl);
      } catch (e) {
        // Use original URL if decoding fails
      }
    }
    
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match && match[1] && match[1].length === 11) {
        return match[1];
      }
    }
    
    return null;
  };

  const fetchContentDetails = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      // Use dynamic port detection
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';
      
      const response = await fetch(`${baseURL}/api/content/${id}`, {
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

  const handleStartTopicQuiz = () => {
    // Get the first tag or extract from title
    let topic = content.metadata?.tags?.[0];
    
    if (!topic && content.title) {
      // Try to extract topic from title - order matters! Check longer strings first
      const title = content.title.toLowerCase();
      const availableTopics = [
        'next.js', 'nextjs',  // Check Next.js before TypeScript
        'node.js', 'nodejs',  // Check Node.js before JavaScript
        'javascript', 
        'typescript',
        'express',
        'react',
        'python',
        'java',
        'c++', 'cpp'
      ];
      
      // Find first matching topic in title
      topic = availableTopics.find(t => title.includes(t));
      
      // Normalize topic names
      if (topic === 'node.js') topic = 'nodejs';
      if (topic === 'next.js') topic = 'nextjs';
      if (topic === 'c++') topic = 'cpp';
    }
    
    if (topic) {
      navigate('/quiz', { 
        state: { 
          topic, 
          keyword: topic,
          videoTitle: content.title  // Pass video title
        } 
      });
    } else {
      // If no topic found, show a message
      alert('No programming topic detected in this video. Please watch a video about Java, JavaScript, Python, Node.js, TypeScript, React, Next.js, Express, or C++.');
    }
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

        {/* Main Content Area - Video and Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Video Player Area - Larger */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <SimpleVideoPlayer
                contentId={content.contentId}
                videoUrl={content.url}
                title={content.title}
                thumbnail={content.thumbnail}
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

              {/* Watch Complete Message */}
              <div className="mt-6 p-4 bg-purple-900/20 border border-purple-800/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-purple-300 font-semibold mb-1">Test Your Knowledge</h4>
                    <p className="text-gray-300 text-sm">
                      Watch the complete video and take the quiz below in the Learning Assessment section to test your understanding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section - Right Side - Larger */}
          <div className="lg:col-span-1">
            {user ? (
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Learning Notes
                  </h3>
                  <button
                    onClick={saveNotes}
                    disabled={savingNotes || notes === savedNotes}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    <Save className="w-4 h-4" />
                    {savingNotes ? 'Saving...' : 'Save'}
                  </button>
                </div>
                
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Take notes while watching the video..."
                  className="w-full h-[500px] bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none text-sm"
                />
                
                {notes !== savedNotes && (
                  <p className="text-yellow-400 text-xs mt-2">You have unsaved changes</p>
                )}
              </div>
            ) : (
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 text-center sticky top-24">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Take Notes</h3>
                <p className="text-gray-400 mb-4 text-sm">Sign in to take notes while watching videos</p>
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

        {/* Bottom Section - Learning Assessment and Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Learning Assessment */}
          <div className="lg:col-span-1">
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
              ) : (
                <div className="space-y-3">
                  {content.metadata?.tags && content.metadata.tags.length > 0 ? (
                    <>
                      <div className="flex items-center gap-2 text-purple-400">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Topic Quiz Available!</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">
                        Test your knowledge on {content.metadata.tags[0]}
                      </p>
                      <button
                        onClick={handleStartTopicQuiz}
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Take {content.metadata.tags[0]} Quiz
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-purple-400">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm font-medium">Test Your Knowledge</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">
                        Take a quiz on programming topics
                      </p>
                      <button
                        onClick={handleStartTopicQuiz}
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Take Topic Quiz
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Learning Tips */}
          <div className="lg:col-span-1">
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
          </div>

          {/* Video Stats */}
          <div className="lg:col-span-1">
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
    </div>
  );
};

export default VideoPlayer;