import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SummarizerDashboard from '../../components/SummarizerDashboard';

const Summarizer = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to sign in if not authenticated (with delay to avoid race conditions)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        console.log('🔴 Summarizer: User not authenticated, redirecting to signin');
        navigate('/signin');
      }
    }, 100); // Small delay to allow auth state to settle

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  // Show sign in required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060010] pt-20">
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 text-center">
            <LogIn className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
            <p className="text-gray-300 mb-6">
              You need to sign in to access the AI-powered summarizer and create intelligent summaries.
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

  return (
    <div className="min-h-screen bg-[#060010] pt-20">
      <SummarizerDashboard />
    </div>
  );
};

export default Summarizer;