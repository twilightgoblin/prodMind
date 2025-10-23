// Smart Scheduler Dashboard Component
import { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, Settings, Play, CheckCircle, AlertCircle, LogIn } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useScheduler } from '../hooks/useScheduler';
import { useContent } from '../hooks/useContent';
import { generateVideoPlayerUrl } from '../utils/videoUtils';

const SchedulerDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('today');
  const [showSettings, setShowSettings] = useState(false);

  const { content } = useContent();
  const {
    schedule,
    todaysSchedule,
    preferences,
    loading,
    patterns,
    generateSchedule,
    updatePreferences,
    completeSession,
    rescheduleSession,
    getUpcomingSessions,
    getScheduleStats
  } = useScheduler();

  const stats = getScheduleStats();
  const upcomingSessions = getUpcomingSessions();

  // Auto-generate schedule when content changes
  useEffect(() => {
    if (content.length > 0 && schedule.length === 0) {
      generateSchedule(content, 'week');
    }
  }, [content]);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSessionStatus = (session) => {
    const now = new Date();
    const sessionStart = new Date(session.startTime);
    const sessionEnd = new Date(session.endTime);

    if (session.completed) return 'completed';
    if (now > sessionEnd) return 'overdue';
    if (now >= sessionStart && now <= sessionEnd) return 'active';
    return 'upcoming';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-900/30';
      case 'active': return 'text-blue-400 bg-blue-900/30';
      case 'overdue': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'active': return <Play size={16} />;
      case 'overdue': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const SessionCard = ({ session }) => {
    const status = getSessionStatus(session);
    const statusColor = getStatusColor(status);

    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-medium text-white mb-1 line-clamp-2">
              {session.content?.title || 'Learning Session'}
            </h3>
            <p className="text-sm text-gray-400">
              {formatTime(session.startTime)} - {formatTime(session.endTime)}
            </p>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusColor}`}>
            {getStatusIcon(status)}
            {status}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-gray-400">
            <span>{session.duration} min</span>
            <span>Priority: {session.priority}/10</span>
            <span>Focus: {session.focusPrediction}/10</span>
          </div>

          <div className="flex items-center gap-2">
            {session.content?.url && (
              <Link
                to={generateVideoPlayerUrl(session.content)}
                className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded text-xs hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-1 no-underline"
              >
                <Play size={12} />
                Watch
              </Link>
            )}

            {status === 'upcoming' && (
              <button
                onClick={() => completeSession(session.id)}
                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
              >
                Start
              </button>
            )}

            {status === 'active' && (
              <button
                onClick={() => completeSession(session.id, 8)}
                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
              >
                Complete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const EngagementChart = () => {
    if (!patterns) return null;

    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM

    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
        <h3 className="text-white font-medium mb-4">Focus Patterns</h3>
        <div className="space-y-2">
          {hours.map(hour => {
            const data = patterns.hourlyEngagement[hour] || { total: 0, successful: 0 };
            const successRate = data.total > 0 ? (data.successful / data.total) * 100 : 0;
            const isPeak = patterns.focusPeaks.includes(hour);

            return (
              <div key={hour} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-16">
                  {hour}:00 {hour < 12 ? 'AM' : 'PM'}
                </span>
                <div className="flex-1 bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${isPeak ? 'bg-green-400' : 'bg-blue-400'}`}
                    style={{ width: `${successRate}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-12">
                  {successRate.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Green bars indicate your peak focus hours
        </p>
      </div>
    );
  };

  const PreferencesPanel = () => (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
      <h3 className="text-white font-medium mb-4">Scheduling Preferences</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-2">Focus Hours</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max="23"
              value={preferences.focusHours.start}
              onChange={(e) => updatePreferences({
                focusHours: { ...preferences.focusHours, start: parseInt(e.target.value) }
              })}
              className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm"
            />
            <span className="text-gray-400 self-center">to</span>
            <input
              type="number"
              min="0"
              max="23"
              value={preferences.focusHours.end}
              onChange={(e) => updatePreferences({
                focusHours: { ...preferences.focusHours, end: parseInt(e.target.value) }
              })}
              className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Preferred Session Length: {preferences.preferredSessionLength} min
          </label>
          <input
            type="range"
            min="15"
            max="90"
            step="5"
            value={preferences.preferredSessionLength}
            onChange={(e) => updatePreferences({ preferredSessionLength: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Max Sessions Per Day: {preferences.maxSessionsPerDay}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={preferences.maxSessionsPerDay}
            onChange={(e) => updatePreferences({ maxSessionsPerDay: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <button
          onClick={() => generateSchedule(content, 'week')}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Regenerate Schedule
        </button>
      </div>
    </div>
  );

  // Show sign-in prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8">
            <LogIn size={48} className="text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
            <p className="text-gray-300 mb-6">
              You need to sign in to access your smart scheduler and view your scheduled content.
            </p>
            <div className="space-y-4">
              <Link
                to="/signin"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In to Your Account
              </Link>
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300">
                  Sign up here
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Smart Scheduler</h1>
          <p className="text-gray-300">AI-powered learning schedule optimization</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-gray-700"
        >
          <Settings size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={20} className="text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Total Sessions</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={20} className="text-green-400" />
            <span className="text-sm font-medium text-gray-300">Completed</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.completed}</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">Completion Rate</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.completionRate}%</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-300">Avg Focus</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.avgFocusScore}/10</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-900/50 p-1 rounded-lg border border-gray-800">
        {['today', 'upcoming', 'analytics'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'today' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Today's Schedule</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
                  <p className="text-gray-400 mt-2">Generating optimal schedule...</p>
                </div>
              ) : todaysSchedule.length > 0 ? (
                <div className="space-y-4">
                  {todaysSchedule.map(session => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar size={48} className="text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No sessions scheduled for today</p>
                  <button
                    onClick={() => navigate('/dashboard/content')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Generate Schedule
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'upcoming' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Upcoming Sessions</h2>
              <div className="space-y-4">
                {upcomingSessions.map(session => (
                  <div key={session.id} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white">{session.content?.title}</h3>
                        <p className="text-sm text-gray-400">
                          {formatDate(session.startTime)} at {formatTime(session.startTime)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">{session.duration} min</p>
                        <p className="text-xs text-blue-400">Focus: {session.focusPrediction}/10</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && <EngagementChart />}
        </div>

        <div>
          {showSettings ? <PreferencesPanel /> : (
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">This Week</span>
                  <span className="text-white">{stats.completed} completed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Success Rate</span>
                  <span className="text-green-400">{stats.completionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Focus</span>
                  <span className="text-blue-400">{stats.avgFocusScore}/10</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulerDashboard;