import CardFlip from "./Card";

const featuresData = [
  {
    title: "Smart Content Intelligence",
    subtitle: "AI-powered content curation",
    description:
      "Discover and prioritize YouTube videos with AI-driven analysis, smart tagging, and personalized recommendations based on your learning goals.",
    features: ["AI Priority Scoring", "Smart Tagging", "Content Analysis", "YouTube Integration"],
  },
  {
    title: "Intelligent Scheduler",
    subtitle: "Optimize your learning time",
    description:
      "Schedule your learning sessions with AI optimization, calendar integration, and mobile-friendly reminders for maximum productivity.",
    features: ["AI Time Optimization", "Calendar Sync", "Mobile Reminders", "Progress Analytics"],
  },
  {
    title: "Content Summarizer",
    subtitle: "Extract key insights instantly",
    description:
      "Generate comprehensive summaries with multiple modes (TL;DR, Insight, Detailed), educational focus, and interactive learning tools.",
    features: ["3 Summary Modes", "Educational Focus", "Key Insights", "Learning Analytics"],
  },
  {
    title: "Video Learning Hub",
    subtitle: "Enhanced video experience",
    description:
      "Take notes while watching, track progress, export to calendar apps, and build your personal knowledge base with seamless video integration.",
    features: ["Interactive Notes", "Progress Tracking", "Calendar Export", "Knowledge Base"],
  },
];

export default function FeaturesPage() {
  return (
    // 🔹 added section + id so #features scroll works
    <section
      id="features"
      className="min-h-screen bg-gradient-to-b from-black via-gray-500 to-black py-24 px-6"
    >
      {/* Page Heading */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            ProdMind
          </span>{" "}
          AI-Powered Learning Suite
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Transform your learning journey with intelligent content curation, smart scheduling,
          AI-powered summarization, and seamless video learning experiences.
        </p>
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>YouTube Integration</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>Mobile Optimized</span>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center mb-20">
        {featuresData.map((item, index) => (
          <div
            key={index}
            className="w-full max-w-[300px] rounded-3xl backdrop-blur-md bg-gradient-to-br from-gray-800 via-gray-300 to-white border border-gray-700/50 shadow-lg shadow-black/50 hover:shadow-yellow-400/50 transition-all duration-500"
          >
            <CardFlip
              title={item.title}
              subtitle={item.subtitle}
              description={item.description}
              features={item.features}
            />
          </div>
        ))}
      </div>



      {/* Key Benefits */}
      <div className="max-w-4xl mx-auto mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose ProdMind?
          </h2>
          <p className="text-gray-400 text-lg">
            Experience the future of personalized learning with our comprehensive AI-powered platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Save 70% of Your Learning Time</h3>
              <p className="text-gray-300 text-sm">
                AI-powered summaries and smart scheduling help you consume more content in less time while retaining key insights.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Personalized Learning Path</h3>
              <p className="text-gray-300 text-sm">
                AI analyzes your preferences and learning patterns to recommend the most relevant content for your goals.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Mobile-First Experience</h3>
              <p className="text-gray-300 text-sm">
                Seamlessly sync across devices with mobile-optimized calendar integration and offline capabilities.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Comprehensive Analytics</h3>
              <p className="text-gray-300 text-sm">
                Track your learning progress, completion rates, and optimize your study habits with detailed insights.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-800/50 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of learners who have already optimized their content consumption with ProdMind's AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/dashboard/content"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 no-underline"
            >
              Start Learning Smarter
            </a>
            <a
              href="/signin"
              className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-gray-500 hover:text-white transition-all duration-200 no-underline"
            >
              Sign In to Continue
            </a>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Free to use • No credit card required • Start in seconds
          </p>
        </div>
      </div>
    </section>
  );
}
