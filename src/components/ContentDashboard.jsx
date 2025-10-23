// Main content dashboard component
import { useState, useMemo, useEffect } from 'react';
import { RefreshCw, Filter, Search, BookOpen, Clock, TrendingUp, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useContent } from '../hooks/useContent';
import ContentCard from './ContentCard';
import ScheduleModal from './ScheduleModal';


const ContentDashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, consumed, pending
  const [sortBy, setSortBy] = useState('priority'); // priority, date, title
  const [userTopics, setUserTopics] = useState(['productivity', 'learning', 'ai']);
  const [searchOptions, setSearchOptions] = useState({
    order: 'relevance',
    duration: 'any',
    publishedAfter: null
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [activeTab, setActiveTab] = useState('curated'); // curated, search, trending
  const [scheduleModal, setScheduleModal] = useState({ isOpen: false, content: null });
  const [scheduledItems, setScheduledItems] = useState(new Set());

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);



  const { 
    content, 
    loading, 
    error, 
    refreshContent, 
    markAsConsumed, 
    updatePriority,
    fetchContent,
    searchContent,
    fetchTrending,
    curateContent
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
      searchContent(searchQuery.trim(), searchOptions);
    }
  };

  const handleCurateContent = () => {
    curateContent({
      topics: userTopics,
      maxResults: 20,
      minPriority: 6,
      difficulty: 'all',
      duration: searchOptions.duration
    });
  };

  const handleFetchTrending = () => {
    fetchTrending(20, '0'); // General category
  };

  const handleScheduleClick = (item) => {
    setScheduleModal({ isOpen: true, content: item });
  };

  const handleScheduleSuccess = (scheduledContent) => {
    setScheduledItems(prev => new Set([...prev, scheduledContent.contentId]));
    // You could also show a success message here
  };

  const closeScheduleModal = () => {
    setScheduleModal({ isOpen: false, content: null });
  };

  // Show sign in required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 text-center">
          <LogIn className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-gray-300 mb-6">
            You need to sign in to access your smart scheduler and view your scheduled content.
          </p>
          <button
            onClick={() => navigate('/signin')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In to Your Account
          </button>
          <p className="text-gray-400 text-sm mt-4">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    );
  }

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
        <p className="text-gray-300">Your personalized learning content, curated and prioritized with YouTube API</p>
        
        {/* Tabs */}
        <div className="flex gap-1 mt-4 bg-gray-900/50 p-1 rounded-lg border border-gray-800 w-fit">
          {[
            { id: 'curated', label: 'AI Curated', icon: '🤖' },
            { id: 'search', label: 'Search', icon: '🔍' },
            { id: 'trending', label: 'Trending', icon: '🔥' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
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
        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
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
              
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
              >
                <Filter size={16} />
                Advanced
              </button>
            </div>

            {/* Advanced Search Options */}
            {showAdvancedSearch && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sort Order</label>
                  <select
                    value={searchOptions.order}
                    onChange={(e) => setSearchOptions(prev => ({ ...prev, order: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="date">Upload Date</option>
                    <option value="viewCount">View Count</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                  <select
                    value={searchOptions.duration}
                    onChange={(e) => setSearchOptions(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="any">Any Duration</option>
                    <option value="short">Under 4 minutes</option>
                    <option value="medium">4-20 minutes</option>
                    <option value="long">Over 20 minutes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Published After</label>
                  <input
                    type="date"
                    value={searchOptions.publishedAfter || ''}
                    onChange={(e) => setSearchOptions(prev => ({ ...prev, publishedAfter: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Curated Tab */}
        {activeTab === 'curated' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-white">AI-Curated Content</h3>
                <p className="text-sm text-gray-300">Personalized content based on your learning topics</p>
              </div>
              <button
                onClick={handleCurateContent}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Curate Content
              </button>
            </div>
            
            {/* Topics */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Learning Topics</label>
              <div className="flex flex-wrap gap-2">
                {['productivity', 'learning', 'ai', 'programming', 'design', 'business', 'javascript', 'python', 'react'].map(topic => (
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
        )}

        {/* Trending Tab */}
        {activeTab === 'trending' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-white">Trending Content</h3>
                <p className="text-sm text-gray-300">Popular videos on YouTube right now</p>
              </div>
              <button
                onClick={handleFetchTrending}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                <TrendingUp size={16} />
                Get Trending
              </button>
            </div>
          </div>
        )}

        {/* Common Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-gray-700">
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
              onSchedule={handleScheduleClick}
              isScheduled={scheduledItems.has(item.id)}
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

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={scheduleModal.isOpen}
        onClose={closeScheduleModal}
        content={scheduleModal.content}
        onSchedule={handleScheduleSuccess}
      />
    </div>
  );
};

export default ContentDashboard;