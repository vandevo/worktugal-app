import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Seo } from '../Seo';
import {
  FileText,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Lock,
  Search
} from 'lucide-react';
import { ComplianceDisclaimer } from '../ComplianceDisclaimer';

interface PaidReviewLandingProps {
  onCheckout: () => void;
  isLoading?: boolean;
  isAuthenticated?: boolean;
  onSignIn?: () => void;
  onSignUp?: () => void;
}

export const PaidReviewLanding: React.FC<PaidReviewLandingProps> = ({
  onCheckout,
  isLoading,
  isAuthenticated = false,
  onSignIn,
  onSignUp
}) => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Seo
        title="Know Where You Stand Before Portugal Fines You - Worktugal"
        description="Avoid penalties, blocked permits, and surprise tax bills. Get a detailed compliance readiness review for your specific situation in Portugal. AI-assisted research, human-verified report delivered within 48 hours."
        canonicalUrl="https://app.worktugal.com/compliance-review"
      />

      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIGZpbGw9IiMyMzY1YzQiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="mb-4 inline-block">
              <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-4 py-2 rounded-full border border-blue-500/30">
                For Remote Professionals & Freelancers in Portugal
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Know Where You Stand<br />Before Portugal Fines You
            </h1>
            <p className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto">
              Avoid penalties, blocked permits, and surprise tax bills. Get a detailed review of your specific compliance situation with escalation flags and evidence-backed findings.
            </p>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              Based on analysis of 90+ freelancer compliance situations in Portugal
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-8">
                <h2 className="text-2xl font-bold text-white mb-6">What you get</h2>
                <ul className="space-y-5">
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Structured risk mapping</h3>
                      <p className="text-gray-400 text-sm">26-question intake covering 7 compliance dimensions -- residency, VAT, social security, tax regime, cross-border exposure, and more</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Search className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">AI-assisted research, human-verified report</h3>
                      <p className="text-gray-400 text-sm">Your intake is cross-referenced against current Portuguese regulations from official sources. A human reviewer verifies and finalizes every report.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Escalation flags with source citations</h3>
                      <p className="text-gray-400 text-sm">Clear identification of areas that need professional accountant review, with links to the relevant Portuguese authority pages</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Delivered within 48 hours</h3>
                      <p className="text-gray-400 text-sm">Written report sent to your email with your case reference number</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* What you avoid */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  What you avoid by knowing your status
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-gray-300 text-sm">
                    <span className="text-red-400 font-bold mt-0.5">-</span>
                    Fines from 500 to 5,000 EUR for missing or late tax filings
                  </li>
                  <li className="flex items-start gap-3 text-gray-300 text-sm">
                    <span className="text-red-400 font-bold mt-0.5">-</span>
                    Blocked residence permit renewals due to outstanding tax obligations
                  </li>
                  <li className="flex items-start gap-3 text-gray-300 text-sm">
                    <span className="text-red-400 font-bold mt-0.5">-</span>
                    Surprise social security (NISS) contributions you didn't budget for
                  </li>
                  <li className="flex items-start gap-3 text-gray-300 text-sm">
                    <span className="text-red-400 font-bold mt-0.5">-</span>
                    Missing the NHR/IFICI window or misunderstanding your tax regime
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-200/90 text-sm font-medium mb-1">Important disclaimer</p>
                    <p className="text-yellow-200/70 text-xs leading-relaxed">
                      Worktugal provides compliance readiness assessment and educational information only. This is not legal or tax advice. Information is sourced from official Portuguese authorities where available. Final decisions should be confirmed with a licensed professional (OCC-certified accountant or lawyer).
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-8 sticky top-8">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-white mb-2">
                    49<span className="text-2xl text-gray-400">.00 EUR</span>
                  </div>
                  <div className="text-gray-400">One-time payment. No subscription.</div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>26-question structured intake</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>AI-assisted research, human-verified report</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Written report within 48 hours</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Escalation flags with source citations</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>Progress saved to your account</span>
                  </div>
                </div>

                {isAuthenticated ? (
                  <Button
                    onClick={onCheckout}
                    disabled={isLoading}
                    size="lg"
                    className="w-full mb-4"
                  >
                    {isLoading ? (
                      <>Processing...</>
                    ) : (
                      <>
                        Get your compliance review
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-3 mb-4">
                    <Button
                      onClick={onSignUp}
                      size="lg"
                      className="w-full"
                    >
                      Create account to get started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <button
                      onClick={onSignIn}
                      className="w-full text-center text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      Already have an account? Sign in
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                  <Lock className="w-4 h-4" />
                  <span>Secure payment via Stripe</span>
                </div>

                {!isAuthenticated && (
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Your progress is saved to your account. Return anytime by logging in.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">How it works</h2>
            <p className="text-gray-400">Simple process, thorough analysis</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Pay securely', desc: 'One-time payment of 49 EUR via Stripe. No subscription.' },
              { step: 2, title: 'Complete intake', desc: '26 questions covering all risk dimensions (5-7 min). Auto-saved.' },
              { step: 3, title: 'AI research + human review', desc: 'Your intake is cross-referenced against current regulations, then verified by a human.' },
              { step: 4, title: 'Get your report', desc: 'Written review with escalation flags delivered within 48 hours.' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Common questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-2">Is this tax advice?</h3>
                <p className="text-gray-400 text-sm">
                  No. This is a compliance readiness assessment -- we identify potential gaps and flag areas that require professional review. Worktugal is not a tax firm, accountancy practice, or law office. For binding tax advice, you need a licensed OCC-certified accountant.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">How does AI-assisted research work?</h3>
                <p className="text-gray-400 text-sm">
                  When you submit your intake, our system cross-references your answers against current Portuguese regulations from official sources (Autoridade Tributaria, Seguranca Social, etc.). A human reviewer then verifies the findings and finalizes your report. AI assists the research -- it does not write your report autonomously.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">What if my situation is complex?</h3>
                <p className="text-gray-400 text-sm">
                  Complex situations (multi-jurisdiction residency, A1 certificate issues, VAT complexities) are flagged for professional review. You'll receive partial findings plus clear guidance on what requires accountant consultation.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Can I save my progress?</h3>
                <p className="text-gray-400 text-sm">
                  Yes. Your answers are auto-saved to your account after each section. Close the browser, come back anytime by logging in.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">How long does the intake take?</h3>
                <p className="text-gray-400 text-sm">
                  5-7 minutes. 26 questions across 7 sections. Most questions are multiple choice. You can take breaks and return.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom disclaimer */}
      <ComplianceDisclaimer variant="footer" className="bg-gray-900" />
    </div>
  );
};
