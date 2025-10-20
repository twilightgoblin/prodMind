import { useState, useCallback } from 'react';
import mindMapService from '../services/mindMapService';

export const useMindMap = () => {
  const [mindMapData, setMindMapData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [savedMaps, setSavedMaps] = useState([]);

  const generateMindMap = useCallback(async (topic, options = {}) => {
    if (!topic?.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await mindMapService.generateMindMap(
        topic,
        options.depth || 3,
        options.style || 'hierarchical'
      );

      if (result.success) {
        setMindMapData(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to generate mind map');
        setMindMapData(result.data); // Fallback data
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Mind map generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const saveMindMap = useCallback(async (name) => {
    if (!mindMapData || !name?.trim()) {
      setError('Please provide a name for the mind map');
      return false;
    }

    try {
      const result = await mindMapService.saveMindMap(mindMapData, name);
      if (result.success) {
        loadSavedMaps();
        return true;
      } else {
        setError(result.error || 'Failed to save mind map');
        return false;
      }
    } catch (err) {
      setError('Failed to save mind map');
      return false;
    }
  }, [mindMapData]);

  const loadSavedMaps = useCallback(() => {
    try {
      const maps = mindMapService.getSavedMindMaps();
      setSavedMaps(maps);
    } catch (err) {
      console.error('Failed to load saved maps:', err);
    }
  }, []);

  const loadMindMap = useCallback((mapData) => {
    setMindMapData(mapData);
    setError(null);
  }, []);

  const deleteMindMap = useCallback(async (id) => {
    try {
      const result = await mindMapService.deleteMindMap(id);
      if (result.success) {
        loadSavedMaps();
        return true;
      } else {
        setError(result.error || 'Failed to delete mind map');
        return false;
      }
    } catch (err) {
      setError('Failed to delete mind map');
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetMindMap = useCallback(() => {
    setMindMapData(null);
    setError(null);
  }, []);

  return {
    mindMapData,
    isGenerating,
    error,
    savedMaps,
    generateMindMap,
    saveMindMap,
    loadSavedMaps,
    loadMindMap,
    deleteMindMap,
    clearError,
    resetMindMap
  };
};