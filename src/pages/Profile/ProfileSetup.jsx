import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import userProfileService from '../../services/userProfileService';
import recommendationService from '../../services/recommendationService';


const ProfileSetup = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState({
    interests: [],
    learningGoals: [],
    preferredContentTypes: [],
    learningStyle: 'visual',
    availableTime: {
      dailyMinutes: 60,
      preferredTimes: []
    }
  });

  const contentTypes = [
    { id: 'video', label: 'Videos', icon: '🎥' },
    { id: 'article', label: 'Articles', icon: '📄' },
    { id: 'podcast', label: 'Podcasts', icon: '🎧' },
    { id: 'course', label: 'Courses', icon: '📚' }
  ];

  const learningStyles = [
    { id: 'visual', label: 'Visual', description: 'Learn best through images, diagrams, and videos' },
    { id: 'auditory', label: 'Auditory', description: 'Learn best through listening and discussion' },
    { id: 'kinesthetic', label: 'Kinesthetic', description: 'Learn best through hands-on practice' },
    { id: 'reading', label: 'Reading/Writing', description: 'Learn best through text and written materials' }
  ];

  const timeSlots = [
    { id: 'morning', label: 'Morning (6AM - 12PM)', icon: '🌅' },
    { id: 'afternoon', label: 'Afternoon (12PM - 6PM)', icon: '☀️' },
    { id: 'evening', label: 'Evening (6PM - 12AM)', icon: '🌙' }
  ];

  const popularTopics = [
    'Programming', 'Data Science', 'Machine Learning', 'Web Development',
    'Mobile Development', 'DevOps', 'Cybersecurity', 'Cloud Computing',
    'Artificial Intelligence', 'Blockchain', 'UI/UX Design', 'Digital Marketing',
    'Project Management', 'Business Strategy', 'Leadership', 'Productivity',
    'Personal Finance', 'Health & Wellness', 'Language Learning', 'Photography'
  ];

  useEffect(() => {
    if (user?.id) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userProfileService.getUserProfile(user.id);
      
      if (response.success && response.data.user.learningProfile) {
        const learningProfile = response.data.user.learningProfile;
        setProfile({
          interests: learningProfile.interests || [],
          learningGoals: learningProfile.learningGoals || [],
          preferredContentTypes: learningProfile.preferredContentTypes || [],
          learningStyle: learningProfile.learningStyle || 'visual',
          availableTime: learningProfile.availableTime || {
            dailyMinutes: 60,
            preferredTimes: []
          }
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInterest = (topic) => {
    if (!profile.interests.find(interest => interest.topic === topic)) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, {
          topic,
          proficiency: 'intermediate',
          priority: 5
        }]
      }));
    }
  };

  const handleRemoveInterest = (topic) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest.topic !== topic)
    }));
  };

  const handleUpdateInterest = (topic, field, value) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.map(interest =>
        interest.topic === topic ? { ...interest, [field]: value } : interest
      )
    }));
  };

  const handleAddGoal = () => {
    const title = prompt('Enter your learning goal:');
    if (title) {
      setProfile(prev => ({
        ...prev,
        learningGoals: [...prev.learningGoals, {
          title,
          description: '',
          targetDate: null,
          progress: 0
        }]
      }));
    }
  };

  const handleRemoveGoal = (index) => {
    setProfile(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.filter((_, i) => i !== index)
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      await userProfileService.updateProfile({
        learningProfile: profile
      });

      // Regenerate user embedding
      await recommendationService.refreshUserEmbedding(user.id);

      alert('Profile saved successfully! Your recommendations will be updated.');
      
      // Redirect to user analytics dashboard
      window.location.href = '/dashboard/analytics';
      
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Learning Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Help us personalize your learning experience with AI-powered recommendations
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          
          {/* Step 1: Learning Interests */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                What are you interested in learning?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Select topics that interest you. We'll use this to recommend relevant content.
              </p>

              {/* Popular Topics */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Popular Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTopics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => handleAddInterest(topic)}
                      disabled={profile.interests.find(interest => interest.topic === topic)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        profile.interests.find(interest => interest.topic === topic)
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 cursor-not-allowed'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {topic}
                      {profile.interests.find(interest => interest.topic === topic) && ' ✓'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Interests */}
              {profile.interests.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Your Interests ({profile.interests.length})
                  </h3>
                  <div className="space-y-3">
                    {profile.interests.map((interest, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex-1">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {interest.topic}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <select
                            value={interest.proficiency}
                            onChange={(e) => handleUpdateInterest(interest.topic, 'proficiency', e.target.value)}
                            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={interest.priority}
                            onChange={(e) => handleUpdateInterest(interest.topic, 'priority', parseInt(e.target.value))}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                            {interest.priority}
                          </span>
                          <button
                            onClick={() => handleRemoveInterest(interest.topic)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Learning Goals */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                What are your learning goals?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Set specific goals to track your progress and get targeted recommendations.
              </p>

              <div className="space-y-4 mb-6">
                {profile.learningGoals.map((goal, index) => (
                  <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {goal.title}
                        </h4>
                        {goal.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {goal.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveGoal(index)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-4"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddGoal}
                className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                + Add Learning Goal
              </button>
            </div>
          )}

          {/* Step 3: Content Preferences */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                How do you prefer to learn?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Tell us about your learning preferences to get better recommendations.
              </p>

              {/* Content Types */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Preferred Content Types
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        const isSelected = profile.preferredContentTypes.includes(type.id);
                        setProfile(prev => ({
                          ...prev,
                          preferredContentTypes: isSelected
                            ? prev.preferredContentTypes.filter(t => t !== type.id)
                            : [...prev.preferredContentTypes, type.id]
                        }));
                      }}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        profile.preferredContentTypes.includes(type.id)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {type.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Learning Style */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Learning Style
                </h3>
                <div className="space-y-3">
                  {learningStyles.map((style) => (
                    <label
                      key={style.id}
                      className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        profile.learningStyle === style.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="learningStyle"
                        value={style.id}
                        checked={profile.learningStyle === style.id}
                        onChange={(e) => setProfile(prev => ({ ...prev, learningStyle: e.target.value }))}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {style.label}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {style.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Time Preferences */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                When do you prefer to learn?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Help us suggest content that fits your schedule.
              </p>

              {/* Daily Time */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Daily Learning Time
                </h3>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="15"
                    max="240"
                    step="15"
                    value={profile.availableTime.dailyMinutes}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      availableTime: {
                        ...prev.availableTime,
                        dailyMinutes: parseInt(e.target.value)
                      }
                    }))}
                    className="flex-1"
                  />
                  <span className="text-lg font-medium text-gray-900 dark:text-white w-20">
                    {profile.availableTime.dailyMinutes} min
                  </span>
                </div>
              </div>

              {/* Preferred Times */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Preferred Time Slots
                </h3>
                <div className="space-y-3">
                  {timeSlots.map((slot) => (
                    <label
                      key={slot.id}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        profile.availableTime.preferredTimes.includes(slot.id)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={profile.availableTime.preferredTimes.includes(slot.id)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setProfile(prev => ({
                            ...prev,
                            availableTime: {
                              ...prev.availableTime,
                              preferredTimes: isChecked
                                ? [...prev.availableTime.preferredTimes, slot.id]
                                : prev.availableTime.preferredTimes.filter(t => t !== slot.id)
                            }
                          }));
                        }}
                        className="mr-3"
                      />
                      <div className="text-2xl mr-3">{slot.icon}</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {slot.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;