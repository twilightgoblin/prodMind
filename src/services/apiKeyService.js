import api from './api.js';

class ApiKeyService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get API key for a specific service
   * @param {string} service - Service name (youtube, openai, gemini, anthropic)
   * @returns {Promise<string>} API key
   */
  async getApiKey(service) {
    try {
      // Check cache first
      const cacheKey = `apikey_${service}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.apiKey;
      }

      // Fetch from backend
      const response = await api.get(`/keys/${service}`);
      
      if (response.data && response.data.apiKey) {
        // Cache the result
        this.cache.set(cacheKey, {
          apiKey: response.data.apiKey,
          timestamp: Date.now()
        });
        
        return response.data.apiKey;
      }
      
      throw new Error(`No API key found for service: ${service}`);
      
    } catch (error) {
      console.error(`Failed to get API key for ${service}:`, error);
      
      if (error.response?.status === 404) {
        throw new Error(`API key for ${service} is not configured on the server`);
      } else if (error.response?.status === 400) {
        throw new Error(`Service ${service} is not supported`);
      }
      
      throw new Error(`Failed to retrieve API key for ${service}`);
    }
  }

  /**
   * Get all available services and their configuration status
   * @returns {Promise<Object>} Services configuration status
   */
  async getServicesStatus() {
    try {
      const response = await api.get('/keys');
      return response.data.services;
    } catch (error) {
      console.error('Failed to get services status:', error);
      throw new Error('Failed to retrieve services configuration status');
    }
  }

  /**
   * Clear cache for a specific service or all services
   * @param {string} [service] - Service name to clear, or undefined to clear all
   */
  clearCache(service = null) {
    if (service) {
      this.cache.delete(`apikey_${service}`);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Check if a service has a cached API key
   * @param {string} service - Service name
   * @returns {boolean} True if cached and not expired
   */
  hasCachedKey(service) {
    const cached = this.cache.get(`apikey_${service}`);
    return cached && Date.now() - cached.timestamp < this.cacheExpiry;
  }
}

// Create and export singleton instance
export const apiKeyService = new ApiKeyService();
export default apiKeyService;