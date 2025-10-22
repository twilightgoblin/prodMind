// Custom hook for content summarization
import { useState, useEffect } from 'react';
import summarizerService from '../services/summarizerService';
import apiClient from '../utils/api';

export const useSummarizer = () => {
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Summarize content
  const summarizeContent = async (content, mode = 'insight', customPrompt = null) => {
    setLoading(true);
    setError(null);
    
    try {
      // Generate summary using the service (for AI processing)
      const localSummary = await summarizerService.summarizeContent(content, mode, customPrompt);
      
      // Save to database via API
      try {
        const dbSummary = await apiClient.generateSummary({
          contentId: content.id,
          mode,
          customPrompt,
          content: localSummary.content,
          keyInsights: localSummary.keyInsights,
          actionableItems: localSummary.actionableItems,
          mentalModels: localSummary.mentalModels,
          relatedTopics: localSummary.relatedTopics,
          difficulty: localSummary.difficulty,
          timeToRead: localSummary.timeToRead,
          originalContent: localSummary.originalContent,
          tags: localSummary.tags
        });
        
        // Use the database version if successful
        setSummaries(prev => ({
          ...prev,
          [content.id]: dbSummary
        }));
        return dbSummary;
      } catch (dbError) {
        console.warn('Failed to save to database, using local summary:', dbError);
        // Fall back to local summary if database save fails
        setSummaries(prev => ({
          ...prev,
          [content.id]: localSummary
        }));
        return localSummary;
      }
    } catch (err) {
      setError(err.message);
      console.error('Error summarizing content:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get summary for content
  const getSummary = (contentId) => {
    return summaries[contentId] || summarizerService.getSummary(contentId);
  };

  // Update summary rating and notes
  const updateSummary = async (contentId, updates) => {
    try {
      // Update locally first
      const localUpdated = summarizerService.updateSummary(contentId, updates);
      
      if (localUpdated) {
        // Try to update in database
        try {
          const dbUpdated = await apiClient.updateSummary(localUpdated.id, updates);
          setSummaries(prev => ({
            ...prev,
            [contentId]: dbUpdated
          }));
          return dbUpdated;
        } catch (dbError) {
          console.warn('Failed to update in database, using local:', dbError);
          setSummaries(prev => ({
            ...prev,
            [contentId]: localUpdated
          }));
          return localUpdated;
        }
      }
      return null;
    } catch (err) {
      console.error('Error updating summary:', err);
      return null;
    }
  };

  // Rate summary
  const rateSummary = (contentId, rating) => {
    return updateSummary(contentId, { rating });
  };

  // Add notes to summary
  const addNotes = (contentId, notes) => {
    return updateSummary(contentId, { notes });
  };

  // Get all summaries with filtering
  const getAllSummaries = async (filters = {}) => {
    try {
      const data = await apiClient.getAllSummaries(filters);
      return data.summaries || [];
    } catch (error) {
      console.warn('Failed to fetch summaries from database, using local:', error);
      return summarizerService.getAllSummaries(filters);
    }
  };

  // Check if content has summary
  const hasSummary = (contentId) => {
    return !!getSummary(contentId);
  };

  // Search topics using AI/Hugging Face
  const searchTopics = async (query) => {
    try {
      return await summarizerService.searchTopics(query);
    } catch (err) {
      setError(err.message);
      console.error('Error searching topics:', err);
      return [];
    }
  };

  // Summarize completed video
  const summarizeCompletedVideo = async (video, mode = 'insight') => {
    setLoading(true);
    setError(null);
    
    try {
      const summary = await summarizerService.summarizeCompletedVideo(video, mode);
      setSummaries(prev => ({
        ...prev,
        [`video_${video.videoId}`]: summary
      }));
      return summary;
    } catch (err) {
      setError(err.message);
      console.error('Error summarizing completed video:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete summary
  const deleteSummary = async (summaryId) => {
    try {
      // Try to delete from database first
      try {
        await apiClient.deleteSummary(summaryId);
      } catch (dbError) {
        console.warn('Failed to delete from database:', dbError);
      }
      
      // Also delete from local storage
      await summarizerService.deleteSummary(summaryId);
      
      setSummaries(prev => {
        const updated = { ...prev };
        delete updated[summaryId];
        return updated;
      });
    } catch (err) {
      setError(err.message);
      console.error('Error deleting summary:', err);
      throw err;
    }
  };

  // Get summary statistics
  const getSummaryStats = () => {
    const allSummaries = Object.values(summaries);
    const savedSummaries = summarizerService.getSavedSummaries();
    const totalSummaries = Object.keys(savedSummaries).length;
    
    const modeDistribution = {};
    const difficultyDistribution = {};
    let totalReadingTime = 0;
    let ratedSummaries = 0;
    let totalRating = 0;

    Object.values(savedSummaries).forEach(summary => {
      // Mode distribution
      modeDistribution[summary.mode] = (modeDistribution[summary.mode] || 0) + 1;
      
      // Difficulty distribution
      difficultyDistribution[summary.difficulty] = (difficultyDistribution[summary.difficulty] || 0) + 1;
      
      // Reading time
      totalReadingTime += summary.timeToRead || 0;
      
      // Ratings
      if (summary.rating) {
        ratedSummaries++;
        totalRating += summary.rating;
      }
    });

    return {
      total: totalSummaries,
      modeDistribution,
      difficultyDistribution,
      totalReadingTime,
      averageRating: ratedSummaries > 0 ? (totalRating / ratedSummaries).toFixed(1) : 0,
      ratedCount: ratedSummaries
    };
  };

  // Load saved summaries on mount
  useEffect(() => {
    const savedSummaries = summarizerService.getSavedSummaries();
    setSummaries(savedSummaries);
  }, []);

  return {
    summaries,
    loading,
    error,
    summarizeContent,
    getSummary,
    updateSummary,
    rateSummary,
    addNotes,
    getAllSummaries,
    hasSummary,
    getSummaryStats,
    searchTopics,
    summarizeCompletedVideo,
    deleteSummary
  };
};