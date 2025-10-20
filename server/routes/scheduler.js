import express from 'express';
import mongoose from 'mongoose';
import ScheduledContent from '../models/ScheduledContent.js';

const router = express.Router();

// Middleware to check database connection
const checkDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      error: 'Database connection is not ready. The server is attempting to connect to MongoDB Atlas. Please try again in a few moments.',
      status: 'service_unavailable',
      connectionState: mongoose.connection.readyState,
      hint: 'Check your MongoDB Atlas connection and network access settings'
    });
  }
  next();
};

// Apply database check to all routes
router.use(checkDBConnection);

// Get all scheduled content
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      startDate, 
      endDate,
      priority 
    } = req.query;
    const userId = req.headers['x-user-id'] || 'default';

    const filter = { userId };
    if (status) filter.status = status;
    if (priority) filter.priority = { $gte: parseInt(priority) };
    
    // Date range filter
    if (startDate || endDate) {
      filter.scheduledDate = {};
      if (startDate) filter.scheduledDate.$gte = new Date(startDate);
      if (endDate) filter.scheduledDate.$lte = new Date(endDate);
    }

    const scheduledContent = await ScheduledContent.find(filter)
      .sort({ scheduledDate: 1, scheduledTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ScheduledContent.countDocuments(filter);

    res.json({
      scheduledContent,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get scheduled content for a specific date
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.headers['x-user-id'] || 'default';

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const scheduledContent = await ScheduledContent.find({
      userId,
      scheduledDate: {
        $gte: startDate,
        $lt: endDate
      }
    }).sort({ scheduledTime: 1 });

    res.json({ scheduledContent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule new content
router.post('/schedule', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default';
    const {
      contentId,
      title,
      description,
      thumbnail,
      url,
      channelTitle,
      duration,
      source = 'youtube',
      scheduledDate,
      scheduledTime,
      priority = 5,
      tags = [],
      notes,
      estimatedDuration
    } = req.body;

    // Validate required fields
    if (!contentId || !title || !url || !scheduledDate || !scheduledTime) {
      return res.status(400).json({ 
        error: 'Missing required fields: contentId, title, url, scheduledDate, scheduledTime' 
      });
    }

    // Check if content is already scheduled for the same time
    const existingSchedule = await ScheduledContent.findOne({
      userId,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      status: { $in: ['scheduled', 'in-progress'] }
    });

    if (existingSchedule) {
      return res.status(409).json({ 
        error: 'You already have content scheduled for this time slot' 
      });
    }

    const scheduledContent = new ScheduledContent({
      userId,
      contentId,
      title,
      description,
      thumbnail,
      url,
      channelTitle,
      duration,
      source,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      priority,
      tags,
      notes,
      estimatedDuration
    });

    await scheduledContent.save();
    res.status(201).json(scheduledContent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update scheduled content
router.put('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default';
    const { id } = req.params;

    const scheduledContent = await ScheduledContent.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!scheduledContent) {
      return res.status(404).json({ error: 'Scheduled content not found' });
    }

    res.json(scheduledContent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark content as completed
router.patch('/:id/complete', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default';
    const { id } = req.params;
    const { actualDuration, rating, feedback } = req.body;

    const scheduledContent = await ScheduledContent.findOneAndUpdate(
      { _id: id, userId },
      {
        status: 'completed',
        completedAt: new Date(),
        actualDuration,
        rating,
        feedback
      },
      { new: true }
    );

    if (!scheduledContent) {
      return res.status(404).json({ error: 'Scheduled content not found' });
    }

    res.json(scheduledContent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cancel scheduled content
router.patch('/:id/cancel', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default';
    const { id } = req.params;

    const scheduledContent = await ScheduledContent.findOneAndUpdate(
      { _id: id, userId },
      { status: 'cancelled' },
      { new: true }
    );

    if (!scheduledContent) {
      return res.status(404).json({ error: 'Scheduled content not found' });
    }

    res.json(scheduledContent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete scheduled content
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default';
    const { id } = req.params;

    const scheduledContent = await ScheduledContent.findOneAndDelete({ 
      _id: id, 
      userId 
    });

    if (!scheduledContent) {
      return res.status(404).json({ error: 'Scheduled content not found' });
    }

    res.json({ message: 'Scheduled content deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get schedule analytics
router.get('/analytics', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default';
    const { startDate, endDate } = req.query;

    const filter = { userId };
    if (startDate || endDate) {
      filter.scheduledDate = {};
      if (startDate) filter.scheduledDate.$gte = new Date(startDate);
      if (endDate) filter.scheduledDate.$lte = new Date(endDate);
    }

    const analytics = await ScheduledContent.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalEstimatedDuration: { $sum: '$estimatedDuration' },
          totalActualDuration: { $sum: '$actualDuration' },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    const totalScheduled = await ScheduledContent.countDocuments(filter);
    const completionRate = totalScheduled > 0 
      ? (analytics.find(a => a._id === 'completed')?.count || 0) / totalScheduled * 100 
      : 0;

    res.json({
      analytics,
      totalScheduled,
      completionRate: Math.round(completionRate * 100) / 100
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;