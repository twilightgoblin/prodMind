// Main content dashboard component
import { useState, useMemo } from 'react';
import { RefreshCw, Filter, Search, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import ContentCard from './ContentCard';
import { debugEnv } from '../debug-env';

const ContentDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, consumed, pending
  const [sortBy, setSortBy] = useState('priority'); // priority, date, title
  const [userTopics, setUserTopics] = useState(['productivity', 'learning', 'ai']);

  // Debug environment variables
  console.log('Debug env from component:', debugEnv());

  const { 
    content, 
    loading, 
    error, 
    refreshContent, 
    markAsConsumed, 
    updatePriority,
    fetchContent,
    searchContent 
  } = useContent({ topics: userTopics });

  // Filter and sort content
  const filteredContent = useMemo(() => {
    let filtered = content;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (filterBy === 'consumed') {
      filtered = filtered.filter(item => item.consumed);
    } else if (filterBy === 'pending') {
      filtered = filtered.filter(item => !item.consumed);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return b.priority - a.priority;
        case 'date':
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [content, searchQuery, filterBy, sortBy]);

  // Stats
  const stats = useMemo(() => {
    const total = content.length;
    const consumed = content.filter(item => item.consumed).length;
    const pending = total - consumed;
    const avgPriority = content.length > 0 
      ? (content.reduce((sum, item) => sum + item.priority, 0) / content.length).toFixed(1)
      : 0;

    return { total, consumed, pending, avgPriority };
  }, [content]);

  const handleTopicChange = (newTopics) => {
    setUserTopics(newTopics);
    fetchContent({ topics: newTopics });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchContent(searchQuery.trim());
    }
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-900/50 border border-red-800 rounded-lg p-4">
          <h3 className="text-red-300 font-medium">Error loading content</h3>
          <p className="text-red-400 text-sm mt-1">{error}</p>
          <button 
            onClick={refreshContent}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Content Intelligence</h1>
        <p className="text-gray-300">Your personalized learning content, curated and prioritized</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={20} className="text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Total Content</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={20} className="text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">Pending</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.pending}</p>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-green-400" />
            <span className="text-sm font-medium text-gray-300">Completed</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.consumed}</p>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-300">Avg Priority</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.avgPriority}/10</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <form onSubmit={handleSearch} className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search YouTube content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Search
              </button>
            </form>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Content</option>
              <option value="pending">Pending</option>
              <option value="consumed">Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="priority">Priority</option>
              <option value="date">Date</option>
              <option value="title">Title</option>
            </select>

            <button
              onClick={refreshContent}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Topics */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Learning Topics
          </label>
          <div className="flex flex-wrap gap-2">
            {['productivity', 'learning', 'ai', 'programming', 'design', 'business'].map(topic => (
              <button
                key={topic}
                onClick={() => {
                  const newTopics = userTopics.includes(topic)
                    ? userTopics.filter(t => t !== topic)
                    : [...userTopics, topic];
                  handleTopicChange(newTopics);
                }}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  userTopics.includes(topic)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {loading && content.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw size={32} className="animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-gray-300">Curating your personalized content...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredContent.map(item => (
            <ContentCard
              key={item.id}
              content={item}
              onMarkConsumed={markAsConsumed}
              onUpdatePriority={updatePriority}
            />
          ))}
        </div>
      )}

      {filteredContent.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen size={48} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No content found</h3>
          <p className="text-gray-300 mb-4">
            {searchQuery || filterBy !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Add some topics to get started with content curation'
            }
          </p>
          {!searchQuery && filterBy === 'all' && (
            <button
              onClick={refreshContent}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Content
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentDashboard;