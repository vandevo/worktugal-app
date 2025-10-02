import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, MapPin, Building, FileText, ArrowLeft } from 'lucide-react';
import { Seo } from './Seo';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <Seo
        title="Privacy Policy - How We Protect Your Data"
        description="Learn how Worktugal Pass collects, uses, and protects your personal data. We're GDPR compliant and transparent about our data practices."
        ogType="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Privacy Policy",
          "description": "Privacy Policy for Worktugal Pass - GDPR compliant data protection practices",
          "url": "https://pass.worktugal.com/privacy",
          "isPartOf": {
            "@type": "WebSite",
            "name": "Worktugal Pass",
            "url": "https://pass.worktugal.com"
          }
        }}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="inline-flex items-center text-gray-400 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We're transparent about how we collect, use, and protect your personal data
          </p>
          <p className="text-sm text-gray-400 mt-4">
            <strong>Effective Date:</strong> August 9, 2025
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-8"
        >
          {/* Introduction */}
          <Card className="p-8">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed text-lg">
                This Privacy Policy explains how <strong className="text-white">Worktugal Pass</strong> ("we," "us," or "our") 
                collects, uses, and protects your personal data when you use our website or services.
              </p>
              
              <div className="mt-6 p-6 bg-gray-700/30 rounded-xl border border-gray-600/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Building className="mr-2 h-5 w-5 text-blue-400" />
                  We are operated by:
                </h3>
                <div className="space-y-2 text-gray-300">
                  <p><strong>Xolo Go OÜ – Van Vo</strong></p>
                  <p>Registry code: 14717109</p>
                  <p>EU VAT: EE102156920</p>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>Registered address: Paju tn 1a, 50603 Tartu, Estonia</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href="mailto:hello@worktugal.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                      hello@worktugal.com
                    </a>
                  </div>
                </div>
                <p className="text-sm text-blue-300 mt-4 font-medium">
                  We are based in the European Union and comply with the General Data Protection Regulation (GDPR).
                </p>
              </div>
            </div>
          </Card>

          {/* Section 1: What We Collect */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FileText className="mr-3 h-6 w-6 text-blue-400" />
              1. What We Collect
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                We only collect the data necessary to provide our services, including:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li><strong>Partner listings:</strong> name, email, WhatsApp, business info</li>
                <li><strong>Payments:</strong> Stripe processes payment data (we don't store card info)</li>
                <li><strong>Website visits:</strong> anonymized cookie and usage data (with consent)</li>
                <li><strong>Contact:</strong> any info you voluntarily provide via forms or messages</li>
              </ul>
              <p className="text-blue-300 font-medium mt-4">
                We never ask for or store sensitive data without clear consent.
              </p>
            </div>
          </Card>

          {/* Section 2: Why We Collect It */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">2. Why We Collect It</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                We collect and process your data to:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>Create and manage your Worktugal Pass listing</li>
                <li>Process payments and send confirmations</li>
                <li>Improve the website experience</li>
                <li>Send relevant updates or event invites</li>
                <li>Fulfill legal, accounting, or tax requirements</li>
              </ul>
              <p className="text-blue-300 font-medium mt-4">
                We only process data under lawful bases: contract, consent, or legal obligation.
              </p>
            </div>
          </Card>

          {/* Section 3: How We Store and Protect It */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">3. How We Store and Protect It</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                Your data is stored securely using:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li><strong>Supabase</strong> (accounts, partner submissions)</li>
                <li><strong>Stripe</strong> (payments)</li>
                <li><strong>Netlify</strong> (hosting)</li>
                <li><strong>Make.com</strong> (automated emails)</li>
              </ul>
              <p className="text-green-300 font-medium mt-4">
                We apply strict access controls and appropriate technical safeguards to protect your information.
              </p>
            </div>
          </Card>

          {/* Section 4: Data Sharing */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">4. Data Sharing</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-green-300 font-bold mb-4">
                We do not sell or rent your data.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                We share data only with GDPR-compliant service providers who help us operate Worktugal Pass:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>Stripe (payments)</li>
                <li>Supabase (database and auth)</li>
                <li>Make.com (automation)</li>
                <li>Netlify (hosting)</li>
              </ul>
            </div>
          </Card>

          {/* Section 5: Your Rights */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">5. Your Rights (Under GDPR)</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>Access your personal data</li>
                <li>Correct inaccurate info</li>
                <li>Request deletion ("right to be forgotten")</li>
                <li>Withdraw consent at any time</li>
                <li>File a complaint with your local data authority</li>
              </ul>
              <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/20 rounded-xl">
                <p className="text-blue-300 font-medium">
                  To exercise your rights, email: <a href="mailto:hello@worktugal.com" className="text-blue-400 hover:text-blue-300 transition-colors underline">hello@worktugal.com</a>
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  We respond within 30 days.
                </p>
              </div>
            </div>
          </Card>

          {/* Section 6: Cookies */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">6. Cookies</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                We use cookies only after you consent. They help us analyze usage and improve the experience.
              </p>
              <p className="text-blue-300 font-medium">
                You can manage or revoke cookie preferences at any time through our site settings.
              </p>
            </div>
          </Card>

          {/* Section 7: Policy Updates */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">7. Policy Updates</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                If we change this Privacy Policy, we'll update the date above and notify you when relevant.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The latest version will always be available at:{' '}
                <a 
                  href="https://pass.worktugal.com/privacy" 
                  className="text-blue-400 hover:text-blue-300 transition-colors underline"
                >
                  https://pass.worktugal.com/privacy
                </a>
              </p>
            </div>
          </Card>

          {/* Contact Section */}
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions or Concerns?</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">Email:</span>
                <a 
                  href="mailto:hello@worktugal.com" 
                  className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                >
                  hello@worktugal.com
                </a>
              </div>
              <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
                We're building Worktugal Pass with transparency, trust, and respect for your data.
              </p>
            </div>
          </Card>

          {/* Back to top */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Back to Top
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};