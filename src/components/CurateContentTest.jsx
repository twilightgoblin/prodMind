import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

const CurateContentTest = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState(['javascript', 'react']);

  const availableTopics = [
    'javascript', 'react', 'python', 'programming', 'productivity', 
    'ai', 'design', 'web', 'tutorial', 'career', 'mobile', 'database'
  ];

  const handleCurateContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5001/api/content/curate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topics: selectedTopics,
          maxResults: 6,
          minPriority: 5,
          difficulty: 'all',
          duration: 'any'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setContent(data.content || []);
    } catch (err) {
      setError(err.message);
      console.error('Error curating content:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (topic) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
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

  const formatNumber = (num) => {
    if (!num) return '0';
    const number = parseInt(num);
    if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
    if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
    return number.toString();
  };

  return (
    <div className="min-h-screen bg-[#060010] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Content Curation Test</h1>
        
        {/* Topic Selection */}
        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Topics</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {availableTopics.map(topic => (
              <button
                key={topic}
                onClick={() => toggleTopic(topic)}
                className={`px-3 py-2 rounded-full text-sm transition-colors ${
                  selectedTopics.includes(topic)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleCurateContent}
            disabled={loading || selectedTopics.length === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Curating...' : 'Curate Content'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-800 rounded-lg p-4 mb-6">
            <h3 className="text-red-300 font-medium">Error</h3>
            <p className="text-red-400 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Content Results */}
        {content.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map(item => (
              <div key={item.id} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <h3 className="font-semibold text-white line-clamp-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 mb-2">{item.channelTitle}</p>
                
                {/* Metadata */}
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                  {item.duration && (
                    <span>{formatDuration(item.duration)}</span>
                  )}
                  <span className="text-yellow-400">Priority: {item.priority}/10</span>
                  <span className="capitalize">{item.difficulty}</span>
                </div>

                {/* Stats */}
                {item.viewCount && (
                  <div className="text-xs text-gray-500 mb-3">
                    {formatNumber(item.viewCount)} views
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags?.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Summary */}
                {item.summary && (
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                    {item.summary}
                  </p>
                )}

                {/* Action */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Watch Video
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw size={32} className="animate-spin text-blue-400 mx-auto mb-4" />
              <p className="text-gray-300">Curating your personalized content...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && content.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-300">Select topics and click "Curate Content" to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurateContentTest;