// Content Intelligence Service
// Handles fetching and analyzing content from various sources

import youtubeService from './youtubeService.js';
import api from './api.js';

class ContentService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
    console.log('Content Service initialized with API base URL:', this.baseURL);
  }

  // Fetch YouTube videos based on search query
  async fetchYouTubeContent(query, options = {}) {
    const { 
      maxResults = 10, 
      order = 'relevance', 
      publishedAfter = null, 
      duration = null 
    } = options;

    try {
      // Use direct YouTube service with dynamic API key
      const results = await youtubeService.searchVideos(query, {
        maxResults,
        order,
        publishedAfter,
        duration
      });
      
      return results;
    } catch (error) {
      console.error('Error fetching YouTube content:', error);
      
      // Fallback to backend if direct API fails
      try {
        const response = await fetch(`${this.baseURL}/api/content/youtube/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            maxResults,
            order,
            publishedAfter,
            duration
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'YouTube search failed');
        }
        
        const data = await response.json();
        return data.content || [];
      } catch (backendError) {
        console.error('Backend fallback also failed:', backendError);
        throw new Error('YouTube search failed. Please check your API configuration.');
      }
    }
  }

  // Fetch content from a specific YouTube channel
  async fetchChannelContent(channelId, maxResults = 10) {
    try {
      // Use direct YouTube service with dynamic API key
      const results = await youtubeService.getChannelVideos(channelId, { maxResults });
      return results;
    } catch (error) {
      console.error('Error fetching channel content:', error);
      
      // Fallback to backend
      try {
        const response = await fetch(`${this.baseURL}/api/content/youtube/channel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            channelId,
            maxResults
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Channel fetch failed');
        }
        
        const data = await response.json();
        return data.content || [];
      } catch (backendError) {
        console.error('Backend fallback also failed:', backendError);
        throw new Error('Channel fetch failed. Please check your API configuration.');
      }
    }
  }

  // Fetch trending YouTube content
  async fetchTrendingContent(maxResults = 10, categoryId = '0') {
    try {
      // Use direct YouTube service with dynamic API key
      const results = await youtubeService.getTrendingVideos({ 
        maxResults, 
        categoryId 
      });
      return results;
    } catch (error) {
      console.error('Error fetching trending content:', error);
      
      // Fallback to backend
      try {
        const response = await fetch(
          `${this.baseURL}/api/content/youtube/trending?maxResults=${maxResults}&categoryId=${categoryId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Trending fetch failed');
        }
        
        const data = await response.json();
        return data.content || [];
      } catch (backendError) {
        console.error('Backend fallback also failed:', backendError);
        throw new Error('Trending fetch failed. Please check your API configuration.');
      }
    }
  }



  // Analyze content using AI (summarization, tagging, priority scoring)
  async analyzeContent(content) {
    try {
      const response = await fetch(`${this.baseURL}/api/content/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }
      
      const data = await response.json();
      return data.analysis || {
        summary: 'Analysis not available',
        tags: ['content'],
        priority: 5,
        difficulty: 'intermediate'
      };
    } catch (error) {
      console.error('Error analyzing content:', error);
      return {
        summary: 'Analysis failed - please try again',
        tags: ['content'],
        priority: 5,
        difficulty: 'intermediate'
      };
    }
  }







  // Intelligent content curation based on user preferences and learning goals
  async curateContent(userPreferences = {}) {
    const { 
      topics = ['programming', 'productivity'], 
      maxResults = 20,
      minPriority = 6,
      difficulty = 'all',
      duration = 'any'
    } = userPreferences;
    
    try {
      const data = await api.post('/content/curate', {
        topics,
        maxResults,
        minPriority,
        difficulty,
        duration
      });
      
      return {
        content: data.content || [],
        metadata: data.metadata || {}
      };
    } catch (error) {
      console.error('Error curating content:', error);
      return {
        content: [],
        metadata: { error: error.message }
      };
    }
  }

  // Save content to user's collection
  async saveContent(content) {
    try {
      const response = await fetch(`${this.baseURL}/api/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'default' // You can implement proper user auth later
        },
        body: JSON.stringify(content)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Save failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving content:', error);
      throw error;
    }
  }

  // Get saved content
  async getSavedContent(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${this.baseURL}/api/content?${queryParams}`, {
        headers: {
          'x-user-id': 'default'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fetch failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching saved content:', error);
      return { content: [], total: 0 };
    }
  }

  // Update content
  async updateContent(id, updates) {
    try {
      const response = await fetch(`${this.baseURL}/api/content/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'default'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Update failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  }

  // Delete content
  async deleteContent(id) {
    try {
      const response = await fetch(`${this.baseURL}/api/content/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': 'default'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Delete failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  }
}

export default new ContentService();