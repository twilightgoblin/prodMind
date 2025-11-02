import User from '../models/User.js';
import Content from '../models/Content.js';
import embeddingUtils from '../utils/embeddingUtils.js';

class RecommendationService {
  constructor() {
    this.defaultRecommendationCount = 10;
    this.similarityThreshold = 0.01; // Lower threshold for fallback embeddings
    this.maxCandidates = 1000; // Limit candidates for performance
  }

  /**
   * Get personalized content recommendations for a user
   * @param {string} userId - User ID
   * @param {Object} options - Recommendation options
   * @returns {Promise<Object[]>} - Recommended content with scores
   */
  async getPersonalizedRecommendations(userId, options = {}) {
    try {
      const {
        limit = this.defaultRecommendationCount,
        excludeViewed = true,
        contentTypes = null,
        difficulty = null,
        maxDuration = null
      } = options;

      // Get user profile with embedding
      const user = await User.findById(userId).select('+embedding');
      if (!user) {
        throw new Error('User not found');
      }

      // Generate user embedding if not exists
      if (!user.embedding) {
        await this.generateUserEmbedding(userId);
        user.embedding = (await User.findById(userId).select('+embedding')).embedding;
      }

      // Get candidate content
      const candidates = await this.getCandidateContent(user, {
        excludeViewed,
        contentTypes,
        difficulty,
        maxDuration,
        limit: this.maxCandidates
      });

      if (!candidates.length) {
        return [];
      }

      // Score and rank recommendations
      const recommendations = await this.scoreAndRankContent(user, candidates, limit);

      return recommendations;
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return [];
    }
  }

  /**
   * Get candidate content based on user preferences and filters
   * @param {Object} user - User object with profile and analytics
   * @param {Object} filters - Content filters
   * @returns {Promise<Object[]>} - Candidate content
   */
  async getCandidateContent(user, filters) {
    const query = { isActive: true };
    

    
    // Filter by content types
    if (filters.contentTypes?.length) {
      query.source = { $in: filters.contentTypes };
    }

    // Filter by difficulty
    if (filters.difficulty) {
      query['metadata.difficulty'] = filters.difficulty;
    } else if (user.behaviorAnalytics?.preferredContentDifficulty) {
      // Include current difficulty and adjacent levels
      const difficultyLevels = ['beginner', 'intermediate', 'advanced'];
      const currentIndex = difficultyLevels.indexOf(user.behaviorAnalytics.preferredContentDifficulty);
      const allowedDifficulties = [
        difficultyLevels[Math.max(0, currentIndex - 1)],
        difficultyLevels[currentIndex],
        difficultyLevels[Math.min(2, currentIndex + 1)]
      ].filter(Boolean);
      
      query['metadata.difficulty'] = { $in: allowedDifficulties };
    }

    // Filter by duration
    if (filters.maxDuration) {
      query['metadata.durationSec'] = { $lte: filters.maxDuration };
    } else if (user.learningProfile?.availableTime?.dailyMinutes) {
      // Suggest content that fits in available time slots
      const maxSeconds = user.learningProfile.availableTime.dailyMinutes * 60;
      query['metadata.durationSec'] = { $lte: maxSeconds };
    }

    // Filter by user interests (tags)
    if (user.learningProfile?.interests?.length) {
      const interestTopics = user.learningProfile.interests.map(i => i.topic.toLowerCase());
      query.$or = [
        { 'metadata.tags': { $in: interestTopics } },
        { 'metadata.keyTopics': { $in: interestTopics } },
        { 'metadata.category': { $in: interestTopics } }
      ];
    }

    // Exclude already viewed content
    if (filters.excludeViewed) {
      // This would require a UserContentInteraction model to track views
      // For now, we'll skip this filter
    }

    // Sort by engagement and recency
    const candidates = await Content.find(query)
      .select('-embedding -metadata.transcript')
      .sort({
        'consumptionStats.avgRating': -1,
        'metadata.publishedAt': -1,
        createdAt: -1
      })
      .limit(filters.limit || this.maxCandidates)
      .lean();


    return candidates;
  }

