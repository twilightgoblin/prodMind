// API Health Check utility
import apiService from '../services/api.js';

export const performHealthCheck = async () => {
  try {
    console.log('🔍 Performing API health check...');
    
    // Initialize the API service (this will handle port detection)
    await apiService.initialize();
    
    // Perform health check
    const health = await apiService.healthCheck();
    
    console.log('✅ API Health Check Results:', {
      status: health.status,
      baseURL: apiService.baseURL,
      timestamp: health.timestamp,
      uptime: health.uptime
    });

    return {
      success: true,
      baseURL: apiService.baseURL,
      health
    };
  } catch (error) {
    console.error('❌ API Health Check Failed:', error.message);
    
    return {
      success: false,
      error: error.message,
      baseURL: apiService.baseURL
    };
  }
};

// Auto-run health check in development
if (import.meta.env.DEV) {
  // Run health check after a short delay to allow server startup
  setTimeout(() => {
    performHealthCheck().then(result => {
      if (result.success) {
        console.log('🎉 API connection established successfully!');
      } else {
        console.warn('⚠️ API connection failed. Please check server status.');
        console.warn('Expected server URL:', result.baseURL);
      }
    });
  }, 2000);
}

export default performHealthCheck;