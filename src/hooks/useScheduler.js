// Custom hook for scheduler management
import { useState, useEffect } from 'react';

export const useScheduler = () => {
  const [schedule, setSchedule] = useState([]);
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [preferences, setPreferences] = useState({
    focusHours: { start: 9, end: 17 },
    preferredSessionLength: 30,
    maxSessionsPerDay: 4,
    breakDuration: 15,
    adaptiveScheduling: true
  });
  const [loading, setLoading] = useState(false);
  const [patterns, setPatterns] = useState(null);

  // Fetch scheduled content from API
  const fetchScheduledContent = async (filters = {}) => {
    setLoading(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      let url = `${apiBaseUrl}/scheduler`;
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const scheduledContent = data.scheduledContent || [];

        // Transform API data to match existing component structure
        const transformedSchedule = scheduledContent.map(item => ({
          id: item._id,
          content: {
            title: item.title,
            url: item.url,
            thumbnail: item.thumbnail,
            channelTitle: item.channelTitle
          },
          startTime: new Date(`${item.scheduledDate.split('T')[0]}T${item.scheduledTime}`).toISOString(),
          endTime: new Date(`${item.scheduledDate.split('T')[0]}T${item.scheduledTime}`).toISOString(),
          duration: item.estimatedDuration || 30,
          priority: item.priority,
          status: item.status,
          completed: item.status === 'completed',
          focusPrediction: Math.floor(Math.random() * 3) + 7, // Mock focus prediction
          notes: item.notes
        }));

        setSchedule(transformedSchedule);

        // Update today's schedule
        const today = new Date().toDateString();
        const todaySessions = transformedSchedule.filter(session =>
          new Date(session.startTime).toDateString() === today
        );
        setTodaysSchedule(todaySessions);
      }
    } catch (error) {
      console.error('Error fetching scheduled content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate schedule for content (placeholder for now)
  const generateSchedule = async (contentItems, timeframe = 'week') => {
    // For now, just fetch existing scheduled content
    await fetchScheduledContent();
  };

  // Update user preferences
  const updatePreferences = (newPreferences) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem('prodmind_scheduler_preferences', JSON.stringify(updated));
  };

  // Mark session as completed
  const completeSession = async (sessionId, focusScore = 8, notes = '') => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiBaseUrl}/scheduler/${sessionId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: focusScore,
          feedback: notes,
          actualDuration: 30 // Could be calculated based on actual time
        })
      });

      if (response.ok) {
        // Refresh the schedule
        await fetchScheduledContent();
      }
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  // Reschedule a session
  const rescheduleSession = async (sessionId, newStartTime) => {
    try {
      const newDate = newStartTime.toISOString().split('T')[0];
      const newTime = newStartTime.toTimeString().slice(0, 5);

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiBaseUrl}/scheduler/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduledDate: newDate,
          scheduledTime: newTime
        })
      });

      if (response.ok) {
        // Refresh the schedule
        await fetchScheduledContent();
      }
    } catch (error) {
      console.error('Error rescheduling session:', error);
    }
  };

  // Get engagement patterns (mock data for now)
  const getEngagementPatterns = () => {
    if (!patterns) {
      const mockPatterns = {
        hourlyEngagement: {
          9: { total: 10, successful: 8 },
          10: { total: 12, successful: 10 },
          11: { total: 8, successful: 7 },
          14: { total: 15, successful: 12 },
          15: { total: 10, successful: 9 },
          16: { total: 8, successful: 6 }
        },
        focusPeaks: [10, 14, 15]
      };
      setPatterns(mockPatterns);
      return mockPatterns;
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
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem('prodmind_scheduler_preferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }

    // Fetch scheduled content from API
    fetchScheduledContent();

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
    getScheduleStats,
    fetchScheduledContent
  };
};