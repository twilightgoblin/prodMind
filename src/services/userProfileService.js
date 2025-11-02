class UserProfileService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
  }

  /**
   * Get user profile with analytics
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User profile response
   */
  async getUserProfile(userId) {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${this.baseURL}/api/user/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user profile');
      }

      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} - Updated profile response
   */
  async updateProfile(profileData) {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${this.baseURL}/api/user/profile/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Update learning goals
   * @param {Array} goals - Array of learning goals
   * @returns {Promise<Object>} - Response
   */
  async updateLearningGoals(goals) {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${this.baseURL}/api/user/learning-goals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ goals })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update learning goals');
      }

      return data;
    } catch (error) {
      console.error('Error updating learning goals:', error);
      throw error;
    }
  }

  /**
   * Update progress for a specific learning goal
   * @param {number} goalIndex - Index of the goal
   * @param {number} progress - Progress percentage (0-100)
   * @returns {Promise<Object>} - Response
   */
  async updateGoalProgress(goalIndex, progress) {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${this.baseURL}/api/user/learning-goals/${goalIndex}/progress`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ progress })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update goal progress');
      }

      return data;
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw error;
    }
  }

  /**
   * Get personalized dashboard data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Dashboard data response
   */
  async getDashboardData(userId) {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${this.baseURL}/api/user/dashboard/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get dashboard data');
      }

      return data;
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }

  /**
   * Helper method to add a learning interest
   * @param {string} topic - Interest topic
   * @param {string} proficiency - Proficiency level
   * @param {number} priority - Priority (1-10)
   * @returns {Promise<Object>} - Response
   */
  async addLearningInterest(topic, proficiency = 'intermediate', priority = 5) {
    try {
      // Get current profile
      const token = localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const currentProfile = await this.getUserProfile(userData.id);
      
      const currentInterests = currentProfile.data.user.learningProfile?.interests || [];
      
      // Check if interest already exists
      const existingInterest = currentInterests.find(interest => 
        interest.topic.toLowerCase() === topic.toLowerCase()
      );
      
      if (existingInterest) {
        throw new Error('Interest already exists');
      }
      
      // Add new interest
      const updatedInterests = [
        ...currentInterests,
        { topic, proficiency, priority }
      ];
      
      return this.updateProfile({
        learningProfile: {
          interests: updatedInterests
        }
      });
    } catch (error) {
      console.error('Error adding learning interest:', error);
      throw error;
    }
  }

  /**
   * Helper method to remove a learning interest
   * @param {string} topic - Interest topic to remove
   * @returns {Promise<Object>} - Response
   */
  async removeLearningInterest(topic) {
    try {
      // Get current profile
      const token = localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const currentProfile = await this.getUserProfile(userData.id);
      
      const currentInterests = currentProfile.data.user.learningProfile?.interests || [];
      
      // Remove interest
      const updatedInterests = currentInterests.filter(interest => 
        interest.topic.toLowerCase() !== topic.toLowerCase()
      );
      
      return this.updateProfile({
        learningProfile: {
          interests: updatedInterests
        }
      });
    } catch (error) {
      console.error('Error removing learning interest:', error);
      throw error;
    }
  }

  /**
   * Helper method to add a learning goal
   * @param {string} title - Goal title
   * @param {string} description - Goal description
   * @param {Date} targetDate - Target completion date
   * @returns {Promise<Object>} - Response
   */
  async addLearningGoal(title, description = '', targetDate = null) {
    try {
      // Get current profile
      const token = localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const currentProfile = await this.getUserProfile(userData.id);
      
      const currentGoals = currentProfile.data.user.learningProfile?.learningGoals || [];
      
      // Add new goal
      const updatedGoals = [
        ...currentGoals,
        {
          title,
          description,
          targetDate,
          progress: 0,
          createdAt: new Date()
        }
      ];
      
      return this.updateLearningGoals(updatedGoals);
    } catch (error) {
      console.error('Error adding learning goal:', error);
      throw error;
    }
  }

  /**
   * Helper method to update user preferences
   * @param {Object} preferences - Preferences to update
   * @returns {Promise<Object>} - Response
   */
  async updatePreferences(preferences) {
    return this.updateProfile({ preferences });
  }



  /**
   * Helper method to update available time
   * @param {number} dailyMinutes - Daily available minutes
   * @param {Array} preferredTimes - Preferred time slots
   * @returns {Promise<Object>} - Response
   */
  async updateAvailableTime(dailyMinutes, preferredTimes = []) {
    return this.updateProfile({
      learningProfile: {
        availableTime: {
          dailyMinutes,
          preferredTimes
        }
      }
    });
  }

}

export default new UserProfileService();