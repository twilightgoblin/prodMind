import React from 'react';

const SkillProgressWidget = ({ skills = [] }) => {
  const getProficiencyColor = (proficiency) => {
    switch (proficiency) {
      case 'beginner':
        return 'bg-red-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getProficiencyTextColor = (proficiency) => {
    switch (proficiency) {
      case 'beginner':
        return 'text-red-400';
      case 'intermediate':
        return 'text-yellow-400';
      case 'advanced':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getPriorityIcon = (priority) => {
    if (priority >= 8) {
      return (
        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    } else if (priority >= 6) {
      return (
        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    );
  };

  if (!skills.length) {
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Skill Progress
        </h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-white mb-2">
            No Skills Tracked
          </h4>
          <p className="text-gray-400 mb-4">
            Add learning interests to track your skill progression
          </p>
          <button
            onClick={() => window.location.href = '/profile'}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Add Interests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Skill Progress
        </h3>
        <span className="text-sm text-gray-400">
          {skills.length} skills
        </span>
      </div>

      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getPriorityIcon(skill.priority)}
                <span className="font-medium text-white capitalize">
                  {skill.topic}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getProficiencyTextColor(skill.proficiency)} bg-opacity-10`}>
                  {skill.proficiency}
                </span>
                <span className="text-sm text-gray-400">
                  {Math.round(skill.progress)}%
                </span>
              </div>
            </div>
            
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getProficiencyColor(skill.proficiency)}`}
                style={{ width: `${skill.progress}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Priority: {skill.priority}/10</span>
              <span>
                {skill.progress >= 90 ? 'Expert' : 
                 skill.progress >= 70 ? 'Proficient' : 
                 skill.progress >= 40 ? 'Learning' : 'Beginner'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Progress Summary */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Overall Progress</span>
          <span className="font-medium text-white">
            {Math.round(skills.reduce((acc, skill) => acc + skill.progress, 0) / skills.length)}%
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-800 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ 
              width: `${skills.reduce((acc, skill) => acc + skill.progress, 0) / skills.length}%` 
            }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => window.location.href = '/profile'}
          className="flex-1 px-3 py-2 text-sm bg-blue-900/20 text-blue-400 rounded-lg hover:bg-blue-900/30 transition-colors border border-blue-800/30"
        >
          Update Skills
        </button>
        <button
          onClick={() => window.location.href = '/recommendations'}
          className="flex-1 px-3 py-2 text-sm bg-green-900/20 text-green-400 rounded-lg hover:bg-green-900/30 transition-colors border border-green-800/30"
        >
          Get Content
        </button>
      </div>
    </div>
  );
};

export default SkillProgressWidget;