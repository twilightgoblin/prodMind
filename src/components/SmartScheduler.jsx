import { useState, useEffect } from 'react';
import { Calendar, Clock, Play, CheckCircle, X, Filter, BarChart3, Plus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import CalendarIntegration from './CalendarIntegration';
import { generateVideoPlayerUrl } from '../utils/videoUtils';

const SmartScheduler = () => {
  const navigate = useNavigate();
  const [scheduledContent, setScheduledContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState('all');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    fetchScheduledContent();
  }, [selectedDate, filter]);

  const fetchScheduledContent = async () => {
    setLoading(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      let url = `${apiBaseUrl}/scheduler`;
      const params = new URLSearchParams();
      
      if (filter !== 'all') {
        params.append('status', filter);
      }
      
      if (selectedDate) {
        params.append('startDate', selectedDate);
        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() + 1);
        params.append('endDate', endDate.toISOString().split('T')[0]);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setScheduledContent(data.scheduledContent || []);
      }
    } catch (error) {
      console.error('Error fetching scheduled content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiBaseUrl}/scheduler/analytics`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const updateContentStatus = async (id, status, additionalData = {}) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      const endpoint = status === 'completed' ? 'complete' : 'cancel';
      const response = await fetch(`${apiBaseUrl}/scheduler/${id}/${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(additionalData)
      });

      if (response.ok) {
        fetchScheduledContent();
      }
    } catch (error) {
      console.error('Error updating content status:', error);
    }
  };

  const deleteScheduledContent = async (id) => {
    if (!confirm('Are you sure you want to delete this scheduled content?')) return;
    
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiBaseUrl}/scheduler/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchScheduledContent();
      }
    } catch (error) {
      console.error('Error deleting scheduled content:', error);
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDuration = (duration) => {
    if (!duration) return null;
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;
    
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    
    if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-600';
      case 'in-progress': return 'bg-yellow-600';
      case 'completed': return 'bg-green-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Clock size={16} />;
      case 'in-progress': return <Play size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'cancelled': return <X size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
    if (!showAnalytics && !analytics) {
      fetchAnalytics();
    }
  };

  // Mobile calendar integration
  const addToMobileCalendar = (item) => {
    const startDate = new Date(`${item.scheduledDate.split('T')[0]}T${item.scheduledTime}`);
    const endDate = new Date(startDate.getTime() + (item.estimatedDuration || 30) * 60000);
    
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    // Create calendar event details
    const eventDetails = {
      title: `📚 ${item.title}`,
      description: `Learning session: ${item.title}\n\nChannel: ${item.channelTitle || 'Unknown'}\nDuration: ${formatDuration(item.duration) || `${item.estimatedDuration || 30} min`}\n\nWatch: ${item.url}\n\nNotes: ${item.notes || 'No notes'}`,
      startTime: formatDate(startDate),
      endTime: formatDate(endDate),
      url: item.url
    };

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // For mobile devices, try native calendar first
      if (navigator.share) {
        // Use Web Share API if available
        const shareData = {
          title: eventDetails.title,
          text: eventDetails.description,
          url: item.url
        };
        navigator.share(shareData).catch(console.error);
      } else {
        // Fallback to Google Calendar
        openGoogleCalendar(eventDetails);
      }
    } else {
      // For desktop, show options
      showCalendarOptions(eventDetails);
    }
  };

  const openGoogleCalendar = (eventDetails) => {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: eventDetails.title,
      dates: `${eventDetails.startTime}/${eventDetails.endTime}`,
      details: eventDetails.description,
      location: 'Online Learning',
      trp: 'false'
    });

    const url = `https://calendar.google.com/calendar/render?${params.toString()}`;
    window.open(url, '_blank');
  };

  const showCalendarOptions = (eventDetails) => {
    // Create a temporary modal for calendar options
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-gray-900 rounded-lg border border-gray-800 p-6 max-w-sm w-full">
        <h3 class="text-white font-semibold mb-4">Add to Calendar</h3>
        <div class="space-y-2">
          <button onclick="window.open('https://calendar.google.com/calendar/render?${new URLSearchParams({
            action: 'TEMPLATE',
            text: eventDetails.title,
            dates: `${eventDetails.startTime}/${eventDetails.endTime}`,
            details: eventDetails.description,
            location: 'Online Learning'
          }).toString()}', '_blank'); this.closest('.fixed').remove();" 
                  class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Google Calendar
          </button>
          <button onclick="window.open('https://outlook.live.com/calendar/0/deeplink/compose?${new URLSearchParams({
            subject: eventDetails.title,
            startdt: eventDetails.startTime,
            enddt: eventDetails.endTime,
            body: eventDetails.description,
            location: 'Online Learning'
          }).toString()}', '_blank'); this.closest('.fixed').remove();" 
                  class="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors">
            Outlook
          </button>
          <button onclick="this.closest('.fixed').remove();" 
                  class="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Remove modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#060010] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="text-blue-400" />
            Smart Scheduler
          </h1>
          <div className="flex gap-2">
            <a
              href="/dashboard/content"
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg no-underline text-white"
              style={{ textDecoration: 'none', color: 'white' }}
            >
              <Plus size={16} />
              Generate Schedule
            </a>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Calendar size={16} />
              Calendar
            </button>
            <button
              onClick={toggleAnalytics}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <BarChart3 size={16} />
              Analytics
            </button>
          </div>
        </div>

        {/* Calendar Integration */}
        {showCalendar && (
          <div className="mb-6">
            <CalendarIntegration scheduledContent={scheduledContent} />
          </div>
        )}

        {/* Analytics Panel */}
        {showAnalytics && analytics && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Learning Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-900/30 p-4 rounded-lg">
                <h3 className="text-blue-300 font-medium">Total Scheduled</h3>
                <p className="text-2xl font-bold">{analytics.totalScheduled}</p>
              </div>
              <div className="bg-green-900/30 p-4 rounded-lg">
                <h3 className="text-green-300 font-medium">Completion Rate</h3>
                <p className="text-2xl font-bold">{analytics.completionRate}%</p>
              </div>
              <div className="bg-yellow-900/30 p-4 rounded-lg">
                <h3 className="text-yellow-300 font-medium">Avg Rating</h3>
                <p className="text-2xl font-bold">
                  {analytics.analytics.find(a => a._id === 'completed')?.avgRating?.toFixed(1) || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none w-full sm:w-auto"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none w-full sm:w-auto"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Quick Actions for Mobile */}
            <div className="flex items-center gap-2 sm:ml-auto">
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="px-3 py-2 bg-blue-600/20 text-blue-400 text-sm rounded border border-blue-600/30 hover:bg-blue-600/30 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setFilter('scheduled')}
                className="px-3 py-2 bg-yellow-600/20 text-yellow-400 text-sm rounded border border-yellow-600/30 hover:bg-yellow-600/30 transition-colors"
              >
                Pending
              </button>
            </div>
          </div>
        </div>

        {/* Today's Watch List - Prominent Section */}
        {!loading && scheduledContent.length > 0 && (
          (() => {
            const today = new Date().toDateString();
            const todaysContent = scheduledContent.filter(item => 
              new Date(item.scheduledDate).toDateString() === today && 
              item.status === 'scheduled'
            );
            
            if (todaysContent.length > 0) {
              return (
                <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-800 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Play className="text-blue-400" />
                    Ready to Watch Today ({todaysContent.length} items)
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {todaysContent.slice(0, 6).map(item => (
                      <div key={item._id} className="bg-gray-900/70 border border-gray-700 rounded-lg p-4">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="w-full h-24 object-cover rounded mb-3"
                        />
                        <h3 className="font-medium text-white text-sm line-clamp-2 mb-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                          <span>{formatTime(item.scheduledTime)}</span>
                          <span className="text-yellow-400">Priority: {item.priority}</span>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={generateVideoPlayerUrl(item)}
                            className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-1 font-medium no-underline"
                          >
                            <Play size={14} />
                            Watch
                          </Link>
                          <button
                            onClick={() => addToMobileCalendar(item)}
                            className="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                            title="Add to calendar"
                          >
                            <Calendar size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {todaysContent.length > 6 && (
                    <p className="text-center text-gray-400 text-sm mt-4">
                      +{todaysContent.length - 6} more items scheduled for today
                    </p>
                  )}
                </div>
              );
            }
            return null;
          })()
        )}

        {/* Scheduled Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Clock size={32} className="animate-spin text-blue-400 mx-auto mb-4" />
              <p className="text-gray-300">Loading your schedule...</p>
            </div>
          </div>
        ) : scheduledContent.length > 0 ? (
          <div className="space-y-4">
            {scheduledContent.map(item => (
              <div key={item._id} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Thumbnail */}
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-full sm:w-24 h-32 sm:h-16 object-cover rounded flex-shrink-0"
                  />
                  
                  {/* Content Info */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white line-clamp-2 pr-4">
                        {item.title}
                      </h3>
                      <div className={`px-2 py-1 rounded-full text-xs text-white flex items-center gap-1 ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        {item.status}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-2">{item.channelTitle}</p>
                    
                    {/* Schedule Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-300 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(item.scheduledDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatTime(item.scheduledTime)}
                      </span>
                      {item.duration && (
                        <span>{formatDuration(item.duration)}</span>
                      )}
                      <span className="text-yellow-400">Priority: {item.priority}/10</span>
                    </div>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Notes */}
                    {item.notes && (
                      <p className="text-sm text-gray-300 mb-2 italic">
                        "{item.notes}"
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {/* Primary Watch Button - More Prominent */}
                      <Link
                        to={generateVideoPlayerUrl(item)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg no-underline"
                      >
                        <Play size={16} />
                        Watch Now
                      </Link>

                      {/* YouTube Link - Secondary */}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-1"
                        title="Open in YouTube"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        YT
                      </a>

                      {/* Add to Calendar Button */}
                      <button
                        onClick={() => addToMobileCalendar(item)}
                        className="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1"
                        title="Add to mobile calendar"
                      >
                        <Calendar size={14} />
                        Add to Calendar
                      </button>
                      
                      {item.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => updateContentStatus(item._id, 'completed', { rating: 4 })}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                          >
                            <CheckCircle size={14} />
                            Complete
                          </button>
                          <button
                            onClick={() => updateContentStatus(item._id, 'cancelled')}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                          >
                            <X size={14} />
                            Cancel
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => deleteScheduledContent(item._id)}
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-300 mb-2">No scheduled content found</p>
            <p className="text-gray-500 text-sm mb-6">
              {filter === 'all' 
                ? 'Schedule some content from the Content Intelligence page to get started!'
                : `No content with status "${filter}" found for the selected date.`
              }
            </p>
            {filter === 'all' && (
              <Link
                to="/dashboard/content"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg mx-auto no-underline"
              >
                <Plus size={20} />
                Go to Content Intelligence
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartScheduler;