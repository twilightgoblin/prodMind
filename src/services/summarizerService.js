// Active Summarizer Service
// Transforms content into actionable learning notes with AI insights

class SummarizerService {
  constructor() {
    this.apiKeys = {
      openai: import.meta.env.VITE_OPENAI_API_KEY,
      assemblyai: import.meta.env.VITE_ASSEMBLYAI_API_KEY, // For audio transcription
    };
    this.summaryModes = ['tldr', 'insight', 'detailed'];
    
    // Debug: Check if API keys are loaded
    const hasOpenAI = this.apiKeys.openai && 
                     !this.apiKeys.openai.includes('your_openai_api_key') && 
                     this.apiKeys.openai.startsWith('sk-') &&
                     this.apiKeys.openai.length > 20;
    
    console.log('OpenAI API Key configured:', hasOpenAI ? 'Yes' : 'No');
    
    if (!hasOpenAI) {
      console.info('💡 For AI-powered summaries, configure your OpenAI API key in your .env file. See .env.example for details.');
    }
  }

  // Main summarization function
  async summarizeContent(content, mode = 'insight', customPrompt = null) {
    try {
      let textContent = '';
      
      // Extract text based on content type
      if (content.type === 'custom') {
        // For custom topics, we'll generate educational content
        textContent = await this.generateCustomTopicContent(content);
      } else if (content.type === 'video' && content.url) {
        textContent = await this.extractVideoContent(content);
      } else if (content.type === 'audio') {
        textContent = await this.transcribeAudio(content);
      } else if (content.type === 'article' || content.description) {
        textContent = content.description || content.content || '';
      } else {
        textContent = `${content.title}\n${content.description || ''}`;
      }

      if (!textContent.trim()) {
        throw new Error('No content to summarize');
      }

      // Generate AI summary
      const summary = await this.generateAISummary(textContent, content, mode, customPrompt);
      
      // Save summary for future reference
      this.saveSummary(content.id, summary);
      
      return summary;
    } catch (error) {
      console.error('Error summarizing content:', error);
      throw error;
    }
  }

  // Generate content for custom topics
  async generateCustomTopicContent(content) {
    const topic = content.title;
    const context = content.description || '';
    
    return `Topic: ${topic}

Context: ${context}

This is a request to learn about ${topic}. The user wants to understand:
- Core concepts and fundamentals
- Practical applications and real-world examples  
- Key principles and best practices
- Common challenges and how to overcome them
- Step-by-step guidance for getting started
- Advanced concepts for deeper understanding

The explanation should be comprehensive, educational, and actionable, suitable for someone looking to gain practical knowledge about ${topic}.`;
  }

  // Extract content from video (mock implementation - would use YouTube transcript API)
  async extractVideoContent(content) {
    // In production, this would:
    // 1. Use YouTube Data API to get video transcript
    // 2. Or use speech-to-text on audio track
    // 3. Or scrape video description and comments
    
    return `Video: ${content.title}
    
Description: ${content.description || 'No description available'}

Key topics likely covered:
- Main concepts related to ${content.title.toLowerCase()}
- Practical applications and examples
- Step-by-step explanations
- Common challenges and solutions

This is a ${content.difficulty || 'intermediate'} level content focusing on ${content.tags?.join(', ') || 'general learning'}.`;
  }

  // Transcribe audio content
  async transcribeAudio(content) {
    if (!this.apiKeys.assemblyai) {
      return `Audio content: ${content.title}\nTranscription not available - API key not configured.`;
    }

    // Mock implementation - would use AssemblyAI or similar
    return `Transcribed audio from: ${content.title}
    
This audio content covers various topics related to ${content.tags?.join(', ') || 'learning and productivity'}.
The speaker discusses key concepts, provides examples, and shares insights based on their experience.`;
  }

