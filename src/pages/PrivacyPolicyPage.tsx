import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, ExternalLink } from 'lucide-react';
import { Seo } from '../components/Seo';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <Seo
        title="Privacy Policy – Worktugal Pass"
        description="Learn how Worktugal Pass collects, uses, and protects your data in line with EU GDPR standards. Full transparency, built with trust."
        ogTitle="Privacy Policy – Worktugal Pass"
        ogDescription="Learn how Worktugal Pass collects, uses, and protects your data in line with EU GDPR standards."
        canonicalUrl="https://pass.worktugal.com/privacy"
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-blue-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-300">
              How we collect, use, and protect your data
            </p>
            <div className="mt-4 text-sm text-gray-400">
              <p>Effective Date: August 9, 2025</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-invert max-w-none">
            <div className="bg-gray-800/50 rounded-2xl p-8 space-y-8">
              
              <div className="text-gray-300 leading-relaxed">
                <p className="text-lg mb-6">
                  This Privacy Policy explains how Worktugal Pass ("we," "us," or "our") collects, uses, and protects your personal data when you use our website or services.
                </p>
                
                <div className="bg-gray-700/30 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">We are operated by:</h3>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>Xolo Go OÜ – Van Vo</strong></p>
                    <p>Registry code: 14717109</p>
                    <p>EU VAT: EE102156920</p>
                    <p>Registered address: Paju tn 1a, 50603 Tartu, Estonia</p>
                    <p>Email: <a href="mailto:hello@worktugal.com" className="text-blue-400 hover:text-blue-300 transition-colors">hello@worktugal.com</a></p>
                  </div>
                  <p className="mt-4 text-sm text-blue-300">
                    We are based in the European Union and comply with the <a href="https://gdpr.eu/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors underline">General Data Protection Regulation (GDPR)</a>.
                  </p>
                </div>
              </div>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. What We Collect</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We only collect the data necessary to provide our services, including:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Partner listings:</strong> name, email, WhatsApp, business info</li>
                    <li><strong>Payments:</strong> <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors underline">Stripe</a> processes payment data (we don't store card info)</li>
                    <li><strong>Website visits:</strong> anonymized cookie and usage data (with consent)</li>
                    <li><strong>Contact:</strong> any info you voluntarily provide via forms or messages</li>
                  </ul>
                  <p className="font-medium">We never ask for or store sensitive data without clear consent.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Why We Collect It</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We collect and process your data to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Create and manage your Worktugal Pass listing</li>
                    <li>Process payments and send confirmations</li>
                    <li>Improve the website experience</li>
                    <li>Send relevant updates or event invites</li>
                    <li>Fulfill legal, accounting, or tax requirements</li>
                  </ul>
                  <p>We only process data under lawful bases: contract, consent, or legal obligation.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. How We Store and Protect It</h2>
                <div className="text-gray-300 space-y-4">
                  <p>Your data is stored securely using:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors underline">Supabase</a> (accounts, partner submissions)</li>
                    <li><a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors underline">Stripe</a> (payments)</li>
                    <li><a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors underline">Netlify</a> (hosting)</li>
                    <li><a href="https://www.make.com/en/privacy-notice" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors underline">Make.com</a> (automated emails)</li>
                  </ul>
                  <p>We apply strict access controls and appropriate technical safeguards to protect your information.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing</h2>
                <div className="text-gray-300 space-y-4">
                  <p className="font-medium">We do not sell or rent your data.</p>
                  <p>We share data only with GDPR-compliant service providers who help us operate Worktugal Pass:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><a href="https://stripe.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors underline">Stripe</a> (payments)</li>
                    <li><a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors underline">Supabase</a> (database and auth)</li>
                    <li><a href="https://www.make.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors underline">Make.com</a> (automation)</li>
                    <li><a href="https://www.netlify.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors underline">Netlify</a> (hosting)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights (Under GDPR)</h2>
                <div className="text-gray-300 space-y-4">
                  <p>You have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Access your personal data</li>
                    <li>Correct inaccurate info</li>
                    <li>Request deletion ("right to be forgotten")</li>
                    <li>Withdraw consent at any time</li>
                    <li>File a complaint with your local data authority</li>
                  </ul>
                  <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-4 mt-4">
                    <p className="font-medium text-blue-300">
                      To exercise your rights, email: <a href="mailto:hello@worktugal.com" className="text-blue-400 hover:text-blue-300 transition-colors underline">hello@worktugal.com</a>
                    </p>
                    <p className="text-sm text-blue-200 mt-1">We respond within 30 days.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Cookies</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We use cookies only after you consent. They help us analyze usage and improve the experience.</p>
                  <p>You can manage or revoke cookie preferences at any time through our site settings.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Policy Updates</h2>
                <div className="text-gray-300 space-y-4">
                  <p>If we change this Privacy Policy, we'll update the date above and notify you when relevant.</p>
                  <p>
                    The latest version will always be available at: <a href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors underline">our Privacy Policy page</a>
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Questions or Concerns?</h2>
                <div className="text-gray-300 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-400" />
                    <span>Email: <a href="mailto:hello@worktugal.com" className="text-blue-400 hover:text-blue-300 transition-colors underline">hello@worktugal.com</a></span>
                  </div>
                  <p className="text-lg font-medium text-blue-300 mt-6">
                    We're building Worktugal Pass with transparency, trust, and respect for your data.
                  </p>
                </div>
              </section>

            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <a
              href="/"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Worktugal Pass
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};