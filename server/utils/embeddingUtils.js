import OpenAI from 'openai';

class EmbeddingUtils {
  constructor() {
    this.embeddingModel = 'text-embedding-3-small'; // 1536 dimensions, cost-effective
    this.maxTokens = 8000; // Safe limit for embedding model
    
    // Only initialize OpenAI if API key is available
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_new_openai_api_key_here') {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    } else {
      this.openai = null;
      console.warn('OpenAI API key not configured, using fallback embeddings');
    }
  }

  /**
   * Generate embedding for text content
   * @param {string} text - Text to embed
   * @returns {Promise<number[]>} - Embedding vector
   */
  async generateEmbedding(text) {
    try {
      if (!text || typeof text !== 'string') {
        throw new Error('Invalid text input for embedding');
      }

      // Use fallback if OpenAI is not available
      if (!this.openai) {
        return this.generateFallbackEmbedding(text);
      }

      // Truncate text if too long
      const truncatedText = this.truncateText(text, this.maxTokens);
      
      const response = await this.openai.embeddings.create({
        model: this.embeddingModel,
        input: truncatedText,
        encoding_format: 'float'
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      
      // Fallback to zero vector if OpenAI fails
      return this.generateFallbackEmbedding(text);
    }
  }

  /**
   * Generate embedding for content object
   * @param {Object} content - Content with title, description, tags, etc.
   * @returns {Promise<number[]>} - Embedding vector
   */
  async generateContentEmbedding(content) {
    const textParts = [];
    
    // Combine relevant text fields with weights
    if (content.title) {
      textParts.push(`Title: ${content.title}`);
    }
    
    if (content.description) {
      textParts.push(`Description: ${content.description}`);
    }
    
    if (content.metadata?.tags?.length) {
      textParts.push(`Tags: ${content.metadata.tags.join(', ')}`);
    }
    
    if (content.metadata?.keyTopics?.length) {
      textParts.push(`Topics: ${content.metadata.keyTopics.join(', ')}`);
    }
    
    if (content.aiAnalysis?.summary) {
      textParts.push(`Summary: ${content.aiAnalysis.summary}`);
    }
    
    if (content.aiAnalysis?.keyPoints?.length) {
      textParts.push(`Key Points: ${content.aiAnalysis.keyPoints.join('. ')}`);
    }

    // Include transcript if available (truncated)
    if (content.metadata?.transcript) {
      const truncatedTranscript = this.truncateText(content.metadata.transcript, 2000);
      textParts.push(`Content: ${truncatedTranscript}`);
    }

    const combinedText = textParts.join('\n\n');
    return this.generateEmbedding(combinedText);
  }

  /**
   * Generate user profile embedding based on interests and behavior
   * @param {Object} userProfile - User learning profile and analytics
   * @returns {Promise<number[]>} - User embedding vector
   */
  async generateUserEmbedding(userProfile) {
    const textParts = [];
    
    // Learning interests with priority weighting
    if (userProfile.learningProfile?.interests?.length) {
      const interests = userProfile.learningProfile.interests
        .sort((a, b) => b.priority - a.priority)
        .map(interest => `${interest.topic} (${interest.proficiency} level, priority ${interest.priority})`)
        .join(', ');
      textParts.push(`Learning Interests: ${interests}`);
    }
    
    // Learning goals
    if (userProfile.learningProfile?.learningGoals?.length) {
      const goals = userProfile.learningProfile.learningGoals
        .map(goal => `${goal.title}: ${goal.description || ''}`)
        .join('. ');
      textParts.push(`Learning Goals: ${goals}`);
    }
    
    // Preferred content types and learning style
    if (userProfile.learningProfile?.preferredContentTypes?.length) {
      textParts.push(`Preferred Content: ${userProfile.learningProfile.preferredContentTypes.join(', ')}`);
    }
    
    if (userProfile.learningProfile?.learningStyle) {
      textParts.push(`Learning Style: ${userProfile.learningProfile.learningStyle}`);
    }
    
    // Behavior-based preferences
    if (userProfile.behaviorAnalytics?.preferredContentDifficulty) {
      textParts.push(`Preferred Difficulty: ${userProfile.behaviorAnalytics.preferredContentDifficulty}`);
    }

    const combinedText = textParts.join('\n');
    
    if (!combinedText.trim()) {
      // Return null embedding for empty profiles
      return null;
    }
    
    return this.generateEmbedding(combinedText);
  }

  /**
   * Update user embedding incrementally based on content interaction
   * @param {number[]} currentEmbedding - Current user embedding
   * @param {number[]} contentEmbedding - Content embedding user interacted with
   * @param {number} interactionWeight - Weight of interaction (0-1)
   * @param {number} decayFactor - Decay factor for existing embedding (0-1)
   * @returns {number[]} - Updated user embedding
   */
  updateUserEmbedding(currentEmbedding, contentEmbedding, interactionWeight = 0.1, decayFactor = 0.95) {
    if (!currentEmbedding || !contentEmbedding) {
      return contentEmbedding || currentEmbedding;
    }
    
    if (currentEmbedding.length !== contentEmbedding.length) {
      console.warn('Embedding dimension mismatch, using content embedding');
      return contentEmbedding;
    }
    
    // Weighted update: new = decay * old + weight * content
    return currentEmbedding.map((value, index) => 
      (decayFactor * value) + (interactionWeight * contentEmbedding[index])
    );
  }

  /**
   * Calculate cosine similarity between two embeddings
   * @param {number[]} embedding1 - First embedding vector
   * @param {number[]} embedding2 - Second embedding vector
   * @returns {number} - Cosine similarity (-1 to 1)
   */
  cosineSimilarity(embedding1, embedding2) {
    if (!embedding1 || !embedding2 || embedding1.length !== embedding2.length) {
      return 0;
    }
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }
    
    const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
    
    if (magnitude === 0) return 0;
    
    return dotProduct / magnitude;
  }

  /**
   * Truncate text to fit within token limits
   * @param {string} text - Text to truncate
   * @param {number} maxTokens - Maximum tokens allowed
   * @returns {string} - Truncated text
   */
  truncateText(text, maxTokens) {
    // Rough estimation: 1 token ≈ 4 characters
    const maxChars = maxTokens * 4;
    
    if (text.length <= maxChars) {
      return text;
    }
    
    // Truncate at word boundary
    const truncated = text.substring(0, maxChars);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > maxChars * 0.8 ? truncated.substring(0, lastSpace) : truncated;
  }

  /**
   * Generate fallback embedding when OpenAI is unavailable
   * @param {string} text - Text to create fallback embedding for
   * @returns {number[]} - Simple hash-based embedding
   */
  generateFallbackEmbedding(text) {
    const dimensions = 1536; // Match OpenAI embedding dimensions
    const embedding = new Array(dimensions).fill(0);
    
    if (!text) return embedding;
    
    // Simple hash-based approach for fallback
    const words = text.toLowerCase().split(/\s+/);
    
    words.forEach((word, index) => {
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        hash = ((hash << 5) - hash + word.charCodeAt(i)) & 0xffffffff;
      }
      
      // Distribute hash across embedding dimensions
      const position = Math.abs(hash) % dimensions;
      embedding[position] += 1 / Math.sqrt(words.length);
    });
    
    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      return embedding.map(val => val / magnitude);
    }
    
    return embedding;
  }

  /**
   * Batch generate embeddings for multiple texts
   * @param {string[]} texts - Array of texts to embed
   * @returns {Promise<number[][]>} - Array of embedding vectors
   */
  async batchGenerateEmbeddings(texts) {
    // Use fallback if OpenAI is not available
    if (!this.openai) {
      return texts.map(text => this.generateFallbackEmbedding(text));
    }

    const batchSize = 100; // OpenAI batch limit
    const results = [];
    
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      
      try {
        const response = await this.openai.embeddings.create({
          model: this.embeddingModel,
          input: batch.map(text => this.truncateText(text, this.maxTokens)),
          encoding_format: 'float'
        });
        
        results.push(...response.data.map(item => item.embedding));
      } catch (error) {
        console.error(`Error in batch ${i}-${i + batchSize}:`, error);
        
        // Generate fallback embeddings for failed batch
        const fallbackEmbeddings = batch.map(text => this.generateFallbackEmbedding(text));
        results.push(...fallbackEmbeddings);
      }
    }
    
    return results;
  }
}

export default new EmbeddingUtils();