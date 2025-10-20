// Custom hook for scheduler management
import { useState, useEffect } from 'react';
import schedulerService from '../services/schedulerService';

export const useScheduler = () => {
  const [schedule, setSchedule] = useState([]);
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [preferences, setPreferences] = useState(schedulerService.userPreferences);
  const [loading, setLoading] = useState(false);
  const [patterns, setPatterns] = useState(null);

  // Generate schedule for content
  const generateSchedule = async (contentItems, timeframe = 'week') => {
    setLoading(true);
    try {
      const newSchedule = await schedulerService.generateSchedule(contentItems, timeframe);
      setSchedule(newSchedule);
      schedulerService.saveSchedule(newSchedule);
      
      // Update today's schedule
      const today = new Date().toDateString();
      const todaySessions = newSchedule.filter(session => 
        new Date(session.startTime).toDateString() === today
      );
      setTodaysSchedule(todaySessions);
    } catch (error) {
      console.error('Error generating schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update user preferences
  const updatePreferences = (newPreferences) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    schedulerService.saveUserPreferences(updated);
  };

  // Mark session as completed
  const completeSession = (sessionId, focusScore = 8, notes = '') => {
    const session = schedule.find(s => s.id === sessionId);
    if (session) {
      const completedSession = {
        ...session,
        completed: true,
        focusScore,
        notes,
        actualEndTime: new Date().toISOString()
      };
      
      schedulerService.saveSession(completedSession);
      
      // Update schedule state
      const updatedSchedule = schedule.map(s => 
        s.id === sessionId ? completedSession : s
      );
      setSchedule(updatedSchedule);
      schedulerService.saveSchedule(updatedSchedule);
      
      // Update today's schedule
      setTodaysSchedule(prev => 
        prev.map(s => s.id === sessionId ? completedSession : s)
      );
    }
  };

  // Reschedule a session
  const rescheduleSession = (sessionId, newStartTime) => {
    const updatedSchedule = schedule.map(session => {
      if (session.id === sessionId) {
        const newEndTime = new Date(newStartTime.getTime() + session.duration * 60000);
        return {
          ...session,
          startTime: newStartTime,
          endTime: newEndTime,
          status: 'rescheduled'
        };
      }
      return session;
    });
    
    setSchedule(updatedSchedule);
    schedulerService.saveSchedule(updatedSchedule);
    
    // Update today's schedule if needed
    const today = new Date().toDateString();
    const todaySessions = updatedSchedule.filter(session => 
      new Date(session.startTime).toDateString() === today
    );
    setTodaysSchedule(todaySessions);
  };

  // Get engagement patterns
  const getEngagementPatterns = () => {
    if (!patterns) {
      const analysisPatterns = schedulerService.analyzeEngagementPatterns();
      setPatterns(analysisPatterns);
      return analysisPatterns;
    }
    return patterns;
  };

  // Get upcoming sessions (next 24 hours)
  const getUpcomingSessions = () => {
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    return schedule.filter(session => {
      const sessionTime = new Date(session.startTime);
      return sessionTime >= now && sessionTime <= next24Hours && !session.completed;
    }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  };

  // Get schedule statistics
  const getScheduleStats = () => {
    const total = schedule.length;
    const completed = schedule.filter(s => s.completed).length;
    const upcoming = schedule.filter(s => !s.completed && new Date(s.startTime) > new Date()).length;
    const overdue = schedule.filter(s => !s.completed && new Date(s.startTime) < new Date()).length;
    
    const completionRate = total > 0 ? (completed / total * 100).toFixed(1) : 0;
    
    const avgFocusScore = schedule
      .filter(s => s.completed && s.focusScore)
      .reduce((sum, s, _, arr) => sum + s.focusScore / arr.length, 0)
      .toFixed(1);

    return {
      total,
      completed,
      upcoming,
      overdue,
      completionRate,
      avgFocusScore: avgFocusScore || 0
    };
  };

  // Load initial data
  useEffect(() => {
    const savedSchedule = localStorage.getItem('prodmind_daily_schedule');
    if (savedSchedule) {
      const parsedSchedule = JSON.parse(savedSchedule);
      setSchedule(parsedSchedule);
      
      // Filter today's sessions
      const today = new Date().toDateString();
      const todaySessions = parsedSchedule.filter(session => 
        new Date(session.startTime).toDateString() === today
      );
      setTodaysSchedule(todaySessions);
    }
    
    // Load engagement patterns
    getEngagementPatterns();
  }, []);

  return {
    schedule,
    todaysSchedule,
    preferences,
    loading,
    patterns,
    generateSchedule,
    updatePreferences,
    completeSession,
    rescheduleSession,
    getEngagementPatterns,
    getUpcomingSessions,
    getScheduleStats
  };
};