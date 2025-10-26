import React, { useState } from 'react';

const LearningInsightsWidget = ({ insights = [] }) => {
  const [dismissedInsights, setDismissedInsights] = useState(new Set());

  const getInsightIcon = (type) => {
    switch (type) {
      case 'achievement':
        return (
          <div className="w-8 h-8 bg-green-900/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'improvement':
        return (
          <div className="w-8 h-8 bg-orange-900/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'suggestion':
        return (
          <div className="w-8 h-8 bg-blue-900/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const getInsightBorderColor = (type) => {
    switch (type) {
      case 'achievement':
        return 'border-green-800';
      case 'improvement':
        return 'border-orange-800';
      case 'suggestion':
        return 'border-blue-800';
      default:
        return 'border-gray-800';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-900/20 text-red-400',
      medium: 'bg-yellow-900/20 text-yellow-400',
      low: 'bg-green-900/20 text-green-400'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[priority] || colors.low}`}>
        {priority}
      </span>
    );
  };

  const dismissInsight = (index) => {
    setDismissedInsights(prev => new Set([...prev, index]));
  };

  const visibleInsights = insights.filter((_, index) => !dismissedInsights.has(index));

  if (!visibleInsights.length) {
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Learning Insights
        </h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-white mb-2">
            No Insights Available
          </h4>
          <p className="text-gray-400">
            Start learning to get personalized insights and recommendations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Learning Insights
        </h3>
        <span className="text-sm text-gray-400">
          {visibleInsights.length} insights
        </span>
      </div>

      <div className="space-y-4">
        {visibleInsights.map((insight, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${getInsightBorderColor(insight.type)} bg-opacity-50`}
          >
            <div className="flex items-start space-x-3">
              {getInsightIcon(insight.type)}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">
                    {insight.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(insight.priority)}
                    <button
                      onClick={() => dismissInsight(insights.indexOf(insight))}
                      className="text-gray-400 hover:text-gray-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mb-3">
                  {insight.message}
                </p>

                {/* Action buttons based on insight type */}
                {insight.type === 'improvement' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.location.href = '/recommendations'}
                      className="px-3 py-1 text-xs bg-orange-900/20 text-orange-400 rounded-md hover:bg-orange-900/30 transition-colors"
                    >
                      Get Recommendations
                    </button>
                    <button
                      onClick={() => window.location.href = '/profile'}
                      className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Update Preferences
                    </button>
                  </div>
                )}

                {insight.type === 'suggestion' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.location.href = '/summarizer'}
                      className="px-3 py-1 text-xs bg-blue-900/20 text-blue-400 rounded-md hover:bg-blue-900/30 transition-colors"
                    >
                      Explore Content
                    </button>
                  </div>
                )}

                {insight.type === 'achievement' && (
                  <div className="flex items-center space-x-2 text-xs text-green-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Keep up the great work!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Refresh Insights Button */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <button
          onClick={() => window.location.reload()}
          className="w-full px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh Insights</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LearningInsightsWidget;