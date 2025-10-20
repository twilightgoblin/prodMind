// MetaLearning Analytics Service - Advanced learning insights
class MetaLearningService {
  constructor() {
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1';
  }

  async analyzeLearningPatterns(learningData, timeframe = '30d') {
    try {
      // Check if API key is available
      if (!this.openaiApiKey || this.openaiApiKey.includes('your_openai_api_key')) {
        throw new Error('OpenAI API key not configured - cannot analyze learning patterns');
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{
            role: 'system',
            content: 'You are a learning analytics expert. Analyze the provided learning data to identify patterns, strengths, weaknesses, and provide actionable insights for improvement.'
          }, {
            role: 'user',
            content: `Analyze this learning data over ${timeframe}: ${JSON.stringify(learningData)}. Provide insights on learning patterns, efficiency, retention, and recommendations.`
          }],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const analysis = this.parseLearningAnalysis(data.choices[0].message.content);
      
      return {
        success: true,
        data: analysis,
        metadata: {
          analyzedAt: new Date().toISOString(),
          timeframe,
          dataPoints: learningData.length
        }
      };
    } catch (error) {
      console.error('Learning analysis error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  parseLearningAnalysis(content) {
    try {
      const analysis = {
        overallScore: 75,
        learningEfficiency: 'moderate',
        retentionRate: 68,
        strengths: [],
        weaknesses: [],
        patterns: [],
        recommendations: [],
        insights: []
      };

      const lines = content.split('\n').filter(line => line.trim());
      
      lines.forEach(line => {
        const lower = line.toLowerCase();
        if (lower.includes('strength') || lower.includes('good at')) {
          analysis.strengths.push(line.replace(/^[-*]\s*/, '').trim());
        } else if (lower.includes('weakness') || lower.includes('struggle') || lower.includes('difficulty')) {
          analysis.weaknesses.push(line.replace(/^[-*]\s*/, '').trim());
        } else if (lower.includes('pattern') || lower.includes('trend')) {
          analysis.patterns.push(line.replace(/^[-*]\s*/, '').trim());
        } else if (lower.includes('recommend') || lower.includes('suggest')) {
          analysis.recommendations.push(line.replace(/^[-*]\s*/, '').trim());
        } else if (lower.includes('insight') || lower.includes('finding')) {
          analysis.insights.push(line.replace(/^[-*]\s*/, '').trim());
        }
      });

      return analysis;
    } catch {
      return this.getDefaultAnalysis();
    }
  }

  async generateLearningPlan(goals, currentLevel, preferences = {}) {
    try {
      // Check if API key is available
      if (!this.openaiApiKey || this.openaiApiKey.includes('your_openai_api_key')) {
        throw new Error('OpenAI API key not configured - cannot generate learning plan');
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{
            role: 'system',
            content: 'You are a personalized learning plan generator. Create detailed, actionable learning plans based on goals, current level, and preferences.'
          }, {
            role: 'user',
            content: `Create a learning plan for: Goals: ${goals}, Current Level: ${currentLevel}, Preferences: ${JSON.stringify(preferences)}`
          }],
          temperature: 0.4,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const plan = this.parseLearningPlan(data.choices[0].message.content);
      
      return {
        success: true,
        data: plan,
        metadata: {
          generatedAt: new Date().toISOString(),
          goals,
          currentLevel
        }
      };
    } catch (error) {
      console.error('Learning plan generation error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  parseLearningPlan(content) {
    const plan = {
      title: 'Personalized Learning Plan',
      duration: '4 weeks',
      phases: [],
      milestones: [],
      resources: [],
      schedule: []
    };

    const lines = content.split('\n').filter(line => line.trim());
    let currentSection = '';

    lines.forEach(line => {
      const lower = line.toLowerCase();
      if (lower.includes('phase') || lower.includes('week')) {
        plan.phases.push({
          title: line.trim(),
          tasks: [],
          duration: '1 week'
        });
        currentSection = 'phase';
      } else if (lower.includes('milestone') || lower.includes('goal')) {
        plan.milestones.push(line.replace(/^[-*]\s*/, '').trim());
        currentSection = 'milestone';
      } else if (lower.includes('resource') || lower.includes('material')) {
        plan.resources.push(line.replace(/^[-*]\s*/, '').trim());
        currentSection = 'resource';
      } else if (currentSection === 'phase' && plan.phases.length > 0) {
        plan.phases[plan.phases.length - 1].tasks.push(line.replace(/^[-*]\s*/, '').trim());
      }
    });

    return plan;
  }

  getDefaultAnalysis() {
    return {
      overallScore: 70,
      learningEfficiency: 'moderate',
      retentionRate: 65,
      strengths: [
        'Consistent study schedule',
        'Good at visual learning',
        'Strong problem-solving skills'
      ],
      weaknesses: [
        'Difficulty with abstract concepts',
        'Limited practice time',
        'Needs more review sessions'
      ],
      patterns: [
        'Better performance in morning sessions',
        'Improved retention with spaced repetition',
        'Higher engagement with interactive content'
      ],
      recommendations: [
        'Increase practice frequency',
        'Use more visual aids',
        'Implement spaced repetition',
        'Schedule regular review sessions'
      ],
      insights: [
        'Learning curve shows steady improvement',
        'Peak performance occurs during focused sessions',
        'Collaborative learning enhances understanding'
      ]
    };
  }

  getDefaultLearningPlan() {
    return {
      title: 'Personalized Learning Plan',
      duration: '4 weeks',
      phases: [
        {
          title: 'Week 1: Foundation Building',
          tasks: [
            'Review basic concepts',
            'Complete introductory exercises',
            'Set up learning environment'
          ],
          duration: '1 week'
        },
        {
          title: 'Week 2: Skill Development',
          tasks: [
            'Practice core skills',
            'Work on practical projects',
            'Seek feedback and guidance'
          ],
          duration: '1 week'
        }
      ],
      milestones: [
        'Complete foundation assessment',
        'Demonstrate core competencies',
        'Apply skills to real projects'
      ],
      resources: [
        'Online tutorials and courses',
        'Practice exercises and quizzes',
        'Community forums and support'
      ],
      schedule: []
    };
  }

  // Learning data tracking
  trackLearningSession(sessionData) {
    try {
      const sessions = this.getLearningHistory();
      const newSession = {
        id: Date.now(),
        ...sessionData,
        timestamp: new Date().toISOString()
      };
      
      sessions.push(newSession);
      localStorage.setItem('prodmind_learning_sessions', JSON.stringify(sessions));
      
      return { success: true, id: newSession.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getLearningHistory(limit = 100) {
    try {
      const sessions = localStorage.getItem('prodmind_learning_sessions');
      const parsed = sessions ? JSON.parse(sessions) : [];
      return parsed.slice(-limit);
    } catch {
      return [];
    }
  }

  calculateLearningMetrics(sessions) {
    if (!sessions || sessions.length === 0) {
      return {
        totalSessions: 0,
        totalTime: 0,
        averageScore: 0,
        streakDays: 0,
        topicDistribution: {},
        progressTrend: []
      };
    }

    const totalSessions = sessions.length;
    const totalTime = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const averageScore = sessions.reduce((sum, session) => sum + (session.score || 0), 0) / totalSessions;
    
    // Calculate streak
    const sortedSessions = sessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    let streakDays = 0;
    let currentDate = new Date();
    
    for (const session of sortedSessions) {
      const sessionDate = new Date(session.timestamp);
      const daysDiff = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= streakDays + 1) {
        streakDays = Math.max(streakDays, daysDiff + 1);
      } else {
        break;
      }
    }

    // Topic distribution
    const topicDistribution = {};
    sessions.forEach(session => {
      if (session.topic) {
        topicDistribution[session.topic] = (topicDistribution[session.topic] || 0) + 1;
      }
    });

    // Progress trend (last 7 days)
    const progressTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.timestamp);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      });
      
      progressTrend.push({
        date: dayStart.toISOString().split('T')[0],
        sessions: daySessions.length,
        totalTime: daySessions.reduce((sum, session) => sum + (session.duration || 0), 0),
        averageScore: daySessions.length > 0 
          ? daySessions.reduce((sum, session) => sum + (session.score || 0), 0) / daySessions.length 
          : 0
      });
    }

    return {
      totalSessions,
      totalTime,
      averageScore: Math.round(averageScore * 100) / 100,
      streakDays,
      topicDistribution,
      progressTrend
    };
  }

  async saveLearningPlan(plan, name) {
    try {
      const savedPlans = this.getSavedLearningPlans();
      const newPlan = {
        id: Date.now(),
        name,
        plan,
        createdAt: new Date().toISOString(),
        isActive: false
      };
      
      savedPlans.push(newPlan);
      localStorage.setItem('prodmind_learning_plans', JSON.stringify(savedPlans));
      
      return { success: true, id: newPlan.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getSavedLearningPlans() {
    try {
      const saved = localStorage.getItem('prodmind_learning_plans');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  deleteLearningPlan(id) {
    try {
      const plans = this.getSavedLearningPlans();
      const filtered = plans.filter(plan => plan.id !== id);
      localStorage.setItem('prodmind_learning_plans', JSON.stringify(filtered));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }


}

export default new MetaLearningService();