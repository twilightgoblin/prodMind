import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  NotebookPen, 
  ArrowRight,
  Zap,
  Target,
  Lightbulb,
  CheckCircle,
  Clock,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const modules = [
    {
      id: 'content',
      title: 'Content Intelligence',
      description: 'AI-powered content curation and prioritization system',
      icon: BookOpen,
      path: '/dashboard/content',
      color: 'blue',
      features: [
        'Smart content curation from multiple sources',
        'AI-powered priority scoring and ranking',
        'Advanced topic tracking and categorization',
        'Personalized content recommendations'
      ]
    },
    {
      id: 'scheduler',
      title: 'Smart Scheduler',
      description: 'Intelligent task scheduling and time management',
      icon: Calendar,
      path: '/smart-scheduler',
      color: 'green',
      features: [
        'AI-driven optimal scheduling algorithms',
        'Priority-based time allocation system',
        'Automated time blocking and planning',
        'Calendar integration and sync'
      ]
    },
    {
      id: 'summarizer',
      title: 'Content Summarizer',
      description: 'Extract key insights from any content format',
      icon: FileText,
      path: '/summarizer',
      color: 'purple',
      features: [
        'Multi-format content processing (text, video, audio)',
        'Three summary modes: TL;DR, Insight, Detailed',
        'Educational focus with learning optimization',
        'Topic-based search and filtering'
      ]
    },
    {
      id: 'notes',
      title: 'Learning Notes',
      description: 'Centralized note management and learning insights',
      icon: NotebookPen,
      path: '/notes',
      color: 'indigo',
      features: [
        'Auto-save notes while watching videos',
        'Search across all your learning notes',
        'Learning progress tracking and analytics',
        'Quick access to video content from notes'
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            ProdMind Dashboard
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your comprehensive AI-powered productivity suite. Choose a module to enhance your learning and productivity journey.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-8 w-8 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">AI-Powered</h3>
            </div>
            <p className="text-gray-300">Advanced AI algorithms for intelligent automation</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-green-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-8 w-8 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Goal-Oriented</h3>
            </div>
            <p className="text-gray-300">Focused on achieving your productivity goals</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="h-8 w-8 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Intelligent</h3>
            </div>
            <p className="text-gray-300">Smart insights and personalized recommendations</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-8 w-8 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Adaptive</h3>
            </div>
            <p className="text-gray-300">Learns and adapts to your workflow patterns</p>
          </div>
        </div>

        {/* Modules Grid - 4 Evenly Aligned */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Link
                key={module.id}
                to={module.path}
                className="group block h-full"
              >
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 h-full flex flex-col">
                  {/* Icon and Title */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${getColorClasses(module.color)}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-gray-100">
                        {module.title}
                      </h3>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                    {module.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 flex-grow">
                    {module.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 text-${module.color}-400`} />
                        <span className="text-sm text-gray-400 leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hover Effect */}
                  <div className="mt-6 pt-4 border-t border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300 font-medium">Launch Module</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">Ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Performance Metrics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Productivity Boost</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400 mb-2">85%</p>
            <p className="text-sm text-gray-300">Average efficiency improvement across all modules</p>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-6 w-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Time Saved</h3>
            </div>
            <p className="text-3xl font-bold text-green-400 mb-2">12hrs</p>
            <p className="text-sm text-gray-300">Weekly time savings through intelligent automation</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">AI Accuracy</h3>
            </div>
            <p className="text-3xl font-bold text-purple-400 mb-2">94%</p>
            <p className="text-sm text-gray-300">AI recommendation accuracy and relevance</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to boost your productivity?</h2>
            <p className="text-gray-300 mb-6 max-w-3xl mx-auto">
              Each module is designed to work independently or together as part of your complete productivity workflow. 
              Start with any module that matches your current needs and experience the power of AI-driven productivity.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>4 Active Modules</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>AI-Powered Insights</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Personalized Experience</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span>Real-time Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;