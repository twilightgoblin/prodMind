// Custom hook for content summarization
import { useState, useEffect } from 'react';
import summarizerService from '../services/summarizerService';

export const useSummarizer = () => {
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Summarize content
  const summarizeContent = async (content, mode = 'insight', customPrompt = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const summary = await summarizerService.summarizeContent(content, mode, customPrompt);
      setSummaries(prev => ({
        ...prev,
        [content.id]: summary
      }));
      return summary;
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
  const updateSummary = (contentId, updates) => {
    const updated = summarizerService.updateSummary(contentId, updates);
    if (updated) {
      setSummaries(prev => ({
        ...prev,
        [contentId]: updated
      }));
    }
    return updated;
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
  const getAllSummaries = (filters = {}) => {
    return summarizerService.getAllSummaries(filters);
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