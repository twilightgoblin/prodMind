import express from 'express';
import fetch from 'node-fetch';
import Content from '../models/Content.js';
import aiService from '../services/aiService.js';

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
export async function youtubeSearch(req, res) {
  try {
    const { query, maxResults = 10, order = 'relevance', publishedAfter, duration } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(500).json({ error: 'YouTube API key not configured' });
    }

    let searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&q=${encodeURIComponent(query)}&` +
      `type=video&maxResults=${maxResults}&` +
      `order=${order}&` +
      `regionCode=US&relevanceLanguage=en&` +
      `key=${process.env.YOUTUBE_API_KEY}`;

    if (publishedAfter) {
      searchUrl += `&publishedAfter=${publishedAfter}`;
    }
    if (duration) {
      searchUrl += `&videoDuration=${duration}`;
    }

    const response = await fetch(searchUrl);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`YouTube API error: ${errorData.error?.message || 'Request failed'}`);
    }

    const data = await response.json();
    const videoIds = data.items?.map(item => item.id.videoId).join(',');
    
    // Get additional video details (duration, view count, etc.)
    let detailedContent = [];
    if (videoIds) {
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?` +
        `part=contentDetails,statistics&id=${videoIds}&` +
        `key=${process.env.YOUTUBE_API_KEY}`
      );

      const detailsData = await detailsResponse.json();
      const videoDetails = {};
      
      detailsData.items?.forEach(item => {
        videoDetails[item.id] = {
          duration: item.contentDetails.duration,
          viewCount: item.statistics.viewCount,
          likeCount: item.statistics.likeCount,
          commentCount: item.statistics.commentCount
        };
      });

      detailedContent = data.items?.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        source: 'youtube',
        type: 'video',
        duration: videoDetails[item.id.videoId]?.duration || null,
        viewCount: videoDetails[item.id.videoId]?.viewCount || 0,
        likeCount: videoDetails[item.id.videoId]?.likeCount || 0,
        commentCount: videoDetails[item.id.videoId]?.commentCount || 0
      })) || [];
    }

    res.json({ content: detailedContent });
  } catch (error) {
    console.error('YouTube search error:', error);
    res.status(500).json({ error: error.message });
  }
}
router.post('/youtube/search', youtubeSearch);

// Get YouTube channel content
export async function youtubeChannel(req, res) {
  try {
    const { channelId, maxResults = 10 } = req.body;
    
    if (!channelId) {
      return res.status(400).json({ error: 'Channel ID is required' });
    }

    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(500).json({ error: 'YouTube API key not configured' });
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&channelId=${channelId}&` +
      `type=video&maxResults=${maxResults}&` +
      `order=date&` +
      `key=${process.env.YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`YouTube API error: ${errorData.error?.message || 'Request failed'}`);
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
    console.error('YouTube channel error:', error);
    res.status(500).json({ error: error.message });
  }
}
router.post('/youtube/channel', youtubeChannel);