  /**
   * Score and rank content based on user preferences and similarity
   * @param {Object} user - User object with embedding
   * @param {Object[]} candidates - Candidate content
   * @param {number} limit - Number of recommendations to return
   * @returns {Promise<Object[]>} - Scored and ranked recommendations
   */
  async scoreAndRankContent(user, candidates, limit) {
    const recommendations = [];

    // Get content embeddings for similarity calculation
    const contentIds = candidates.map(c => c.contentId);
    const contentWithEmbeddings = await Content.find({
      contentId: { $in: contentIds }
    }).select('contentId embedding').lean();

    const embeddingMap = new Map();
    contentWithEmbeddings.forEach(content => {
      embeddingMap.set(content.contentId, content.embedding);
    });

    for (const content of candidates) {
      const contentEmbedding = embeddingMap.get(content.contentId);
      if (!contentEmbedding) continue;

      const score = this.calculateContentScore(user, content, contentEmbedding);
      
      if (score > this.similarityThreshold) {
        recommendations.push({
          ...content,
          recommendationScore: score,
          reasons: this.generateRecommendationReasons(user, content, score)
        });
      }
    }

    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);
  }

  /**
   * Calculate comprehensive content score
   * @param {Object} user - User object
   * @param {Object} content - Content object
   * @param {number[]} contentEmbedding - Content embedding vector
   * @returns {number} - Content score (0-1)
   */
  calculateContentScore(user, content, contentEmbedding) {
    let score = 0;
    const weights = {
      similarity: 0.4,
      goalAlignment: 0.25,
      preferenceMatch: 0.15,
      qualityScore: 0.1,
      recencyBoost: 0.05,
      diversityPenalty: 0.05
    };

    // 1. Semantic similarity score
    if (user.embedding && contentEmbedding) {
      const similarity = embeddingUtils.cosineSimilarity(user.embedding, contentEmbedding);
      score += weights.similarity * Math.max(0, similarity);
    }

    // 2. Learning goal alignment
    const goalAlignment = this.calculateGoalAlignment(user, content);
    score += weights.goalAlignment * goalAlignment;

    // 3. Preference matching
    const preferenceMatch = this.calculatePreferenceMatch(user, content);
    score += weights.preferenceMatch * preferenceMatch;

    // 4. Content quality score
    const qualityScore = this.calculateQualityScore(content);
    score += weights.qualityScore * qualityScore;

    // 5. Recency boost
    const recencyBoost = this.calculateRecencyBoost(content);
    score += weights.recencyBoost * recencyBoost;

    // 6. Diversity penalty (avoid too similar content)
    // This would require tracking recent recommendations
    // For now, we'll skip this component

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Calculate how well content aligns with user's learning goals
   * @param {Object} user - User object
   * @param {Object} content - Content object
   * @returns {number} - Goal alignment score (0-1)
   */
  calculateGoalAlignment(user, content) {
    if (!user.learningProfile?.learningGoals?.length) return 0.5;

    const contentTopics = [
      ...(content.metadata?.tags || []),
      ...(content.metadata?.keyTopics || []),
      content.metadata?.category
    ].filter(Boolean).map(t => t.toLowerCase());

    let maxAlignment = 0;

    for (const goal of user.learningProfile.learningGoals) {
      const goalText = `${goal.title} ${goal.description || ''}`.toLowerCase();
      
      // Check if content topics match goal keywords
      const alignment = contentTopics.reduce((acc, topic) => {
        return goalText.includes(topic) ? acc + 0.3 : acc;
      }, 0);

      // Boost for active goals (not completed)
      const activeBoost = goal.progress < 100 ? 0.2 : 0;
      
      maxAlignment = Math.max(maxAlignment, Math.min(1, alignment + activeBoost));
    }

    return maxAlignment;
  }

  /**
   * Calculate preference matching score
   * @param {Object} user - User object
   * @param {Object} content - Content object
   * @returns {number} - Preference match score (0-1)
   */
  calculatePreferenceMatch(user, content) {
    let score = 0;
    let factors = 0;



    // Difficulty preference
    if (user.behaviorAnalytics?.preferredContentDifficulty) {
      factors++;
      if (content.metadata?.difficulty === user.behaviorAnalytics.preferredContentDifficulty) {
        score += 0.3;
      }
    }

    // Duration preference
    if (user.learningProfile?.availableTime?.dailyMinutes) {
      factors++;
      const contentMinutes = (content.metadata?.durationSec || 0) / 60;
      const availableMinutes = user.learningProfile.availableTime.dailyMinutes;
      
      if (contentMinutes <= availableMinutes) {
        score += 0.2;
      }
    }

    // Interest matching
    if (user.learningProfile?.interests?.length) {
      factors++;
      const userTopics = user.learningProfile.interests.map(i => i.topic.toLowerCase());
      const contentTopics = [
        ...(content.metadata?.tags || []),
        ...(content.metadata?.keyTopics || [])
      ].map(t => t.toLowerCase());

      const matchCount = userTopics.filter(topic => 
        contentTopics.some(ct => ct.includes(topic) || topic.includes(ct))
      ).length;

      if (matchCount > 0) {
        score += Math.min(0.4, matchCount * 0.1);
      }
    }

    return factors > 0 ? score / factors : 0.5;
  }

  /**
   * Calculate content quality score
   * @param {Object} content - Content object
   * @returns {number} - Quality score (0-1)
   */
  calculateQualityScore(content) {
    const stats = content.consumptionStats || {};
    
    let score = 0;
    let factors = 0;

    // Average rating
    if (stats.avgRating > 0) {
      factors++;
      score += stats.avgRating / 5; // Normalize to 0-1
    }

    // Completion rate
    if (stats.completionRate > 0) {
      factors++;
      score += stats.completionRate;
    }

    // View count (normalized)
    if (stats.views > 0) {
      factors++;
      score += Math.min(1, stats.views / 100); // Cap at 100 views = 1.0
    }

    return factors > 0 ? score / factors : 0.5;
  }

  /**
   * Calculate recency boost for newer content
   * @param {Object} content - Content object
   * @returns {number} - Recency boost (0-1)
   */
  calculateRecencyBoost(content) {
    const publishDate = content.metadata?.publishedAt || content.createdAt;
    if (!publishDate) return 0;

    const daysSincePublish = (Date.now() - new Date(publishDate).getTime()) / (1000 * 60 * 60 * 24);
    
    // Boost newer content (within 30 days)
    if (daysSincePublish <= 30) {
      return 1 - (daysSincePublish / 30);
    }
    
    return 0;
  }

  /**
   * Generate human-readable recommendation reasons
   * @param {Object} user - User object
   * @param {Object} content - Content object
   * @param {number} score - Recommendation score
   * @returns {string[]} - Array of reason strings
   */
  generateRecommendationReasons(user, content, score) {
    const reasons = [];

    // High similarity
    if (score > 0.7) {
      reasons.push('Highly relevant to your interests');
    }

    // Goal alignment
    if (user.learningProfile?.learningGoals?.length) {
      const goalKeywords = user.learningProfile.learningGoals
        .map(g => g.title.toLowerCase())
        .join(' ');
      
      const contentText = `${content.title} ${content.description || ''}`.toLowerCase();
      
      if (goalKeywords.split(' ').some(keyword => contentText.includes(keyword))) {
        reasons.push('Aligns with your learning goals');
      }
    }



    // Appropriate difficulty
    if (content.metadata?.difficulty === user.behaviorAnalytics?.preferredContentDifficulty) {
      reasons.push(`${content.metadata.difficulty} level content`);
    }

    // High quality
    if (content.consumptionStats?.avgRating >= 4) {
      reasons.push('Highly rated by other learners');
    }

    // Recent content
    const daysSincePublish = (Date.now() - new Date(content.metadata?.publishedAt || content.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePublish <= 7) {
      reasons.push('Recently published');
    }

    return reasons.length ? reasons : ['Recommended based on your profile'];
  }

  /**
   * Generate or update user embedding based on profile and interactions
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  async generateUserEmbedding(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) return false;

      const embedding = await embeddingUtils.generateUserEmbedding(user);
      
      if (embedding) {
        await User.findByIdAndUpdate(userId, {
          $set: { embedding }
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error generating user embedding:', error);
      return false;
    }
  }

  /**
   * Update user embedding based on content interaction
   * @param {string} userId - User ID
   * @param {string} contentId - Content ID
   * @param {Object} interaction - Interaction data (rating, completion, etc.)
   * @returns {Promise<boolean>} - Success status
   */
  async updateUserEmbeddingFromInteraction(userId, contentId, interaction) {
    try {
      const user = await User.findById(userId).select('+embedding');
      const content = await Content.findOne({ contentId }).select('embedding');

      if (!user || !content?.embedding) return false;

      // Calculate interaction weight based on engagement
      let weight = 0.05; // Base weight
      
      if (interaction.completed) weight += 0.1;
      if (interaction.rating >= 4) weight += 0.05;
      if (interaction.timeSpent > (content.metadata?.durationSec * 0.8)) weight += 0.05;

      // Update user embedding
      const updatedEmbedding = embeddingUtils.updateUserEmbedding(
        user.embedding,
        content.embedding,
        weight
      );

      await User.findByIdAndUpdate(userId, {
        $set: { embedding: updatedEmbedding }
      });

      return true;
    } catch (error) {
      console.error('Error updating user embedding from interaction:', error);
      return false;
    }
  }

  /**
   * Get trending content with personalization
   * @param {string} userId - User ID
   * @param {Object} options - Options
   * @returns {Promise<Object[]>} - Trending content with personalized scores
   */
  async getTrendingWithPersonalization(userId, options = {}) {
    try {
      const { limit = 20 } = options;

      // Get trending content (high engagement, recent)
      const trending = await Content.find({
        isActive: true,
        'consumptionStats.views': { $gte: 10 }
      })
      .sort({
        'consumptionStats.avgRating': -1,
        'consumptionStats.views': -1,
        'metadata.publishedAt': -1
      })
      .limit(limit * 2) // Get more to allow for personalization filtering
      .lean();

      if (!userId) {
        return trending.slice(0, limit);
      }

      // Add personalization scores
      const user = await User.findById(userId).select('+embedding');
      if (!user?.embedding) {
        return trending.slice(0, limit);
      }

      const personalizedTrending = [];
      
      for (const content of trending) {
        const contentWithEmbedding = await Content.findOne({ 
          contentId: content.contentId 
        }).select('embedding').lean();

        if (contentWithEmbedding?.embedding) {
          const personalizedScore = this.calculateContentScore(
            user, 
            content, 
            contentWithEmbedding.embedding
          );

          personalizedTrending.push({
            ...content,
            personalizedScore,
            trendingScore: content.consumptionStats?.avgRating || 0
          });
        }
      }

      // Sort by combined trending and personalization score
      return personalizedTrending
        .sort((a, b) => {
          const scoreA = (a.trendingScore * 0.6) + (a.personalizedScore * 0.4);
          const scoreB = (b.trendingScore * 0.6) + (b.personalizedScore * 0.4);
          return scoreB - scoreA;
        })
        .slice(0, limit);

    } catch (error) {
      console.error('Error getting trending with personalization:', error);
      return [];
    }
  }
}

export default new RecommendationService();