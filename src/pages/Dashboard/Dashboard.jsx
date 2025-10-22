import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Brain, 
  ArrowRight,
  Zap,
  Target,
  Lightbulb
} from 'lucide-react';

const Dashboard = () => {
  const modules = [
    {
      id: 'content',
      title: 'Content Intelligence',
      description: 'AI-powered content curation and prioritization',
      icon: BookOpen,
      path: '/dashboard/content',
      color: 'blue',
      features: ['Smart curation', 'Priority scoring', 'Topic tracking']
    },
    {
      id: 'scheduler',
      title: 'Smart Scheduler',
      description: 'Intelligent task scheduling and time management',
      icon: Calendar,
      path: '/smart-scheduler',
      color: 'green',
      features: ['AI scheduling', 'Priority optimization', 'Time blocking']
    },
    {
      id: 'summarizer',
      title: 'Content Summarizer',
      description: 'Extract key insights from any content',
      icon: FileText,
      path: '/summarizer',
      color: 'purple',
      features: ['Multi-format support', 'Key insights', 'Smart summaries']
    },
    {
      id: 'mindmap',
      title: 'MindMap Generator',
      description: 'Knowledge graph visualization and mapping',
      icon: Brain,
      path: '/mindmap',
      color: 'indigo',
      features: ['Visual mapping', 'Knowledge graphs', 'Interactive design']
    },

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-8 w-8 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">AI-Powered</h3>
            </div>
            <p className="text-gray-300">Advanced AI algorithms for intelligent automation</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-8 w-8 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Goal-Oriented</h3>
            </div>
            <p className="text-gray-300">Focused on achieving your productivity goals</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="h-8 w-8 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Intelligent</h3>
            </div>
            <p className="text-gray-300">Smart insights and personalized recommendations</p>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Link
                key={module.id}
                to={module.path}
                className="group block"
              >
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105">
                  {/* Icon and Title */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${getColorClasses(module.color)}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white group-hover:text-gray-100">
                        {module.title}
                      </h3>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {module.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {module.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getColorClasses(module.color)}`}></div>
                        <span className="text-sm text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hover Effect */}
                  <div className="mt-6 pt-4 border-t border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span>Launch Module</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to boost your productivity?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Each module is designed to work independently or together as part of your complete productivity workflow. 
              Start with any module that matches your current needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>All modules active</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>AI-powered insights</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Personalized experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;