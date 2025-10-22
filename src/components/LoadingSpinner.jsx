import React from 'react';
import { Sparkles } from 'lucide-react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-purple-400 animate-pulse" />
          </div>
        </div>
        <p className="text-white text-xl font-medium mb-2">{message}</p>
        <p className="text-gray-400">Please wait while we set things up for you</p>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-1 mt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;