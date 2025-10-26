import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import recommendationService from '../../services/recommendationService';
import ContentCard from '../../components/ContentCard';


const Recommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personalized');
  const [filters, setFilters] = useState({
    contentTypes: [],
    difficulty: '',
    maxDuration: ''
  });

  useEffect(() => {
    loadRecommendations();
  }, [user, filters]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Always load trending content
      const trendingRes = await recommendationService.getTrendingContent(user?.id, { limit: 10 });
      setTrending(trendingRes.data?.trending || []);

      // Only load personalized recommendations if user is signed in
      if (user) {
        try {
          const personalizedRes = await recommendationService.getPersonalizedRecommendations(user.id, {
            limit: 20,
            ...filters
          });
          setRecommendations(personalizedRes.data?.recommendations || []);
        } catch (personalizedErr) {
          console.error('Error loading personalized recommendations:', personalizedErr);
          // Don't set error for personalized recommendations, just leave them empty
          setRecommendations([]);
        }
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError(err.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleInteraction = async (contentId, interactionType, data = {}) => {
    try {
      await recommendationService.recordInteraction({
        contentId,
        interactionType,
        ...data
      });
      
      // Refresh recommendations after interaction
      if (interactionType === 'rate') {
        loadRecommendations();
      }
    } catch (err) {
      console.error('Error recording interaction:', err);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Show sign-in prompt for personalized tab if not authenticated
  const showSignInPrompt = !user && activeTab === 'personalized';

  return (
    <div className="min-h-screen bg-[#060010] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Content Recommendations
          </h1>
          <p className="text-gray-400">
            Discover content tailored to your learning goals and interests
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800/50 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('personalized')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'personalized'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            For You
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'trending'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Trending
          </button>
        </div>

        {/* Filters */}
        {activeTab === 'personalized' && (
          <div className="mb-8 p-4 bg-gray-800/30 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Content Types */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content Type
                </label>
                <select
                  value={filters.contentTypes.join(',')}
                  onChange={(e) => handleFilterChange('contentTypes', e.target.value ? e.target.value.split(',') : [])}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="youtube">YouTube</option>
                  <option value="article">Articles</option>
                  <option value="course">Courses</option>
                  <option value="podcast">Podcasts</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Duration (minutes)
                </label>
                <select
                  value={filters.maxDuration}
                  onChange={(e) => handleFilterChange('maxDuration', e.target.value ? parseInt(e.target.value) * 60 : '')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Duration</option>
                  <option value="5">5 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-white text-lg">Loading...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-white mb-2">Error Loading Recommendations</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={loadRecommendations}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : showSignInPrompt ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="text-lg font-medium text-white mb-2">Sign In for Personalized Recommendations</h3>
              <p className="text-gray-400 mb-6">
                Create an account or sign in to get content recommendations tailored to your interests and learning goals.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/signin'}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => window.location.href = '/signup'}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {activeTab === 'personalized' ? (
              <div>
                {recommendations.length > 0 ? (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">
                      Personalized for You ({recommendations.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recommendations.map((content, index) => {
                        // Map recommendation data to ContentCard expected format
                        const mappedContent = {
                          ...content,
                          id: content.contentId,
                          channelTitle: content.source,
                          difficulty: content.metadata?.difficulty || 'intermediate',
                          priority: 7, // Default priority for recommendations
                          tags: content.metadata?.tags || [],
                          summary: content.description || content.aiAnalysis?.summary,
                          duration: content.metadata?.durationSec ? `PT${Math.floor(content.metadata.durationSec / 60)}M${content.metadata.durationSec % 60}S` : null,
                          viewCount: content.consumptionStats?.views,
                          consumed: false
                        };
                        
                        return (
                          <ContentCard
                            key={content.contentId || index}
                            content={mappedContent}
                            showRecommendationScore={true}
                            showReasons={true}
                            onMarkConsumed={() => handleInteraction(content.contentId, 'view', { completed: true })}
                            onUpdatePriority={() => {}} // Not applicable for recommendations
                            onSchedule={() => {}} // Could implement scheduling later
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <h3 className="text-lg font-medium text-white mb-2">No Recommendations Yet</h3>
                      <p className="text-gray-400 mb-4">
                        Complete your learning profile to get personalized recommendations
                      </p>
                      <button
                        onClick={() => window.location.href = '/profile'}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Complete Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {trending.length > 0 ? (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">
                      Trending Content ({trending.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trending.map((content, index) => {
                        // Map trending data to ContentCard expected format
                        const mappedContent = {
                          ...content,
                          id: content.contentId,
                          channelTitle: content.source,
                          difficulty: content.metadata?.difficulty || 'intermediate',
                          priority: 7, // Default priority for trending
                          tags: content.metadata?.tags || [],
                          summary: content.description || content.aiAnalysis?.summary,
                          duration: content.metadata?.durationSec ? `PT${Math.floor(content.metadata.durationSec / 60)}M${content.metadata.durationSec % 60}S` : null,
                          viewCount: content.consumptionStats?.views,
                          consumed: false
                        };
                        
                        return (
                          <ContentCard
                            key={content.contentId || index}
                            content={mappedContent}
                            showTrendingBadge={true}
                            onMarkConsumed={() => handleInteraction(content.contentId, 'view', { completed: true })}
                            onUpdatePriority={() => {}} // Not applicable for trending
                            onSchedule={() => {}} // Could implement scheduling later
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400">
                      <h3 className="text-lg font-medium text-white mb-2">No Trending Content</h3>
                      <p className="text-gray-400">Check back later for trending content</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;