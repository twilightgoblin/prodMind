import React, { useState, useEffect } from 'react';
import { usePersonaTuner } from '../hooks/usePersonaTuner';
import { 
  User, 
  Brain, 
  MessageCircle, 
  Settings, 
  Save, 
  Trash2, 
  Play, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Users,
  Target,
  Lightbulb
} from 'lucide-react';

const PersonaTunerDashboard = () => {
  const {
    personalityProfile,
    isAnalyzing,
    isGenerating,
    error,
    savedProfiles,
    activeProfile,
    assessmentAnswers,
    conversationHistory,
    generatePersonalizedResponse,
    savePersonalityProfile,
    setActivePersonality,
    deletePersonalityProfile,
    updateAssessmentAnswer,
    completeAssessment,
    clearError,
    resetPersonality,
    clearConversationHistory,
    getAssessmentQuestions
  } = usePersonaTuner();

  const [currentStep, setCurrentStep] = useState('assessment'); // assessment, profile, chat
  const [saveName, setSaveName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [questions] = useState(getAssessmentQuestions());

  useEffect(() => {
    if (personalityProfile) {
      setCurrentStep('profile');
    }
  }, [personalityProfile]);

  const handleAnswerChange = (questionId, value) => {
    updateAssessmentAnswer(questionId, value);
  };

  const handleCompleteAssessment = async () => {
    await completeAssessment();
  };

  const handleSaveProfile = async () => {
    const success = await savePersonalityProfile(saveName);
    if (success) {
      setSaveName('');
      setShowSaveDialog(false);
    }
  };

  const handleSetActive = async (id) => {
    await setActivePersonality(id);
  };

  const handleDeleteProfile = async (id) => {
    if (window.confirm('Are you sure you want to delete this personality profile?')) {
      await deletePersonalityProfile(id);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    
    const response = await generatePersonalizedResponse(chatMessage);
    if (response) {
      setChatMessage('');
    }
  };

  const getCompletionPercentage = () => {
    return Math.round((Object.keys(assessmentAnswers).length / questions.length) * 100);
  };

  return (
    <div className="min-h-screen bg-[#060010] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <User className="h-12 w-12 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">PersonaTuner</h1>
          </div>
          <p className="text-xl text-gray-300">
            Adaptive AI personality for personalized interactions
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
              onClick={() => setCurrentStep('assessment')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                currentStep === 'assessment' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-blue-400'
              }`}
            >
              <Target className="h-4 w-4 mr-2" />
              Assessment
            </button>
            <button
              onClick={() => setCurrentStep('profile')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                currentStep === 'profile' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-blue-400'
              }`}
              disabled={!personalityProfile}
            >
              <Brain className="h-4 w-4 mr-2" />
              Profile
            </button>
            <button
              onClick={() => setCurrentStep('chat')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                currentStep === 'chat' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-blue-400'
              }`}
              disabled={!activeProfile}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </button>
          </div>
        </div>

        {/* Assessment Step */}
        {currentStep === 'assessment' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">Personality Assessment</h2>
                  <div className="text-sm text-gray-400">
                    {getCompletionPercentage()}% Complete
                  </div>
                </div>

                <div className="space-y-6">
                  {questions.map((question) => (
                    <div key={question.id} className="border-b border-gray-700 pb-6">
                      <h3 className="text-lg font-medium mb-4 text-white">{question.question}</h3>
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <label key={option.value} className="flex items-center">
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option.value}
                              checked={assessmentAnswers[question.id] === option.value}
                              onChange={() => handleAnswerChange(question.id, option.value)}
                              className="mr-3 text-blue-600 accent-blue-500"
                            />
                            <span className="text-gray-300">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleCompleteAssessment}
                    disabled={Object.keys(assessmentAnswers).length === 0 || isAnalyzing}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Analyze Personality
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                  <Users className="h-5 w-5 mr-2 text-blue-400" />
                  Saved Profiles
                </h3>
                {savedProfiles.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No saved profiles yet</p>
                ) : (
                  <div className="space-y-3">
                    {savedProfiles.map((profile) => (
                      <div key={profile.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{profile.name}</h4>
                          <p className="text-sm text-gray-400">
                            {new Date(profile.createdAt).toLocaleDateString()}
                          </p>
                          {profile.isActive && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-900/50 text-green-300 mt-1">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSetActive(profile.id)}
                            className="p-1 text-blue-400 hover:text-blue-300"
                            title="Set Active"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProfile(profile.id)}
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

        {/* Profile Step */}
        {currentStep === 'profile' && personalityProfile && (
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Personality Profile</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </button>
                <button
                  onClick={resetPersonality}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-900/30 border border-blue-800 rounded-lg">
                  <h3 className="font-semibold text-blue-300 mb-2">Communication Style</h3>
                  <p className="text-blue-100 capitalize">{personalityProfile.communicationStyle}</p>
                </div>

                <div className="p-4 bg-purple-900/30 border border-purple-800 rounded-lg">
                  <h3 className="font-semibold text-purple-300 mb-2">Tone Preference</h3>
                  <p className="text-purple-100 capitalize">{personalityProfile.tonePreference}</p>
                </div>

                <div className="p-4 bg-green-900/30 border border-green-800 rounded-lg">
                  <h3 className="font-semibold text-green-300 mb-2">Formality Level</h3>
                  <p className="text-green-100 capitalize">{personalityProfile.formalityLevel}</p>
                </div>

                <div className="p-4 bg-orange-900/30 border border-orange-800 rounded-lg">
                  <h3 className="font-semibold text-orange-300 mb-2">Interaction Style</h3>
                  <p className="text-orange-100 capitalize">{personalityProfile.interactionStyle}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Key Traits</h3>
                  <div className="flex flex-wrap gap-2">
                    {personalityProfile.traits.map((trait, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-sm">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Strengths</h3>
                  <ul className="space-y-1">
                    {personalityProfile.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-300 flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-white mb-2 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2 text-yellow-400" />
                    Recommendations
                  </h3>
                  <ul className="space-y-1">
                    {personalityProfile.recommendations.map((rec, index) => (
                      <li key={index} className="text-gray-300 text-sm">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Step */}
        {currentStep === 'chat' && activeProfile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 h-[600px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Personalized Chat</h2>
                  <div className="text-sm text-gray-400">
                    Using: {activeProfile.name}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {conversationHistory.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Start a conversation to see personalized responses</p>
                    </div>
                  ) : (
                    conversationHistory.map((conv) => (
                      <div key={conv.id} className="space-y-2">
                        <div className="bg-blue-900/30 border border-blue-800 p-3 rounded-lg ml-8">
                          <p className="text-blue-100">{conv.message}</p>
                          <div className="text-xs text-blue-300 mt-1">You</div>
                        </div>
                        <div className="bg-gray-800/50 border border-gray-700 p-3 rounded-lg mr-8">
                          <p className="text-gray-200">{conv.response}</p>
                          <div className="text-xs text-gray-400 mt-1">
                            AI ({conv.personalityUsed})
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim() || isGenerating}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Send'
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Active Profile</h3>
                {activeProfile && (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-900/30 border border-blue-800 rounded-lg">
                      <h4 className="font-medium text-blue-300">{activeProfile.name}</h4>
                      <p className="text-sm text-blue-200">
                        Style: {activeProfile.profile.communicationStyle}
                      </p>
                      <p className="text-sm text-blue-200">
                        Tone: {activeProfile.profile.tonePreference}
                      </p>
                    </div>
                    
                    <button
                      onClick={clearConversationHistory}
                      className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear History
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4 text-white">Save Personality Profile</h3>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Enter a name for your profile..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 mb-4"
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
                  onClick={handleSaveProfile}
                  disabled={!saveName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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

export default PersonaTunerDashboard;