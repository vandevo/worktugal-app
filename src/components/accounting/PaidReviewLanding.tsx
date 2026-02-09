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
    <div className="min-h-screen bg-obsidian">
      <Seo
        title="Compliance Readiness Review - Worktugal"
        description="Avoid penalties, blocked permits, and surprise tax bills. Get a detailed compliance readiness review for your specific situation in Portugal."
        canonicalUrl="https://app.worktugal.com/compliance-review"
      />

      <section className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="mb-8">
              <span className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-medium px-4 py-2 rounded-full border border-white/10">
                Strategic Readiness Layer
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif text-white mb-8 leading-[1.1]">
              Know Where You Stand<br />Before Portugal Fines You
            </h1>
            <p className="text-lg text-gray-500 font-light mb-4 max-w-3xl mx-auto leading-relaxed">
              Avoid penalties, blocked permits, and surprise tax bills. Get a detailed review of your specific compliance situation with escalation flags and evidence-backed findings.
            </p>
            <p className="text-xs text-gray-600 uppercase tracking-widest font-bold mt-8">
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
              <div className="bg-white/[0.01] rounded-3xl border border-white/5 p-10">
                <h2 className="text-xl font-serif text-white mb-10">What you get</h2>
                <ul className="space-y-10">
                  <li className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-500/50" />
                    </div>
                    <div>
                      <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-3">Structured risk mapping</h3>
                      <p className="text-gray-500 text-xs font-light leading-relaxed">26-question intake covering 7 compliance dimensions — residency, VAT, social security, tax regime, cross-border exposure, and more.</p>
                    </div>
                  </li>
                  <li className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
                      <Search className="w-6 h-6 text-emerald-500/50" />
                    </div>
                    <div>
                      <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-3">AI-assisted research, human-verified</h3>
                      <p className="text-gray-500 text-xs font-light leading-relaxed">Your intake is cross-referenced against current Portuguese regulations from official sources. A human reviewer verifies and finalizes every report.</p>
                    </div>
                  </li>
                  <li className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-yellow-500/5 border border-yellow-500/10 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-yellow-500/50" />
                    </div>
                    <div>
                      <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-3">Escalation flags with citations</h3>
                      <p className="text-gray-500 text-xs font-light leading-relaxed">Clear identification of areas that need professional accountant review, with links to the relevant Portuguese authority pages.</p>
                    </div>
                  </li>
                  <li className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-500/50" />
                    </div>
                    <div>
                      <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-3">Delivered within 48 hours</h3>
                      <p className="text-gray-500 text-xs font-light leading-relaxed">Written report sent to your email with your specific case reference number.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* What you avoid */}
              <div className="bg-red-500/[0.02] border border-red-500/10 rounded-3xl p-10">
                <h3 className="text-red-500/60 text-xs uppercase tracking-[0.2em] font-bold mb-8 flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4" />
                  What you avoid by knowing your status
                </h3>
                <ul className="space-y-6">
                  {[
                    'Fines from 500 to 5,000 EUR for missing or late tax filings',
                    'Blocked residence permit renewals due to outstanding tax obligations',
                    'Surprise social security (NISS) contributions you didn\'t budget for',
                    'Missing the NHR/IFICI window or misunderstanding your tax regime'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-gray-400 text-xs font-light leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/30 mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 p-10 sticky top-24">
                <div className="text-center mb-10">
                  <div className="text-5xl font-serif text-white mb-2">
                    €49<span className="text-sm text-gray-500 font-sans ml-2 font-light">One-time</span>
                  </div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">No subscription required</div>
                </div>

                <div className="space-y-5 mb-10">
                  {[
                    '26-question diagnostic intake',
                    'AI-assisted research process',
                    'Human-verified readiness report',
                    'Written review within 48 hours',
                    'Direct links to official sources'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-gray-400 text-xs font-light">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500/50 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {isAuthenticated ? (
                  <Button
                    onClick={onCheckout}
                    disabled={isLoading}
                    size="lg"
                    className="w-full text-xs font-medium uppercase tracking-widest py-6 h-auto"
                  >
                    {isLoading ? 'Processing...' : 'Get Your Review'}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Button
                      onClick={onSignUp}
                      size="lg"
                      className="w-full text-xs font-medium uppercase tracking-widest py-6 h-auto"
                    >
                      Create Account
                    </Button>
                    <button
                      onClick={onSignIn}
                      className="w-full text-center text-gray-600 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-gray-600 text-[9px] uppercase tracking-widest font-bold mt-8">
                  <Lock className="w-3 h-3" />
                  <span>Secure via Stripe</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            {[
              { step: 1, title: 'Secure Payment', desc: 'One-time checkout via Stripe. No subscription.' },
              { step: 2, title: 'Diagnostic Intake', desc: '26 questions covering all risk dimensions (5-7 min).' },
              { step: 3, title: 'AI + Human Review', desc: 'Regulatory cross-reference verified by our team.' },
              { step: 4, title: 'Readiness Report', desc: 'Detailed PDF artifact delivered in 48 hours.' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 text-gray-500 font-serif text-lg flex items-center justify-center mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-white text-sm font-medium mb-3">{item.title}</h3>
                <p className="text-gray-500 text-xs font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white/[0.01] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/[0.01] rounded-3xl border border-white/5 p-12">
            <h2 className="text-2xl font-serif text-white mb-12 text-center">Common questions</h2>
            <div className="grid gap-12">
              {[
                {
                  q: 'Is this tax advice?',
                  a: 'No. This is a compliance readiness assessment — we identify potential gaps and flag areas that require professional review. Worktugal is not a tax firm, accountancy practice, or law office. For binding tax advice, you need a licensed OCC-certified accountant.'
                },
                {
                  q: 'How does AI-assisted research work?',
                  a: 'When you submit your intake, our system cross-references your answers against current Portuguese regulations from official sources (Autoridade Tributária, Segurança Social, etc.). A human reviewer then verifies the findings and finalizes your report. AI assists the research — it does not write your report autonomously.'
                },
                {
                  q: 'What if my situation is complex?',
                  a: "Complex situations (multi-jurisdiction residency, A1 certificate issues, VAT complexities) are identified and flagged for immediate professional review. You'll receive partial findings plus clear guidance on what requires accountant consultation."
                },
                {
                  q: 'Can I save my progress?',
                  a: 'Yes. Your answers are auto-saved to your account after each section. You can close the browser and come back anytime by logging in.'
                },
                {
                  q: 'How long does the intake take?',
                  a: '5-7 minutes. 26 questions across 7 sections covering all risk dimensions. Most questions are multiple choice. You can take breaks and return whenever you want.'
                }
              ].map((item, i) => (
                <div key={i}>
                  <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-4">{item.q}</h3>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom disclaimer */}
      <ComplianceDisclaimer variant="footer" className="bg-obsidian pt-12 pb-24" />
    </div>
  );
};
