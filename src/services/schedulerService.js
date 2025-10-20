// Smart Scheduler Service
// Handles intelligent scheduling and calendar integration

class SchedulerService {
  constructor() {
    this.apiKeys = {
      googleCalendar: import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY,
    };
    this.userPreferences = this.loadUserPreferences();
  }

  // Load user scheduling preferences from localStorage
  loadUserPreferences() {
    const saved = localStorage.getItem('prodmind_scheduler_preferences');
    return saved ? JSON.parse(saved) : {
      focusHours: { start: 9, end: 17 }, // 9 AM to 5 PM
      preferredSessionLength: 30, // minutes
      breakDuration: 10, // minutes
      maxSessionsPerDay: 6,
      workDays: [1, 2, 3, 4, 5], // Monday to Friday
      energyPeaks: [9, 14], // 9 AM and 2 PM
      avoidTimes: [], // Array of {start, end} objects
    };
  }

  // Save user preferences
  saveUserPreferences(preferences) {
    this.userPreferences = { ...this.userPreferences, ...preferences };
    localStorage.setItem('prodmind_scheduler_preferences', JSON.stringify(this.userPreferences));
  }

  // Analyze user's historical engagement to predict optimal times
  analyzeEngagementPatterns() {
    const sessions = this.getHistoricalSessions();
    const patterns = {
      hourlyEngagement: {},
      dayOfWeekEngagement: {},
      sessionLengthOptimal: 30,
      focusPeaks: []
    };

    // Analyze hourly patterns
    sessions.forEach(session => {
      const hour = new Date(session.startTime).getHours();
      const day = new Date(session.startTime).getDay();
      
      if (!patterns.hourlyEngagement[hour]) {
        patterns.hourlyEngagement[hour] = { total: 0, successful: 0 };
      }
      if (!patterns.dayOfWeekEngagement[day]) {
        patterns.dayOfWeekEngagement[day] = { total: 0, successful: 0 };
      }

      patterns.hourlyEngagement[hour].total++;
      patterns.dayOfWeekEngagement[day].total++;

      if (session.completed && session.focusScore > 7) {
        patterns.hourlyEngagement[hour].successful++;
        patterns.dayOfWeekEngagement[day].successful++;
      }
    });

    // Find focus peaks (hours with >70% success rate)
    patterns.focusPeaks = Object.entries(patterns.hourlyEngagement)
      .filter(([hour, data]) => data.total > 2 && (data.successful / data.total) > 0.7)
      .map(([hour]) => parseInt(hour))
      .sort();

    return patterns;
  }

  // Get historical learning sessions
  getHistoricalSessions() {
    const saved = localStorage.getItem('prodmind_learning_sessions');
    return saved ? JSON.parse(saved) : [];
  }



  // Generate optimal schedule for content
  async generateSchedule(contentItems, timeframe = 'week') {
    const patterns = this.analyzeEngagementPatterns();
    const schedule = [];
    const startDate = new Date();
    const endDate = new Date();
    
    if (timeframe === 'week') {
      endDate.setDate(startDate.getDate() + 7);
    } else if (timeframe === 'month') {
      endDate.setMonth(startDate.getMonth() + 1);
    }

    // Sort content by priority and estimated duration
    const sortedContent = contentItems
      .filter(item => !item.consumed)
      .sort((a, b) => b.priority - a.priority);

    let currentDate = new Date(startDate);
    let contentIndex = 0;

    while (currentDate <= endDate && contentIndex < sortedContent.length) {
      // Skip weekends if not in work days
      if (!this.userPreferences.workDays.includes(currentDate.getDay())) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      const dailySessions = this.scheduleDailyContent(
        currentDate, 
        sortedContent.slice(contentIndex), 
        patterns
      );

      schedule.push(...dailySessions);
      contentIndex += dailySessions.length;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return schedule;
  }

  // Schedule content for a specific day
  scheduleDailyContent(date, availableContent, patterns) {
    const sessions = [];
    const { focusHours, preferredSessionLength, maxSessionsPerDay } = this.userPreferences;
    
    // Get optimal time slots for the day
    const optimalSlots = this.getOptimalTimeSlots(date, patterns);
    
    let sessionCount = 0;
    let slotIndex = 0;

    while (sessionCount < maxSessionsPerDay && 
           slotIndex < optimalSlots.length && 
           sessionCount < availableContent.length) {
      
      const slot = optimalSlots[slotIndex];
      const content = availableContent[sessionCount];
      
      // Estimate session duration based on content type and difficulty
      const estimatedDuration = this.estimateSessionDuration(content);
      
      sessions.push({
        id: `session_${date.toISOString().split('T')[0]}_${sessionCount}`,
        contentId: content.id,
        content: content,
        startTime: slot.start,
        endTime: new Date(slot.start.getTime() + estimatedDuration * 60000),
        duration: estimatedDuration,
        type: 'learning',
        priority: content.priority,
        focusPrediction: slot.focusScore,
        status: 'scheduled'
      });

      sessionCount++;
      slotIndex++;
    }

    return sessions;
  }

  // Get optimal time slots for a given day
  getOptimalTimeSlots(date, patterns) {
    const slots = [];
    const { focusHours, preferredSessionLength, breakDuration } = this.userPreferences;
    
    // Generate potential slots within focus hours
    for (let hour = focusHours.start; hour < focusHours.end; hour++) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      
      // Calculate focus score for this time slot
      const focusScore = this.calculateFocusScore(hour, date.getDay(), patterns);
      
      slots.push({
        start: slotStart,
        focusScore: focusScore,
        available: true
      });
    }

    // Sort by focus score (highest first)
    return slots.sort((a, b) => b.focusScore - a.focusScore);
  }

