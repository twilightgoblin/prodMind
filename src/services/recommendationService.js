class RecommendationService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
  }

  /**
   * Get personalized recommendations for a user
   * @param {string} userId - User ID
   * @param {Object} options - Recommendation options
   * @returns {Promise<Object>} - Recommendations response
   */
  async getPersonalizedRecommendations(userId, options = {}) {
    try {
      const token = localStorage.getItem('authToken');
      const queryParams = new URLSearchParams();
      
      if (options.limit) queryParams.append('limit', options.limit);
      if (options.excludeViewed !== undefined) queryParams.append('excludeViewed', options.excludeViewed);
      if (options.contentTypes) queryParams.append('contentTypes', options.contentTypes.join(','));
      if (options.difficulty) queryParams.append('difficulty', options.difficulty);
      if (options.maxDuration) queryParams.append('maxDuration', options.maxDuration);

      const response = await fetch(`${this.baseURL}/api/recommendations/${userId}?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get recommendations');
      }

      return data;
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      throw error;
    }
  }

  /**
   * Get trending content with personalization
   * @param {string} userId - User ID (optional)
   * @param {Object} options - Options
   * @returns {Promise<Object>} - Trending content response
   */
  async getTrendingContent(userId = null, options = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (options.limit) queryParams.append('limit', options.limit);

      const endpoint = userId 
        ? `${this.baseURL}/api/recommendations/trending/${userId}?${queryParams}`
        : `${this.baseURL}/api/recommendations/trending/?${queryParams}`;

      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get trending content');
      }

      return data;
    } catch (error) {
      console.error('Error getting trending content:', error);
      throw error;
    }
  }

  /**
   * Record user interaction with content
   * @param {Object} interaction - Interaction data
   * @returns {Promise<Object>} - Response
   */
  async recordInteraction(interaction) {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${this.baseURL}/api/recommendations/interaction`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(interaction)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to record interaction');
      }

      return data;
    } catch (error) {
      console.error('Error recording interaction:', error);
      throw error;
    }
  }

  /**
   * Get similar content to a specific item
   * @param {string} contentId - Content ID
   * @param {number} limit - Number of similar items to return
   * @returns {Promise<Object>} - Similar content response
   */
  async getSimilarContent(contentId, limit = 5) {
    try {
      const response = await fetch(`${this.baseURL}/api/recommendations/similar/${contentId}?limit=${limit}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get similar content');
      }

      return data;
    } catch (error) {
      console.error('Error getting similar content:', error);
      throw error;
    }
  }

  /**
   * Refresh user embedding
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Response
   */
  async refreshUserEmbedding(userId) {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${this.baseURL}/api/recommendations/refresh-embedding/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to refresh embedding');
      }

      return data;
    } catch (error) {
      console.error('Error refreshing user embedding:', error);
      throw error;
    }
  }

  /**
   * Ingest new content with embedding generation
   * @param {Object} contentData - Content data
   * @returns {Promise<Object>} - Response
   */
  async ingestContent(contentData) {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${this.baseURL}/api/recommendations/content/ingest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contentData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to ingest content');
      }

      return data;
    } catch (error) {
      console.error('Error ingesting content:', error);
      throw error;
    }
  }

  /**
   * Get recommendation analytics for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Analytics response
   */
  async getAnalytics(userId) {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${this.baseURL}/api/recommendations/analytics/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get analytics');
      }

      return data;
    } catch (error) {
      console.error('Error getting recommendation analytics:', error);
      throw error;
    }
  }

  /**
   * Helper method to track content view
   * @param {string} contentId - Content ID
   * @param {number} timeSpent - Time spent in seconds
   * @param {boolean} completed - Whether content was completed
   */
  async trackView(contentId, timeSpent = 0, completed = false) {
    return this.recordInteraction({
      contentId,
      interactionType: 'view',
      timeSpent,
      completed
    });
  }

  /**
   * Helper method to track content rating
   * @param {string} contentId - Content ID
   * @param {number} rating - Rating (1-5)
   */
  async trackRating(contentId, rating) {
    return this.recordInteraction({
      contentId,
      interactionType: 'rate',
      rating
    });
  }

  /**
   * Helper method to track content bookmark
   * @param {string} contentId - Content ID
   * @param {boolean} bookmarked - Whether content was bookmarked
   */
  async trackBookmark(contentId, bookmarked) {
    return this.recordInteraction({
      contentId,
      interactionType: 'bookmark',
      bookmarked
    });
  }
}

export default new RecommendationService();