// Connection test utility
import apiService from '../services/api.js';
import apiClient from './api.js';

export const testApiConnection = async () => {
  const results = {
    apiService: { connected: false, error: null, port: null },
    apiClient: { connected: false, error: null, port: null }
  };

  // Test main API service
  try {
    const health = await apiService.healthCheck();
    results.apiService.connected = true;
    results.apiService.port = apiService.baseURL.match(/:(\d+)/)?.[1];
    console.log('✅ API Service connection successful');
  } catch (error) {
    results.apiService.error = error.message;
    console.error('❌ API Service connection failed:', error.message);
  }

  // Test API client
  try {
    await apiClient.initialize();
    const health = await apiClient.get('/health');
    results.apiClient.connected = true;
    results.apiClient.port = apiClient.baseURL.match(/:(\d+)/)?.[1];
    console.log('✅ API Client connection successful');
  } catch (error) {
    results.apiClient.error = error.message;
    console.error('❌ API Client connection failed:', error.message);
  }

  return results;
};

// Auto-test connection on import (in development)
if (import.meta.env.DEV) {
  testApiConnection().then(results => {
    const allConnected = results.apiService.connected && results.apiClient.connected;
    if (allConnected) {
      console.log('🎉 All API connections established successfully');
    } else {
      console.warn('⚠️ Some API connections failed. Check server status.');
    }
  });
}