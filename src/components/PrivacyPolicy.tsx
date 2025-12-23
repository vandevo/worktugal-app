import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, MapPin, Building, FileText, ArrowLeft, Phone } from 'lucide-react';
import { Seo } from './Seo';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <Seo
        title="Privacy Policy - How We Protect Your Data"
        description="Learn how Worktugal collects, uses, and protects your personal data. We're GDPR compliant and transparent about our data practices."
        ogType="article"
        canonicalUrl="https://app.worktugal.com/privacy"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Privacy Policy",
          "description": "Privacy Policy for Worktugal - GDPR compliant data protection practices",
          "url": "https://app.worktugal.com/privacy",
          "isPartOf": {
            "@type": "WebSite",
            "name": "Worktugal",
            "url": "https://app.worktugal.com"
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
            <strong>Effective Date:</strong> December 23, 2025
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
                This Privacy Policy explains how <strong className="text-white">Worktugal</strong> ("we," "us," or "our") 
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
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a href="tel:+351215818485" className="text-blue-400 hover:text-blue-300 transition-colors">
                      +351 215 818 485
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
                <li><strong>Accounting consultations:</strong> name, email, phone, case details, documents you upload</li>
                <li><strong>Tax compliance checkup:</strong> work type, estimated income range, months in Portugal, residency status, tax registration status (NIF, VAT, NISS, fiscal representative), email, and optional phone number</li>
                <li><strong>Accountant applications:</strong> professional credentials, OCC certification, experience, resume/CV uploads, language skills, and contact details</li>
                <li><strong>Contact requests:</strong> name, email, company, inquiry purpose, message content, and optional budget/timeline information</li>
                <li><strong>Appointment bookings:</strong> name, email, timezone, meeting preferences (via Cal.com)</li>
                <li><strong>Payments:</strong> Stripe processes payment data (we don't store card info)</li>
                <li><strong>Website analytics:</strong> anonymized usage data via Google Analytics and Simple Analytics (with consent)</li>
                <li><strong>Marketing attribution:</strong> UTM parameters (source, campaign, medium) to understand how you found us</li>
                <li><strong>Feedback:</strong> ratings and comments you provide on our recommendations</li>
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
                <li>Create and manage your Partner Hub listing</li>
                <li>Provide personalized tax compliance assessments via our checkup tool</li>
                <li>Connect you with OCC-certified accountants for tax consultations</li>
                <li>Review and process accountant partnership applications</li>
                <li>Respond to contact inquiries and partnership proposals</li>
                <li>Schedule and manage accounting appointments</li>
                <li>Process payments and send confirmations</li>
                <li>Improve the website experience and service quality</li>
                <li>Send relevant updates about services you've purchased or expressed interest in</li>
                <li>Fulfill legal, accounting, or tax requirements</li>
              </ul>
              <p className="text-blue-300 font-medium mt-4">
                We only process data under lawful bases: contract, consent, legitimate interest, or legal obligation.
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
                <li><strong>Supabase</strong> (accounts, partner submissions, consultation data, file storage for resumes)</li>
                <li><strong>Stripe</strong> (payment processing)</li>
                <li><strong>Cal.com</strong> (appointment scheduling for accountants)</li>
                <li><strong>Airtable</strong> (lead management and consultation tracking)</li>
                <li><strong>Netlify</strong> (website hosting)</li>
                <li><strong>Make.com</strong> (automated notifications, lead routing, and workflows)</li>
                <li><strong>Google Analytics</strong> (anonymized website usage data, retained for 26 months)</li>
                <li><strong>Simple Analytics</strong> (privacy-focused analytics without personal data)</li>
                <li><strong>Amazon SES</strong> (transactional emails)</li>
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
                We share data only with GDPR-compliant service providers who help us operate Worktugal:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li><strong>Stripe</strong> (payment processing - US, EU Standard Contractual Clauses)</li>
                <li><strong>Supabase</strong> (database, authentication, file storage - EU region)</li>
                <li><strong>Cal.com</strong> (appointment scheduling)</li>
                <li><strong>Airtable</strong> (consultation management)</li>
                <li><strong>Make.com</strong> (workflow automation, confirmation emails, lead routing)</li>
                <li><strong>Netlify</strong> (website hosting)</li>
                <li><strong>Amazon SES</strong> (transactional emails)</li>
                <li><strong>Google Analytics</strong> (anonymized usage analytics - you can opt-out via cookie preferences)</li>
                <li><strong>Simple Analytics</strong> (privacy-focused analytics)</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                All these providers are GDPR-compliant and process data under strict security standards. For transfers outside the EU (e.g., to US-based services), we rely on Standard Contractual Clauses or equivalent safeguards.
              </p>
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
                <li>Receive your data in a portable format (data portability)</li>
                <li>Object to automated decision-making or profiling</li>
                <li>Withdraw consent at any time</li>
                <li>Restrict processing in certain circumstances</li>
                <li>File a complaint with your local data protection authority</li>
              </ul>
              <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/20 rounded-xl">
                <p className="text-blue-300 font-medium">
                  To exercise your rights, email: <a href="mailto:hello@worktugal.com" className="text-blue-400 hover:text-blue-300 transition-colors underline">hello@worktugal.com</a>
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  We respond within 30 days.
                </p>
              </div>
              <div className="mt-4 p-4 bg-gray-700/30 border border-gray-600/20 rounded-xl">
                <p className="text-gray-300 text-sm">
                  <strong>For Portuguese residents:</strong> You may lodge a complaint with CNPD (Comissao Nacional de Protecao de Dados) at <a href="https://www.cnpd.pt" className="text-blue-400 hover:text-blue-300 transition-colors underline" target="_blank" rel="noopener noreferrer">www.cnpd.pt</a>
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
              <p className="text-gray-300 leading-relaxed mb-4">
                We use the following types of cookies:
              </p>
              <ul className="space-y-2 text-gray-300 mb-4">
                <li><strong>Strictly Necessary:</strong> Essential for authentication, security, and saving your cookie preferences</li>
                <li><strong>Analytics:</strong> Google Analytics (GA4) and Simple Analytics help us understand site usage. Google Analytics data is anonymized and retained for 26 months</li>
                <li><strong>Functional:</strong> Remember your preferences and saved form progress via localStorage</li>
              </ul>
              <p className="text-blue-300 font-medium">
                You can manage or revoke cookie preferences at any time through the cookie settings in our site footer.
              </p>
            </div>
          </Card>

          {/* Section 7: Automated Decision-Making */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">7. Automated Decision-Making</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                Our tax compliance checkup uses automated logic to generate compliance assessments based on your inputs. These assessments categorize potential issues as:
              </p>
              <ul className="space-y-2 text-gray-300 mb-4">
                <li><span className="text-red-400 font-medium">Red (Critical):</span> Immediate action recommended</li>
                <li><span className="text-yellow-400 font-medium">Yellow (Warning):</span> Review recommended</li>
                <li><span className="text-green-400 font-medium">Green (Compliant):</span> No immediate action needed</li>
              </ul>
              <div className="p-4 bg-orange-600/10 border border-orange-600/20 rounded-xl">
                <p className="text-orange-300 font-medium mb-2">Important:</p>
                <p className="text-gray-300 text-sm">
                  These scores are informational only and do not constitute professional tax, legal, or accounting advice. They do not result in legally binding decisions. You have the right to request human review of any automated assessment by contacting us at hello@worktugal.com.
                </p>
              </div>
            </div>
          </Card>

          {/* Section 8: Data Retention */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">8. Data Retention</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                We retain your data only as long as necessary for the purposes described in this policy:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li><strong>User accounts:</strong> Duration of account plus 7 years (for tax/legal records)</li>
                <li><strong>Tax checkup data:</strong> 2 years from submission</li>
                <li><strong>Contact requests:</strong> 1 year after resolution</li>
                <li><strong>Accountant applications:</strong> 3 years (accepted) or 1 year (not accepted)</li>
                <li><strong>Payment records:</strong> 7 years (legal requirement)</li>
                <li><strong>Partner listings:</strong> Duration of listing plus 2 years</li>
                <li><strong>Analytics data:</strong> 26 months (Google Analytics default)</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                After these periods, data is securely deleted or anonymized.
              </p>
            </div>
          </Card>

          {/* Section 9: Policy Updates */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">9. Policy Updates</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                If we change this Privacy Policy, we'll update the date above and notify you when relevant.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The latest version will always be available at:{' '}
                <a
                  href="https://app.worktugal.com/privacy"
                  className="text-blue-400 hover:text-blue-300 transition-colors underline"
                >
                  https://app.worktugal.com/privacy
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
                We're building Worktugal with transparency, trust, and respect for your data.
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