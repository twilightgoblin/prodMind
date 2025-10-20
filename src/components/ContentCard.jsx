// Individual content card component
import { useState } from 'react';
import { Play, Clock, Tag, Star, ExternalLink, Check, Eye, ThumbsUp, MessageCircle } from 'lucide-react';

const ContentCard = ({ content, onMarkConsumed, onUpdatePriority }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-900/30 text-green-300';
      case 'intermediate': return 'bg-yellow-900/30 text-yellow-300';
      case 'advanced': return 'bg-red-900/30 text-red-300';
      default: return 'bg-gray-900/30 text-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    if (priority >= 8) return 'text-red-400';
    if (priority >= 6) return 'text-yellow-400';
    return 'text-green-400';
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    const number = parseInt(num);
    if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
    if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
    return number.toString();
  };

  const formatDuration = (duration) => {
    if (!duration) return null;
    // Parse ISO 8601 duration (PT4M13S) to readable format
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;
    
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    
    if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg hover:border-gray-700 ${
      content.consumed ? 'opacity-75 bg-gray-800/30' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <img 
          src={content.thumbnail} 
          alt={content.title}
          className="w-20 h-12 object-cover rounded"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-white line-clamp-2 mb-1">
            {content.title}
          </h3>
          <p className="text-sm text-gray-400 mb-2">{content.channelTitle}</p>
          
          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
            {content.duration && (
              <div className="flex items-center gap-1">
                <Clock size={12} />
                {formatDuration(content.duration)}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star size={12} className={getPriorityColor(content.priority)} />
              {content.priority}/10
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(content.difficulty)}`}>
              {content.difficulty}
            </span>
          </div>

          {/* YouTube Stats */}
          {(content.viewCount || content.likeCount || content.commentCount) && (
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {content.viewCount && (
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  {formatNumber(content.viewCount)} views
                </div>
              )}
              {content.likeCount && (
                <div className="flex items-center gap-1">
                  <ThumbsUp size={12} />
                  {formatNumber(content.likeCount)}
                </div>
              )}
              {content.commentCount && (
                <div className="flex items-center gap-1">
                  <MessageCircle size={12} />
                  {formatNumber(content.commentCount)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {content.summary && (
        <div className="mb-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            {isExpanded ? content.summary : `${content.summary.slice(0, 120)}...`}
          </p>
          {content.summary.length > 120 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-400 text-xs mt-1 hover:underline"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}

      {/* Tags */}
      {content.tags && content.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {content.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
          {content.tags.length > 3 && (
            <span className="text-xs text-gray-400">
              +{content.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <div className="flex gap-2">
          <a
            href={content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Play size={14} />
            Watch
            <ExternalLink size={12} />
          </a>
          
          {!content.consumed && (
            <button
              onClick={() => onMarkConsumed(content.id)}
              className="inline-flex items-center gap-2 px-3 py-2 bg-green-900/30 text-green-300 text-sm rounded-lg hover:bg-green-900/50 transition-colors"
            >
              <Check size={14} />
              Mark Done
            </button>
          )}
        </div>

        {/* Priority adjustment */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onUpdatePriority(content.id, Math.max(1, content.priority - 1))}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-300 rounded"
          >
            -
          </button>
          <span className="text-sm font-medium w-8 text-center text-white">{content.priority}</span>
          <button
            onClick={() => onUpdatePriority(content.id, Math.min(10, content.priority + 1))}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-300 rounded"
          >
            +
          </button>
        </div>
      </div>

      {/* Consumed indicator */}
      {content.consumed && (
        <div className="mt-3 text-xs text-green-400 flex items-center gap-1">
          <Check size={12} />
          Completed on {new Date(content.consumedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default ContentCard;