// Get trending YouTube content
export async function youtubeTrending(req, res) {
  try {
    const { maxResults = 10, categoryId = '0' } = req.query;

    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(500).json({ error: 'YouTube API key not configured' });
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?` +
      `part=snippet,contentDetails,statistics&` +
      `chart=mostPopular&maxResults=${maxResults}&` +
      `regionCode=US&videoCategoryId=${categoryId}&` +
      `key=${process.env.YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`YouTube API error: ${errorData.error?.message || 'Request failed'}`);
    }

    const data = await response.json();
    const formattedContent = data.items?.map(item => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id}`,
      source: 'youtube',
      type: 'video',
      duration: item.contentDetails.duration,
      viewCount: item.statistics.viewCount,
      likeCount: item.statistics.likeCount,
      commentCount: item.statistics.commentCount
    })) || [];

    res.json({ content: formattedContent });
  } catch (error) {
    console.error('YouTube trending error:', error);
    res.status(500).json({ error: error.message });
  }
}
router.get('/youtube/trending', youtubeTrending);

// Analyze content with AI
router.post('/analyze', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.title) {
      return res.status(400).json({ error: 'Content with title is required' });
    }

    const analysis = await aiService.analyzeContent(content);
    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Intelligent content curation - combines YouTube search with AI analysis
router.post('/curate', async (req, res) => {
  try {
    const { 
      topics = ['programming', 'productivity'], 
      maxResults = 20, 
      minPriority = 6,
      difficulty = 'all',
      duration = 'any'
    } = req.body;

    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(500).json({ error: 'YouTube API key not configured' });
    }

    const allContent = [];
    
    // Search for content on each topic with enhanced queries
    for (const topic of topics) {
      try {
        // Create more specific search queries based on topic
        let searchQuery = topic;
        if (topic === 'programming' || topic === 'coding') {
          searchQuery = `${topic} tutorial beginner guide`;
        } else if (topic === 'productivity') {
          searchQuery = `${topic} tips workflow efficiency`;
        } else if (topic === 'ai' || topic === 'artificial intelligence') {
          searchQuery = `${topic} machine learning tutorial`;
        } else {
          searchQuery = `${topic} tutorial complete guide`;
        }

        let searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
          `part=snippet&q=${encodeURIComponent(searchQuery)}&` +
          `type=video&maxResults=${Math.ceil(maxResults / topics.length)}&` +
          `order=relevance&regionCode=US&relevanceLanguage=en&` +
          `key=${process.env.YOUTUBE_API_KEY}`;

        if (duration !== 'any') {
          searchUrl += `&videoDuration=${duration}`;
        }

        const response = await fetch(searchUrl);
        
        if (response.ok) {
          const data = await response.json();
          const videoIds = data.items?.map(item => item.id.videoId).join(',');
          
          // Get additional video details (duration, view count, etc.)
          let topicContent = [];
          if (videoIds) {
            const detailsResponse = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?` +
              `part=contentDetails,statistics&id=${videoIds}&` +
              `key=${process.env.YOUTUBE_API_KEY}`
            );

            const detailsData = await detailsResponse.json();
            const videoDetails = {};
            
            detailsData.items?.forEach(item => {
              videoDetails[item.id] = {
                duration: item.contentDetails.duration,
                viewCount: item.statistics.viewCount,
                likeCount: item.statistics.likeCount,
                commentCount: item.statistics.commentCount
              };
            });

            topicContent = data.items?.map(item => ({
              id: item.id.videoId,
              title: item.snippet.title,
              description: item.snippet.description,
              thumbnail: item.snippet.thumbnails.medium.url,
              channelTitle: item.snippet.channelTitle,
              publishedAt: item.snippet.publishedAt,
              url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              source: 'youtube',
              type: 'video',
              searchTopic: topic,
              duration: videoDetails[item.id.videoId]?.duration || null,
              viewCount: videoDetails[item.id.videoId]?.viewCount || 0,
              likeCount: videoDetails[item.id.videoId]?.likeCount || 0,
              commentCount: videoDetails[item.id.videoId]?.commentCount || 0
            })) || [];
          }
          
          allContent.push(...topicContent);
        }
      } catch (error) {
        console.warn(`Failed to fetch content for topic: ${topic}`, error.message);
      }
    }

    // Analyze each piece of content with AI
    const analyzedContent = [];
    for (const content of allContent) {
      try {
        const analysis = await aiService.analyzeContent(content);
        const enrichedContent = {
          ...content,
          ...analysis,
          curatedAt: new Date().toISOString()
        };
        
        // Filter by criteria
        if (enrichedContent.priority >= minPriority) {
          if (difficulty === 'all' || enrichedContent.difficulty === difficulty) {
            analyzedContent.push(enrichedContent);
          }
        }
      } catch (error) {
        console.warn(`Failed to analyze content: ${content.title}`, error.message);
      }
    }

    // Sort by priority and remove duplicates
    const uniqueContent = analyzedContent
      .filter((content, index, self) => 
        index === self.findIndex(c => c.id === content.id)
      )
      .sort((a, b) => b.priority - a.priority)
      .slice(0, maxResults);

    res.json({ 
      content: uniqueContent,
      metadata: {
        totalFound: allContent.length,
        totalAnalyzed: analyzedContent.length,
        totalReturned: uniqueContent.length,
        topics,
        criteria: { minPriority, difficulty, duration }
      }
    });
  } catch (error) {
    console.error('Content curation error:', error);
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