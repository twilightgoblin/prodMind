import { useState } from 'react';
import { Search, TrendingUp, Sparkles, Play, Clock, Eye, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import contentService from '../../services/contentService';
import ApiKeyStatus from '../../components/ApiKeyStatus';
import { generateVideoPlayerUrl } from '../../utils/videoUtils';

const YouTubeTest = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const searchResults = await contentService.fetchYouTubeContent(searchQuery, {
        maxResults: 5,
        order: 'relevance'
      });
      
      // Analyze results
      const analyzed = await Promise.all(
        searchResults.map(async (item) => {
          const analysis = await contentService.analyzeContent(item);
          return { ...item, ...analysis };
        })
      );
      
      setResults(analyzed);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCurate = async () => {
    setLoading(true);
    try {
      const result = await contentService.curateContent({
        topics: ['javascript', 'react', 'programming'],
        maxResults: 5,
        minPriority: 6
      });
      setResults(result.content || []);
    } catch (error) {
      console.error('Curation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrending = async () => {
    setLoading(true);
    try {
      const trending = await contentService.fetchTrendingContent(5, '0');
      
      // Analyze trending content
      const analyzed = await Promise.all(
        trending.map(async (item) => {
          const analysis = await contentService.analyzeContent(item);
          return { ...item, ...analysis };
        })
      );
      
      setResults(analyzed);
    } catch (error) {
      console.error('Trending fetch failed:', error);
    } finally {
      setLoading(false);
    }
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">YouTube API Test</h1>
        <p className="text-gray-300">Testing YouTube integration with AI analysis and dynamic API keys</p>
      </div>

      {/* API Key Status */}
      <div className="mb-6">
        <ApiKeyStatus />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-900/50 p-1 rounded-lg border border-gray-800 w-fit">
        {[
          { id: 'search', label: 'Search', icon: Search },
          { id: 'curate', label: 'AI Curate', icon: Sparkles },
          { id: 'trending', label: 'Trending', icon: TrendingUp }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800 mb-6">
        {activeTab === 'search' && (
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              placeholder="Search YouTube videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Search size={16} />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        )}

        {activeTab === 'curate' && (
          <div className="text-center">
            <p className="text-gray-300 mb-4">Get AI-curated content for JavaScript, React, and Programming</p>
            <button
              onClick={handleCurate}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              <Sparkles size={16} />
              {loading ? 'Curating...' : 'Curate Content'}
            </button>
          </div>
        )}

        {activeTab === 'trending' && (
          <div className="text-center">
            <p className="text-gray-300 mb-4">Get trending videos from YouTube</p>
            <button
              onClick={handleTrending}
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              <TrendingUp size={16} />
              {loading ? 'Loading...' : 'Get Trending'}
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results.map((video) => (
          <div key={video.id} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <div className="flex gap-4">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-32 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-400 mb-2">{video.channelTitle}</p>
                
                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  {video.duration && (
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatDuration(video.duration)}
                    </div>
                  )}
                  {video.viewCount && (
                    <div className="flex items-center gap-1">
                      <Eye size={12} />
                      {formatNumber(video.viewCount)} views
                    </div>
                  )}
                  {video.likeCount && (
                    <div className="flex items-center gap-1">
                      <ThumbsUp size={12} />
                      {formatNumber(video.likeCount)}
                    </div>
                  )}
                </div>

                {/* AI Analysis */}
                {video.summary && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-300">{video.summary}</p>
                  </div>
                )}

                {/* Tags and Priority */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {video.tags?.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {video.difficulty && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        video.difficulty === 'beginner' ? 'bg-green-900/30 text-green-300' :
                        video.difficulty === 'intermediate' ? 'bg-yellow-900/30 text-yellow-300' :
                        'bg-red-900/30 text-red-300'
                      }`}>
                        {video.difficulty}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {video.priority && (
                      <span className="text-sm font-medium text-white">
                        Priority: {video.priority}/10
                      </span>
                    )}
                    <Link
                      to={generateVideoPlayerUrl(video)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 no-underline"
                    >
                      <Play size={14} />
                      Watch
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-400">No results yet. Try searching, curating, or getting trending content!</p>
        </div>
      )}
    </div>
  );
};

export default YouTubeTest;