// Enhanced Smart Summarizer Dashboard Component
import { useState, useEffect } from 'react';
import { 
  FileText, 
  Zap, 
  Search, 
  Plus, 
  BookOpen, 
  Clock, 
  Star,
  TrendingUp,
  Video,
  CheckCircle,
  Brain,
  Sparkles
} from 'lucide-react';
import { useSummarizer } from '../hooks/useSummarizer';
import { useContent } from '../hooks/useContent';
import SummaryCard from './SummaryCard';
import apiClient from '../utils/api';

const SummarizerDashboard = () => {
  const [activeTab, setActiveTab] = useState('summaries');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [summaryMode, setSummaryMode] = useState('insight');
  const [completedVideos, setCompletedVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [topicSearchResults, setTopicSearchResults] = useState([]);
  const [searchingTopics, setSearchingTopics] = useState(false);
  const [allSummaries, setAllSummaries] = useState([]);

  const { content } = useContent();
  const {
    loading,
    error,
    summarizeContent,
    rateSummary,
    addNotes,
    getAllSummaries,
    hasSummary,
    getSummaryStats,
    searchTopics,
    summarizeCompletedVideo,
    deleteSummary
  } = useSummarizer();

  // Fetch completed videos and summaries on component mount
  useEffect(() => {
    fetchCompletedVideos();
    loadSummaries();
  }, []);

  const loadSummaries = async () => {
    try {
      const summaries = await getAllSummaries();
      setAllSummaries(summaries || []);
    } catch (error) {
      console.error('Error loading summaries:', error);
      setAllSummaries([]);
    }
  };

  const fetchCompletedVideos = async () => {
    setLoadingVideos(true);
    try {
      const data = await apiClient.getAllVideoNotes();
      setCompletedVideos(data.data || []);
    } catch (error) {
      console.error('Error fetching completed videos:', error);
    } finally {
      setLoadingVideos(false);
    }
  };

  const handleTopicSearch = async (query) => {
    if (!query.trim()) {
      setTopicSearchResults([]);
      return;
    }

    setSearchingTopics(true);
    try {
      const results = await searchTopics(query);
      setTopicSearchResults(results);
    } catch (error) {
      console.error('Error searching topics:', error);
    } finally {
      setSearchingTopics(false);
    }
  };

  const stats = getSummaryStats();

  // Filter summaries based on search and filters
  const filteredSummaries = allSummaries.filter(summary => {
    const matchesSearch = !searchQuery || 
      summary.originalContent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMode = filterMode === 'all' || summary.mode === filterMode;
    const matchesDifficulty = filterDifficulty === 'all' || summary.difficulty === filterDifficulty;

    return matchesSearch && matchesMode && matchesDifficulty;
  });

  // Get content that can be summarized
  const summarizableContent = content.filter(item => !hasSummary(item.id));

  const handleCreateSummary = async (contentItem, mode) => {
    setSelectedContent(contentItem);
    setSummaryMode(mode);
    await summarizeContent(contentItem, mode);
    await loadSummaries(); // Refresh summaries list
    setShowCreateModal(false);
    setSelectedContent(null);
  };

  const handleCreateCustomSummary = async (topic, description, mode) => {
    // Create a custom content object for the topic
    const customContent = {
      id: `custom_${Date.now()}`,
      title: topic,
      description: description || `Learn about ${topic}`,
      type: 'custom',
      tags: topic.split(' ').filter(word => word.length > 2),
      difficulty: 'intermediate',
      priority: 8,
      source: 'Custom Topic',
      channelTitle: 'User Generated'
    };
    
    await summarizeContent(customContent, mode);
    await loadSummaries(); // Refresh summaries list
    setShowCreateModal(false);
    setCustomTopic('');
    setCustomDescription('');
    // Auto-navigate to summaries tab after creation
    setActiveTab('summaries');
  };

  const handleDeleteSummary = async (summaryId) => {
    try {
      await deleteSummary(summaryId);
      // Refresh the summaries list after deletion
      await loadSummaries();
    } catch (error) {
      console.error('Error deleting summary:', error);
    }
  };

  const handleSummarizeCompletedVideo = async (video, mode) => {
    const videoContent = {
      id: `video_${video.videoId}_${Date.now()}`,
      title: video.title,
      description: video.notes,
      type: 'completed_video',
      videoId: video.videoId,
      videoUrl: video.videoUrl,
      tags: video.title.split(' ').filter(word => word.length > 2),
      difficulty: 'intermediate',
      priority: 9,
      source: 'Completed Video',
      channelTitle: 'Video Notes'
    };
    
    await summarizeContent(videoContent, mode);
    await loadSummaries(); // Refresh summaries list
    // Auto-navigate to summaries tab after creation
    setActiveTab('summaries');
  };

  const handleCreateTopicSummary = async (topicResult) => {
    const topicContent = {
      id: `topic_${Date.now()}`,
      title: topicResult.title,
      description: topicResult.description,
      type: 'topic_search',
      tags: topicResult.title.split(' ').filter(word => word.length > 2),
      difficulty: topicResult.difficulty,
      priority: 8,
      source: 'Topic Search',
      channelTitle: 'Smart Search'
    };
    
    await summarizeContent(topicContent, 'insight');
    await loadSummaries(); // Refresh summaries list
    // Auto-navigate to summaries tab after creation
    setActiveTab('summaries');
  };

  const handleCreateCustomTopicSummary = async (topic) => {
    const customContent = {
      id: `custom_topic_${Date.now()}`,
      title: topic,
      description: `Learn about ${topic} - comprehensive guide and insights`,
      type: 'custom',
      tags: topic.split(' ').filter(word => word.length > 2),
      difficulty: 'intermediate',
      priority: 8,
      source: 'Custom Topic',
      channelTitle: 'User Generated'
    };
    
    await summarizeContent(customContent, 'insight');
    await loadSummaries(); // Refresh summaries list
    // Auto-navigate to summaries tab after creation
    setActiveTab('summaries');
  };

  const [summaryType, setSummaryType] = useState('existing'); // 'existing' or 'custom'
  const [customTopic, setCustomTopic] = useState('');
  const [customDescription, setCustomDescription] = useState('');

  const CreateSummaryModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Create New Summary</h2>
          <button
            onClick={() => setShowCreateModal(false)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Summary Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What would you like to summarize?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setSummaryType('existing');
                }}
                className={`p-3 border rounded-lg text-left transition-colors cursor-pointer ${
                  summaryType === 'existing'
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="font-medium text-white text-sm">Existing Content</div>
                <div className="text-xs text-gray-400">From your library</div>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setSummaryType('custom');
                }}
                className={`p-3 border rounded-lg text-left transition-colors cursor-pointer ${
                  summaryType === 'custom'
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="font-medium text-white text-sm">Custom Topic</div>
                <div className="text-xs text-gray-400">Any topic you want</div>
              </button>
            </div>
          </div>

          {summaryType === 'existing' ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Content to Summarize
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {summarizableContent.length > 0 ? (
                  summarizableContent.map(item => (
                    <div
                      key={item.id}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedContent(item);
                      }}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedContent?.id === item.id
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <h3 className="font-medium text-white text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">{item.channelTitle}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                          {item.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">Priority: {item.priority}/10</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No content available to summarize</p>
                    <p className="text-xs mt-1">Try the custom topic option instead</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Topic or Question *
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g., Machine Learning basics, How to start a business, React hooks..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Context (Optional)
                </label>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Provide any specific context, your current level, or what you want to focus on..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              
              {/* Popular Topics */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Popular Topics
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Machine Learning Basics',
                    'React Hooks',
                    'Time Management',
                    'Investment Strategies',
                    'Public Speaking',
                    'Data Structures',
                    'Digital Marketing',
                    'Mindfulness'
                  ].map(topic => (
                    <button
                      key={topic}
                      onClick={(e) => {
                        e.preventDefault();
                        setCustomTopic(topic);
                      }}
                      className="p-2 text-left text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-gray-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Summary Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { mode: 'tldr', label: 'TL;DR', desc: 'Quick overview' },
                { mode: 'insight', label: 'Insight', desc: 'Balanced analysis' },
                { mode: 'detailed', label: 'Detailed', desc: 'Comprehensive' }
              ].map(({ mode, label, desc }) => (
                <button
                  key={mode}
                  onClick={(e) => {
                    e.preventDefault();
                    setSummaryMode(mode);
                  }}
                  className={`p-3 border rounded-lg text-left transition-colors cursor-pointer ${
                    summaryMode === mode
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-white text-sm">{label}</div>
                  <div className="text-xs text-gray-400">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                if (summaryType === 'existing' && selectedContent) {
                  handleCreateSummary(selectedContent, summaryMode);
                } else if (summaryType === 'custom' && customTopic.trim()) {
                  handleCreateCustomSummary(customTopic, customDescription, summaryMode);
                }
              }}
              disabled={
                loading || 
                (summaryType === 'existing' && !selectedContent) || 
                (summaryType === 'custom' && !customTopic.trim())
              }
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Generate Summary
                </>
              )}
            </button>
            <button
              onClick={() => {
                setShowCreateModal(false);
                setSelectedContent(null);
                setCustomTopic('');
                setCustomDescription('');
                setSummaryType('existing');
              }}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const StatsOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <FileText size={20} className="text-blue-400" />
          <span className="text-sm font-medium text-gray-300">Total Summaries</span>
        </div>
        <p className="text-2xl font-bold text-white">{stats.total}</p>
      </div>
      
      <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={20} className="text-green-400" />
          <span className="text-sm font-medium text-gray-300">Reading Time</span>
        </div>
        <p className="text-2xl font-bold text-white">{stats.totalReadingTime}m</p>
      </div>
      
      <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <Star size={20} className="text-yellow-400" />
          <span className="text-sm font-medium text-gray-300">Avg Rating</span>
        </div>
        <p className="text-2xl font-bold text-white">{stats.averageRating}/5</p>
      </div>
      
      <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={20} className="text-purple-400" />
          <span className="text-sm font-medium text-gray-300">This Week</span>
        </div>
        <p className="text-2xl font-bold text-white">
          {allSummaries.filter(s => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(s.createdAt) > weekAgo;
          }).length}
        </p>
      </div>
    </div>
  );

  const CompletedVideosView = () => (
    <div className="space-y-6">
      <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            Completed Videos Ready for Summarization
          </h3>
          <button
            onClick={fetchCompletedVideos}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
        
        {loadingVideos ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
            <span className="ml-2 text-gray-400">Loading completed videos...</span>
          </div>
        ) : completedVideos.length > 0 ? (
          <div className="grid gap-4">
            {completedVideos.map((video) => (
              <div key={video._id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-2">{video.title}</h4>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{video.notes}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Video ID: {video.videoId}</span>
                      <span>Updated: {new Date(video.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleSummarizeCompletedVideo(video, 'insight')}
                      disabled={loading}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1"
                    >
                      <Brain size={14} />
                      Smart Summary
                    </button>
                    <button
                      onClick={() => handleSummarizeCompletedVideo(video, 'detailed')}
                      disabled={loading}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                    >
                      <FileText size={14} />
                      Detailed
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Video size={48} className="text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Completed Videos</h3>
            <p className="text-gray-400">
              Watch some videos and take notes to see them here for summarization.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const TopicSearchView = () => (
    <div className="space-y-6">
      <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h3 className="text-white font-medium">Smart Topic Search & Learning</h3>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search any topic to learn about... (e.g., Machine Learning, React Hooks, Time Management)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleTopicSearch(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Popular Topics */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Popular Learning Topics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                'Machine Learning',
                'React Development',
                'Time Management',
                'Investment Strategies',
                'Public Speaking',
                'Data Science',
                'Digital Marketing',
                'Mindfulness',
                'Productivity Hacks',
                'Leadership Skills',
                'Cryptocurrency',
                'UI/UX Design'
              ].map(topic => (
                <button
                  key={topic}
                  onClick={() => {
                    setSearchQuery(topic);
                    handleTopicSearch(topic);
                  }}
                  className="p-2 text-left text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {searchingTopics && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
              <span className="ml-2 text-gray-400">Searching for learning resources...</span>
            </div>
          )}

          {topicSearchResults.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-300">Learning Resources Found</h4>
              <div className="grid gap-3">
                {topicSearchResults.map((result, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="text-white font-medium mb-1">{result.title}</h5>
                        <p className="text-gray-400 text-sm mb-2">{result.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="bg-gray-700 px-2 py-1 rounded">{result.difficulty}</span>
                          <span>{result.estimatedTime}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCreateTopicSummary(result)}
                        disabled={loading}
                        className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1"
                      >
                        <Zap size={14} />
                        Summarize
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchQuery && !searchingTopics && topicSearchResults.length === 0 && (
            <div className="text-center py-8">
              <Search size={48} className="text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Results Found</h3>
              <p className="text-gray-400 mb-4">
                Try a different search term or create a custom summary for "{searchQuery}"
              </p>
              <button
                onClick={() => handleCreateCustomTopicSummary(searchQuery)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2 mx-auto"
              >
                <Plus size={16} />
                Create Custom Summary
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const AnalyticsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mode Distribution */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
          <h3 className="text-white font-medium mb-4">Summary Modes</h3>
          <div className="space-y-3">
            {Object.entries(stats.modeDistribution).map(([mode, count]) => {
              const percentage = (count / stats.total * 100).toFixed(1);
              return (
                <div key={mode} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">{mode}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-12">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
          <h3 className="text-white font-medium mb-4">Content Difficulty</h3>
          <div className="space-y-3">
            {Object.entries(stats.difficultyDistribution).map(([difficulty, count]) => {
              const percentage = (count / stats.total * 100).toFixed(1);
              const color = difficulty === 'beginner' ? 'bg-green-400' : 
                           difficulty === 'intermediate' ? 'bg-yellow-400' : 'bg-red-400';
              return (
                <div key={difficulty} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">{difficulty}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-800 rounded-full h-2">
                      <div 
                        className={`${color} h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-12">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Active Summarizer</h1>
          <p className="text-gray-300">Transform any topic into actionable insights</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowCreateModal(true);
              setSummaryType('custom');
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 cursor-pointer"
          >
            <Search size={16} />
            Learn Any Topic
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowCreateModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            New Summary
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatsOverview />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-900/50 p-1 rounded-lg border border-gray-800">
        {[
          { key: 'summaries', label: 'Summaries', icon: FileText },
          { key: 'completed', label: 'Completed Videos', icon: Video },
          { key: 'search', label: 'Topic Search', icon: Search },
          { key: 'analytics', label: 'Analytics', icon: TrendingUp }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === key
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'summaries' && (
        <>
          {/* Controls */}
          <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search summaries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Modes</option>
                  <option value="tldr">TL;DR</option>
                  <option value="insight">Insight</option>
                  <option value="detailed">Detailed</option>
                </select>

                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Summaries Grid */}
          {loading && filteredSummaries.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Generating summary...</p>
              </div>
            </div>
          ) : filteredSummaries.length > 0 ? (
            <div className="space-y-6">
              {filteredSummaries.map(summary => (
                <SummaryCard
                  key={summary._id || summary.id}
                  summary={summary}
                  onRate={rateSummary}
                  onAddNotes={addNotes}
                  onDelete={handleDeleteSummary}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText size={48} className="text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No summaries found</h3>
              <p className="text-gray-400 mb-4">
                {searchQuery || filterMode !== 'all' || filterDifficulty !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first summary to get started'
                }
              </p>
              <div className="flex gap-3 justify-center">
                {!searchQuery && filterMode === 'all' && filterDifficulty === 'all' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setShowCreateModal(true);
                        setSummaryType('custom');
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 cursor-pointer"
                    >
                      <Search size={16} />
                      Learn Any Topic
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setShowCreateModal(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      Create Summary
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'completed' && <CompletedVideosView />}

      {activeTab === 'search' && <TopicSearchView />}

      {activeTab === 'analytics' && <AnalyticsView />}

      {/* Create Summary Modal */}
      {showCreateModal && <CreateSummaryModal />}

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-900/50 border border-red-800 rounded-lg p-4 max-w-sm">
          <h4 className="text-red-300 font-medium">Error</h4>
          <p className="text-red-400 text-sm mt-1">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SummarizerDashboard;