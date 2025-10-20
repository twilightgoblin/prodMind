import { useState, useCallback, useEffect } from 'react';
import personaTunerService from '../services/personaTunerService';

export const usePersonaTuner = () => {
  const [personalityProfile, setPersonalityProfile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState({});
  const [conversationHistory, setConversationHistory] = useState([]);

  const analyzePersonality = useCallback(async (responses, preferences = {}) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await personaTunerService.analyzePersonality(responses, preferences);
      
      if (result.success) {
        setPersonalityProfile(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to analyze personality');
        setPersonalityProfile(result.data); // Fallback data
      }
    } catch (err) {
      setError('An unexpected error occurred during analysis');
      console.error('Personality analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const generatePersonalizedResponse = useCallback(async (message, context = {}) => {
    if (!activeProfile) {
      setError('No active personality profile selected');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await personaTunerService.generatePersonalizedResponse(
        message,
        activeProfile.profile,
        context
      );

      if (result.success) {
        // Add to conversation history
        const newConversation = {
          id: Date.now(),
          message,
          response: result.response,
          timestamp: new Date().toISOString(),
          personalityUsed: activeProfile.name
        };
        
        setConversationHistory(prev => [...prev, newConversation]);
        setError(null);
        return result.response;
      } else {
        setError(result.error || 'Failed to generate personalized response');
        return result.response;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Personalized response error:', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [activeProfile]);

  const savePersonalityProfile = useCallback(async (name) => {
    if (!personalityProfile || !name?.trim()) {
      setError('Please provide a name for the personality profile');
      return false;
    }

    try {
      const result = await personaTunerService.savePersonalityProfile(personalityProfile, name);
      if (result.success) {
        loadSavedProfiles();
        return true;
      } else {
        setError(result.error || 'Failed to save personality profile');
        return false;
      }
    } catch (err) {
      setError('Failed to save personality profile');
      return false;
    }
  }, [personalityProfile]);

  const loadSavedProfiles = useCallback(() => {
    try {
      const profiles = personaTunerService.getSavedProfiles();
      setSavedProfiles(profiles);
      
      // Load active profile
      const active = profiles.find(profile => profile.isActive);
      setActiveProfile(active);
    } catch (err) {
      console.error('Failed to load saved profiles:', err);
    }
  }, []);

  const setActivePersonality = useCallback(async (id) => {
    try {
      const result = await personaTunerService.setActiveProfile(id);
      if (result.success) {
        loadSavedProfiles();
        return true;
      } else {
        setError(result.error || 'Failed to set active profile');
        return false;
      }
    } catch (err) {
      setError('Failed to set active profile');
      return false;
    }
  }, [loadSavedProfiles]);

  const deletePersonalityProfile = useCallback(async (id) => {
    try {
      const result = await personaTunerService.deleteProfile(id);
      if (result.success) {
        loadSavedProfiles();
        return true;
      } else {
        setError(result.error || 'Failed to delete profile');
        return false;
      }
    } catch (err) {
      setError('Failed to delete profile');
      return false;
    }
  }, [loadSavedProfiles]);

  const updateAssessmentAnswer = useCallback((questionId, answer) => {
    setAssessmentAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, []);

  const completeAssessment = useCallback(async () => {
    const responses = Object.values(assessmentAnswers);
    if (responses.length === 0) {
      setError('Please answer at least one question');
      return;
    }

    await analyzePersonality(responses, assessmentAnswers);
  }, [assessmentAnswers, analyzePersonality]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetPersonality = useCallback(() => {
    setPersonalityProfile(null);
    setAssessmentAnswers({});
    setError(null);
  }, []);

  const clearConversationHistory = useCallback(() => {
    setConversationHistory([]);
  }, []);

  // Load saved profiles on mount
  useEffect(() => {
    loadSavedProfiles();
  }, [loadSavedProfiles]);

  return {
    personalityProfile,
    isAnalyzing,
    isGenerating,
    error,
    savedProfiles,
    activeProfile,
    assessmentAnswers,
    conversationHistory,
    analyzePersonality,
    generatePersonalizedResponse,
    savePersonalityProfile,
    loadSavedProfiles,
    setActivePersonality,
    deletePersonalityProfile,
    updateAssessmentAnswer,
    completeAssessment,
    clearError,
    resetPersonality,
    clearConversationHistory,
    getAssessmentQuestions: () => personaTunerService.getAssessmentQuestions()
  };
};