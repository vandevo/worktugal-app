import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const AccountantApplicationSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] p-8 md:p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Application Received!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-8"
          >
            Thank you for your interest in joining Worktugal's partner network.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 mb-8 text-left"
          >
            <h2 className="text-lg font-semibold text-white mb-4">What happens next?</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Application Review</h3>
                  <p className="text-sm text-gray-400">
                    Our team will review your application within 5 business days. We'll verify your credentials and assess your fit for our network.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  <span className="text-purple-400 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Brief Intro Call</h3>
                  <p className="text-sm text-gray-400">
                    If your application aligns with our needs, we'll invite you for a 15-minute intro call to discuss the partnership model and answer your questions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <span className="text-green-400 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Onboarding & Activation</h3>
                  <p className="text-sm text-gray-400">
                    Once approved, we'll guide you through onboarding, set up your profile, and connect you with your first clients.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8"
          >
            <div className="flex items-center gap-2 text-gray-400">
              <Mail className="w-5 h-5" />
              <span className="text-sm">Check your email for confirmation</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">Response within 5 business days</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="border-t border-white/[0.08] pt-8"
          >
            <p className="text-gray-400 mb-6">
              In the meantime, explore what Worktugal offers to professionals in Portugal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  Back to Home
                </Button>
              </Link>
              <Link to="/checkup">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Try Tax Checkup
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 pt-8 border-t border-white/[0.08]"
          >
            <p className="text-sm text-gray-500">
              Questions? Contact us at{' '}
              <a href="mailto:partners@worktugal.com" className="text-blue-400 hover:text-blue-300 underline">
                partners@worktugal.com
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
