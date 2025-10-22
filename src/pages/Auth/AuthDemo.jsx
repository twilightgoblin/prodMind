import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield, Star, ArrowRight, Eye, Lock, Mail, User } from 'lucide-react';

const AuthDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-full blur-3xl animate-bounce" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl w-full text-center">
          {/* Header */}
          <div className="mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-6 animate-bounce">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Authentication Demo
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience our advanced, flashy authentication system with stunning animations and password visibility controls
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
              <Eye className="h-8 w-8 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Password Visibility</h3>
              <p className="text-gray-400 text-sm">Toggle password visibility with smooth animations</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105">
              <Zap className="h-8 w-8 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Validation</h3>
              <p className="text-gray-400 text-sm">Instant feedback with animated indicators</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 transform hover:scale-105">
              <Shield className="h-8 w-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Password Strength</h3>
              <p className="text-gray-400 text-sm">Dynamic strength meter with color coding</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-yellow-500/50 transition-all duration-300 transform hover:scale-105">
              <Star className="h-8 w-8 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Flashy Design</h3>
              <p className="text-gray-400 text-sm">Stunning gradients and smooth transitions</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link
              to="/signin"
              className="group bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-3"
            >
              <Lock className="h-5 w-5" />
              <span>Try Sign In Page</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <Link
              to="/signup"
              className="group bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 flex items-center gap-3"
            >
              <User className="h-5 w-5" />
              <span>Try Sign Up Page</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* Demo Features */}
          <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">What You'll Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 animate-pulse" />
                  <div>
                    <h4 className="text-white font-medium">Interactive Mouse Tracking</h4>
                    <p className="text-gray-400 text-sm">Background elements respond to your mouse movement</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 animate-pulse" />
                  <div>
                    <h4 className="text-white font-medium">Floating Particles</h4>
                    <p className="text-gray-400 text-sm">Animated particles create a dynamic atmosphere</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 animate-pulse" />
                  <div>
                    <h4 className="text-white font-medium">Focus Animations</h4>
                    <p className="text-gray-400 text-sm">Input fields glow and animate on focus</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 animate-pulse" />
                  <div>
                    <h4 className="text-white font-medium">Password Strength Meter</h4>
                    <p className="text-gray-400 text-sm">Real-time password strength with visual feedback</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 animate-pulse" />
                  <div>
                    <h4 className="text-white font-medium">Social Login Options</h4>
                    <p className="text-gray-400 text-sm">Stylish social media authentication buttons</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 animate-pulse" />
                  <div>
                    <h4 className="text-white font-medium">Loading States</h4>
                    <p className="text-gray-400 text-sm">Smooth loading animations during form submission</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AuthDemo;