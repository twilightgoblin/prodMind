import { useState } from 'react';
import { Calendar, Download, ExternalLink, Plus } from 'lucide-react';

const CalendarIntegration = ({ scheduledContent = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showExportOptions, setShowExportOptions] = useState(false);

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Get scheduled content for a specific date
  const getContentForDate = (date) => {
    const dateString = date.toDateString();
    return scheduledContent.filter(item => {
      const itemDate = new Date(item.scheduledDate).toDateString();
      return itemDate === dateString;
    });
  };

  // Generate ICS file for calendar export
  const generateICSFile = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ProdMind//Smart Scheduler//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    scheduledContent.forEach(item => {
      const startDate = new Date(`${item.scheduledDate.split('T')[0]}T${item.scheduledTime}`);
      const endDate = new Date(startDate.getTime() + (item.estimatedDuration || 30) * 60000);
      
      const formatDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${item._id || item.contentId}@prodmind.app`,
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        `SUMMARY:${item.title}`,
        `DESCRIPTION:Learning session: ${item.title}\\nChannel: ${item.channelTitle || 'Unknown'}\\nURL: ${item.url}`,
        `URL:${item.url}`,
        `CATEGORIES:Learning,Education`,
        `STATUS:${item.status === 'completed' ? 'CONFIRMED' : 'TENTATIVE'}`,
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');
    return icsContent.join('\r\n');
  };

  // Download ICS file
  const downloadICSFile = () => {
    const icsContent = generateICSFile();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'prodmind-schedule.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate Google Calendar URL
  const generateGoogleCalendarURL = (item) => {
    const startDate = new Date(`${item.scheduledDate.split('T')[0]}T${item.scheduledTime}`);
    const endDate = new Date(startDate.getTime() + (item.estimatedDuration || 30) * 60000);
    
    const formatGoogleDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `📚 ${item.title}`,
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
      details: `Learning session: ${item.title}\n\nChannel: ${item.channelTitle || 'Unknown'}\nDuration: ${item.duration ? formatDuration(item.duration) : `${item.estimatedDuration || 30} min`}\n\nWatch: ${item.url}\n\nNotes: ${item.notes || 'No notes'}`,
      location: 'Online Learning',
      trp: 'false'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Mobile-optimized calendar integration
  const addToMobileCalendar = (item) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // For mobile, directly open Google Calendar
      const googleUrl = generateGoogleCalendarURL(item);
      window.open(googleUrl, '_blank');
    } else {
      // For desktop, show the existing behavior
      const googleUrl = generateGoogleCalendarURL(item);
      window.open(googleUrl, '_blank');
    }
  };

  // Format duration helper
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

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === selectedDate.getMonth();
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Calendar className="text-blue-400" />
          Learning Calendar
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-1"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Export Options */}
      {showExportOptions && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
          <h3 className="text-white font-medium mb-3">Export & Sync Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              onClick={downloadICSFile}
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Download size={14} />
              Download .ics
            </button>
            <button
              onClick={() => {
                // Mobile-optimized Google Calendar sync
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                const googleUrl = isMobile 
                  ? `https://calendar.google.com/calendar/u/0/r`
                  : `https://calendar.google.com/calendar/u/0/r/settings/export`;
                window.open(googleUrl, '_blank');
              }}
              className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <ExternalLink size={14} />
              Google Calendar
            </button>
            <button
              onClick={() => {
                const outlookUrl = `https://outlook.live.com/calendar/0/addcalendar`;
                window.open(outlookUrl, '_blank');
              }}
              className="px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <ExternalLink size={14} />
              Outlook
            </button>
            <button
              onClick={() => {
                // Add all scheduled content to mobile calendar
                scheduledContent.forEach(item => {
                  setTimeout(() => addToMobileCalendar(item), 100);
                });
              }}
              className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus size={14} />
              Add All to Calendar
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            💡 Tip: On mobile devices, calendar events will open directly in your default calendar app
          </p>
        </div>
      )}

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          ←
        </button>
        <h3 className="text-lg font-medium text-white">
          {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </h3>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const dayContent = getContentForDate(date);
          const hasContent = dayContent.length > 0;
          
          return (
            <div
              key={index}
              className={`min-h-[80px] p-1 border border-gray-800 rounded ${
                isCurrentMonth(date) ? 'bg-gray-800/50' : 'bg-gray-900/30'
              } ${isToday(date) ? 'ring-2 ring-blue-400' : ''}`}
            >
              <div className={`text-sm ${
                isCurrentMonth(date) ? 'text-white' : 'text-gray-600'
              } ${isToday(date) ? 'font-bold text-blue-400' : ''}`}>
                {date.getDate()}
              </div>
              
              {hasContent && (
                <div className="mt-1 space-y-1">
                  {dayContent.slice(0, 2).map((item, idx) => (
                    <div
                      key={idx}
                      className="text-xs bg-blue-600/80 text-white px-1 py-0.5 rounded truncate cursor-pointer hover:bg-blue-600"
                      title={`${item.title} - Click to add to calendar`}
                      onClick={() => addToMobileCalendar(item)}
                    >
                      {item.scheduledTime} {item.title.slice(0, 15)}...
                    </div>
                  ))}
                  {dayContent.length > 2 && (
                    <div className="text-xs text-gray-400">
                      +{dayContent.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{scheduledContent.length} sessions scheduled</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              Scheduled
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              Completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarIntegration;