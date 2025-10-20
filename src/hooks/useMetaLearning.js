import { useState, useCallback, useEffect } from 'react';
import metaLearningService from '../services/metaLearningService';

export const useMetaLearning = () => {
  const [learningAnalysis, setLearningAnalysis] = useState(null);
  const [learningPlan, setLearningPlan] = useState(null);
  const [learningMetrics, setLearningMetrics] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [error, setError] = useState(null);
  const [learningHistory, setLearningHistory] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);

  const analyzeLearningPatterns = useCallback(async (timeframe = '30d') => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const history = metaLearningService.getLearningHistory();
      const result = await metaLearningService.analyzeLearningPatterns(history, timeframe);
      
      if (result.success) {
        setLearningAnalysis(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to analyze learning patterns');
        setLearningAnalysis(result.data); // Fallback data
      }
    } catch (err) {
      setError('An unexpected error occurred during analysis');
      console.error('Learning analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const generateLearningPlan = useCallback(async (goals, currentLevel, preferences = {}) => {
    if (!goals?.trim()) {
      setError('Please specify your learning goals');
      return;
    }

    setIsGeneratingPlan(true);
    setError(null);

    try {
      const result = await metaLearningService.generateLearningPlan(goals, currentLevel, preferences);
      
      if (result.success) {
        setLearningPlan(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to generate learning plan');
        setLearningPlan(result.data); // Fallback data
      }
    } catch (err) {
      setError('An unexpected error occurred while generating plan');
      console.error('Learning plan generation error:', err);
    } finally {
      setIsGeneratingPlan(false);
    }
  }, []);

  const trackLearningSession = useCallback(async (sessionData) => {
    try {
      const result = await metaLearningService.trackLearningSession(sessionData);
      if (result.success) {
        loadLearningHistory();
        return true;
      } else {
        setError(result.error || 'Failed to track learning session');
        return false;
      }
    } catch (err) {
      setError('Failed to track learning session');
      return false;
    }
  }, []);

  const loadLearningHistory = useCallback(() => {
    try {
      const history = metaLearningService.getLearningHistory();
      setLearningHistory(history);
      
      // Calculate metrics
      const metrics = metaLearningService.calculateLearningMetrics(history);
      setLearningMetrics(metrics);
    } catch (err) {
      console.error('Failed to load learning history:', err);
    }
  }, []);

  const saveLearningPlan = useCallback(async (name) => {
    if (!learningPlan || !name?.trim()) {
      setError('Please provide a name for the learning plan');
      return false;
    }

    try {
      const result = await metaLearningService.saveLearningPlan(learningPlan, name);
      if (result.success) {
        loadSavedPlans();
        return true;
      } else {
        setError(result.error || 'Failed to save learning plan');
        return false;
      }
    } catch (err) {
      setError('Failed to save learning plan');
      return false;
    }
  }, [learningPlan]);

  const loadSavedPlans = useCallback(() => {
    try {
      const plans = metaLearningService.getSavedLearningPlans();
      setSavedPlans(plans);
    } catch (err) {
      console.error('Failed to load saved plans:', err);
    }
  }, []);

  const deleteLearningPlan = useCallback(async (id) => {
    try {
      const result = await metaLearningService.deleteLearningPlan(id);
      if (result.success) {
        loadSavedPlans();
        return true;
      } else {
        setError(result.error || 'Failed to delete learning plan');
        return false;
      }
    } catch (err) {
      setError('Failed to delete learning plan');
      return false;
    }
  }, [loadSavedPlans]);

  const loadLearningPlan = useCallback((planData) => {
    setLearningPlan(planData);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetAnalysis = useCallback(() => {
    setLearningAnalysis(null);
    setError(null);
  }, []);

  const resetPlan = useCallback(() => {
    setLearningPlan(null);
    setError(null);
  }, []);

  // Load data on mount
  useEffect(() => {
    loadLearningHistory();
    loadSavedPlans();
  }, [loadLearningHistory, loadSavedPlans]);

  return {
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
    loadLearningHistory,
    saveLearningPlan,
    loadSavedPlans,
    deleteLearningPlan,
    loadLearningPlan,
    clearError,
    resetAnalysis,
    resetPlan
  };
};