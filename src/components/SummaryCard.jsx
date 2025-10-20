// Individual summary card component
import { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Star, 
  Edit3, 
  Save, 
  X, 
  Lightbulb, 
  Target, 
  Brain,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

const SummaryCard = ({ summary, onUpdateSummary, onRate, onAddNotes }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(summary.notes || '');
  const [rating, setRating] = useState(summary.rating || 0);
  const [copied, setCopied] = useState(false);

  const getModeColor = (mode) => {
    switch (mode) {
      case 'tldr': return 'bg-green-900/30 text-green-300';
      case 'insight': return 'bg-blue-900/30 text-blue-300';
      case 'detailed': return 'bg-purple-900/30 text-purple-300';
      default: return 'bg-gray-900/30 text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleSaveNotes = () => {
    onAddNotes(summary.contentId, notes);
    setIsEditingNotes(false);
  };

  const handleRating = (newRating) => {
    setRating(newRating);
    onRate(summary.contentId, newRating);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModeColor(summary.mode)}`}>
              {summary.mode.toUpperCase()}
            </span>
            <span className={`text-xs ${getDifficultyColor(summary.difficulty)}`}>
              {summary.difficulty}
            </span>
            <span className="text-xs text-gray-500">
              {summary.timeToRead} min read
            </span>
          </div>
          
          <h3 className="font-semibold text-white mb-1">
            {summary.originalContent.title}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{formatDate(summary.createdAt)}</span>
            <span>{summary.originalContent.source}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            title="Copy summary"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
          
          {summary.originalContent.url && (
            <a
              href={summary.originalContent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
              title="View original"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Summary Content */}
      <div className="mb-4">
        <div className={`prose prose-invert max-w-none ${!isExpanded ? 'line-clamp-4' : ''}`}>
          <div 
            className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: summary.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
          />
        </div>
        
        {summary.content.length > 300 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-400 text-sm mt-2 hover:underline cursor-pointer"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Key Insights */}
      {summary.keyInsights && summary.keyInsights.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">Key Insights</span>
          </div>
          <div className="space-y-1">
            {summary.keyInsights.slice(0, isExpanded ? undefined : 3).map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1 h-1 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-gray-400">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Items */}
      {summary.actionableItems && summary.actionableItems.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-green-400" />
            <span className="text-sm font-medium text-gray-300">Action Items</span>
          </div>
          <div className="space-y-1">
            {summary.actionableItems.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1 h-1 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-gray-400">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mental Models */}
      {summary.mentalModels && summary.mentalModels.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={16} className="text-purple-400" />
            <span className="text-sm font-medium text-gray-300">Mental Models</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {summary.mentalModels.map((model, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-full"
              >
                {model}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {summary.tags && summary.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {summary.tags.slice(0, 5).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Rating and Notes */}
      <div className="border-t border-gray-800 pt-4">
        {/* Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Rate this summary:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`transition-colors cursor-pointer ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'
                  }`}
                >
                  <Star size={16} fill={star <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock size={14} />
            {summary.timeToRead} min
          </div>
        </div>

        {/* Notes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Personal Notes:</span>
            {!isEditingNotes && (
              <button
                onClick={() => setIsEditingNotes(true)}
                className="p-1 text-gray-400 hover:text-white rounded cursor-pointer"
              >
                <Edit3 size={14} />
              </button>
            )}
          </div>
          
          {isEditingNotes ? (
            <div className="space-y-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your thoughts, connections, or follow-up ideas..."
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                >
                  <Save size={12} />
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditingNotes(false);
                    setNotes(summary.notes || '');
                  }}
                  className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 flex items-center gap-1"
                >
                  <X size={12} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-400 min-h-[20px]">
              {summary.notes || 'No notes yet. Click the edit icon to add your thoughts.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;