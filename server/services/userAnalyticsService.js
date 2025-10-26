import mongoose from 'mongoose';
import User from '../models/User.js';
import UserContentInteraction from '../models/UserContentInteraction.js';
import Content from '../models/Content.js';
import Quiz from '../models/Quiz.js';

class UserAnalyticsService {
  
  /**
   * Track user content interaction
   */
  async trackInteraction(userId, interactionData) {
    try {
      const interaction = new UserContentInteraction({
        userId,
        ...interactionData
      });
      
      await interaction.save();
      
      // Update user behavior analytics
      await this.updateUserBehaviorAnalytics(userId);
      
      // Update content consumption stats
      await this.updateContentStats(interactionData.contentId, interactionData);
      
      return { success: true, interaction };
    } catch (error) {
      console.error('Error tracking interaction:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Get comprehensive user analytics
   */
  async getUserAnalytics(userId, timeframe = 30) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeframe);
      
      // Get interaction analytics
      const interactionStats = await UserContentInteraction.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: null,
            totalWatchTime: { $sum: '$watchTime' },
            totalContent: { $sum: 1 },
            avgCompletionRate: { $avg: '$completionPercentage' },
            avgRating: { $avg: '$rating' },
            totalQuizzes: { $sum: { $cond: [{ $ne: ['$quizResults.score', null] }, 1, 0] } },
            avgQuizScore: { $avg: '$quizResults.score' },
            uniqueContent: { $addToSet: '$contentId' }
          }
        }
      ]);
      
      // Get learning streak
      const learningStreak = await this.calculateLearningStreak(userId);
      
      // Get skill progress
      const skillProgress = await this.getSkillProgress(userId);
      
      // Get learning goals progress
      const goalsProgress = await this.getLearningGoalsProgress(userId);
      
      // Get content preferences
      const contentPreferences = await this.analyzeContentPreferences(userId);
      
      return {
        success: true,
        analytics: {
          overview: interactionStats[0] || {},
          learningStreak,
          skillProgress,
          goalsProgress,
          contentPreferences,
          timeframe
        }
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Calculate learning streak
   */
  async calculateLearningStreak(userId) {
    const interactions = await UserContentInteraction.find({
      userId,
      interactionType: 'view',
      completionPercentage: { $gte: 80 } // Consider 80%+ as "learned"
    })
    .sort({ createdAt: -1 })
    .select('createdAt');
    
    if (!interactions.length) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const interaction of interactions) {
      const interactionDate = new Date(interaction.createdAt);
      interactionDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate - interactionDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    return streak;
  }
  
  /**
   * Analyze user's content preferences
   */
  async analyzeContentPreferences(userId) {
    const preferences = await UserContentInteraction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'contents',
          localField: 'contentId',
          foreignField: 'contentId',
          as: 'content'
        }
      },
      { $unwind: '$content' },
      {
        $group: {
          _id: {
            source: '$content.source',
            difficulty: '$content.metadata.difficulty',
            category: '$content.metadata.category'
          },
          avgRating: { $avg: '$rating' },
          avgCompletion: { $avg: '$completionPercentage' },
          count: { $sum: 1 },
          totalWatchTime: { $sum: '$watchTime' }
        }
      },
      { $sort: { avgRating: -1, avgCompletion: -1 } }
    ]);
    
    return preferences;
  }
  
  /**
   * Get skill progress based on content consumption and quiz results
   */
  async getSkillProgress(userId) {
    const skillData = await UserContentInteraction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'contents',
          localField: 'contentId',
          foreignField: 'contentId',
          as: 'content'
        }
      },
      { $unwind: '$content' },
      { $unwind: '$content.metadata.tags' },
      {
        $group: {
          _id: '$content.metadata.tags',
          contentCount: { $sum: 1 },
          avgCompletion: { $avg: '$completionPercentage' },
          avgQuizScore: { $avg: '$quizResults.score' },
          totalWatchTime: { $sum: '$watchTime' },
          lastActivity: { $max: '$createdAt' }
        }
      },
      {
        $addFields: {
          skillLevel: {
            $switch: {
              branches: [
                { case: { $and: [{ $gte: ['$avgQuizScore', 90] }, { $gte: ['$contentCount', 10] }] }, then: 'advanced' },
                { case: { $and: [{ $gte: ['$avgQuizScore', 70] }, { $gte: ['$contentCount', 5] }] }, then: 'intermediate' },
                { case: { $gte: ['$contentCount', 1] }, then: 'beginner' }
              ],
              default: 'novice'
            }
          }
        }
      },
      { $sort: { totalWatchTime: -1 } }
    ]);
    
    return skillData;
  }
  
  /**
   * Track learning goals progress
   */
  async getLearningGoalsProgress(userId) {
    const user = await User.findById(userId).select('learningProfile.learningGoals');
    if (!user?.learningProfile?.learningGoals?.length) return [];
    
    const goalsWithProgress = [];
    
    for (const goal of user.learningProfile.learningGoals) {
      // Find content related to this goal
      const relatedInteractions = await UserContentInteraction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: 'contents',
            localField: 'contentId',
            foreignField: 'contentId',
            as: 'content'
          }
        },
        { $unwind: '$content' },
        {
          $match: {
            $or: [
              { 'content.metadata.tags': { $regex: goal.title, $options: 'i' } },
              { 'content.title': { $regex: goal.title, $options: 'i' } },
              { 'content.description': { $regex: goal.title, $options: 'i' } }
            ]
          }
        },
        {
          $group: {
            _id: null,
            contentCount: { $sum: 1 },
            avgCompletion: { $avg: '$completionPercentage' },
            avgQuizScore: { $avg: '$quizResults.score' },
            totalWatchTime: { $sum: '$watchTime' }
          }
        }
      ]);
      
      const stats = relatedInteractions[0] || {};
      
      // Calculate progress based on content consumption and quiz performance
      let calculatedProgress = 0;
      if (stats.contentCount > 0) {
        calculatedProgress = Math.min(100, 
          (stats.avgCompletion * 0.6) + 
          ((stats.avgQuizScore || 0) * 0.4)
        );
      }
      
      goalsWithProgress.push({
        ...goal.toObject(),
        calculatedProgress: Math.round(calculatedProgress),
        relatedContent: stats.contentCount || 0,
        avgQuizScore: stats.avgQuizScore || 0
      });
    }
    
    return goalsWithProgress;
  }
  
  /**
   * Update user behavior analytics based on interactions
   */
  async updateUserBehaviorAnalytics(userId) {
    const recentInteractions = await UserContentInteraction.find({
      userId,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    });
    
    if (!recentInteractions.length) return;
    
    // Calculate analytics
    const totalWatchTime = recentInteractions.reduce((sum, i) => sum + (i.watchTime || 0), 0);
    const avgSessionDuration = totalWatchTime / recentInteractions.length / 60; // minutes
    const avgCompletionRate = recentInteractions.reduce((sum, i) => sum + (i.completionPercentage || 0), 0) / recentInteractions.length / 100;
    const avgRating = recentInteractions.filter(i => i.rating).reduce((sum, i) => sum + i.rating, 0) / recentInteractions.filter(i => i.rating).length || 0;
    
    // Determine preferred difficulty
    const difficultyStats = {};
    for (const interaction of recentInteractions) {
      const content = await Content.findOne({ contentId: interaction.contentId }).select('metadata.difficulty');
      if (content?.metadata?.difficulty) {
        difficultyStats[content.metadata.difficulty] = (difficultyStats[content.metadata.difficulty] || 0) + 1;
      }
    }
    const preferredDifficulty = Object.keys(difficultyStats).reduce((a, b) => difficultyStats[a] > difficultyStats[b] ? a : b, 'intermediate');
    
    // Update user analytics
    await User.findByIdAndUpdate(userId, {
      $set: {
        'behaviorAnalytics.averageSessionDuration': avgSessionDuration,
        'behaviorAnalytics.contentCompletionRate': avgCompletionRate,
        'behaviorAnalytics.averageRating': avgRating,
        'behaviorAnalytics.preferredContentDifficulty': preferredDifficulty,
        'behaviorAnalytics.totalContentConsumed': recentInteractions.length,
        'behaviorAnalytics.lastAnalyticsUpdate': new Date()
      }
    });
  }
  
  /**
   * Update content consumption stats
   */
  async updateContentStats(contentId, interactionData) {
    const updates = {};
    
    if (interactionData.rating) {
      // This would need to be more sophisticated to handle weighted averages
      updates['$inc'] = { 'consumptionStats.totalRatings': 1 };
    }
    
    if (interactionData.completionPercentage >= 80) {
      updates['$inc'] = { ...updates['$inc'], 'consumptionStats.views': 1 };
    }
    
    updates['$set'] = { 'consumptionStats.lastViewed': new Date() };
    
    if (Object.keys(updates).length > 0) {
      await Content.findOneAndUpdate({ contentId }, updates);
    }
  }
  
  /**
   * Generate personalized quiz after content consumption
   */
  async generatePostContentQuiz(userId, contentId) {
    try {
      // Check if user completed the content
      const interaction = await UserContentInteraction.findOne({
        userId,
        contentId,
        completionPercentage: { $gte: 80 }
      }).sort({ createdAt: -1 });
      
      if (!interaction) {
        return { success: false, message: 'Content not sufficiently completed for quiz generation' };
      }
      
      // Check if quiz already exists
      let quiz = await Quiz.findOne({ contentId, isActive: true });
      
      if (!quiz) {
        // Generate new quiz
        quiz = await Quiz.generateFromContent(contentId, {
          difficulty: interaction.content?.metadata?.difficulty || 'intermediate'
        });
        await quiz.save();
      }
      
      return { success: true, quiz };
    } catch (error) {
      console.error('Error generating post-content quiz:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new UserAnalyticsService();