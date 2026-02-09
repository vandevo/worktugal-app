import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { CheckCircle2, Clock, Mail, FileText, Users, ArrowRight, Search, Shield, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ComplianceDisclaimer } from '../ComplianceDisclaimer';

interface PaidReviewSuccessProps {
  customerEmail: string;
  reviewId: string;
}

export const PaidReviewSuccess: React.FC<PaidReviewSuccessProps> = ({
  customerEmail,
  reviewId
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const reference = reviewId.slice(0, 8).toUpperCase();
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timelineSteps = [
    { label: 'Submitted', icon: CheckCircle2, status: 'complete' as const },
    { label: 'Researching', icon: Search, status: 'active' as const },
    { label: 'Under Review', icon: Shield, status: 'pending' as const },
    { label: 'Delivered', icon: Mail, status: 'pending' as const },
  ];

  return (
    <div className="min-h-screen bg-obsidian py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.02] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl shadow-black/30 p-8 md:p-12"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-8 border border-emerald-500/20"
            >
              <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
            </motion.div>
            <h1 className="text-3xl font-serif text-white mb-3">Intake submitted</h1>
            <p className="text-gray-500 font-light text-sm">
              Your compliance readiness review is being processed.
            </p>
          </div>

          {/* Status Timeline */}
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-8 mb-12">
            <div className="flex items-center justify-between relative px-2">
              {/* Connection line */}
              <div className="absolute top-5 left-0 right-0 h-px bg-white/5 mx-8"></div>
              <div 
                className="absolute top-5 left-0 h-px bg-blue-500/30 transition-all duration-1000 mx-8" 
                style={{ width: 'calc(33.33% - 8px)' }}
              ></div>

              {timelineSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex flex-col items-center relative z-10 flex-1">
                    <div className="relative mb-4">
                      {/* Solid mask background */}
                      <div className="absolute inset-0 bg-obsidian rounded-full z-0"></div>
                      
                      {/* Pulse effect (only for active) */}
                      {step.status === 'active' && (
                        <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping z-0"></div>
                      )}

                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.15 }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center relative z-10 border transition-all duration-500 ${
                          step.status === 'complete'
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : step.status === 'active'
                            ? 'bg-blue-500/10 border-blue-500/30'
                            : 'bg-white/[0.02] border-white/5'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${
                          step.status === 'complete'
                            ? 'text-emerald-500/50'
                            : step.status === 'active'
                            ? 'text-blue-500/50'
                            : 'text-gray-700'
                        }`} />
                      </motion.div>
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest font-bold text-center ${
                      step.status === 'complete'
                        ? 'text-emerald-500/50'
                        : step.status === 'active'
                        ? 'text-blue-500/50'
                        : 'text-gray-700'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-500/[0.02] border border-blue-500/5 rounded-xl p-8 mb-12">
            <div className="flex items-start gap-6">
              <Search className="w-5 h-5 text-blue-500/50 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white text-sm font-medium mb-4">What happens next</h3>
                <div className="space-y-6">
                  {[
                    'Your intake is cross-referenced against official law using AI-assisted research.',
                    'A human reviewer verifies research findings and finalizes your report.',
                    'Escalation flags are added for areas requiring professional review.',
                    'Your Readiness Artifact is delivered to your email with source citations.'
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-5 h-5 rounded-lg bg-blue-500/5 text-blue-500/50 text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-500/10 font-bold">
                        {i + 1}
                      </div>
                      <p className="text-gray-500 text-xs font-light leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-12">
            <div className="flex items-center justify-between p-5 bg-white/[0.01] rounded-xl border border-white/5">
              <div className="flex items-center gap-4">
                <Mail className="w-4 h-4 text-gray-600" />
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-gray-600 font-bold">Delivery destination</div>
                  <div className="text-gray-400 text-sm font-light">{customerEmail}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-white/[0.01] rounded-xl border border-white/5">
              <div className="flex items-center gap-4">
                <FileText className="w-4 h-4 text-gray-600" />
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-gray-600 font-bold">Case reference</div>
                  <div className="text-gray-400 font-mono text-sm">{reviewId.slice(0, 8).toUpperCase()}</div>
                </div>
              </div>
              <button
                onClick={copyToClipboard}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  copied 
                    ? 'bg-blue-500/10 text-blue-400' 
                    : 'bg-white/5 text-gray-600 hover:text-white'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-4 p-5 bg-white/[0.01] rounded-xl border border-white/5">
              <Clock className="w-4 h-4 text-gray-600" />
              <div>
                <div className="text-[9px] uppercase tracking-widest text-gray-600 font-bold">Expected delivery</div>
                <div className="text-gray-400 text-sm font-light">Within 48 hours</div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-10">
            <div className="grid sm:grid-cols-2 gap-4">
              <Button
                onClick={() => window.open('https://t.me/worktugal', '_blank')}
                variant="outline"
                className="w-full text-[10px] uppercase tracking-widest font-bold border-white/5 hover:bg-white/5 text-gray-400 hover:text-white"
              >
                <MessageCircle className="w-3 h-3 mr-2" />
                Join Community
              </Button>
              <Button
                onClick={() => navigate('/partners')}
                variant="outline"
                className="w-full text-[10px] uppercase tracking-widest font-bold border-white/5 hover:bg-white/5 text-gray-400 hover:text-white"
              >
                <ArrowRight className="w-3 h-3 mr-2" />
                Browse Partners
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <div className="text-center mt-10 space-y-6">
          <p className="text-gray-600 text-[10px] uppercase tracking-widest font-medium">
            Support: <a href="mailto:hello@worktugal.com" className="text-blue-500/50 hover:text-blue-500 transition-colors">hello@worktugal.com</a>
          </p>
          <ComplianceDisclaimer variant="inline" className="max-w-xl mx-auto text-center opacity-50" />
        </div>
      </div>
    </div>
  );
};
