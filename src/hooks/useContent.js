// Custom hook for content management
import { useState, useEffect } from 'react';
import contentService from '../services/contentService';

export const useContent = (userPreferences = {}) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContent = async (preferences = userPreferences) => {
    setLoading(true);
    setError(null);
    
    try {
      const curatedContent = await contentService.curateContent(preferences);
      setContent(curatedContent);
      
      // Store in localStorage for persistence
      localStorage.setItem('prodmind_content', JSON.stringify(curatedContent));
    } catch (err) {
      setError(err.message);
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchContent = async (query, maxResults = 10) => {
    if (!query.trim()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const searchResults = await contentService.fetchYouTubeContent(query, maxResults);
      
      // Analyze the search results
      const analyzedResults = await Promise.all(
        searchResults.map(async (item) => {
          const analysis = await contentService.analyzeContent(item);
          return { ...item, ...analysis };
        })
      );
      
      setContent(analyzedResults);
    } catch (err) {
      setError(err.message);
      console.error('Error searching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshContent = () => {
    fetchContent();
  };

  const markAsConsumed = (contentId) => {
    const updatedContent = content.map(item => 
      item.id === contentId 
        ? { ...item, consumed: true, consumedAt: new Date().toISOString() }
        : item
    );
    setContent(updatedContent);
    localStorage.setItem('prodmind_content', JSON.stringify(updatedContent));
  };

  const updatePriority = (contentId, newPriority) => {
    const updatedContent = content.map(item => 
      item.id === contentId 
        ? { ...item, priority: newPriority }
        : item
    );
    setContent(updatedContent);
    localStorage.setItem('prodmind_content', JSON.stringify(updatedContent));
  };

  // Load content from localStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('prodmind_content');
    if (savedContent) {
      try {
        setContent(JSON.parse(savedContent));
      } catch (err) {
        console.error('Error parsing saved content:', err);
      }
    }
    
    // Fetch fresh content if none saved or if it's been a while
    const lastFetch = localStorage.getItem('prodmind_last_fetch');
    const shouldFetch = !lastFetch || 
      (Date.now() - parseInt(lastFetch)) > 24 * 60 * 60 * 1000; // 24 hours
    
    if (shouldFetch) {
      fetchContent();
      localStorage.setItem('prodmind_last_fetch', Date.now().toString());
    }
  }, []);

  return {
    content,
    loading,
    error,
    refreshContent,
    markAsConsumed,
    updatePriority,
    fetchContent,
    searchContent
  };
};