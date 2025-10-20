// Content Intelligence Service
// Handles fetching and analyzing content from various sources

class ContentService {
  constructor() {
    this.apiKeys = {
      youtube: import.meta.env.VITE_YOUTUBE_API_KEY,
      openai: import.meta.env.VITE_OPENAI_API_KEY
    };
    
    // Debug: Check if API keys are loaded
    console.log('Content - YouTube API Key loaded:', this.apiKeys.youtube ? 'Yes' : 'No');
    console.log('Content - OpenAI API Key loaded:', this.apiKeys.openai ? 'Yes' : 'No');
  }

  // Fetch YouTube videos based on search query or channel
  async fetchYouTubeContent(query, maxResults = 10) {
    if (!this.apiKeys.youtube) {
      console.warn('YouTube API key not configured');
      return [];
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet&q=${encodeURIComponent(query)}&` +
        `type=video&maxResults=${maxResults}&` +
        `regionCode=IN&relevanceLanguage=en&` +
        `key=${this.apiKeys.youtube}`
      );

      if (!response.ok) throw new Error('YouTube API request failed');
      
      const data = await response.json();
      return this.formatYouTubeData(data.items || []);
    } catch (error) {
      console.error('Error fetching YouTube content:', error);
      return [];
    }
  }

  // Format YouTube API response
  formatYouTubeData(items) {
    return items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      source: 'youtube',
      type: 'video',
      duration: null, // Would need additional API call
      tags: [],
      summary: null,
      priority: 0
    }));
  }

  // Analyze content using AI (summarization, tagging, priority scoring)
  async analyzeContent(content) {
    if (!this.apiKeys.openai || this.apiKeys.openai.includes('your_openai_api_key')) {
      console.warn('OpenAI API key not configured');
      return {
        summary: 'AI analysis not available - OpenAI API key not configured',
        tags: ['content'],
        priority: 5,
        difficulty: 'unknown'
      };
    }

    try {
      const prompt = `Analyze this YouTube video content and provide a JSON response with the following structure:
{
  "summary": "A concise 2-3 sentence summary of the content",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "priority": 8,
  "difficulty": "beginner|intermediate|advanced"
}

Video Title: ${content.title}
Video Description: ${content.description}
Channel: ${content.channelTitle}

Base the priority score (1-10) on educational value, relevance, and quality indicators. Use relevant, specific tags.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeys.openai}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 400,
          temperature: 0.3
        })
      });

      if (!response.ok) throw new Error('OpenAI API request failed');
      
      const data = await response.json();
      return this.parseAnalysis(data.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing content:', error);
      return {
        summary: 'Analysis failed - please try again',
        tags: ['content'],
        priority: 5,
        difficulty: 'unknown'
      };
    }
  }

  // Parse AI analysis response
  parseAnalysis(analysisText) {
    try {
      // Try to parse as JSON first
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || 'No summary available',
          tags: Array.isArray(parsed.tags) ? parsed.tags : ['content'],
          priority: typeof parsed.priority === 'number' ? Math.max(1, Math.min(10, parsed.priority)) : 5,
          difficulty: ['beginner', 'intermediate', 'advanced'].includes(parsed.difficulty) ? parsed.difficulty : 'intermediate'
        };
      }
    } catch (error) {
      console.warn('Failed to parse JSON response, falling back to text parsing');
    }

    // Fallback to text parsing
    const lines = analysisText.split('\n').filter(line => line.trim());
    
    const summaryLine = lines.find(line => line.toLowerCase().includes('summary'));
    const tagsLine = lines.find(line => line.toLowerCase().includes('tags'));
    const priorityLine = lines.find(line => line.toLowerCase().includes('priority'));
    const difficultyLine = lines.find(line => line.toLowerCase().includes('difficulty'));

    return {
      summary: summaryLine ? summaryLine.split(':')[1]?.trim() || 'No summary available' : 'No summary available',
      tags: tagsLine ? tagsLine.split(':')[1]?.trim().split(',').map(tag => tag.trim()) || ['content'] : ['content'],
      priority: priorityLine ? parseInt(priorityLine.match(/\d+/)?.[0]) || 5 : 5,
      difficulty: difficultyLine ? difficultyLine.toLowerCase().includes('beginner') ? 'beginner' : 
                  difficultyLine.toLowerCase().includes('advanced') ? 'advanced' : 'intermediate' : 'intermediate'
    };
  }





  // Curate content based on user preferences and learning goals
  async curateContent(userPreferences = {}) {
    const { topics = ['productivity', 'learning'], maxItems = 10 } = userPreferences;
    
    const allContent = [];
    
    // Fetch content for each topic
    for (const topic of topics) {
      const content = await this.fetchYouTubeContent(topic, 5);
      allContent.push(...content);
    }

    // Analyze each piece of content
    const analyzedContent = await Promise.all(
      allContent.map(async (item) => {
        const analysis = await this.analyzeContent(item);
        return { ...item, ...analysis };
      })
    );

    // Sort by priority and return top items
    return analyzedContent
      .sort((a, b) => b.priority - a.priority)
      .slice(0, maxItems);
  }
}

export default new ContentService();