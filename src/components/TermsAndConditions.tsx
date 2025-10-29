import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Mail, MapPin, Building, Scale, ArrowLeft, CreditCard, Shield, AlertCircle, Phone } from 'lucide-react';
import { Seo } from './Seo';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <Seo
        title="Terms and Conditions - Service Agreement"
        description="Read the terms and conditions for using Worktugal. Understand your rights and obligations as a partner or user of our partner network."
        ogType="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Terms and Conditions",
          "description": "Terms and Conditions for Worktugal - Service agreement and user obligations",
          "url": "https://app.worktugal.com/terms",
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
              <Scale className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your agreement for using Worktugal Pass services
          </p>
          <p className="text-sm text-gray-400 mt-4">
            <strong>Effective Date:</strong> October 29, 2025
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
                Welcome to <strong className="text-white">Worktugal</strong>. By accessing or using our website and services, 
                you agree to the following terms.
              </p>
            </div>
          </Card>

          {/* Section 1: Who We Are */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Building className="mr-3 h-6 w-6 text-blue-400" />
              1. Who We Are
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                Worktugal is operated by:
              </p>
              
              <div className="p-6 bg-gray-700/30 rounded-xl border border-gray-600/20">
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
                  We operate under EU law, with digital services sold across the European Economic Area (EEA).
                </p>
              </div>
            </div>
          </Card>

          {/* Section 2: What We Offer */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FileText className="mr-3 h-6 w-6 text-blue-400" />
              2. What We Offer
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                Worktugal provides two core services:
              </p>
              <div className="space-y-4 mb-4">
                <div className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-xl">
                  <h3 className="text-white font-semibold mb-2">1. Accounting Desk</h3>
                  <p className="text-gray-300 text-sm">
                    Tax consultation services connecting remote professionals with OCC-certified Portuguese accountants.
                    Includes 30-minute video consultations, written action plans, and follow-up support.
                  </p>
                  <p className="text-blue-300 font-medium text-sm mt-2">
                    Pricing: €59 (Early Access), €149-€299 (Full Service)
                  </p>
                </div>
                <div className="p-4 bg-green-600/10 border border-green-600/20 rounded-xl">
                  <h3 className="text-white font-semibold mb-2">2. Partner Hub</h3>
                  <p className="text-gray-300 text-sm">
                    Digital listing services for businesses who want visibility to remote professionals based in Portugal.
                    Lifetime verified business listings displayed at app.worktugal.com/partners
                  </p>
                  <p className="text-green-300 font-medium text-sm mt-2">
                    Pricing: €49 (one-time, no subscription or renewal)
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Payments */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <CreditCard className="mr-3 h-6 w-6 text-blue-400" />
              3. Payments
            </h2>
            <div className="prose prose-invert max-w-none">
              <ul className="space-y-2 text-gray-300">
                <li>All payments are processed securely via <strong>Stripe</strong>.</li>
                <li>We do not store or handle your credit card information directly.</li>
                <li>Receipts are automatically issued and sent via email.</li>
                <li>All prices are in <strong>EUR (€)</strong> and include applicable VAT where required.</li>
              </ul>
              <div className="mt-4 p-4 bg-orange-600/10 border border-orange-600/20 rounded-xl">
                <p className="text-orange-300 font-medium text-sm">
                  <strong>Refund Policy:</strong>
                </p>
                <ul className="text-gray-300 text-sm mt-2 space-y-1">
                  <li>• <strong>Partner Hub listings:</strong> Non-refundable once approved and published</li>
                  <li>• <strong>Accounting consultations:</strong> Refundable before appointment is scheduled. Non-refundable within 24 hours of appointment or after consultation has occurred</li>
                  <li>• Exceptional refund requests can be submitted to hello@worktugal.com</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Section 4: User Conduct */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Shield className="mr-3 h-6 w-6 text-blue-400" />
              4. User Conduct
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>Post false, misleading, or inappropriate content</li>
                <li>Impersonate other businesses</li>
                <li>Attempt to hack, disrupt, or scrape our platform</li>
                <li>Use Worktugal Pass for illegal or deceptive purposes</li>
              </ul>
              <div className="mt-4 p-4 bg-red-600/10 border border-red-600/20 rounded-xl">
                <p className="text-red-300 font-medium">
                  We reserve the right to remove listings or block access for any violations.
                </p>
              </div>
            </div>
          </Card>

          {/* Section 5: Intellectual Property */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">5. Intellectual Property</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                All content on this site — including layout, branding, and code — is the intellectual property 
                of Worktugal or its contributors.
              </p>
              <p className="text-orange-300 font-medium">
                You may not copy, reproduce, or distribute our materials without permission.
              </p>
            </div>
          </Card>

          {/* Section 6: Availability and Changes */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">6. Availability and Changes</h2>
            <div className="prose prose-invert max-w-none">
              <ul className="space-y-2 text-gray-300">
                <li>We may modify or pause features at any time without notice.</li>
                <li>We reserve the right to update these terms. Changes will be posted on this page with a new effective date.</li>
              </ul>
            </div>
          </Card>

          {/* Section 7: Liability Disclaimer */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <AlertCircle className="mr-3 h-6 w-6 text-orange-400" />
              7. Liability Disclaimer
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                We do our best to maintain a secure and reliable service, but we can't guarantee uninterrupted 
                access or platform availability.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                We are not liable for:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>Loss of income or leads</li>
                <li>Listing visibility fluctuations</li>
                <li>Third-party service issues (e.g. Stripe, Cal.com, Supabase, Airtable)</li>
                <li>Quality or outcomes of accounting consultations (we connect you with professionals but don't provide the advice ourselves)</li>
                <li>Mistakes caused by false info submitted by partners</li>
              </ul>
            </div>
          </Card>

          {/* Section 8: Jurisdiction and Law */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">8. Jurisdiction and Law</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                These terms are governed by Estonian law (where Xolo Go OÜ is registered).
              </p>
              <p className="text-gray-300 leading-relaxed">
                Any disputes should first be raised via email:{' '}
                <a 
                  href="mailto:hello@worktugal.com" 
                  className="text-blue-400 hover:text-blue-300 transition-colors underline"
                >
                  hello@worktugal.com
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
                We're building Worktugal with transparency, trust, and respect for the remote professional community in Portugal.
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