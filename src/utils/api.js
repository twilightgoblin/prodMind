import portDetector from './portDetection.js';

// API utility for making authenticated requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.portDetected = false;
  }

  // Initialize with port detection
  async initialize() {
    if (!this.portDetected) {
      try {
        await portDetector.detectAvailablePort();
        this.baseURL = portDetector.getBaseURL().replace('/api', '');
        this.portDetected = true;
        console.log(`🔗 API Client initialized with: ${this.baseURL}`);
      } catch (error) {
        console.warn('⚠️ Port detection failed, using default URL:', this.baseURL);
        console.warn('Error:', error.message);
        // Fallback to environment variable
        this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
        this.portDetected = true;
        console.log(`🔗 API Client fallback URL: ${this.baseURL}`);
      }
    }
  }

  // Force re-initialization (useful for debugging)
  async reinitialize() {
    this.portDetected = false;
    portDetector.reset();
    await this.initialize();
  }

  // Get current status (useful for debugging)
  getStatus() {
    return {
      baseURL: this.baseURL,
      portDetected: this.portDetected,
      hasAuthToken: !!this.getAuthToken()
    };
  }



  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Get default headers with auth token
  getHeaders(additionalHeaders = {}) {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...additionalHeaders
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    // Ensure port detection is done
    await this.initialize();
    const url = `${this.baseURL}/api${endpoint}`;
    const config = {
      headers: this.getHeaders(options.headers),
      ...options
    };

    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          // Token expired or invalid, redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          window.location.href = '/signin';
          throw new Error('Authentication required');
        }
        
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET'
    });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  // Auth specific methods
  async signUp(userData) {
    return this.post('/auth/signup', userData);
  }

  async signIn(email, password) {
    return this.post('/auth/signin', { email, password });
  }

  async signOut() {
    return this.post('/auth/signout');
  }

  async getProfile() {
    return this.get('/auth/me');
  }

  async updateProfile(userData) {
    return this.put('/auth/profile', userData);
  }

  async changePassword(passwordData) {
    return this.put('/auth/change-password', passwordData);
  }

  // Scheduler methods
  async getScheduledContent(params = {}) {
    return this.get('/scheduler', params);
  }

  async scheduleContent(contentData) {
    return this.post('/scheduler/schedule', contentData);
  }

  async updateScheduledContent(id, data) {
    return this.put(`/scheduler/${id}`, data);
  }

  async completeScheduledContent(id, data) {
    return this.patch(`/scheduler/${id}/complete`, data);
  }

  async cancelScheduledContent(id) {
    return this.patch(`/scheduler/${id}/cancel`);
  }

  async deleteScheduledContent(id) {
    return this.delete(`/scheduler/${id}`);
  }

  async getScheduleAnalytics(params = {}) {
    return this.get('/scheduler/analytics', params);
  }

  // Video Notes methods
  async saveVideoNotes(notesData) {
    return this.post('/video-notes', notesData);
  }

  async getVideoNotes(videoId) {
    return this.get(`/video-notes/${videoId}`);
  }

  async getAllVideoNotes(params = {}) {
    return this.get('/video-notes', params);
  }

  async deleteVideoNotes(videoId) {
    return this.delete(`/video-notes/${videoId}`);
  }

  // Content methods (if needed)
  async getContent(params = {}) {
    return this.get('/content', params);
  }

  // Summarizer methods
  async generateSummary(contentData) {
    return this.post('/summarizer/generate', contentData);
  }

  async getAllSummaries(params = {}) {
    return this.get('/summarizer', params);
  }

  async getSummaryById(summaryId) {
    return this.get(`/summarizer/${summaryId}`);
  }

  async updateSummary(summaryId, data) {
    return this.put(`/summarizer/${summaryId}`, data);
  }

  async deleteSummary(summaryId) {
    return this.delete(`/summarizer/${summaryId}`);
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Export individual methods for convenience
export const {
  signUp,
  signIn,
  signOut,
  getProfile,
  updateProfile,
  changePassword,
  getScheduledContent,
  scheduleContent,
  updateScheduledContent,
  completeScheduledContent,
  cancelScheduledContent,
  deleteScheduledContent,
  getScheduleAnalytics,
  saveVideoNotes,
  getVideoNotes,
  getAllVideoNotes,
  deleteVideoNotes,
  getContent,
  generateSummary,
  getAllSummaries,
  getSummaryById,
  updateSummary,
  deleteSummary
} = apiClient;