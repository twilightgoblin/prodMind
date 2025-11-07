import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Calendar, Mail } from 'lucide-react';
import LiquidEther from '../../components/ui/liquid-ether';

const TermsOfService = () => {
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
                <FileText className="h-8 w-8 text-purple-400" />
                <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
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
                <Shield className="h-6 w-6 text-purple-400" />
                Agreement to Terms
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Welcome to Productive Content. These Terms of Service ("Terms") govern your use of our 
                  enterprise-grade AI-powered content management platform and related services (collectively, 
                  the "Service") operated by Productive Content ("we," "us," or "our").
                </p>
                <p>
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree 
                  with any part of these terms, then you may not access the Service.
                </p>
              </div>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Service Description</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Productive Content provides an AI-powered platform that helps users streamline their 
                  workflow, enhance productivity, and transform how teams consume and process information. 
                  Our services include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Content management and organization tools</li>
                  <li>AI-powered content summarization</li>
                  <li>Smart scheduling and productivity features</li>
                  <li>Analytics and insights dashboard</li>
                  <li>Team collaboration features</li>
                </ul>
              </div>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">User Accounts</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  When you create an account with us, you must provide information that is accurate, 
                  complete, and current at all times. You are responsible for safeguarding the password 
                  and for all activities that occur under your account.
                </p>
                <p>
                  You agree not to disclose your password to any third party and to take sole responsibility 
                  for activities and actions under your password, whether or not you have authorized such 
                  activities or actions.
                </p>
              </div>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Acceptable Use Policy</h2>
              <div className="text-gray-300 space-y-4">
                <p>You agree not to use the Service:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                </ul>
              </div>
            </section>

            {/* Data and Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data and Privacy</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and 
                  protect your information when you use our Service. By using our Service, you agree to 
                  the collection and use of information in accordance with our Privacy Policy.
                </p>
                <p>
                  We implement enterprise-grade security measures to protect your data, including SOC 2 
                  compliance and 99.9% uptime guarantee.
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Intellectual Property Rights</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  The Service and its original content, features, and functionality are and will remain 
                  the exclusive property of Productive Content and its licensors. The Service is protected 
                  by copyright, trademark, and other laws.
                </p>
                <p>
                  You retain ownership of any content you submit, post, or display on or through the Service. 
                  By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to 
                  use, reproduce, and distribute such content in connection with the Service.
                </p>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Termination</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We may terminate or suspend your account and bar access to the Service immediately, 
                  without prior notice or liability, under our sole discretion, for any reason whatsoever 
                  and without limitation, including but not limited to a breach of the Terms.
                </p>
                <p>
                  If you wish to terminate your account, you may simply discontinue using the Service 
                  or contact our support team.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  In no event shall Productive Content, nor its directors, employees, partners, agents, 
                  suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, 
                  or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                  or other intangible losses, resulting from your use of the Service.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to Terms</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                  If a revision is material, we will provide at least 30 days notice prior to any new terms 
                  taking effect.
                </p>
                <p>
                  What constitutes a material change will be determined at our sole discretion. By continuing 
                  to access or use our Service after any revisions become effective, you agree to be bound 
                  by the revised terms.
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
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p><strong>Email:</strong> legal@productivecontent.com</p>
                  <p><strong>Address:</strong> Jayanagar, Bengaluru, India</p>
                  <p><strong>Phone:</strong> +91 XXXXX XXXXX</p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Navigation */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link 
              to="/privacy" 
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Privacy Policy
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

export default TermsOfService;