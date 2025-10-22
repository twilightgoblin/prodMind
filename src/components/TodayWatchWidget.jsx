import { useState, useEffect } from 'react';
import { Play, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateVideoPlayerUrl } from '../utils/videoUtils';

const TodayWatchWidget = ({ onNavigateToScheduler }) => {
  const [todaysContent, setTodaysContent] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodaysContent();
  }, []);

  const fetchTodaysContent = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiBaseUrl}/scheduler/date/${today}`);

      if (response.ok) {
        const data = await response.json();
        const scheduledToday = data.scheduledContent.filter(item => item.status === 'scheduled');
        setTodaysContent(scheduledToday);
      }
    } catch (error) {
      console.error('Error fetching today\'s content:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const addToMobileCalendar = (item) => {
    const startDate = new Date(`${item.scheduledDate.split('T')[0]}T${item.scheduledTime}`);
    const endDate = new Date(startDate.getTime() + (item.estimatedDuration || 30) * 60000);

    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `📚 ${item.title}`,
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
      details: `Learning session: ${item.title}\n\nChannel: ${item.channelTitle || 'Unknown'}\nWatch: ${item.url}\n\nNotes: ${item.notes || 'No notes'}`,
      location: 'Online Learning',
      trp: 'false'
    });

    const url = `https://calendar.google.com/calendar/render?${params.toString()}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Clock size={16} className="animate-spin" />
          <span className="text-sm">Loading today's schedule...</span>
        </div>
      </div>
    );
  }

  if (todaysContent.length === 0) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
        <div className="text-center text-gray-400">
          <Calendar size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No learning sessions scheduled for today</p>
          <button
            onClick={onNavigateToScheduler}
            className="mt-2 text-blue-400 hover:text-blue-300 text-sm underline"
          >
            Schedule some content
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Play className="text-blue-400" size={18} />
          Today's Learning ({todaysContent.length})
        </h3>
        <button
          onClick={onNavigateToScheduler}
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {todaysContent.slice(0, 3).map(item => (
          <div key={item._id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-12 h-8 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm line-clamp-1 mb-1">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{formatTime(item.scheduledTime)}</span>
                  <span>•</span>
                  <span className="text-yellow-400">Priority {item.priority}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <Link
                  to={generateVideoPlayerUrl(item)}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center gap-1 no-underline"
                >
                  <Play size={12} />
                  Watch
                </Link>
                <button
                  onClick={() => addToMobileCalendar(item)}
                  className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                  title="Add to calendar"
                >
                  <Calendar size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {todaysContent.length > 3 && (
        <button
          onClick={onNavigateToScheduler}
          className="w-full mt-3 px-3 py-2 bg-blue-600/20 text-blue-400 text-sm rounded border border-blue-600/30 hover:bg-blue-600/30 transition-colors flex items-center justify-center gap-1"
        >
          View all {todaysContent.length} sessions
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
};

export default TodayWatchWidget;