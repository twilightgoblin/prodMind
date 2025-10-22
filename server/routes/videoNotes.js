import express from 'express';
import VideoNotes from '../models/VideoNotes.js';
import { authenticateToken } from './auth.js';
import { logger } from '../middleware/logger.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Save or update video notes
router.post('/', async (req, res) => {
  try {
    const { videoId, videoUrl, title, notes } = req.body;

    // Validation
    if (!videoId || !videoUrl || !title || !notes) {
      return res.status(400).json({
        error: 'Missing required fields: videoId, videoUrl, title, notes'
      });
    }

    if (notes.length > 5000) {
      return res.status(400).json({
        error: 'Notes cannot exceed 5000 characters'
      });
    }

    const userId = req.user._id;

    // Check if notes already exist for this video and user
    let existingNotes = await VideoNotes.findOne({ videoId, userId });

    if (existingNotes) {
      // Update existing notes
      existingNotes.notes = notes;
      existingNotes.title = title; // Update title in case it changed
      existingNotes.videoUrl = videoUrl; // Update URL in case it changed
      await existingNotes.save();

      logger.info(`Updated video notes for videoId: ${videoId}`);
      
      return res.json({
        success: true,
        message: 'Notes updated successfully',
        data: existingNotes
      });
    } else {
      // Create new notes
      const newNotes = new VideoNotes({
        videoId,
        videoUrl,
        title,
        notes,
        userId
      });

      await newNotes.save();

      logger.info(`Created new video notes for videoId: ${videoId}`);
      
      return res.status(201).json({
        success: true,
        message: 'Notes saved successfully',
        data: newNotes
      });
    }
  } catch (error) {
    logger.error('Error saving video notes:', error);
    return res.status(500).json({
      error: 'Failed to save notes',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get notes for a specific video
router.get('/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    const notes = await VideoNotes.findOne({ videoId, userId });

    if (!notes) {
      return res.status(404).json({
        error: 'No notes found for this video'
      });
    }

    return res.json({
      success: true,
      data: notes
    });
  } catch (error) {
    logger.error('Error fetching video notes:', error);
    return res.status(500).json({
      error: 'Failed to fetch notes',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all notes for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, search } = req.query;

    const query = { userId };
    
    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { updatedAt: -1 } // Most recently updated first
    };

    const notes = await VideoNotes.find(query)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    const total = await VideoNotes.countDocuments(query);

    return res.json({
      success: true,
      data: notes,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching all video notes:', error);
    return res.status(500).json({
      error: 'Failed to fetch notes',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete notes for a specific video
router.delete('/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    const deletedNotes = await VideoNotes.findOneAndDelete({ videoId, userId });

    if (!deletedNotes) {
      return res.status(404).json({
        error: 'No notes found for this video'
      });
    }

    logger.info(`Deleted video notes for videoId: ${videoId}`);

    return res.json({
      success: true,
      message: 'Notes deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting video notes:', error);
    return res.status(500).json({
      error: 'Failed to delete notes',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;