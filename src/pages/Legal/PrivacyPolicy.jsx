import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, Globe, Mail, Calendar } from 'lucide-react';
import LiquidEther from '../../components/ui/liquid-ether';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black relative">
      {/* LiquidEther animated background */}
      <LiquidEther />

      <div className="relative z-10 min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/signup" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign Up
            </Link>
            
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-purple-400" />
                <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
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
                <Lock className="h-6 w-6 text-purple-400" />
                Our Commitment to Privacy
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  At Productive Content, we take your privacy seriously. This Privacy Policy explains how we 
                  collect, use, disclose, and safeguard your information when you use our enterprise-grade 
                  AI-powered content management platform.
                </p>
                <p>
                  We are committed to protecting your personal information and your right to privacy. If you 
                  have any questions or concerns about our policy or our practices with regard to your personal 
                  information, please contact us.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Database className="h-6 w-6 text-purple-400" />
                Information We Collect
              </h2>
              <div className="text-gray-300 space-y-4">
                <h3 className="text-xl font-medium text-white">Personal Information</h3>
                <p>We collect personal information that you voluntarily provide to us when you:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Register for an account</li>
                  <li>Use our services</li>
                  <li>Contact us for support</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                
                <h3 className="text-xl font-medium text-white mt-6">Types of Data Collected</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Account Information</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Name and email address</li>
                      <li>• Password (encrypted)</li>
                      <li>• Profile information</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Usage Data</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Content interactions</li>
                      <li>• Feature usage patterns</li>
                      <li>• Performance metrics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-purple-400" />
                How We Use Your Information
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>We use the information we collect for various purposes, including:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Service Delivery</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Provide and maintain our services</li>
                      <li>Process your requests and transactions</li>
                      <li>Personalize your experience</li>
                      <li>Generate AI-powered insights</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Communication</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Send you updates and notifications</li>
                      <li>Respond to your inquiries</li>
                      <li>Provide customer support</li>
                      <li>Send marketing communications (with consent)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-purple-400" />
                Data Security & Protection
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We implement enterprise-grade security measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                    <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <h4 className="font-medium text-white mb-1">SOC 2 Compliant</h4>
                    <p className="text-sm text-gray-400">Industry-standard security controls</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                    <Lock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <h4 className="font-medium text-white mb-1">End-to-End Encryption</h4>
                    <p className="text-sm text-gray-400">Data encrypted in transit and at rest</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                    <Globe className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="font-medium text-white mb-1">Global CDN</h4>
                    <p className="text-sm text-gray-400">99.9% uptime guarantee</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Information Sharing</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Service Providers:</strong> Trusted third parties who assist us in operating our platform</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> When you have given us explicit permission</li>
                </ul>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Your Privacy Rights</h2>
              <div className="text-gray-300 space-y-4">
                <p>Depending on your location, you may have the following rights regarding your personal information:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Access & Portability</h4>
                    <p className="text-sm text-gray-400">Request a copy of your personal data and transfer it to another service</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Correction & Update</h4>
                    <p className="text-sm text-gray-400">Update or correct inaccurate personal information</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Deletion</h4>
                    <p className="text-sm text-gray-400">Request deletion of your personal data (right to be forgotten)</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Opt-out</h4>
                    <p className="text-sm text-gray-400">Withdraw consent for marketing communications</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Cookies & Tracking</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We use cookies and similar tracking technologies to enhance your experience on our platform. 
                  Cookies help us understand how you use our services and improve functionality.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Types of Cookies We Use:</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• <strong>Essential:</strong> Required for basic functionality</li>
                    <li>• <strong>Analytics:</strong> Help us understand usage patterns</li>
                    <li>• <strong>Preferences:</strong> Remember your settings and choices</li>
                    <li>• <strong>Marketing:</strong> Deliver relevant content (with consent)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Retention</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We retain your personal information only for as long as necessary to fulfill the purposes 
                  outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                </p>
                <p>
                  When we no longer need your personal information, we will securely delete or anonymize it 
                  in accordance with our data retention policies.
                </p>
              </div>
            </section>

            {/* Updates to Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Updates to This Policy</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices 
                  or for other operational, legal, or regulatory reasons.
                </p>
                <p>
                  We will notify you of any material changes by posting the new Privacy Policy on this page 
                  and updating the "Last updated" date. We encourage you to review this Privacy Policy 
                  periodically to stay informed about how we protect your information.
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
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p><strong>Privacy Officer:</strong> privacy@productivecontent.com</p>
                  <p><strong>General Inquiries:</strong> support@productivecontent.com</p>
                  <p><strong>Address:</strong> Jayanagar, Bengaluru, India</p>
                  <p><strong>Phone:</strong> +91 XXXXX XXXXX</p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Navigation */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link 
              to="/terms" 
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Terms of Service
            </Link>
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

export default PrivacyPolicy;