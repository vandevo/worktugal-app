import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { CheckCircle2, Clock, Mail, FileText, Users, ArrowRight, Search, Shield } from 'lucide-react';
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

  const timelineSteps = [
    { label: 'Submitted', icon: CheckCircle2, status: 'complete' as const },
    { label: 'Researching', icon: Search, status: 'active' as const },
    { label: 'Under Review', icon: Shield, status: 'pending' as const },
    { label: 'Delivered', icon: Mail, status: 'pending' as const },
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-3">Intake submitted successfully</h1>
            <p className="text-gray-400">
              Your compliance readiness review is being processed
            </p>
          </div>

          {/* Status Timeline */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between relative">
              {/* Connection line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/[0.05]"></div>
              <div className="absolute top-5 left-0 h-0.5 bg-blue-500/50" style={{ width: '12.5%' }}></div>

              {timelineSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex flex-col items-center relative z-10 flex-1">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.15 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        step.status === 'complete'
                          ? 'bg-green-500/20 border-2 border-green-500/50'
                          : step.status === 'active'
                          ? 'bg-blue-500/20 border-2 border-blue-500/50 animate-pulse'
                          : 'bg-white/[0.05] border border-white/[0.10]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${
                        step.status === 'complete'
                          ? 'text-green-400'
                          : step.status === 'active'
                          ? 'text-blue-400'
                          : 'text-gray-600'
                      }`} />
                    </motion.div>
                    <span className={`text-xs font-medium text-center ${
                      step.status === 'complete'
                        ? 'text-green-300'
                        : step.status === 'active'
                        ? 'text-blue-300'
                        : 'text-gray-600'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <Search className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-2">What happens next</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-500/30 text-green-300 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <span>Your intake is being cross-referenced against current Portuguese regulations using AI-assisted research from official sources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-300 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <span>A human reviewer verifies the research findings and finalizes your report</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-300 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <span>Escalation flags are added for areas requiring professional accountant review</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-300 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                    <span>Your written report is delivered to your email with source citations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-400">Report will be sent to</div>
                <div className="text-white font-medium">{customerEmail}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-400">Case reference</div>
                <div className="text-white font-mono text-sm">{reviewId.slice(0, 8).toUpperCase()}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-400">Expected delivery</div>
                <div className="text-white">Within 48 hours</div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.05] pt-8">
            <h3 className="text-white font-semibold mb-4 text-center">While you wait</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Button
                onClick={() => window.open('https://www.facebook.com/groups/worktugal', '_blank')}
                variant="secondary"
                className="w-full"
              >
                <Users className="w-4 h-4 mr-2" />
                Join our community
              </Button>
              <Button
                onClick={() => navigate('/partners')}
                variant="secondary"
                className="w-full"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Browse partner services
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <div className="text-center mt-6 space-y-3">
          <p className="text-gray-500 text-sm">
            Questions? Reply to your confirmation email or contact us at{' '}
            <a href="mailto:hello@worktugal.com" className="text-blue-400 hover:underline">
              hello@worktugal.com
            </a>
          </p>
          <ComplianceDisclaimer variant="inline" className="max-w-xl mx-auto text-center" />
        </div>
      </div>
    </div>
  );
};
