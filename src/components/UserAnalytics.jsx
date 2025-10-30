import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import ContentCard from './ContentCard';
import LearningGoalsWidget from './LearningGoalsWidget';
import SkillProgressWidget from './SkillProgressWidget';
import ScheduleModal from './ScheduleModal';

import WeeklyStatsWidget from './WeeklyStatsWidget';

const UserAnalytics = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Debug authentication state
  useEffect(() => {
    console.log('🔍 UserAnalytics - Auth State:', {
      user: !!user,
      isAuthenticated,
      token: !!localStorage.getItem('authToken')
    });
  }, [user, isAuthenticated]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scheduleModal, setScheduleModal] = useState({ isOpen: false, content: null });
  const [scheduledItems, setScheduledItems] = useState(new Set());

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Import the userProfileService dynamically to ensure port detection works
      const { default: userProfileService } = await import('../services/userProfileService.js');
      const data = await userProfileService.getDashboardData(user.id);

      if (data.success) {
        setDashboardData(data.data);
      } else {
        setError(data.message || 'Failed to load analytics');
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Schedule handlers
  const handleScheduleClick = (content) => {
    setScheduleModal({ isOpen: true, content });
  };

  const closeScheduleModal = () => {
    setScheduleModal({ isOpen: false, content: null });
  };

  const handleScheduleSuccess = (scheduledContent) => {
    setScheduledItems(prev => new Set([...prev, scheduledContent.contentId]));
    closeScheduleModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#060010]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#060010] pt-20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-200 mb-2">
              Error Loading User Analytics
            </h3>
            <p className="text-red-300">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { widgets } = dashboardData;

  return (
    <div className="min-h-screen bg-[#060010] pt-20">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {dashboardData.user.avatar && (
                <img
                  src={dashboardData.user.avatar}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">
                  User Analytics - {dashboardData.user.firstName}
                </h1>
                <p className="text-gray-400">
                  Your personalized learning insights and performance metrics
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Learning Streak</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {widgets.weeklyStats?.streak || 0} days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytics Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-8">

            {/* Learning Goals Tracker */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-800">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-semibold text-white">
                  Learning Goals Analytics
                </h2>
                <p className="text-gray-400 mt-1">
                  Track your progress toward your learning objectives
                </p>
              </div>
              <div className="p-6">
                <LearningGoalsWidget goals={widgets.learningGoalsTracker} />
              </div>
            </div>

            {/* Recommended Content */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-800">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-semibold text-white">
                  AI-Recommended Content
                </h2>
                <p className="text-gray-400 mt-1">
                  Personalized content based on your learning patterns and goals
                </p>
              </div>
              <div className="p-6">
                {widgets.recommendedContent?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {widgets.recommendedContent.map((content, index) => (
                      <ContentCard
                        key={content.contentId || index}
                        content={content}
                        showRecommendationScore={true}
                        showReasons={true}
                        onSchedule={handleScheduleClick}
                        isScheduled={scheduledItems.has(content.contentId || content.id || content._id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      No Recommendations Yet
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Complete your learning profile to get personalized recommendations
                    </p>
                    <button
                      onClick={() => window.location.href = '/profile'}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      Complete Profile
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Trending Content */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-800">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-semibold text-white">
                  Trending Analytics
                </h2>
                <p className="text-gray-400 mt-1">
                  Popular content personalized for your interests
                </p>
              </div>
              <div className="p-6">
                {widgets.trendingContent?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {widgets.trendingContent.map((content, index) => (
                      <ContentCard
                        key={content.contentId || index}
                        content={content}
                        showTrendingBadge={true}
                        onSchedule={handleScheduleClick}
                        isScheduled={scheduledItems.has(content.contentId || content.id || content._id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No trending content available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Analytics Widgets */}
          <div className="lg:col-span-4 space-y-6">

            {/* Weekly Stats */}
            <WeeklyStatsWidget stats={widgets.weeklyStats} />

            {/* Skill Progress */}
            <SkillProgressWidget skills={widgets.skillProgress} />



            {/* Quick Actions */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Analytics Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    console.log('🔵 Summarizer button clicked');
                    console.log('User authenticated:', !!user);
                    console.log('User data:', user);
                    console.log('Auth token:', !!localStorage.getItem('authToken'));
                    navigate('/summarizer');
                  }}
                  className="w-full text-left p-3 rounded-lg bg-blue-900/20 hover:bg-blue-900/30 transition-all duration-200 border border-blue-800/30 hover:border-blue-700/50 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white group-hover:text-blue-200 transition-colors">Summarize Content</p>
                      <p className="text-sm text-gray-400">Get AI summaries of videos and articles</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>


                <button
                  onClick={() => {
                    console.log('🟣 Profile button clicked');
                    console.log('User authenticated:', !!user);
                    console.log('User data:', user);
                    navigate('/profile');
                  }}
                  className="w-full text-left p-3 rounded-lg bg-purple-900/20 hover:bg-purple-900/30 transition-all duration-200 border border-purple-800/30 hover:border-purple-700/50 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white group-hover:text-purple-200 transition-colors">Update Profile</p>
                      <p className="text-sm text-gray-400">Enhance your personalized recommendations</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                <button
                  onClick={() => {
                    console.log('🟠 Notes button clicked');
                    console.log('User authenticated:', !!user);
                    console.log('User data:', user);
                    navigate('/notes');
                  }}
                  className="w-full text-left p-3 rounded-lg bg-orange-900/20 hover:bg-orange-900/30 transition-all duration-200 border border-orange-800/30 hover:border-orange-700/50 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white group-hover:text-orange-200 transition-colors">View Notes</p>
                      <p className="text-sm text-gray-400">Access all your learning notes and annotations</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default UserAnalytics;