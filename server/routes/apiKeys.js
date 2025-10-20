import express from 'express';
import dotenv from 'dotenv';
import { logger } from '../middleware/logger.js';

dotenv.config();

const router = express.Router();

/**
 * GET /api/keys/:service
 * Retrieve API key for a specific service
 */
router.get('/:service', async (req, res) => {
  try {
    const { service } = req.params;
    
    // Map service names to environment variables
    const serviceKeyMap = {
      'youtube': 'YOUTUBE_API_KEY',
      'openai': 'OPENAI_API_KEY',
      'gemini': 'GEMINI_API_KEY',
      'anthropic': 'ANTHROPIC_API_KEY'
    };

    const envKey = serviceKeyMap[service.toLowerCase()];
    
    if (!envKey) {
      return res.status(400).json({
        error: 'Invalid service',
        message: `Service '${service}' is not supported`,
        supportedServices: Object.keys(serviceKeyMap)
      });
    }

    const apiKey = process.env[envKey];
    
    if (!apiKey) {
      return res.status(404).json({
        error: 'API key not found',
        message: `API key for ${service} is not configured on the server`,
        service: service
      });
    }

    // Return the API key (in production, you might want to mask part of it)
    res.json({
      service: service,
      apiKey: apiKey,
      masked: `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`,
      timestamp: new Date().toISOString()
    });

    logger.info(`API key retrieved for service: ${service}`);

  } catch (error) {
    logger.error('Error retrieving API key:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve API key'
    });
  }
});

/**
 * GET /api/keys
 * Get all available services and their key status
 */
router.get('/', async (req, res) => {
  try {
    const services = {
      youtube: {
        configured: !!process.env.YOUTUBE_API_KEY,
        masked: process.env.YOUTUBE_API_KEY ? 
          `${process.env.YOUTUBE_API_KEY.substring(0, 8)}...${process.env.YOUTUBE_API_KEY.substring(process.env.YOUTUBE_API_KEY.length - 4)}` : 
          null
      },
      openai: {
        configured: !!process.env.OPENAI_API_KEY,
        masked: process.env.OPENAI_API_KEY ? 
          `${process.env.OPENAI_API_KEY.substring(0, 8)}...${process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 4)}` : 
          null
      },
      gemini: {
        configured: !!process.env.GEMINI_API_KEY,
        masked: process.env.GEMINI_API_KEY ? 
          `${process.env.GEMINI_API_KEY.substring(0, 8)}...${process.env.GEMINI_API_KEY.substring(process.env.GEMINI_API_KEY.length - 4)}` : 
          null
      },
      anthropic: {
        configured: !!process.env.ANTHROPIC_API_KEY,
        masked: process.env.ANTHROPIC_API_KEY ? 
          `${process.env.ANTHROPIC_API_KEY.substring(0, 8)}...${process.env.ANTHROPIC_API_KEY.substring(process.env.ANTHROPIC_API_KEY.length - 4)}` : 
          null
      }
    };

    res.json({
      services: services,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error retrieving API keys status:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve API keys status'
    });
  }
});

export default router;