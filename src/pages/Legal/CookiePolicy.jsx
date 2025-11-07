import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Settings, Eye, Shield, Mail, Calendar } from 'lucide-react';
import LiquidEther from '../../components/ui/liquid-ether';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-black relative">
      {/* LiquidEther animated background */}
      <LiquidEther />

      <div className="relative z-10 min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Cookie className="h-8 w-8 text-purple-400" />
                <h1 className="text-4xl font-bold text-white">Cookie Policy</h1>
              </div>
              <p className="text-gray-400 text-lg">
                Last updated: November 7, 2025
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 backdrop-blur-sm space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Cookie className="h-6 w-6 text-purple-400" />
                What Are Cookies?
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Cookies are small text files that are placed on your device when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences and 
                  understanding how you use our platform.
                </p>
                <p>
                  This Cookie Policy explains what cookies are, how we use them, and how you can manage 
                  your cookie preferences when using Productive Content.
                </p>
              </div>
            </section>

            {/* Types of Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Settings className="h-6 w-6 text-purple-400" />
                Types of Cookies We Use
              </h2>
              <div className="text-gray-300 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-xl font-medium text-white mb-3 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-400" />
                      Essential Cookies
                    </h3>
                    <p className="text-gray-400 mb-3">
                      These cookies are necessary for the website to function properly and cannot be disabled.
                    </p>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Authentication and security</li>
                      <li>• Session management</li>
                      <li>• Load balancing</li>
                      <li>• Basic functionality</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-xl font-medium text-white mb-3 flex items-center gap-2">
                      <Eye className="h-5 w-5 text-blue-400" />
                      Analytics Cookies
                    </h3>
                    <p className="text-gray-400 mb-3">
                      Help us understand how visitors interact with our website.
                    </p>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Page views and traffic sources</li>
                      <li>• User behavior patterns</li>
                      <li>• Performance metrics</li>
                      <li>• Error tracking</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-xl font-medium text-white mb-3 flex items-center gap-2">
                      <Settings className="h-5 w-5 text-purple-400" />
                      Preference Cookies
                    </h3>
                    <p className="text-gray-400 mb-3">
                      Remember your settings and preferences for a personalized experience.
                    </p>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Language preferences</li>
                      <li>• Theme settings</li>
                      <li>• Dashboard layout</li>
                      <li>• Notification preferences</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-xl font-medium text-white mb-3 flex items-center gap-2">
                      <Cookie className="h-5 w-5 text-yellow-400" />
                      Marketing Cookies
                    </h3>
                    <p className="text-gray-400 mb-3">
                      Used to deliver relevant advertisements and track campaign effectiveness.
                    </p>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Targeted advertising</li>
                      <li>• Campaign tracking</li>
                      <li>• Social media integration</li>
                      <li>• Conversion tracking</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Third-Party Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Cookies</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We may also use third-party services that place cookies on your device. These services 
                  help us provide better functionality and understand how our platform is used.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Third-Party Services We Use:</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• <strong>Google Analytics:</strong> Website analytics and performance tracking</li>
                    <li>• <strong>Intercom:</strong> Customer support and communication</li>
                    <li>• <strong>Stripe:</strong> Payment processing and billing</li>
                    <li>• <strong>CDN Providers:</strong> Content delivery and performance optimization</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Managing Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Managing Your Cookie Preferences</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  You have several options for managing cookies on our platform:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Browser Settings</h4>
                    <p className="text-sm text-gray-400">
                      Most web browsers allow you to control cookies through their settings. You can 
                      choose to accept all cookies, reject all cookies, or be notified when a cookie 
                      is set.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Cookie Consent Banner</h4>
                    <p className="text-sm text-gray-400">
                      When you first visit our website, you'll see a cookie consent banner where you 
                      can choose which types of cookies to accept or reject.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Account Settings</h4>
                    <p className="text-sm text-gray-400">
                      Logged-in users can manage their cookie preferences through their account 
                      settings dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Browser Instructions */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Browser-Specific Instructions</h2>
              <div className="text-gray-300 space-y-4">
                <p>Here's how to manage cookies in popular browsers:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Chrome</h4>
                    <p className="text-sm text-gray-400">
                      Settings → Privacy and security → Cookies and other site data
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Firefox</h4>
                    <p className="text-sm text-gray-400">
                      Options → Privacy & Security → Cookies and Site Data
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Safari</h4>
                    <p className="text-sm text-gray-400">
                      Preferences → Privacy → Manage Website Data
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Edge</h4>
                    <p className="text-sm text-gray-400">
                      Settings → Cookies and site permissions → Cookies and site data
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Impact of Disabling */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Impact of Disabling Cookies</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Please note that disabling certain cookies may affect your experience on our platform:
                </p>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <ul className="text-yellow-200 space-y-2 text-sm">
                    <li>• You may need to log in repeatedly</li>
                    <li>• Your preferences and settings may not be saved</li>
                    <li>• Some features may not work properly</li>
                    <li>• You may see less relevant content and advertisements</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Updates to This Policy</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our 
                  practices or for other operational, legal, or regulatory reasons.
                </p>
                <p>
                  Any changes will be posted on this page with an updated revision date. We encourage 
                  you to review this policy periodically to stay informed about our use of cookies.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="border-t border-white/10 pt-8">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Mail className="h-6 w-6 text-purple-400" />
                Contact Us
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p><strong>Email:</strong> privacy@productivecontent.com</p>
                  <p><strong>Support:</strong> support@productivecontent.com</p>
                  <p><strong>Address:</strong> Jayanagar, Bengaluru, India</p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Navigation */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex gap-4">
              <Link 
                to="/privacy" 
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Terms of Service
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Effective November 7, 2025</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;