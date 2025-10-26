import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import routes
import contentRoutes, { youtubeTrending, youtubeSearch, youtubeChannel } from './routes/content.js';
import summarizerRoutes from './routes/summarizer.js';
import authRoutes from './routes/auth.js';
import schedulerRoutes from './routes/scheduler.js';
import apiKeysRoutes from './routes/apiKeys.js';
import videoNotesRoutes from './routes/videoNotes.js';
import recommendationRoutes from './routes/recommendations.js';
import userProfileRoutes from './routes/userProfile.js';
import analyticsRoutes from './routes/analytics.js';
import testRoutes from './routes/test.js';

// Import middleware
import { logger, requestLogger } from './middleware/logger.js';
import { validateRequest } from './middleware/validation.js';
import { errorHandler } from './middleware/errorHandler.js';
import { healthCheck } from './middleware/healthCheck.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// --- ✅ CORS must be very early ---
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    // In development, allow any localhost origin with any port
    if (process.env.NODE_ENV === 'development') {
      if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
    }
    
    // Check against configured origins
    if (corsOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  // Make credentials configurable via env (defaults to true for browser apps)
  credentials: process.env.CORS_CREDENTIALS === 'true' ? true : true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
};

// Apply CORS early
app.use(cors(corsOptions));

// ✅ Explicitly handle preflight requests
app.options('*', cors(corsOptions));

// Request logging
app.use(requestLogger);


// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting with different tiers
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development' && req.ip === '127.0.0.1'
});

// Apply different rate limits
app.use('/api/auth', createRateLimit(15 * 60 * 1000, 5, 'Too many authentication attempts'));
app.use('/api/', createRateLimit(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  'Too many requests from this IP, please try again later.'
));

// Note: CORS already applied above with `corsOptions` to ensure it's configured
// early in the middleware chain. If you need a different CORS policy for
// specific routes, add route-specific middleware instead of re-applying here.

// Body parsing middleware with size limits
app.use(express.json({ 
  limit: process.env.BODY_LIMIT || '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request timeout
app.use((req, res, next) => {
  req.setTimeout(parseInt(process.env.REQUEST_TIMEOUT) || 30000);
  next();
});

// MongoDB connection with proper error handling
const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    logger.warn('⚠️  MONGODB_URI not configured. Server will run without database.');
    return;
  }

  try {
    // Add retry logic for Atlas connection
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE) || 10,
      serverSelectionTimeoutMS: parseInt(process.env.DB_TIMEOUT_MS) || 30000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      retryWrites: true,
      w: 'majority'
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
      // Attempt to reconnect after a delay
      setTimeout(connectDB, 5000);
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error.message);
    logger.warn('⚠️  Server will continue without database functionality');
    
    // Retry connection after 10 seconds
    setTimeout(() => {
      logger.info('Retrying MongoDB connection...');
      connectDB();
    }, 10000);
  }
};

// Initialize database connection
connectDB();

// API Routes with versioning
const apiRouter = express.Router();

// Health check (before other middleware)
apiRouter.get('/health', healthCheck);

// Request validation middleware
apiRouter.use(validateRequest);

// API routes
apiRouter.use('/content', contentRoutes);
apiRouter.use('/summarizer', summarizerRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/scheduler', schedulerRoutes);
apiRouter.use('/keys', apiKeysRoutes);
apiRouter.use('/video-notes', videoNotesRoutes);
apiRouter.use('/recommendations', recommendationRoutes);
apiRouter.use('/user', userProfileRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/test', testRoutes);

// Mount API router
app.use('/api', apiRouter);

// Backwards-compatible shortcuts: expose /api/youtube/* -> handlers
const youtubeRouter = express.Router();

// Trending (GET)
youtubeRouter.get('/trending', youtubeTrending);

// Search (POST)
youtubeRouter.post('/search', youtubeSearch);

// Channel (POST)
youtubeRouter.post('/channel', youtubeChannel);

// Mount under /api/youtube
app.use('/api/youtube', youtubeRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'ProdMind API',
    version: API_VERSION,
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      content: '/api/content',
      summarizer: '/api/summarizer',
      auth: '/api/auth',
      scheduler: '/api/scheduler',
      keys: '/api/keys',
      videoNotes: '/api/video-notes'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    logger.info('HTTP server closed');
    
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Start server with port fallback if requested port is in use (helps
// avoid macOS system services that bind common ports like 5000).
let server;
(async () => {
  const startPort = parseInt(process.env.PORT, 10) || PORT || 5000;
  const maxAttempts = 10; // try up to startPort + 9

  for (let i = 0; i < maxAttempts; i++) {
    const tryPort = startPort + i;

    try {
      server = await new Promise((resolve, reject) => {
        const s = app.listen(tryPort);
        s.once('listening', () => resolve(s));
        s.once('error', (err) => reject(err));
      });

      // Successful start
      logger.info(`🚀 ProdMind API Server started`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 Server: http://localhost:${tryPort}`);
      logger.info(`🔗 API Base: http://localhost:${tryPort}/api`);
      logger.info(`📋 Health Check: http://localhost:${tryPort}/api/health`);

      // Make chosen port available for other parts of the app and scripts
      process.env.PORT = String(tryPort);
      break;
    } catch (err) {
      if (err && err.code === 'EADDRINUSE') {
        logger.warn(`Port ${tryPort} in use, trying ${tryPort + 1}`);
        // loop will try next port
        continue;
      }

      logger.error('Failed to start server:', err);
      process.exit(1);
    }
  }

  if (!server) {
    logger.error('Could not find an available port to bind the server.');
    process.exit(1);
  }
})();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));