  // Calculate predicted focus score for a time slot
  calculateFocusScore(hour, dayOfWeek, patterns) {
    let score = 5; // Base score
    
    // Boost score for historical peak hours
    if (patterns.focusPeaks.includes(hour)) {
      score += 3;
    }
    
    // Boost for user's preferred energy peaks
    if (this.userPreferences.energyPeaks.includes(hour)) {
      score += 2;
    }
    
    // Reduce score for early morning or late evening
    if (hour < 8 || hour > 18) {
      score -= 2;
    }
    
    // Boost for mid-morning and early afternoon
    if ((hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 16)) {
      score += 1;
    }
    
    // Historical success rate boost
    const hourlyData = patterns.hourlyEngagement[hour];
    if (hourlyData && hourlyData.total > 0) {
      const successRate = hourlyData.successful / hourlyData.total;
      score += successRate * 3;
    }

    return Math.min(10, Math.max(1, score));
  }

  // Estimate session duration based on content
  estimateSessionDuration(content) {
    let baseDuration = this.userPreferences.preferredSessionLength;
    
    // Adjust based on content difficulty
    if (content.difficulty === 'advanced') {
      baseDuration += 15;
    } else if (content.difficulty === 'beginner') {
      baseDuration -= 10;
    }
    
    // Adjust based on content type and estimated length
    if (content.type === 'video' && content.duration) {
      const videoDuration = this.parseVideoDuration(content.duration);
      baseDuration = Math.max(baseDuration, videoDuration + 10); // Add buffer time
    }
    
    // Adjust based on priority
    if (content.priority >= 8) {
      baseDuration += 10; // More time for high-priority content
    }
    
    return Math.min(90, Math.max(15, baseDuration)); // 15-90 minute range
  }

  // Parse video duration string (e.g., "15:30" -> 15.5 minutes)
  parseVideoDuration(durationStr) {
    if (!durationStr) return 30;
    
    const parts = durationStr.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) + parseInt(parts[1]) / 60;
    }
    return 30;
  }

  // Save a completed learning session
  saveSession(sessionData) {
    const sessions = this.getHistoricalSessions();
    sessions.push({
      ...sessionData,
      completedAt: new Date().toISOString()
    });
    
    // Keep only last 100 sessions
    const recentSessions = sessions.slice(-100);
    localStorage.setItem('prodmind_learning_sessions', JSON.stringify(recentSessions));
  }

  // Get today's scheduled sessions
  getTodaysSchedule() {
    const saved = localStorage.getItem('prodmind_daily_schedule');
    if (saved) {
      const schedule = JSON.parse(saved);
      const today = new Date().toDateString();
      return schedule.filter(session => 
        new Date(session.startTime).toDateString() === today
      );
    }
    return [];
  }

  // Save generated schedule
  saveSchedule(schedule) {
    localStorage.setItem('prodmind_daily_schedule', JSON.stringify(schedule));
  }
}

export default new SchedulerService();