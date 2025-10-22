// Active Summarizer Service
// Transforms content into actionable learning notes with AI insights

class SummarizerService {
  constructor() {
    this.apiKeys = {
      openai: import.meta.env.VITE_OPENAI_API_KEY,
      assemblyai: import.meta.env.VITE_ASSEMBLYAI_API_KEY, // For audio transcription
      huggingface: import.meta.env.VITE_HUGGINGFACE_API_KEY, // For Hugging Face models
    };
    this.summaryModes = ['tldr', 'insight', 'detailed'];
    this.huggingFaceModels = {
      summarization: 'facebook/bart-large-cnn',
      textGeneration: 'microsoft/DialoGPT-medium',
      questionAnswering: 'deepset/roberta-base-squad2'
    };
    
    // Debug: Check if API keys are loaded
    const hasOpenAI = this.apiKeys.openai && 
                     !this.apiKeys.openai.includes('your_openai_api_key') && 
                     this.apiKeys.openai.startsWith('sk-') &&
                     this.apiKeys.openai.length > 20;

    const hasHuggingFace = this.apiKeys.huggingface && 
                          !this.apiKeys.huggingface.includes('your_huggingface_api_key') && 
                          this.apiKeys.huggingface.startsWith('hf_') &&
                          this.apiKeys.huggingface.length > 20;
    
    console.log('OpenAI API Key configured:', hasOpenAI ? 'Yes' : 'No');
    console.log('Hugging Face API Key configured:', hasHuggingFace ? 'Yes' : 'No');
    
    if (!hasOpenAI && !hasHuggingFace) {
      console.info('💡 For AI-powered summaries, configure your OpenAI or Hugging Face API key in your .env file. See .env.example for details.');
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

    // Try OpenAI first if available and properly configured
    if (this.apiKeys.openai && 
        !this.apiKeys.openai.includes('your_openai_api_key') && 
        this.apiKeys.openai.startsWith('sk-') &&
        this.apiKeys.openai.length > 20) {
      try {
        return await this.generateOpenAISummary(textContent, originalContent, mode, prompt);
      } catch (error) {
        console.warn('OpenAI failed, trying Hugging Face:', error.message);
        // Try Hugging Face as fallback
        if (this.apiKeys.huggingface && 
            !this.apiKeys.huggingface.includes('your_huggingface_api_key') && 
            this.apiKeys.huggingface.startsWith('hf_')) {
          try {
            return await this.generateHuggingFaceSummary(textContent, originalContent, mode, prompt);
          } catch (hfError) {
            console.warn('Hugging Face also failed, using rule-based fallback:', hfError.message);
          }
        }
        // Fall back to rule-based summary
        return await this.generateFallbackSummary(textContent, originalContent, mode);
      }
    }

    // Try Hugging Face if OpenAI not available
    if (this.apiKeys.huggingface && 
        !this.apiKeys.huggingface.includes('your_huggingface_api_key') && 
        this.apiKeys.huggingface.startsWith('hf_')) {
      try {
        return await this.generateHuggingFaceSummary(textContent, originalContent, mode, prompt);
      } catch (error) {
        console.warn('Hugging Face failed, using rule-based fallback:', error.message);
        return await this.generateFallbackSummary(textContent, originalContent, mode);
      }
    }

    // No AI keys configured, use rule-based fallback
    console.info('Using rule-based summary generation. Configure OpenAI or Hugging Face API key for AI-powered summaries.');
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

  // Hugging Face summary generation
  async generateHuggingFaceSummary(textContent, originalContent, mode, prompt) {
    try {
      // For summarization, use BART model
      const summaryResponse = await fetch(`https://api-inference.huggingface.co/models/${this.huggingFaceModels.summarization}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeys.huggingface}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: textContent.slice(0, 1024), // BART has input limits
          parameters: {
            max_length: this.getMaxTokens(mode),
            min_length: Math.floor(this.getMaxTokens(mode) / 3),
            do_sample: false
          }
        })
      });

      if (!summaryResponse.ok) {
        let errorMessage = `Hugging Face API request failed (${summaryResponse.status})`;
        
        try {
          const errorData = await summaryResponse.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          // Use status-based message
        }
        
        throw new Error(errorMessage);
      }

      const summaryData = await summaryResponse.json();
      let aiResponse = '';

      if (Array.isArray(summaryData) && summaryData[0]?.summary_text) {
        aiResponse = summaryData[0].summary_text;
      } else {
        throw new Error('Unexpected response format from Hugging Face');
      }

      // Enhance the basic summary based on mode
      aiResponse = this.enhanceHuggingFaceSummary(aiResponse, originalContent, mode);
      
      return this.parseSummaryResponse(aiResponse, originalContent, mode);
    } catch (error) {
      console.error('Hugging Face API error:', error);
      throw error;
    }
  }

  // Enhance Hugging Face summary based on mode
  enhanceHuggingFaceSummary(basicSummary, originalContent, mode) {
    const title = originalContent.title || 'Content';
    const isCustomTopic = originalContent.type === 'custom' || originalContent.type === 'topic_search';
    
    switch (mode) {
      case 'tldr':
        return `**${title} - Quick Summary**

${basicSummary}

**Key Takeaways:**
• Essential knowledge for understanding ${title}
• Practical applications in real-world scenarios
• Foundation for further learning

**Next Steps:** Apply one concept immediately to see results`;

      case 'insight':
        return `**Understanding ${title}**

**Core Summary:**
${basicSummary}

**Key Insights:**
• **Main Concept**: ${title} provides valuable knowledge and practical applications
• **Why It Matters**: This understanding helps in real-world problem-solving
• **Practical Use**: Can be applied in various professional and personal contexts

**Learning Path:**
1. Start with the basic concepts outlined above
2. Practice with simple examples
3. Apply to real scenarios
4. Build complexity gradually

**Time Investment:** 30-60 minutes for solid understanding`;

      case 'detailed':
        return `**Comprehensive Guide: ${title}**

**Executive Summary:**
${basicSummary}

**Detailed Analysis:**
This topic encompasses both theoretical understanding and practical application. The content provides a foundation for deeper learning and real-world implementation.

**Key Components:**
• **Fundamentals**: Core principles and basic concepts
• **Applications**: How this knowledge applies in practice
• **Benefits**: Value and advantages of understanding this topic
• **Implementation**: Step-by-step approach to application

**Learning Framework:**
1. **Foundation**: Master basic definitions and concepts
2. **Practice**: Work through examples and exercises
3. **Application**: Use in real-world scenarios
4. **Mastery**: Develop advanced understanding

**Success Indicators:**
• Can explain concepts clearly to others
• Successfully apply in practical situations
• Recognize when and how to use this knowledge

**Advanced Exploration:**
Continue learning through specialized resources, communities, and hands-on projects.`;

      default:
        return basicSummary;
    }
  }

  // Search topics using Hugging Face and other sources
  async searchTopics(query) {
    const results = [];

    // Try Hugging Face question-answering for topic exploration
    if (this.apiKeys.huggingface && 
        !this.apiKeys.huggingface.includes('your_huggingface_api_key') && 
        this.apiKeys.huggingface.startsWith('hf_')) {
      try {
        const topicResults = await this.searchTopicsWithHuggingFace(query);
        results.push(...topicResults);
      } catch (error) {
        console.warn('Hugging Face topic search failed:', error.message);
      }
    }

    // Add curated topic suggestions based on query
    const curatedResults = this.getCuratedTopicSuggestions(query);
    results.push(...curatedResults);

    return results.slice(0, 10); // Limit to 10 results
  }

  // Search topics using Hugging Face models
  async searchTopicsWithHuggingFace(query) {
    const context = `Learning resources and educational content about ${query}. This includes tutorials, guides, courses, and practical applications for understanding ${query} concepts, principles, and real-world implementations.`;
    
    try {
      const response = await fetch(`https://api-inference.huggingface.co/models/${this.huggingFaceModels.questionAnswering}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeys.huggingface}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {
            question: `What are the key learning topics and concepts for ${query}?`,
            context: context
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.answer) {
          return [{
            title: `${query} - AI Generated Learning Path`,
            description: data.answer,
            difficulty: 'intermediate',
            estimatedTime: '45-90 minutes',
            source: 'AI Analysis',
            confidence: data.score || 0.8
          }];
        }
      }
    } catch (error) {
      console.warn('Hugging Face search error:', error);
    }

    return [];
  }

  // Get curated topic suggestions
  getCuratedTopicSuggestions(query) {
    const lowerQuery = query.toLowerCase();
    const suggestions = [];

    // Technology topics
    if (lowerQuery.includes('react') || lowerQuery.includes('javascript') || lowerQuery.includes('programming')) {
      suggestions.push({
        title: `${query} - Complete Developer Guide`,
        description: `Comprehensive learning path for ${query} including fundamentals, best practices, and real-world applications.`,
        difficulty: 'intermediate',
        estimatedTime: '2-4 hours',
        source: 'Curated Learning Path'
      });
    }

    // Business/Productivity topics
    if (lowerQuery.includes('productivity') || lowerQuery.includes('management') || lowerQuery.includes('business')) {
      suggestions.push({
        title: `${query} - Professional Development`,
        description: `Strategic approach to mastering ${query} with actionable frameworks and proven methodologies.`,
        difficulty: 'beginner',
        estimatedTime: '1-2 hours',
        source: 'Professional Development'
      });
    }

    // Science/Learning topics
    if (lowerQuery.includes('machine learning') || lowerQuery.includes('ai') || lowerQuery.includes('data')) {
      suggestions.push({
        title: `${query} - Technical Deep Dive`,
        description: `Technical exploration of ${query} concepts, algorithms, and practical implementations with examples.`,
        difficulty: 'advanced',
        estimatedTime: '3-5 hours',
        source: 'Technical Learning'
      });
    }

    // General learning topics
    suggestions.push({
      title: `${query} - Fundamentals & Applications`,
      description: `Essential knowledge about ${query} covering core concepts, practical applications, and step-by-step learning approach.`,
      difficulty: 'intermediate',
      estimatedTime: '1-3 hours',
      source: 'General Learning'
    });

    return suggestions;
  }

  // Summarize completed video with enhanced context
  async summarizeCompletedVideo(video, mode = 'insight') {
    const videoContent = {
      id: `completed_video_${video.videoId}_${Date.now()}`,
      title: video.title,
      description: `Video Notes: ${video.notes}`,
      type: 'completed_video',
      videoId: video.videoId,
      videoUrl: video.videoUrl,
      tags: video.title.split(' ').filter(word => word.length > 2),
      difficulty: 'intermediate',
      priority: 9,
      source: 'Completed Video',
      channelTitle: 'Video Learning'
    };

    return await this.summarizeContent(videoContent, mode);
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
        summary = `**What you can DO with ${title}:**
${title} enables you to achieve practical results in ${tags}. You can immediately apply these concepts to improve your outcomes. ${keySentences || description}

**Why you NEED this:**
• Directly improves your results in ${tags}
• Provides competitive advantage in real-world applications
• Unlocks new opportunities and capabilities

**Start TODAY:** Identify one area where you can apply ${title} principles immediately
**Quick wins:** 
• Implement the basic framework this week
• See measurable improvements within 7-14 days
• Build momentum for advanced applications

**Implementation difficulty:** ${originalContent.difficulty || 'Intermediate'} - achievable with focused action`;
        break;

      case 'insight':
        summary = `**Practical Impact of ${title}:**
${title} transforms how you approach ${tags}, delivering measurable results. ${keySentences || description}

**Action Framework:**
• **Implementation Strategy**: Systematic approach to apply ${title} in your context
• **Practical Application**: Specific ways to use this in real situations with examples
• **Mental Model**: Think of it as your go-to system for ${tags} challenges
• **Success Patterns**: Proven methods that consistently deliver results

**Real Implementation:**
This approach gives you practical tools to improve your ${tags} outcomes and solve real problems.

**Getting Results:**
1. Identify your specific use case and goals
2. Apply the core framework to a small test scenario
3. Measure results and refine your approach
4. Scale successful patterns to larger applications

**Scaling Up:** Build systematic processes and advanced techniques for ${tags}
**Expected ROI:** Significant improvement in ${tags} effectiveness within 2-4 weeks`;
        break;

      case 'detailed':
        summary = `**Complete Implementation System for ${title}:**

**Strategic Impact:**
${title} provides a comprehensive system for achieving superior results in ${tags}. This implementation guide delivers measurable outcomes. ${keySentences || description}

**Implementation Framework:**
• **Strategic Foundation**: Core system architecture for ${title} implementation
• **Execution Methods**: Proven processes and methodologies that deliver results
• **Success Patterns**: Key components that drive consistent outcomes
• **Integration Points**: How this connects with your existing ${tags} systems

**90-Day Implementation Roadmap:**
1. **Days 1-30**: Foundation setup and initial implementation
2. **Days 31-60**: Optimization and scaling successful patterns
3. **Days 61-90**: Advanced applications and system refinement
4. **Ongoing**: Continuous improvement and mastery development

**Real-World Applications:**
• Professional implementation with specific ROI targets
• Personal projects with measurable improvement goals
• Problem-solving systems for complex ${tags} challenges
• Innovation frameworks for breakthrough results

**Optimization Strategy:**
• **Beginner**: Focus on core implementation and quick wins
• **Intermediate**: Scale successful patterns and optimize performance
• **Advanced**: Develop custom solutions and mentor others

**Complete Toolkit:**
• Implementation templates and checklists
• Measurement systems and success metrics
• Troubleshooting guides and common solutions
• Community resources and expert networks

**Success Metrics:**
• Achieve specific, measurable improvements in ${tags}
• Implement systematic processes that scale
• Develop expertise that creates competitive advantage
• Build sustainable systems for long-term success`;
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
        summary = `**What you can ACHIEVE with ${topic}:**
${topic} enables you to gain practical capabilities and deliver real results.${contextInfo}

**Why you NEED this:**
• Directly improves your performance and outcomes
• Provides competitive advantage in real applications
• Unlocks new opportunities and capabilities

**Start TODAY:** Identify one specific area where you can apply ${topic} immediately
**Quick wins:** 
• Implement basic principles this week
• See measurable progress within 7-14 days
• Build foundation for advanced applications

**Implementation difficulty:** Beginner to Intermediate - achievable with focused action`;
        break;

      case 'insight':
        summary = `**Practical Mastery of ${topic}:**
${topic} provides a systematic approach to achieving superior results through proven methods and practical application.${contextInfo}

**Action Framework:**
• **Implementation Strategy**: Systematic approach to apply ${topic} effectively
• **Practical Methods**: Specific techniques you can use immediately
• **Success Patterns**: Proven approaches that consistently deliver results
• **Real Applications**: How to use this in your specific context

**Why This Transforms Results:**
Mastering ${topic} gives you practical tools and systematic approaches that create measurable improvements in your outcomes.

**Results-Driven Implementation:**
1. Identify your specific goals and success metrics
2. Apply core methods to a focused test case
3. Measure results and optimize your approach
4. Scale successful patterns to broader applications

**Scaling Strategy:** Build systematic processes for consistent, repeatable success
**Expected ROI:** Significant improvement in effectiveness within 2-4 weeks`;
        break;

      case 'detailed':
        summary = `**Complete Implementation System: ${topic}**

**Strategic Impact:**
${topic} provides a comprehensive system for achieving breakthrough results through systematic implementation and proven methodologies.${contextInfo}

**What You'll Achieve:**
• **Systematic Results**: Consistent, measurable outcomes through proven methods
• **Competitive Advantage**: Superior performance through advanced implementation
• **Scalable Systems**: Repeatable processes that grow with your needs
• **Expert-Level Mastery**: Deep capability that creates lasting value

**90-Day Implementation Framework:**
1. **Foundation Phase (Days 1-30)**
   - Establish core systems and initial implementation
   - Achieve first measurable results and quick wins
   - Build momentum through systematic application

2. **Optimization Phase (Days 31-60)**
   - Scale successful patterns and refine processes
   - Implement advanced techniques for superior results
   - Develop custom solutions for specific challenges

3. **Mastery Phase (Days 61-90)**
   - Achieve expert-level implementation and results
   - Create innovative applications and breakthrough solutions
   - Build systems for teaching and mentoring others

**Real-World Implementation:**
• Professional applications with specific ROI targets
• Personal transformation with measurable outcomes
• Problem-solving systems for complex challenges
• Innovation frameworks for breakthrough results

**Complete Success Toolkit:**
• **Implementation Guides**: Step-by-step processes and checklists
• **Measurement Systems**: Specific metrics and tracking methods
• **Optimization Tools**: Advanced techniques and troubleshooting guides
• **Community Resources**: Expert networks and ongoing support

**Success Metrics:**
• Achieve specific, measurable improvements in target areas
• Implement systematic processes that deliver consistent results
• Develop expertise that creates competitive advantage
• Build sustainable systems for long-term success and growth

**Advanced Mastery Path:**
Develop specialized expertise, create innovative applications, and build systems that scale your impact and results.`;
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
      ? `You are a practical learning coach. Create an actionable ${mode} guide about "${topic}". 
      
User Context: ${originalContent.description || 'General learning interest'}

Focus on PRACTICAL APPLICATION and ACTIONABLE INSIGHTS, not just theory. Make it immediately useful. Provide:`
      : `Analyze this content and create a practical, actionable ${mode} guide:

Content: ${textContent}

Focus on practical application, real-world implementation, and actionable steps. Make it immediately useful. Please provide:`;

    switch (mode) {
      case 'tldr':
        return `${basePrompt}

1. **What you can DO with it**: Practical applications and outcomes (not just definition)
2. **Why you NEED this**: Real benefits and impact on your goals (3 bullet points)
3. **Start TODAY**: One specific action you can take right now
4. **Quick wins**: 2-3 immediate results you can achieve this week
5. **Implementation difficulty**: How hard is it to get started and see results

Make it action-oriented and immediately applicable. Focus on what the user can DO, not just what it IS.`;

      case 'insight':
        return `${basePrompt}

1. **Practical Impact**: What this enables you to achieve and how it changes your results
2. **Action Framework**: 4-5 specific strategies you can implement with concrete examples
3. **Mental Models**: Practical thinking frameworks you can use immediately
4. **Real Implementation**: Step-by-step process with actual examples and use cases
5. **Common Pitfalls**: What typically goes wrong and how to avoid these mistakes
6. **Getting Results**: Proven approach to see results quickly
7. **Scaling Up**: How to go from basic implementation to advanced results
8. **Tools & Systems**: Specific resources and methods to implement this effectively

Focus on PRACTICAL APPLICATION and REAL RESULTS. Provide actionable strategies, not just explanations.`;

      case 'detailed':
        return `${basePrompt}

1. **Complete Implementation Guide**: Full system for applying this in your life/work
2. **Strategic Framework**: Detailed methodology with step-by-step processes and decision trees
3. **Proven Case Studies**: Multiple real examples with specific results and outcomes
4. **Implementation Roadmap**: 30-60-90 day plan with milestones and checkpoints
5. **Advanced Strategies**: High-impact techniques for maximum results
6. **Problem-Solving Toolkit**: Common challenges with specific solutions and workarounds
7. **Optimization Methods**: How to improve results and scale your implementation
8. **Tools & Systems**: Complete toolkit with specific recommendations and setup guides
9. **Measurement & Tracking**: Exact metrics to track progress and ROI
10. **Troubleshooting Guide**: What to do when things don't work as expected
11. **Advanced Applications**: Next-level strategies for experienced practitioners
12. **Support Systems**: Communities, resources, and ongoing development paths

Focus on COMPLETE IMPLEMENTATION. Provide everything needed to go from zero to expert results.`;

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

  // Delete summary
  deleteSummary(summaryId) {
    const summaries = this.getSavedSummaries();
    if (summaries[summaryId]) {
      delete summaries[summaryId];
      localStorage.setItem('prodmind_summaries', JSON.stringify(summaries));
      return true;
    }
    return false;
  }
}

export default new SummarizerService();