import mongoose from 'mongoose';
import { logger } from './logger.js';

// Health check status
let healthStatus = {
  status: 'starting',
  timestamp: new Date().toISOString(),
  uptime: 0,
  checks: {}
};

// Update health status periodically
const updateHealthStatus = async () => {
  const checks = {};
  let overallStatus = 'healthy';

  try {
    // Database check
    if (mongoose.connection.readyState === 1) {
      const dbStart = Date.now();
      await mongoose.connection.db.admin().ping();
      checks.database = {
        status: 'healthy',
        responseTime: `${Date.now() - dbStart}ms`,
        connection: 'connected'
      };
    } else {
      checks.database = {
        status: 'unhealthy',
        connection: 'disconnected',
        error: 'Database not connected'
      };
      overallStatus = 'unhealthy';
    }
  } catch (error) {
    checks.database = {
      status: 'unhealthy',
      error: error.message
    };
    overallStatus = 'unhealthy';
  }

  // Memory check
  const memUsage = process.memoryUsage();
  const memUsageMB = {
    rss: Math.round(memUsage.rss / 1024 / 1024),
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    external: Math.round(memUsage.external / 1024 / 1024)
  };

  checks.memory = {
    status: memUsageMB.heapUsed < 500 ? 'healthy' : 'warning',
    usage: memUsageMB,
    unit: 'MB'
  };

  // CPU check (simplified)
  const cpuUsage = process.cpuUsage();
  checks.cpu = {
    status: 'healthy',
    user: cpuUsage.user,
    system: cpuUsage.system
  };

  // Environment check
  checks.environment = {
    status: 'healthy',
    nodeVersion: process.version,
    platform: process.platform,
    environment: process.env.NODE_ENV || 'development'
  };

  // API Keys check (without exposing values)
  const requiredKeys = ['YOUTUBE_API_KEY', 'OPENAI_API_KEY'];
  const missingKeys = requiredKeys.filter(key => !process.env[key]);
  
  checks.apiKeys = {
    status: missingKeys.length === 0 ? 'healthy' : 'warning',
    configured: requiredKeys.length - missingKeys.length,
    total: requiredKeys.length,
    missing: missingKeys
  };

  if (missingKeys.length > 0) {
    overallStatus = 'degraded';
  }

  // Update global health status
  healthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: process.env.API_VERSION || '1.0.0',
    checks
  };
};

// Initialize health monitoring
const startHealthMonitoring = () => {
  // Update immediately
  updateHealthStatus();
  
  // Update every 30 seconds
  const interval = parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000;
  setInterval(updateHealthStatus, interval);
  
  logger.info('Health monitoring started', { interval: `${interval}ms` });
};

// Health check endpoint handler
export const healthCheck = async (req, res) => {
  try {
    // Force update if requested
    if (req.query.refresh === 'true') {
      await updateHealthStatus();
    }

    const statusCode = healthStatus.status === 'healthy' ? 200 : 
                      healthStatus.status === 'degraded' ? 200 : 503;

    res.status(statusCode).json({
      ...healthStatus,
      requestId: req.requestId
    });
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      requestId: req.requestId
    });
  }
};

// Readiness check (for Kubernetes/Docker)
export const readinessCheck = async (req, res) => {
  try {
    // Check if database is ready
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        status: 'not ready',
        reason: 'Database not connected'
      });
    }

    // Check if required environment variables are set
    const requiredEnvVars = ['MONGODB_URI', 'YOUTUBE_API_KEY', 'OPENAI_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return res.status(503).json({
        status: 'not ready',
        reason: 'Missing required environment variables',
        missing: missingVars
      });
    }

    res.json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error.message
    });
  }
};

// Liveness check (for Kubernetes/Docker)
export const livenessCheck = (req, res) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime())
  });
};

// Get current health status
export const getHealthStatus = () => healthStatus;

// Start monitoring when module is imported
startHealthMonitoring();