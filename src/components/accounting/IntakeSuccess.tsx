import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Clock, FileCheck, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export const IntakeSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-obsidian py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-surface-dark/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
        >
          {/* Success Header */}
          <div className="bg-gradient-to-br from-green-600/20 via-blue-600/20 to-purple-600/20 p-8 text-center border-b border-white/10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6, delay: 0.1 }}
            >
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">Intake Submitted!</h2>
            <p className="text-gray-300 text-lg">
              We've received your information. Check your inbox in the next 10 minutes.
            </p>
          </div>

          {/* What Happens Next */}
          <div className="p-8 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                Check your email
              </h3>

              <div className="bg-obsidian/50 rounded-xl p-5 space-y-4">
                <p className="text-gray-300">
                  We've sent a confirmation email with your intake summary. You'll hear from us within 48 hours with:
                </p>

                <div className="space-y-2 text-sm text-gray-400">
                  <p>✓ Your compliance status summary</p>
                  <p>✓ What documents or actions are missing (if any)</p>
                  <p>✓ Clear next steps for your situation</p>
                  <p>✓ Timeline for resolving any issues</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <h4 className="text-white font-semibold">What to expect</h4>
              </div>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 font-semibold">Now:</span>
                  <span>Confirmation email sent to your inbox</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 font-semibold">24h:</span>
                  <span>We review your intake and identify any gaps</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 font-semibold">48h:</span>
                  <span>You receive your written action plan via email</span>
                </div>
              </div>
            </div>

            {/* Urgent Cases */}
            <div className="bg-orange-600/10 border border-orange-600/20 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-2">Need help this week?</h4>
                  <p className="text-sm text-gray-300 mb-3">
                    If you have a deadline approaching or received a letter from Financas, reply to the confirmation email with "URGENT" and we'll prioritize your review.
                  </p>
                </div>
              </div>
            </div>

            {/* Next Actions */}
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-white font-semibold mb-4">While you wait:</h4>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/partners')}
                  className="flex items-center justify-between"
                >
                  <span>Browse Partner Directory</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex items-center justify-between"
                >
                  <span>Back to Homepage</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Fine Print */}
            <p className="text-xs text-gray-500 text-center pt-4">
              Don't see the email? Check your spam folder or add hello@worktugal.com to contacts.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
