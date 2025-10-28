import { useState, useEffect } from 'react';
import { Search, BookOpen, Clock, ExternalLink, Trash2, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { generateVideoPlayerUrl } from '../../utils/videoUtils';
import apiClient from '../../utils/api';

const VideoNotes = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);

  // Redirect to sign in if not authenticated (with delay to avoid race conditions)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        console.log('🔴 VideoNotes: User not authenticated, redirecting to signin');
        navigate('/signin');
      }
    }, 100); // Small delay to allow auth state to settle

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Filter notes based on search term
    if (searchTerm.trim()) {
      const filtered = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [notes, searchTerm]);

  const fetchNotes = async () => {
    try {
      const data = await apiClient.getAllVideoNotes();
      setNotes(data.data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (videoId) => {
    if (!confirm('Are you sure you want to delete these notes?')) return;

    try {
      await apiClient.deleteVideoNotes(videoId);
      setNotes(notes.filter(note => note.videoId !== videoId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show sign in required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060010] text-white pt-20 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 text-center">
            <LogIn className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
            <p className="text-gray-300 mb-6">
              You need to sign in to access your video notes and learning history.
            </p>
            <button
              onClick={() => navigate('/signin')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Sign In to Your Account
            </button>
            <p className="text-gray-400 text-sm mt-4">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060010] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060010] text-white pt-20 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <BookOpen className="text-blue-400" />
            My Learning Notes
          </h1>
          <p className="text-gray-400">
            All your video notes in one place. Search, review, and manage your learning journey.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search your notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <h3 className="text-gray-400 text-sm">Total Notes</h3>
            <p className="text-2xl font-bold text-white">{notes.length}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <h3 className="text-gray-400 text-sm">This Week</h3>
            <p className="text-2xl font-bold text-white">
              {notes.filter(note => {
                const noteDate = new Date(note.createdAt);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return noteDate > weekAgo;
              }).length}
            </p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <h3 className="text-gray-400 text-sm">Average Length</h3>
            <p className="text-2xl font-bold text-white">
              {notes.length > 0 ? Math.round(notes.reduce((acc, note) => acc + note.notes.length, 0) / notes.length) : 0} chars
            </p>
          </div>
        </div>

        {/* Notes List */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-300 mb-2">
              {searchTerm ? 'No notes found matching your search' : 'No learning notes yet'}
            </p>
            <p className="text-gray-500 text-sm">
              {searchTerm ? 'Try a different search term' : 'Start watching videos and taking notes to see them here!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <div key={note._id} className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1 line-clamp-2">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatDate(note.updatedAt)}
                      </div>
                      <span>{note.notes.length} characters</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      to={generateVideoPlayerUrl({
                        id: note.videoId,
                        title: note.title,
                        url: note.videoUrl
                      })}
                      className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                      title="Open video"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    <button
                      onClick={() => deleteNote(note.videoId)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      title="Delete notes"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {note.notes.length > 300 ? (
                      <>
                        {note.notes.substring(0, 300)}...
                        <Link
                          to={generateVideoPlayerUrl({
                            id: note.videoId,
                            title: note.title,
                            url: note.videoUrl
                          })}
                          className="text-blue-400 hover:underline ml-2"
                        >
                          Read more
                        </Link>
                      </>
                    ) : (
                      note.notes
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoNotes;