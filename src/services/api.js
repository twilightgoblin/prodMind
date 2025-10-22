// Centralized API service for backend communication
class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
    this.userId = 'default'; // For future user authentication
    this.timeout = 30000; // 30 seconds
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
  }

  // Generic request method with retry logic
  async request(endpoint, options = {}, retryCount = 0) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': this.userId,
        ...options.headers
      },
      signal: AbortSignal.timeout(this.timeout),
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new ApiError(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.requestId,
          errorData.details
        );
        
        // Retry on server errors (5xx) but not client errors (4xx)
        if (response.status >= 500 && retryCount < this.retryAttempts) {
          await this.delay(this.retryDelay * Math.pow(2, retryCount));
          return this.request(endpoint, options, retryCount + 1);
        }
        
        throw error;
      }

      return await response.json();
    } catch (error) {
      // Handle network errors and timeouts
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        // Network error - retry if not exceeded attempts
        if (retryCount < this.retryAttempts) {
          await this.delay(this.retryDelay * Math.pow(2, retryCount));
          return this.request(endpoint, options, retryCount + 1);
        }
        throw new ApiError('Network error - please check your connection', 0);
      }
      
      // Re-throw ApiError instances
      if (error instanceof ApiError) {
        throw error;
      }
      
      console.error(`API request failed: ${endpoint}`, error);
      throw new ApiError(error.message || 'Unknown error occurred', 500);
    }
  }

  // Delay helper for retry logic
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Content API methods
  async getContent(params = {}) {
    return this.get('/content', params);
  }

  async searchYouTube(query, maxResults = 10) {
    return this.post('/content/youtube/search', { query, maxResults });
  }

  async analyzeContent(content) {
    return this.post('/content/analyze', { content });
  }

  async saveContent(content) {
    return this.post('/content', content);
  }

  async updateContent(id, updates) {
    return this.put(`/content/${id}`, updates);
  }

  async deleteContent(id) {
    return this.delete(`/content/${id}`);
  }

  // Summarizer API methods
  async generateSummary(contentId, mode = 'insight', customPrompt = null) {
    return this.post('/summarizer/generate', { contentId, mode, customPrompt });
  }

  async getSummaries(params = {}) {
    return this.get('/summarizer', params);
  }

  async getSummary(id) {
    return this.get(`/summarizer/${id}`);
  }

  async updateSummary(id, updates) {
    return this.put(`/summarizer/${id}`, updates);
  }

  async deleteSummary(id) {
    return this.delete(`/summarizer/${id}`);
  }



  // Health check
  async healthCheck() {
    return this.get('/health');
  }

  // Connection test
  async testConnection() {
    try {
      const health = await this.healthCheck();
      return {
        connected: true,
        status: health.status,
        latency: Date.now() - new Date(health.timestamp).getTime()
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  }

  // Set user ID for requests
  setUserId(userId) {
    this.userId = userId || 'default';
  }

  // Get current configuration
  getConfig() {
    return {
      baseURL: this.baseURL,
      userId: this.userId,
      timeout: this.timeout,
      retryAttempts: this.retryAttempts
    };
  }
}

// Custom API Error class
class ApiError extends Error {
  constructor(message, status = 500, requestId = null, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.requestId = requestId;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  // Check if error is retryable
  isRetryable() {
    return this.status >= 500 || this.status === 0;
  }

  // Check if error is client error
  isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  // Check if error is server error
  isServerError() {
    return this.status >= 500;
  }
}

export { ApiError };
export default new ApiService();