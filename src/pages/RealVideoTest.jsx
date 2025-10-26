import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateVideoPlayerUrl } from '../utils/videoUtils';
import { Play, Clock, Tag, ExternalLink } from 'lucide-react';

const RealVideoTest = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRealVideos();
  }, []);

  const fetchRealVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content?source=youtube&limit=12');
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      
      const data = await response.json();
      setVideos(data.content || []);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-900/30 text-green-300';
      case 'intermediate': return 'bg-yellow-900/30 text-yellow-300';
      case 'advanced': return 'bg-red-900/30 text-red-300';
      default: return 'bg-gray-900/30 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060010] pt-20 flex items-center justify-center">
        <div className="text-white text-lg">Loading real YouTube videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#060010] pt-20 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-200 mb-2">Error Loading Videos</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={fetchRealVideos}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060010] pt-20 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Real YouTube Videos</h1>
          <p className="text-gray-400">
            Test the video player with real YouTube content from our database ({videos.length} videos)
          </p>
        </div>
        
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <h3 className="text-lg font-medium text-white mb-2">No Videos Found</h3>
              <p className="text-gray-400 mb-4">
                Run the seed script to populate the database with real YouTube content
              </p>
              <code className="bg-gray-800 px-3 py-1 rounded text-sm">
                cd server && node scripts/seedRealYouTubeContent.js
              </code>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.contentId} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.metadata?.durationSec)}
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(video.metadata?.difficulty)}`}>
                      {video.metadata?.difficulty || 'intermediate'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-2">
                    {video.metadata?.channelTitle || 'Unknown Channel'}
                  </p>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {video.description}
                  </p>
                  
                  {/* Tags */}
                  {video.metadata?.tags && video.metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {video.metadata.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full"
                        >
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                      {video.metadata.tags.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{video.metadata.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatDuration(video.metadata?.durationSec)}
                    </div>
                    {video.consumptionStats?.views && (
                      <div>
                        {video.consumptionStats.views.toLocaleString()} views
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={generateVideoPlayerUrl({
                        contentId: video.contentId,
                        url: video.url,
                        title: video.title,
                        thumbnail: video.thumbnail,
                        channelTitle: video.metadata?.channelTitle,
                        description: video.description
                      })}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex-1 justify-center no-underline"
                    >
                      <Play className="w-4 h-4" />
                      Watch Video
                    </Link>
                    
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      title="Open in YouTube"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-12 p-6 bg-gray-900/50 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Integration Test Checklist</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Video Player Features</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• ✅ Real YouTube video embedding</li>
                <li>• ✅ Progress tracking with timer</li>
                <li>• ✅ Notes functionality</li>
                <li>• ✅ Quiz generation after completion</li>
                <li>• ✅ Scheduling integration</li>
                <li>• ✅ Analytics tracking</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Content Integration</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• ✅ Real YouTube API data</li>
                <li>• ✅ Proper metadata (duration, tags, etc.)</li>
                <li>• ✅ Difficulty classification</li>
                <li>• ✅ Thumbnail and description</li>
                <li>• ✅ Channel information</li>
                <li>• ✅ URL generation and routing</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
            <h4 className="text-blue-300 font-medium mb-2">Test Instructions:</h4>
            <ol className="text-blue-200 text-sm space-y-1">
              <li>1. Click "Watch Video" on any card above</li>
              <li>2. Verify the YouTube video loads and plays correctly</li>
              <li>3. Test the timer functionality (starts automatically)</li>
              <li>4. Try taking notes in the notes section</li>
              <li>5. Mark the video as complete to trigger quiz generation</li>
              <li>6. Test the scheduling functionality</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealVideoTest;