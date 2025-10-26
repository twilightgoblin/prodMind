import { useState } from 'react';
import { Calendar, Clock, X, Save, AlertCircle } from 'lucide-react';
import apiClient from '../utils/api';

const ScheduleModal = ({ isOpen, onClose, content, onSchedule }) => {
  const [formData, setFormData] = useState({
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '09:00',
    priority: 5,
    notes: '',
    estimatedDuration: 30
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const scheduleData = {
        contentId: content.id,
        title: content.title,
        description: content.description,
        thumbnail: content.thumbnail,
        url: content.url,
        channelTitle: content.channelTitle,
        duration: content.duration,
        source: content.source || 'youtube',
        tags: content.tags || [],
        ...formData
      };

      const scheduledContent = await apiClient.scheduleContent(scheduleData);
      onSchedule(scheduledContent);
      onClose();

      // Reset form
      setFormData({
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: '09:00',
        priority: 5,
        notes: '',
        estimatedDuration: 30
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        slots.push({ value: timeString, label: displayTime });
      }
    }
    return slots;
  };

  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-800 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Calendar className="text-blue-400" />
            Schedule Content
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex gap-3">
            <img
              src={content.thumbnail}
              alt={content.title}
              className="w-16 h-12 object-cover rounded flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white text-sm line-clamp-2 mb-1">
                {content.title}
              </h3>
              <p className="text-xs text-gray-400">{content.channelTitle}</p>
              {content.duration && (
                <p className="text-xs text-gray-500">{formatDuration(content.duration)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Error Display */}
          {error && (
            <div className="bg-red-900/50 border border-red-800 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-300 text-sm font-medium">Scheduling Error</p>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              min={getMinDate()}
              required
              className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Time
            </label>
            <select
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
            >
              {getTimeSlots().map(slot => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Priority (1-10)
            </label>
            <input
              type="range"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              min="1"
              max="10"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Low (1)</span>
              <span className="text-yellow-400">Current: {formData.priority}</span>
              <span>High (10)</span>
            </div>
          </div>

          {/* Estimated Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Estimated Duration (minutes)
            </label>
            <input
              type="number"
              name="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={handleChange}
              min="5"
              max="300"
              step="5"
              className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Add any notes about this learning session..."
              className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  Scheduling...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Schedule
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;