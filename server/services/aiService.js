import fetch from 'node-fetch';

class AIService {
  constructor() {
    this.providers = [
      { name: 'huggingface', priority: 1 },
      { name: 'openai', priority: 2 },
      { name: 'fallback', priority: 3 }
    ];
  }

  async generateText(prompt, options = {}) {
    const { maxTokens = 400, temperature = 0.7 } = options;

    // Skip external AI providers for now and use fallback directly
    // This ensures the content curation works reliably
    return this.generateFallbackResponse(prompt);

    // Uncomment below to try external providers first
    /*
    for (const provider of this.providers) {
      try {
        switch (provider.name) {
          case 'huggingface':
            return await this.callHuggingFace(prompt, { maxTokens, temperature });
          case 'openai':
            return await this.callOpenAI(prompt, { maxTokens, temperature });
          case 'fallback':
            return this.generateFallbackResponse(prompt);
        }
      } catch (error) {
        console.log(`${provider.name} failed:`, error.message);
        continue;
      }
    }

    throw new Error('All AI providers failed');
    */
  }

  async callHuggingFace(prompt, options) {
    if (!process.env.HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY === 'your_huggingface_api_key_here') {
      throw new Error('Hugging Face API key not configured');
    }

    // Using reliable models that are available on HF inference API
    const models = [
      'google/flan-t5-base',
      'facebook/bart-large-cnn',
      'microsoft/DialoGPT-medium'
    ];

    for (const model of models) {
      try {
        // Adjust request based on model type
        let requestBody;
        if (model.includes('bart')) {
          // BART is for summarization
          requestBody = {
            inputs: prompt,
            parameters: {
              max_length: Math.min(options.maxTokens, 142), // BART has limits
              min_length: 30
            }
          };
        } else if (model.includes('flan-t5')) {
          // T5 is for text-to-text generation
          requestBody = {
            inputs: prompt,
            parameters: {
              max_length: options.maxTokens,
              temperature: options.temperature
            }
          };
        } else {
          // Default for dialog models
          requestBody = {
            inputs: prompt,
            parameters: {
              max_length: options.maxTokens,
              temperature: options.temperature,
              do_sample: true
            }
          };
        }

        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        // Handle different response formats based on model type
        let text = '';
        if (model.includes('bart') && Array.isArray(data) && data[0]?.summary_text) {
          // BART returns summary_text
          text = data[0].summary_text;
        } else if (Array.isArray(data) && data[0]?.generated_text) {
          // Most models return generated_text
          text = data[0].generated_text;
        } else if (data.generated_text) {
          text = data.generated_text;
        } else if (data.summary_text) {
          text = data.summary_text;
        } else {
          throw new Error(`Unexpected response format: ${JSON.stringify(data)}`);
        }

        // For dialog models, remove the input prompt from response
        if (!model.includes('bart') && !model.includes('flan-t5')) {
          text = text.replace(prompt, '').trim();
        }
        
        return text.trim();
      } catch (error) {
        console.log(`Model ${model} failed:`, error.message);
        continue;
      }
    }

    throw new Error('All Hugging Face models failed');
  }

  async callOpenAI(prompt, options) {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_new_openai_api_key_here') {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options.maxTokens,
        temperature: options.temperature
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  generateFallbackResponse(prompt) {
    // Simple pattern matching for common requests
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('analyze') && lowerPrompt.includes('content')) {
      return `{
  "summary": "This content appears to be educational and informative, covering relevant topics for learning and development.",
  "tags": ["learning", "educational", "content", "tutorial"],
  "priority": 7,
  "difficulty": "intermediate"
}`;
    }

    if (lowerPrompt.includes('summary') || lowerPrompt.includes('summarize')) {
      return "This content provides valuable information and insights that can be applied practically. It covers important concepts and offers learning opportunities for viewers interested in the topic.";
    }

    return "This content appears to be informative and educational, suitable for learning and skill development.";
  }

  // Specific method for content analysis
  async analyzeContent(content) {
    const prompt = `Analyze this content and provide a JSON response:
{
  "summary": "A concise 2-3 sentence summary",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "priority": 8,
  "difficulty": "beginner|intermediate|advanced"
}

Title: ${content.title}
Description: ${content.description || ''}
Channel: ${content.channelTitle || ''}

Please analyze the content and respond with valid JSON only.`;

    try {
      const response = await this.generateText(prompt, { maxTokens: 300, temperature: 0.3 });
      
      // Try to parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if JSON parsing fails
      return this.generateFallbackAnalysis(content);
    } catch (error) {
      console.log('AI analysis failed, using fallback:', error.message);
      return this.generateFallbackAnalysis(content);
    }
  }

  generateFallbackAnalysis(content) {
    const title = content.title.toLowerCase();
    const description = (content.description || '').toLowerCase();
    const text = `${title} ${description}`;
    
    // Enhanced keyword-based analysis
    const tags = [];
    const keywords = {
      'javascript': ['javascript', 'js', 'node', 'react', 'vue', 'angular', 'typescript', 'nextjs', 'express'],
      'python': ['python', 'django', 'flask', 'pandas', 'numpy', 'tensorflow', 'pytorch'],
      'tutorial': ['tutorial', 'learn', 'guide', 'how to', 'beginner', 'course', 'lesson'],
      'advanced': ['advanced', 'expert', 'master', 'deep dive', 'professional'],
      'web': ['web', 'html', 'css', 'frontend', 'backend', 'fullstack', 'responsive'],
      'programming': ['programming', 'coding', 'development', 'software', 'algorithm', 'data structure'],
      'data': ['data', 'analytics', 'science', 'machine learning', 'ai', 'artificial intelligence'],
      'design': ['design', 'ui', 'ux', 'interface', 'figma', 'adobe'],
      'productivity': ['productivity', 'efficient', 'workflow', 'automation', 'tips', 'tricks'],
      'career': ['career', 'job', 'interview', 'resume', 'freelance', 'business'],
      'mobile': ['mobile', 'ios', 'android', 'react native', 'flutter', 'swift', 'kotlin'],
      'database': ['database', 'sql', 'mongodb', 'postgresql', 'mysql', 'nosql']
    };
    
    for (const [tag, words] of Object.entries(keywords)) {
      if (words.some(word => text.includes(word))) {
        tags.push(tag);
      }
    }
    
    // Add topic-based tags from search context
    if (content.searchTopic) {
      tags.push(content.searchTopic);
    }
    
    // Determine difficulty
    let difficulty = 'intermediate';
    if (text.includes('beginner') || text.includes('intro') || text.includes('basics') || text.includes('start')) {
      difficulty = 'beginner';
    } else if (text.includes('advanced') || text.includes('expert') || text.includes('master') || text.includes('pro')) {
      difficulty = 'advanced';
    }
    
    // Generate priority based on content characteristics
    let priority = 6; // Base priority
    
    // Boost for educational content
    if (tags.includes('tutorial')) priority += 2;
    if (text.includes('complete') || text.includes('full course')) priority += 1;
    
    // Boost for popular programming languages/frameworks
    if (tags.includes('javascript') || tags.includes('python') || tags.includes('react')) priority += 1;
    
    // Boost for beginner-friendly content
    if (difficulty === 'beginner') priority += 1;
    
    // Boost for productivity content
    if (tags.includes('productivity')) priority += 1;
    
    // Consider video metrics if available
    if (content.viewCount) {
      const views = parseInt(content.viewCount);
      if (views > 100000) priority += 1;
      if (views > 1000000) priority += 1;
    }
    
    // Consider engagement metrics
    if (content.likeCount && content.viewCount) {
      const likeRatio = parseInt(content.likeCount) / parseInt(content.viewCount);
      if (likeRatio > 0.01) priority += 1; // Good engagement
    }
    
    // Consider video duration for learning content
    if (content.duration) {
      const match = content.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (match) {
        const hours = parseInt(match[1]) || 0;
        const minutes = parseInt(match[2]) || 0;
        const totalMinutes = hours * 60 + minutes;
        
        // Boost for comprehensive content (10-60 minutes)
        if (totalMinutes >= 10 && totalMinutes <= 60) {
          priority += 1;
        }
        // Slight boost for longer comprehensive courses
        if (totalMinutes > 60) {
          priority += 0.5;
        }
      }
    }
    
    // Ensure tags are unique and limit to 5
    const uniqueTags = [...new Set(tags)].slice(0, 5);
    if (uniqueTags.length === 0) {
      uniqueTags.push('learning', 'educational');
    }
    
    // Generate a more descriptive summary
    let summary = `This ${difficulty} level content`;
    if (uniqueTags.length > 0) {
      summary += ` focuses on ${uniqueTags.slice(0, 3).join(', ')}`;
    }
    if (content.channelTitle) {
      summary += ` from ${content.channelTitle}`;
    }
    
    // Add duration info if available
    if (content.duration) {
      const match = content.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (match) {
        const hours = parseInt(match[1]) || 0;
        const minutes = parseInt(match[2]) || 0;
        const totalMinutes = hours * 60 + minutes;
        
        if (totalMinutes > 60) {
          summary += `. This comprehensive ${Math.floor(totalMinutes / 60)}+ hour course`;
        } else if (totalMinutes > 20) {
          summary += `. This detailed ${totalMinutes}-minute tutorial`;
        } else if (totalMinutes > 5) {
          summary += `. This concise ${totalMinutes}-minute guide`;
        } else {
          summary += `. This quick overview`;
        }
      }
    }
    
    summary += ' is great for expanding your knowledge and skills in this area.';
    
    return {
      summary,
      tags: uniqueTags,
      priority: Math.min(Math.max(priority, 1), 10),
      difficulty
    };
  }
}

export default new AIService();