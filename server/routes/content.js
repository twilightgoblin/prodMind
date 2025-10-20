import express from 'express';
import fetch from 'node-fetch';
import Content from '../models/Content.js';

const router = express.Router();

// Get all content
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, tags, priority } = req.query;
    const userId = req.headers['x-user-id'] || 'default';

    const filter = { userId };
    if (status) filter.status = status;
    if (tags) filter.tags = { $in: tags.split(',') };
    if (priority) filter.priority = { $gte: parseInt(priority) };

    const content = await Content.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Content.countDocuments(filter);

    res.json({
      content,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search YouTube content
router.post('/youtube/search', async (req, res) => {
  try {
    const { query, maxResults = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&q=${encodeURIComponent(query)}&` +
      `type=video&maxResults=${maxResults}&` +
      `regionCode=IN&relevanceLanguage=en&` +
      `key=${process.env.YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data = await response.json();
    const formattedContent = data.items?.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      source: 'youtube',
      type: 'video'
    })) || [];

    res.json({ content: formattedContent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analyze content with AI
router.post('/analyze', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.title) {
      return res.status(400).json({ error: 'Content with title is required' });
    }

    const prompt = `Analyze this content and provide a JSON response:
{
  "summary": "A concise 2-3 sentence summary",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "priority": 8,
  "difficulty": "beginner|intermediate|advanced"
}

Title: ${content.title}
Description: ${content.description || ''}
Channel: ${content.channelTitle || ''}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    // Parse JSON response
    let analysis;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      analysis = {
        summary: 'Analysis failed - please try again',
        tags: ['content'],
        priority: 5,
        difficulty: 'intermediate'
      };
    }

    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save content
router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default';
    const contentData = { ...req.body, userId };

    const content = new Content(contentData);
    await content.save();

    res.status(201).json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update content
router.put('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default';
    const content = await Content.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete content
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default';
    const content = await Content.findOneAndDelete({ _id: req.params.id, userId });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;