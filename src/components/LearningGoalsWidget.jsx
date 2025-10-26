import React, { useState } from 'react';

const LearningGoalsWidget = ({ goals }) => {
  const [expandedGoal, setExpandedGoal] = useState(null);

  if (!goals?.goals?.length) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          No Learning Goals Set
        </h3>
        <p className="text-gray-400 mb-4">
          Set learning goals to track your progress and get better recommendations
        </p>
        <button
          onClick={() => window.location.href = '/profile'}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          Add Learning Goals
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getProgressTextColor = (progress) => {
    if (progress >= 80) return 'text-green-400';
    if (progress >= 50) return 'text-yellow-400';
    return 'text-blue-400';
  };

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-800/30">
          <div className="text-2xl font-bold text-blue-400">
            {goals.goals.length}
          </div>
          <div className="text-sm text-gray-400">Total Goals</div>
        </div>
        <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-800/30">
          <div className="text-2xl font-bold text-green-400">
            {goals.completedGoals || 0}
          </div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>
        <div className="text-center p-4 bg-orange-900/20 rounded-lg border border-orange-800/30">
          <div className="text-2xl font-bold text-orange-400">
            {goals.activeGoals || 0}
          </div>
          <div className="text-sm text-gray-400">In Progress</div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {goals.goals.map((goal, index) => (
          <div
            key={index}
            className="border border-gray-800 rounded-lg p-4 hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">
                    {goal.title}
                  </h4>
                  <span className={`text-sm font-medium ${getProgressTextColor(goal.progress)}`}>
                    {goal.progress}%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(goal.progress)}`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>

                {/* Goal Details */}
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Target: {formatDate(goal.targetDate)}</span>
                  {goal.progress >= 100 && (
                    <span className="flex items-center text-green-400">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Completed
                    </span>
                  )}
                </div>

                {/* Expandable Description */}
                {goal.description && (
                  <div className="mt-2">
                    <button
                      onClick={() => setExpandedGoal(expandedGoal === index ? null : index)}
                      className="text-sm text-blue-400 hover:underline"
                    >
                      {expandedGoal === index ? 'Hide details' : 'Show details'}
                    </button>
                    {expandedGoal === index && (
                      <p className="mt-2 text-sm text-gray-400 bg-gray-900/50 p-3 rounded-lg">
                        {goal.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Goal Button */}
      <button
        onClick={() => window.location.href = '/profile'}
        className="w-full mt-4 p-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors"
      >
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add New Learning Goal</span>
        </div>
      </button>
    </div>
  );
};

export default LearningGoalsWidget;