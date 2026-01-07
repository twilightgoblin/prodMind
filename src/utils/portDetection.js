// Port detection utility for dynamic API connection
class PortDetector {
  constructor() {
    this.commonPorts = [5001, 5000, 5002, 3001, 8000, 8080];
    this.detectedPort = null;
    this.baseURL = null;
  }

  // Test if a port is available by making a health check
  async testPort(port) {
    try {
      const response = await fetch(`http://localhost:${port}/api/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Detect the first available port from common ports
  async detectAvailablePort() {
    // Skip port detection in production
    if (import.meta.env.PROD || import.meta.env.VITE_NODE_ENV === 'production') {
      this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://prodmind.onrender.com';
      console.log(`🚀 Production mode: Using ${this.baseURL}`);
      return null;
    }

    // First try the environment variable
    const envPort = import.meta.env.VITE_API_BASE_URL?.match(/:(\d+)/)?.[1];
    if (envPort) {
      const isAvailable = await this.testPort(parseInt(envPort));
      if (isAvailable) {
        this.detectedPort = parseInt(envPort);
        this.baseURL = `http://localhost:${this.detectedPort}`;
        return this.detectedPort;
      }
    }

    // Try common ports
    for (const port of this.commonPorts) {
      const isAvailable = await this.testPort(port);
      if (isAvailable) {
        this.detectedPort = port;
        this.baseURL = `http://localhost:${port}`;
        console.log(`✅ Detected API server on port ${port}`);
        return port;
      }
    }

    throw new Error('No available API server found on common ports');
  }

  // Get the detected base URL
  getBaseURL() {
    // In production, always use the production URL
    if (import.meta.env.PROD || import.meta.env.VITE_NODE_ENV === 'production') {
      return import.meta.env.VITE_API_BASE_URL || 'https://prodmind.onrender.com';
    }
    
    if (!this.baseURL) {
      // Fallback to environment variable or default
      return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
    }
    return this.baseURL;
  }

  // Get the detected port
  getPort() {
    return this.detectedPort;
  }

  // Reset detection
  reset() {
    this.detectedPort = null;
    this.baseURL = null;
  }
}

// Create singleton instance
const portDetector = new PortDetector();

export default portDetector;