import React from 'react';

const WeeklyStatsWidget = ({ stats = {} }) => {
  const {
    contentConsumed = 0,
    notesCreated = 0,
    averageSessionTime = 0,
    completionRate = 0,
    streak = 0
  } = stats;

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getCompletionRateColor = (rate) => {
    if (rate >= 0.8) return 'text-green-400';
    if (rate >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCompletionRateBackground = (rate) => {
    if (rate >= 0.8) return 'bg-green-900/20';
    if (rate >= 0.6) return 'bg-yellow-900/20';
    return 'bg-red-900/20';
  };

  const statsData = [
    {
      label: 'Content Consumed',
      value: contentConsumed,
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-blue-900/20',
      suffix: contentConsumed === 1 ? 'item' : 'items'
    },
    {
      label: 'Notes Created',
      value: notesCreated,
      icon: (
        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'bg-green-900/20',
      suffix: notesCreated === 1 ? 'note' : 'notes'
    },
    {
      label: 'Avg Session',
      value: formatTime(averageSessionTime),
      icon: (
        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-purple-900/20',
      suffix: ''
    },
    {
      label: 'Completion Rate',
      value: `${Math.round(completionRate * 100)}%`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: getCompletionRateBackground(completionRate),
      textColor: getCompletionRateColor(completionRate),
      suffix: ''
    }
  ];

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Weekly Stats
        </h3>
        <div className="flex items-center space-x-1 text-sm text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>This week</span>
        </div>
      </div>

      <div className="space-y-4">
        {statsData.map((stat, index) => (
          <div key={index} className={`p-3 rounded-lg ${stat.color}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={stat.textColor ? stat.textColor : ''}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-400">
                    {stat.label}
                  </p>
                  <p className={`text-lg font-semibold ${stat.textColor || 'text-white'}`}>
                    {stat.value} {stat.suffix}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Learning Streak */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-900/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Learning Streak</p>
              <p className="text-xl font-bold text-orange-400">
                {streak} {streak === 1 ? 'day' : 'days'}
              </p>
            </div>
          </div>
          
          {streak > 0 && (
            <div className="text-right">
              <div className="flex items-center space-x-1">
                {[...Array(Math.min(streak, 7))].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-orange-400 rounded-full"
                  />
                ))}
                {streak > 7 && (
                  <span className="text-xs text-gray-400 ml-1">
                    +{streak - 7}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Insights */}
      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg className="w-4 h-4 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="text-white font-medium mb-1">
              Weekly Insight
            </p>
            <p className="text-gray-400">
              {completionRate >= 0.8 
                ? "Excellent completion rate! You're staying focused on your learning goals."
                : completionRate >= 0.6
                ? "Good progress! Try to complete more content to improve retention."
                : averageSessionTime > 0
                ? "Consider shorter sessions to improve completion rates."
                : "Start your learning journey by exploring recommended content."
              }
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <div className="mt-4">
        <button
          onClick={() => window.location.href = '/video-notes'}
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-medium"
        >
          View All Learning Activity
        </button>
      </div>
    </div>
  );
};

export default WeeklyStatsWidget;