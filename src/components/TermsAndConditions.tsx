import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Mail, MapPin, Building, Scale, ArrowLeft, CreditCard, Shield, AlertCircle, Phone } from 'lucide-react';
import { Seo } from './Seo';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] py-12">
      <Seo
        title="Terms and Conditions - Service Agreement"
        description="Read the terms and conditions for using Worktugal. Understand your rights and obligations as a partner or user of our partner network."
        ogType="article"
        canonicalUrl="https://app.worktugal.com/terms"
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
              className="inline-flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-400/10 rounded-2xl flex items-center justify-center border border-blue-400/20">
              <Scale className="h-8 w-8 text-blue-400/70" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-serif text-white mb-4">Terms and Conditions</h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
            Your agreement for using Worktugal services
          </p>
          <div className="mt-6 flex justify-center">
            <span className="bg-white/5 text-gray-400 px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-widest border border-white/10">
              Effective Date: December 23, 2025
            </span>
          </div>
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
              <p className="text-gray-400 font-light leading-relaxed text-lg">
                Welcome to <strong className="text-white font-medium">Worktugal</strong>. By accessing or using our website and services, 
                you agree to the following terms.
              </p>
            </div>
          </Card>

          {/* Section 1: Who We Are */}
          <Card className="p-8">
            <h2 className="text-2xl font-serif text-white mb-6 flex items-center">
              <Building className="mr-3 h-6 w-6 text-blue-400/50" />
              1. Who We Are
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 font-light leading-relaxed mb-4">
                Worktugal is operated by:
              </p>
              
              <div className="p-6 bg-white/[0.01] rounded-2xl border border-white/5">
                <div className="space-y-2 text-gray-400 font-light">
                  <p><strong className="text-white font-medium">Xolo Go OÜ – Van Vo</strong></p>
                  <p>Registry code: 14717109</p>
                  <p>EU VAT: EE102156920</p>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>Registered address: Paju tn 1a, 50603 Tartu, Estonia</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a href="mailto:hello@worktugal.com" className="text-blue-400/70 hover:text-blue-400 transition-colors">
                      hello@worktugal.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a href="tel:+351215818485" className="text-blue-400/70 hover:text-blue-400 transition-colors">
                      +351 215 818 485
                    </a>
                  </div>
                </div>
                <p className="text-sm text-blue-400/60 mt-4 font-medium">
                  We operate under EU law, with digital services sold across the European Economic Area (EEA).
                </p>
              </div>
            </div>
          </Card>

          {/* Section 2: What We Offer */}
          <Card className="p-8">
            <h2 className="text-2xl font-serif text-white mb-6 flex items-center">
              <FileText className="mr-3 h-6 w-6 text-blue-400/50" />
              2. What We Offer
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 font-light leading-relaxed mb-4">
                Worktugal provides the following services:
              </p>
              <div className="space-y-4 mb-4">
                <div className="p-4 bg-blue-400/5 border border-blue-400/10 rounded-2xl">
                  <h3 className="text-white font-serif text-lg mb-2">1. Accounting Desk</h3>
                  <p className="text-gray-500 text-sm font-light">
                    Tax consultation services connecting remote professionals with OCC-certified Portuguese accountants.
                    Includes 30-minute video consultations, written action plans, and follow-up support.
                  </p>
                  <p className="text-blue-400/60 font-medium text-sm mt-2">
                    Pricing: €59 (Early Access), €149-€299 (Full Service)
                  </p>
                </div>
                <div className="p-4 bg-emerald-400/5 border border-emerald-400/10 rounded-2xl">
                  <h3 className="text-white font-serif text-lg mb-2">2. Partner Hub</h3>
                  <p className="text-gray-500 text-sm font-light">
                    Digital listing services for businesses who want visibility to remote professionals based in Portugal.
                    Lifetime verified business listings displayed at app.worktugal.com/partners
                  </p>
                  <p className="text-emerald-400/60 font-medium text-sm mt-2">
                    Pricing: €49 (one-time, no subscription or renewal)
                  </p>
                </div>
                <div className="p-4 bg-teal-400/5 border border-teal-400/10 rounded-2xl">
                  <h3 className="text-white font-serif text-lg mb-2">3. Tax Compliance Checkup</h3>
                  <p className="text-gray-500 text-sm font-light">
                    A free diagnostic tool that evaluates your tax compliance status in Portugal based on your inputs.
                    The checkup provides informational guidance only and does not constitute professional tax, legal, or accounting advice.
                  </p>
                  <p className="text-teal-400/60 font-medium text-sm mt-2">
                    Pricing: Free
                  </p>
                </div>
                <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                  <h3 className="text-white font-serif text-lg mb-2">4. Accountant Partner Network</h3>
                  <p className="text-gray-500 text-sm font-light">
                    An application system for OCC-certified accountants who wish to join our partner network.
                    Applications are reviewed internally and acceptance is at our sole discretion.
                    Successful applicants may be matched with clients seeking accounting services.
                  </p>
                </div>
                <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                  <h3 className="text-white font-serif text-lg mb-2">5. Contact and Inquiries</h3>
                  <p className="text-gray-500 text-sm font-light">
                    A contact system for accounting help requests, partnership proposals, job inquiries, and general information.
                    We aim to respond to all inquiries within 5 business days.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Payments */}
          <Card className="p-8">
            <h2 className="text-2xl font-serif text-white mb-6 flex items-center">
              <CreditCard className="mr-3 h-6 w-6 text-blue-400/50" />
              3. Payments
            </h2>
            <div className="prose prose-invert max-w-none">
              <ul className="space-y-2 text-gray-400 font-light">
                <li>All payments are processed securely via <strong className="text-white font-medium">Stripe</strong>.</li>
                <li>We do not store or handle your credit card information directly.</li>
                <li>Receipts are automatically issued and sent via email.</li>
                <li>All prices are in <strong className="text-white font-medium">EUR (€)</strong> and include applicable VAT where required.</li>
              </ul>
              <div className="mt-6 p-6 bg-orange-400/5 border border-orange-400/10 rounded-2xl">
                <p className="text-orange-400/70 font-serif text-lg mb-2">
                  Refund Policy:
                </p>
                <ul className="text-gray-500 text-sm font-light space-y-1">
                  <li>• <strong className="text-gray-400 font-medium">Partner Hub listings:</strong> Non-refundable once approved and published</li>
                  <li>• <strong className="text-gray-400 font-medium">Accounting consultations:</strong> Refundable before appointment is scheduled. Non-refundable within 24 hours of appointment or after consultation has occurred</li>
                  <li>• Exceptional refund requests can be submitted to hello@worktugal.com</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Section 4: User Conduct */}
          <Card className="p-8">
            <h2 className="text-2xl font-serif text-white mb-6 flex items-center">
              <Shield className="mr-3 h-6 w-6 text-blue-400/50" />
              4. User Conduct
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 font-light leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="space-y-2 text-gray-400 font-light">
                <li>Post false, misleading, or inappropriate content</li>
                <li>Impersonate other businesses</li>
                <li>Attempt to hack, disrupt, or scrape our platform</li>
                <li>Use Worktugal services for illegal or deceptive purposes</li>
              </ul>
              <div className="mt-6 p-4 bg-red-400/5 border border-red-400/10 rounded-xl">
                <p className="text-red-400/70 text-sm font-medium">
                  We reserve the right to remove listings or block access for any violations.
                </p>
              </div>
            </div>
          </Card>

          {/* Section 5: Intellectual Property */}
          <Card className="p-8">
            <h2 className="text-2xl font-serif text-white mb-6">5. Intellectual Property</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 font-light leading-relaxed mb-4">
                All content on this site — including layout, branding, and code — is the intellectual property 
                of Worktugal or its contributors.
              </p>
              <p className="text-orange-400/70 font-medium">
                You may not copy, reproduce, or distribute our materials without permission.
              </p>
            </div>
          </Card>

          {/* Section 6: Availability and Changes */}
          <Card className="p-8">
            <h2 className="text-2xl font-serif text-white mb-6">6. Availability and Changes</h2>
            <div className="prose prose-invert max-w-none">
              <ul className="space-y-2 text-gray-400 font-light">
                <li>We may modify or pause features at any time without notice.</li>
                <li>We reserve the right to update these terms. Changes will be posted on this page with a new effective date.</li>
              </ul>
            </div>
          </Card>

          {/* Section 7: Liability Disclaimer */}
          <Card className="p-8">
            <h2 className="text-2xl font-serif text-white mb-6 flex items-center">
              <AlertCircle className="mr-3 h-6 w-6 text-orange-400/50" />
              7. Liability Disclaimer
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 font-light leading-relaxed mb-4">
                We do our best to maintain a secure and reliable service, but we can't guarantee uninterrupted
                access or platform availability.
              </p>
              <p className="text-gray-400 font-light leading-relaxed mb-4">
                We are not liable for:
              </p>
              <ul className="space-y-2 text-gray-400 font-light">
                <li>Loss of income or leads</li>
                <li>Listing visibility fluctuations</li>
                <li>Third-party service issues (e.g. Stripe, Cal.com, Supabase, Airtable, Make.com)</li>
                <li>Quality or outcomes of accounting consultations (we connect you with professionals but don't provide the advice ourselves)</li>
                <li>Accuracy or completeness of tax compliance checkup results</li>
                <li>Decisions made based on automated compliance scoring</li>
                <li>Any reliance on informational content without verification by a qualified professional</li>
                <li>Mistakes caused by false or incomplete info submitted by users</li>
                <li>Outcomes of accountant partnership applications</li>
              </ul>
              <div className="mt-6 p-6 bg-orange-400/5 border border-orange-400/10 rounded-2xl">
                <p className="text-orange-400/70 font-serif text-lg mb-2">
                  Tax Checkup Disclaimer:
                </p>
                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  The tax compliance checkup is for informational purposes only.
                  Results should not be considered professional tax, legal, or accounting advice.
                  Always consult a qualified professional before making financial decisions.
                </p>
              </div>
            </div>
          </Card>

          {/* Section 8: Data Retention */}
          <Card className="p-8">
            <h2 className="text-2xl font-serif text-white mb-6">8. Data Retention</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 font-light leading-relaxed mb-4">
                We retain your data as follows:
              </p>
              <ul className="space-y-2 text-gray-400 font-light">
                <li><strong className="text-white font-medium">Account data:</strong> Duration of account plus 7 years (for tax/legal records)</li>
                <li><strong className="text-white font-medium">Lead/waitlist data:</strong> 2 years from submission or until service enrollment</li>
                <li><strong className="text-white font-medium">Tax checkup results:</strong> 2 years from submission</li>
                <li><strong className="text-white font-medium">Contact requests:</strong> 1 year after resolution</li>
                <li><strong className="text-white font-medium">Accountant applications:</strong> 3 years (accepted) or 1 year (not accepted)</li>
                <li><strong className="text-white font-medium">Payment records:</strong> 7 years (legal requirement)</li>
              </ul>
              <p className="text-gray-500 font-light leading-relaxed mt-4">
                For full details, see our <a href="/privacy" className="text-blue-400/70 hover:text-blue-400 transition-colors underline decoration-blue-400/20">Privacy Policy</a>.
              </p>
            </div>
          </Card>

          {/* Section 9: Jurisdiction and Law */}
          <Card className="p-8">
            <h2 className="text-2xl font-serif text-white mb-6">9. Jurisdiction and Law</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 font-light leading-relaxed mb-4">
                These terms are governed by Estonian law (where Xolo Go OÜ is registered).
              </p>
              <p className="text-gray-400 font-light leading-relaxed">
                Any disputes should first be raised via email:{' '}
                <a
                  href="mailto:hello@worktugal.com"
                  className="text-blue-400/70 hover:text-blue-400 transition-colors underline decoration-blue-400/20"
                >
                  hello@worktugal.com
                </a>
              </p>
            </div>
          </Card>

          {/* Contact Section */}
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-serif text-white mb-4">Questions or Concerns?</h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-2">
                <Mail className="h-5 w-5 text-blue-400/50 mb-2 sm:mb-0" />
                <span className="text-gray-500 font-light">Email:</span>
                <a 
                  href="mailto:hello@worktugal.com" 
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium text-lg"
                >
                  hello@worktugal.com
                </a>
              </div>
              <p className="text-gray-500 font-light leading-relaxed max-w-2xl mx-auto">
                We're building Worktugal with transparency, trust, and respect for the remote professional community in Portugal.
              </p>
            </div>
          </Card>

          {/* Back to top */}
          <div className="text-center pt-8">
            <Button
              variant="secondary"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xs uppercase tracking-[0.2em]"
            >
              Back to Top
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};