  // Generate AI-powered summary
  async generateAISummary(textContent, originalContent, mode, customPrompt) {
    const prompt = customPrompt || this.buildSummaryPrompt(textContent, originalContent, mode);

    // Try OpenAI if available and properly configured
    if (this.apiKeys.openai && 
        !this.apiKeys.openai.includes('your_openai_api_key') && 
        this.apiKeys.openai.startsWith('sk-') &&
        this.apiKeys.openai.length > 20) {
      try {
        return await this.generateOpenAISummary(textContent, originalContent, mode, prompt);
      } catch (error) {
        console.warn('OpenAI failed, using rule-based fallback:', error.message);
        // Fall back to rule-based summary
        return await this.generateFallbackSummary(textContent, originalContent, mode);
      }
    }

    // No OpenAI key configured, use rule-based fallback
    console.info('Using rule-based summary generation. Configure OpenAI API key for AI-powered summaries.');
    return await this.generateFallbackSummary(textContent, originalContent, mode);
  }

  // OpenAI summary generation
  async generateOpenAISummary(textContent, originalContent, mode, prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKeys.openai}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.getMaxTokens(mode),
        temperature: 0.7
      })
    });

    if (!response.ok) {
      let errorMessage = `OpenAI API request failed (${response.status})`;
      
      try {
        const errorData = await response.json();
        if (errorData.error?.code === 'insufficient_quota') {
          errorMessage = 'OpenAI quota exceeded. Please check your billing at https://platform.openai.com/account/billing';
        } else if (errorData.error?.code === 'invalid_api_key') {
          errorMessage = 'Invalid OpenAI API key. Please check your configuration.';
        } else if (response.status === 429) {
          errorMessage = 'OpenAI rate limit exceeded. Please try again in a moment.';
        } else if (response.status === 401) {
          errorMessage = 'OpenAI authentication failed. Please check your API key.';
        } else {
          errorMessage = errorData.error?.message || errorMessage;
        }
      } catch (parseError) {
        // If we can't parse the error response, use the status-based message
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    return this.parseSummaryResponse(aiResponse, originalContent, mode);
  }





  // Fallback summary generation (rule-based)
  async generateFallbackSummary(textContent, originalContent, mode) {
    const title = originalContent.title || 'Content';
    const description = originalContent.description || '';
    const tags = originalContent.tags?.join(', ') || 'learning';
    const isCustomTopic = originalContent.type === 'custom';
    
    // For custom topics, generate educational content
    if (isCustomTopic) {
      return this.generateEducationalFallback(title, description, mode, originalContent);
    }
    
    // Extract key sentences (simple approach)
    const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const keySentences = sentences.slice(0, 3).map(s => s.trim()).join('. ');

    let summary = '';
    
    switch (mode) {
      case 'tldr':
        summary = `**What is ${title}?**
${title} is a topic in ${tags} that focuses on practical applications and core concepts. ${keySentences || description}

**Why it matters:**
• Essential knowledge for ${tags}
• Practical applications in real-world scenarios
• Foundation for advanced learning

**How to start:** Begin with understanding the basic concepts
**Quick wins:** Apply one concept immediately to see results
**Difficulty:** ${originalContent.difficulty || 'Intermediate'} - suitable for focused learning`;
        break;

      case 'insight':
        summary = `**Understanding ${title}:**
${title} is an important concept in ${tags}. ${keySentences || description}

**Key Concepts Explained:**
• **Core Principle**: The fundamental idea behind ${title}
• **Practical Application**: How this applies in real situations
• **Mental Model**: Think of it as a framework for ${tags}
• **Common Use Cases**: Where you'll encounter this most often

**Why This Matters:**
This knowledge helps you understand ${tags} more deeply and provides practical tools for implementation.

**Getting Started:**
1. Learn the basic definitions and concepts
2. Find simple examples to practice with
3. Apply to a small project or scenario
4. Build complexity gradually

**Next Level:** Explore advanced applications and connect with related topics in ${tags}
**Time Investment:** 30-60 minutes for solid understanding`;
        break;

      case 'detailed':
        summary = `**Comprehensive Guide to ${title}:**

**What You'll Learn:**
${title} is a comprehensive topic within ${tags} that encompasses both theoretical understanding and practical application. ${keySentences || description}

**Fundamental Concepts:**
• **Definition**: Clear explanation of what ${title} means
• **Core Principles**: The underlying rules and frameworks
• **Key Components**: Breaking down the main elements
• **Relationships**: How this connects to other concepts in ${tags}

**Practical Framework:**
1. **Foundation Building**: Start with basic concepts and terminology
2. **Skill Development**: Practice with simple examples and exercises
3. **Application**: Use in real-world scenarios and projects
4. **Mastery**: Develop advanced understanding and teach others

**Real-World Applications:**
• Professional settings where this knowledge is valuable
• Personal projects that benefit from this understanding
• Problem-solving scenarios where this applies
• Creative applications and innovations

**Learning Path:**
• **Beginner**: Focus on definitions and basic examples
• **Intermediate**: Practice application and explore variations
• **Advanced**: Master complex scenarios and teach others

**Tools and Resources:**
• Books and articles on ${tags}
• Online courses and tutorials
• Practice platforms and communities
• Real-world projects to apply knowledge

**Success Indicators:**
• Can explain the concept clearly to others
• Successfully apply in practical situations
• Recognize when and how to use this knowledge
• Connect with related concepts confidently`;
        break;

      default:
        summary = `${title} is an important topic in ${tags} that provides practical value and learning opportunities. ${keySentences || description}`;
    }

    return this.parseSummaryResponse(summary, originalContent, mode);
  }

  // Generate educational content for custom topics
  generateEducationalFallback(topic, context, mode, originalContent) {
    const contextInfo = context ? `\n\nContext: ${context}` : '';
    
    let summary = '';
    
    switch (mode) {
      case 'tldr':
        summary = `**What is ${topic}?**
${topic} is an important subject that offers practical knowledge and skills.${contextInfo}

**Why it matters:**
• Provides valuable skills and understanding
• Has practical applications in various scenarios
• Forms foundation for further learning

**How to start:** Begin with basic concepts and definitions
**Quick wins:** Learn one key principle and apply it immediately
**Difficulty:** Beginner to Intermediate - accessible with focused effort`;
        break;

      case 'insight':
        summary = `**Understanding ${topic}:**
${topic} is a valuable area of knowledge that combines theoretical understanding with practical application.${contextInfo}

**Key Concepts to Learn:**
• **Fundamentals**: Core principles and basic definitions
• **Applications**: How this knowledge is used in practice
• **Benefits**: Why learning this topic is valuable
• **Connections**: How it relates to other areas of knowledge

**Why This Matters:**
Learning about ${topic} provides you with practical skills and deeper understanding that can be applied in various contexts.

**Getting Started Guide:**
1. Start with basic definitions and concepts
2. Look for simple examples and case studies
3. Practice with small exercises or projects
4. Gradually build to more complex applications

**Next Steps:** Explore advanced topics and find communities of practice
**Time Investment:** 45-90 minutes for solid foundational understanding`;
        break;

      case 'detailed':
        summary = `**Complete Learning Guide: ${topic}**

**Introduction:**
${topic} is a comprehensive subject that offers both theoretical insights and practical applications.${contextInfo}

**What You'll Master:**
• **Core Knowledge**: Fundamental concepts and principles
• **Practical Skills**: How to apply this knowledge effectively
• **Problem-Solving**: Using these concepts to solve real challenges
• **Advanced Understanding**: Deeper insights and connections

**Learning Framework:**
1. **Foundation Phase**
   - Learn key terminology and definitions
   - Understand basic principles and concepts
   - Study simple examples and case studies

2. **Application Phase**
   - Practice with hands-on exercises
   - Apply knowledge to real scenarios
   - Experiment with different approaches

3. **Mastery Phase**
   - Tackle complex challenges and projects
   - Develop your own insights and methods
   - Share knowledge and teach others

**Practical Applications:**
• Professional development and career advancement
• Personal projects and creative endeavors
• Problem-solving in various contexts
• Building expertise in related areas

**Learning Resources:**
• **Books**: Look for comprehensive guides and textbooks
• **Online Courses**: Structured learning with exercises
• **Communities**: Forums and groups for discussion
• **Practice**: Real-world projects and applications

**Success Milestones:**
• Can explain key concepts clearly
• Successfully apply knowledge in practice
• Solve problems using these principles
• Help others learn and understand the topic

**Advanced Exploration:**
Once you master the basics, explore specialized areas, advanced techniques, and connections to other fields of knowledge.`;
        break;

      default:
        summary = `${topic} is an important area of learning that provides practical knowledge and skills.${contextInfo}`;
    }

    return this.parseSummaryResponse(summary, originalContent, mode);
  }

  // Build summary prompt based on mode
  buildSummaryPrompt(textContent, originalContent, mode) {
    const isCustomTopic = originalContent.type === 'custom';
    const topic = originalContent.title;
    
    const basePrompt = isCustomTopic 
      ? `You are an expert educator. Create a comprehensive, explanatory ${mode} summary about "${topic}". 
      
User Context: ${originalContent.description || 'General learning interest'}

Your task is to EXPLAIN and TEACH about this topic, not just summarize existing content. Provide:`
      : `Analyze this content and create an explanatory ${mode} summary:

Content: ${textContent}

Focus on explaining concepts clearly and providing educational value. Please provide:`;

    switch (mode) {
      case 'tldr':
        return `${basePrompt}

1. **What it is**: Clear definition/explanation in 1-2 sentences
2. **Why it matters**: Key benefits and importance (3 bullet points)
3. **How to start**: One concrete first step
4. **Quick wins**: 2-3 immediate applications
5. **Difficulty level**: Beginner/Intermediate/Advanced with brief reasoning

Make it educational and actionable. Explain concepts clearly for someone new to the topic.`;

      case 'insight':
        return `${basePrompt}

1. **Core Explanation**: What this topic is and why it's important (2-3 sentences)
2. **Key Concepts**: 4-5 fundamental ideas explained clearly with examples
3. **Mental Models**: Frameworks or ways of thinking about this topic
4. **Practical Applications**: Real-world uses and scenarios (with examples)
5. **Common Misconceptions**: What people often get wrong and the correct understanding
6. **Getting Started**: Step-by-step approach for beginners
7. **Next Level**: How to advance from basic to intermediate understanding
8. **Resources**: Types of materials to explore further

Focus on EXPLAINING and TEACHING. Use examples and analogies to make concepts clear.`;

      case 'detailed':
        return `${basePrompt}

1. **Comprehensive Explanation**: Thorough overview of what this topic encompasses
2. **Fundamental Concepts**: Break down core principles with detailed explanations and examples
3. **Historical Context**: How this topic developed and why it's relevant today
4. **Detailed Framework**: Step-by-step processes, methodologies, or approaches
5. **Real-World Examples**: Multiple case studies and practical applications
6. **Common Challenges**: Problems people face and detailed solutions
7. **Skill Development Path**: Progressive learning roadmap from beginner to expert
8. **Tools and Resources**: Specific recommendations for learning and implementation
9. **Advanced Concepts**: Deeper topics for continued growth
10. **Practical Exercises**: Specific activities to build understanding
11. **Success Metrics**: How to measure progress and mastery
12. **Community and Support**: Where to find help and connect with others

Be thorough, educational, and practical. Explain everything as if teaching someone who wants to truly understand and apply this knowledge.`;

      default:
        return `${basePrompt}
A balanced, educational summary that explains key concepts clearly with practical takeaways and actionable next steps.`;
    }
  }

  // Parse AI response into structured summary
  parseSummaryResponse(aiResponse, originalContent, mode) {
    const now = new Date().toISOString();
    
    return {
      id: `summary_${originalContent.id}_${Date.now()}`,
      contentId: originalContent.id,
      mode: mode,
      content: aiResponse,
      keyInsights: this.extractKeyInsights(aiResponse),
      actionableItems: this.extractActionableItems(aiResponse),
      mentalModels: this.extractMentalModels(aiResponse),
      relatedTopics: this.extractRelatedTopics(aiResponse),
      difficulty: this.assessDifficulty(aiResponse),
      timeToRead: this.estimateReadingTime(aiResponse),
      createdAt: now,
      originalContent: {
        title: originalContent.title,
        source: originalContent.source,
        url: originalContent.url
      },
      tags: this.generateSummaryTags(aiResponse, originalContent),
      rating: null,
      notes: ''
    };
  }

  // Extract key insights from AI response
  extractKeyInsights(text) {
    const insights = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.toLowerCase().includes('insight') || 
          line.toLowerCase().includes('key point') ||
          line.toLowerCase().includes('takeaway')) {
        insights.push(line.replace(/^\d+\.\s*/, '').trim());
      }
    }
    
    return insights.slice(0, 5); // Max 5 insights
  }

  // Extract actionable items
  extractActionableItems(text) {
    const actions = [];
    const actionKeywords = ['action', 'do', 'implement', 'try', 'practice', 'apply'];
    const lines = text.split('\n');
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      if (actionKeywords.some(keyword => lowerLine.includes(keyword))) {
        actions.push(line.replace(/^\d+\.\s*/, '').trim());
      }
    }
    
    return actions.slice(0, 3); // Max 3 actions
  }

  // Extract mental models mentioned
  extractMentalModels(text) {
    const models = [];
    const modelKeywords = ['model', 'framework', 'principle', 'concept', 'theory'];
    const lines = text.split('\n');
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      if (modelKeywords.some(keyword => lowerLine.includes(keyword))) {
        models.push(line.replace(/^\d+\.\s*/, '').trim());
      }
    }
    
    return models.slice(0, 3);
  }

  // Extract related topics
  extractRelatedTopics(text) {
    const topics = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.toLowerCase().includes('related') || 
          line.toLowerCase().includes('similar') ||
          line.toLowerCase().includes('explore')) {
        const matches = line.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
        if (matches) {
          topics.push(...matches);
        }
      }
    }
    
    return [...new Set(topics)].slice(0, 5);
  }

  // Assess content difficulty
  assessDifficulty(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('beginner') || lowerText.includes('basic') || lowerText.includes('introduction')) {
      return 'beginner';
    } else if (lowerText.includes('advanced') || lowerText.includes('expert') || lowerText.includes('complex')) {
      return 'advanced';
    }
    
    return 'intermediate';
  }

  // Estimate reading time
  estimateReadingTime(text) {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // Generate tags for summary
  generateSummaryTags(text, originalContent) {
    const tags = [...(originalContent.tags || [])];
    const lowerText = text.toLowerCase();
    
    // Add common learning tags based on content
    if (lowerText.includes('productivity')) tags.push('productivity');
    if (lowerText.includes('learning')) tags.push('learning');
    if (lowerText.includes('strategy')) tags.push('strategy');
    if (lowerText.includes('framework')) tags.push('framework');
    if (lowerText.includes('process')) tags.push('process');
    
    return [...new Set(tags)];
  }

  // Get max tokens based on mode
  getMaxTokens(mode) {
    switch (mode) {
      case 'tldr': return 150;
      case 'insight': return 500;
      case 'detailed': return 1000;
      default: return 300;
    }
  }



  // Save summary to localStorage
  saveSummary(contentId, summary) {
    const summaries = this.getSavedSummaries();
    summaries[contentId] = summary;
    localStorage.setItem('prodmind_summaries', JSON.stringify(summaries));
  }

  // Get all saved summaries
  getSavedSummaries() {
    const saved = localStorage.getItem('prodmind_summaries');
    return saved ? JSON.parse(saved) : {};
  }

  // Get summary for specific content
  getSummary(contentId) {
    const summaries = this.getSavedSummaries();
    return summaries[contentId] || null;
  }

  // Update summary rating and notes
  updateSummary(contentId, updates) {
    const summaries = this.getSavedSummaries();
    if (summaries[contentId]) {
      summaries[contentId] = { ...summaries[contentId], ...updates };
      localStorage.setItem('prodmind_summaries', JSON.stringify(summaries));
      return summaries[contentId];
    }
    return null;
  }

  // Get all summaries with filtering
  getAllSummaries(filters = {}) {
    const summaries = this.getSavedSummaries();
    let results = Object.values(summaries);

    if (filters.mode) {
      results = results.filter(s => s.mode === filters.mode);
    }

    if (filters.difficulty) {
      results = results.filter(s => s.difficulty === filters.difficulty);
    }

    if (filters.tags) {
      results = results.filter(s => 
        filters.tags.some(tag => s.tags.includes(tag))
      );
    }

    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

export default new SummarizerService();