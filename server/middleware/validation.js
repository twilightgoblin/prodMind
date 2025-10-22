import { logger } from './logger.js';

// Request validation middleware
export const validateRequest = (req, res, next) => {
  // Validate Content-Type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type');
    
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        error: 'Invalid Content-Type',
        message: 'Content-Type must be application/json',
        received: contentType || 'none'
      });
    }
  }

  // Validate JSON payload
  if (req.body && typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch (error) {
      return res.status(400).json({
        error: 'Invalid JSON',
        message: 'Request body contains invalid JSON'
      });
    }
  }

  // Add request ID for tracking
  req.requestId = generateRequestId();
  res.set('X-Request-ID', req.requestId);

  // Validate user ID header
  const userId = req.get('x-user-id');
  if (!userId) {
    req.userId = 'anonymous';
  } else {
    req.userId = sanitizeUserId(userId);
  }

  next();
};

// Input sanitization helpers
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

export const sanitizeUserId = (userId) => {
  if (typeof userId !== 'string') return 'anonymous';
  
  return userId
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .substring(0, 50);
};

// Validation schemas
export const validateContentData = (data) => {
  const errors = [];

  if (!data.title || typeof data.title !== 'string') {
    errors.push('Title is required and must be a string');
  }

  if (data.title && data.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (data.description && typeof data.description !== 'string') {
    errors.push('Description must be a string');
  }

  if (data.url && !isValidUrl(data.url)) {
    errors.push('URL must be a valid URL');
  }

  if (data.tags && !Array.isArray(data.tags)) {
    errors.push('Tags must be an array');
  }

  if (data.priority && (typeof data.priority !== 'number' || data.priority < 1 || data.priority > 10)) {
    errors.push('Priority must be a number between 1 and 10');
  }

  return errors;
};

export const validateSummaryData = (data) => {
  const errors = [];

  if (!data.contentId || typeof data.contentId !== 'string') {
    errors.push('Content ID is required and must be a string');
  }

  if (data.mode && !['tldr', 'insight', 'detailed'].includes(data.mode)) {
    errors.push('Mode must be one of: tldr, insight, detailed');
  }

  if (data.customPrompt && typeof data.customPrompt !== 'string') {
    errors.push('Custom prompt must be a string');
  }

  if (data.customPrompt && data.customPrompt.length > 2000) {
    errors.push('Custom prompt must be less than 2000 characters');
  }

  return errors;
};



// Helper functions
const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Validation middleware factory
export const createValidationMiddleware = (validator) => {
  return (req, res, next) => {
    const errors = validator(req.body);
    
    if (errors.length > 0) {
      logger.warn('Validation failed', {
        requestId: req.requestId,
        errors,
        body: req.body
      });
      
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
        requestId: req.requestId
      });
    }
    
    next();
  };
};