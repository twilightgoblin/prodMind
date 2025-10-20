import React, { useState, useEffect } from 'react';
import { useMetaLearning } from '../hooks/useMetaLearning';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock, 
  Award, 
  BookOpen, 
  Plus, 
  Save, 
  Trash2, 
  Eye, 
  Loader2,
  AlertCircle,
  Calendar,
  Brain,
  Lightbulb,
  CheckCircle
} from 'lucide-react';

const MetaLearningDashboard = () => {
  const {
    learningAnalysis,
    learningPlan,
    learningMetrics,
    learningHistory,
    savedPlans,
    isAnalyzing,
    isGeneratingPlan,
    error,
    analyzeLearningPatterns,
    generateLearningPlan,
    trackLearningSession,
    saveLearningPlan,
    deleteLearningPlan,
    loadLearningPlan,
    clearError,
    resetAnalysis,
    resetPlan
  } = useMetaLearning();

  const [currentView, setCurrentView] = useState('analytics'); // analytics, planning, tracking
  const [goals, setGoals] = useState('');
  const [currentLevel, setCurrentLevel] = useState('beginner');
  const [preferences, setPreferences] = useState({
    learningStyle: 'visual',
    timeCommitment: '1-2 hours',
    difficulty: 'moderate'
  });
  const [saveName, setSaveName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [sessionData, setSessionData] = useState({
    topic: '',
    duration: 30,
    score: 80,
    notes: ''
  });

  useEffect(() => {
    if (learningHistory.length > 0) {
      analyzeLearningPatterns();
    }
  }, [learningHistory.length, analyzeLearningPatterns]);

  const handleGeneratePlan = async () => {
    await generateLearningPlan(goals, currentLevel, preferences);
  };

  const handleSavePlan = async () => {
    const success = await saveLearningPlan(saveName);
    if (success) {
      setSaveName('');
      setShowSaveDialog(false);
    }
  };

  const handleDeletePlan = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      await deleteLearningPlan(id);
    }
  };

  const handleTrackSession = async () => {
    const success = await trackLearningSession(sessionData);
    if (success) {
      setSessionData({
        topic: '',
        duration: 30,
        score: 80,
        notes: ''
      });
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-[#060010] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="h-12 w-12 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">MetaLearning Analytics</h1>
          </div>
          <p className="text-xl text-gray-300">
            Advanced learning insights and personalized growth tracking
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-800 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-300">{error}</span>
            <button
              onClick={clearError}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-2">
            <button
              onClick={() => setCurrentView('analytics')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                currentView === 'analytics' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-blue-400'
              }`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setCurrentView('planning')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                currentView === 'planning' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-blue-400'
              }`}
            >
              <Target className="h-4 w-4 mr-2" />
              Planning
            </button>
            <button
              onClick={() => setCurrentView('tracking')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                currentView === 'tracking' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-blue-400'
              }`}
            >
              <Clock className="h-4 w-4 mr-2" />
              Tracking
            </button>
          </div>
        </div>

        {/* Analytics View */}
        {currentView === 'analytics' && (
          <div className="space-y-6">
            {/* Metrics Overview */}
            {learningMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-300">Total Sessions</p>
                      <p className="text-2xl font-bold text-white">{learningMetrics.totalSessions}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-400" />
                  </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-300">Total Time</p>
                      <p className="text-2xl font-bold text-white">{formatTime(learningMetrics.totalTime)}</p>
                    </div>
                    <Clock className="h-8 w-8 text-green-400" />
                  </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-300">Average Score</p>
                      <p className="text-2xl font-bold text-white">{learningMetrics.averageScore}%</p>
                    </div>
                    <Award className="h-8 w-8 text-yellow-400" />
                  </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-300">Streak Days</p>
                      <p className="text-2xl font-bold text-white">{learningMetrics.streakDays}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-400" />
                  </div>
                </div>
              </div>
            )}

            {/* Learning Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Learning Analysis</h2>
                  <button
                    onClick={() => analyzeLearningPatterns()}
                    disabled={isAnalyzing}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Analyze
                      </>
                    )}
                  </button>
                </div>

                {learningAnalysis ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-900/30 border border-green-800 rounded-lg">
                      <h3 className="font-semibold text-green-300 mb-2">Overall Score</h3>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-700 rounded-full h-2 mr-3">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${learningAnalysis.overallScore}%` }}
                          ></div>
                        </div>
                        <span className="text-green-300 font-medium">{learningAnalysis.overallScore}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-900/30 border border-blue-800 rounded-lg">
                        <h4 className="font-medium text-blue-300">Efficiency</h4>
                        <p className="text-blue-200 capitalize">{learningAnalysis.learningEfficiency}</p>
                      </div>
                      <div className="p-3 bg-purple-900/30 border border-purple-800 rounded-lg">
                        <h4 className="font-medium text-purple-300">Retention</h4>
                        <p className="text-purple-200">{learningAnalysis.retentionRate}%</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-white mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                          Strengths
                        </h4>
                        <ul className="space-y-1">
                          {learningAnalysis.strengths.slice(0, 3).map((strength, index) => (
                            <li key={index} className="text-sm text-gray-300">• {strength}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-white mb-2 flex items-center">
                          <Lightbulb className="h-4 w-4 text-yellow-400 mr-2" />
                          Recommendations
                        </h4>
                        <ul className="space-y-1">
                          {learningAnalysis.recommendations.slice(0, 3).map((rec, index) => (
                            <li key={index} className="text-sm text-gray-300">• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Analyze your learning patterns to get insights</p>
                  </div>
                )}
              </div>

              {/* Progress Trend */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Progress Trend</h2>
                {learningMetrics?.progressTrend ? (
                  <div className="space-y-3">
                    {learningMetrics.progressTrend.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-white">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-sm text-gray-300">
                            {day.sessions} sessions • {formatTime(day.totalTime)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-white">{Math.round(day.averageScore)}%</div>
                          <div className="text-sm text-gray-400">avg score</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Start tracking sessions to see progress trends</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Planning View */}
        {currentView === 'planning' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-6">Generate Learning Plan</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Learning Goals
                    </label>
                    <textarea
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      placeholder="What do you want to learn or achieve?"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Level
                      </label>
                      <select
                        value={currentLevel}
                        onChange={(e) => setCurrentLevel(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Learning Style
                      </label>
                      <select
                        value={preferences.learningStyle}
                        onChange={(e) => setPreferences({...preferences, learningStyle: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="visual">Visual</option>
                        <option value="auditory">Auditory</option>
                        <option value="kinesthetic">Kinesthetic</option>
                        <option value="reading">Reading/Writing</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Time Commitment
                      </label>
                      <select
                        value={preferences.timeCommitment}
                        onChange={(e) => setPreferences({...preferences, timeCommitment: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="30 minutes">30 minutes/day</option>
                        <option value="1-2 hours">1-2 hours/day</option>
                        <option value="2-4 hours">2-4 hours/day</option>
                        <option value="4+ hours">4+ hours/day</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGeneratePlan}
                  disabled={!goals.trim() || isGeneratingPlan}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isGeneratingPlan ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Learning Plan
                    </>
                  )}
                </button>

                {/* Generated Plan Display */}
                {learningPlan && (
                  <div className="mt-8 p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{learningPlan.title}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowSaveDialog(true)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={resetPlan}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 flex items-center"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-sm text-gray-300">Duration: {learningPlan.duration}</div>
                      
                      {learningPlan.phases.map((phase, index) => (
                        <div key={index} className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-medium text-white">{phase.title}</h4>
                          <ul className="mt-2 space-y-1">
                            {phase.tasks.map((task, taskIndex) => (
                              <li key={taskIndex} className="text-sm text-gray-300">• {task}</li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {learningPlan.milestones.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-white mb-2">Milestones</h4>
                          <ul className="space-y-1">
                            {learningPlan.milestones.map((milestone, index) => (
                              <li key={index} className="text-sm text-gray-300 flex items-center">
                                <Target className="h-3 w-3 text-green-400 mr-2" />
                                {milestone}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Saved Plans */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Saved Learning Plans</h3>
                {savedPlans.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No saved plans yet</p>
                ) : (
                  <div className="space-y-3">
                    {savedPlans.map((plan) => (
                      <div key={plan.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{plan.name}</h4>
                          <p className="text-sm text-gray-400">
                            {new Date(plan.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => loadLearningPlan(plan.plan)}
                            className="p-1 text-blue-400 hover:text-blue-300"
                            title="Load"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan.id)}
                            className="p-1 text-red-400 hover:text-red-300"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tracking View */}
        {currentView === 'tracking' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Track Learning Session</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Topic/Subject
                  </label>
                  <input
                    type="text"
                    value={sessionData.topic}
                    onChange={(e) => setSessionData({...sessionData, topic: e.target.value})}
                    placeholder="What did you study?"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={sessionData.duration}
                      onChange={(e) => setSessionData({...sessionData, duration: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Score (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={sessionData.score}
                      onChange={(e) => setSessionData({...sessionData, score: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={sessionData.notes}
                    onChange={(e) => setSessionData({...sessionData, notes: e.target.value})}
                    placeholder="Any additional notes about this session..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                    rows={3}
                  />
                </div>

                <button
                  onClick={handleTrackSession}
                  disabled={!sessionData.topic.trim()}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Track Session
                </button>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Sessions</h2>
              {learningHistory.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No learning sessions tracked yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {learningHistory.slice(-10).reverse().map((session) => (
                    <div key={session.id} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{session.topic}</h4>
                        <span className="text-sm text-gray-400">
                          {new Date(session.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-300">
                        <span>{formatTime(session.duration)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          session.score >= 80 ? 'bg-green-900/50 text-green-300 border border-green-800' :
                          session.score >= 60 ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-800' :
                          'bg-red-900/50 text-red-300 border border-red-800'
                        }`}>
                          {session.score}%
                        </span>
                      </div>
                      {session.notes && (
                        <p className="text-sm text-gray-300 mt-2">{session.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold text-white mb-4">Save Learning Plan</h3>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Enter a name for your learning plan..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 mb-4 placeholder-gray-400"
                autoFocus
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="px-4 py-2 text-gray-400 hover:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePlan}
                  disabled={!saveName.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetaLearningDashboard;