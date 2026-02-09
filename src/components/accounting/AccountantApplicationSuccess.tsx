import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const AccountantApplicationSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center py-24 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 p-8 md:p-12 text-center shadow-2xl shadow-black/30">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/5 border border-emerald-500/10 mb-8"
          >
            <CheckCircle className="w-10 h-10 text-emerald-500/50" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-serif text-white mb-6"
          >
            Application received
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-500 mb-12 font-light"
          >
            Thank you for your interest in joining our partner network.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/[0.01] border border-white/5 rounded-2xl p-8 mb-12 text-left"
          >
            <h2 className="text-xs font-bold text-gray-600 uppercase tracking-[0.2em] mb-8">What happens next?</h2>

            <div className="space-y-8">
              {[
                {
                  title: "Application Review",
                  desc: "Our team will review your application within 5 business days. We'll verify your credentials and assess your fit for our network.",
                  icon: "bg-blue-500/5 border-blue-500/10 text-blue-500/50"
                },
                {
                  title: "Brief Intro Call",
                  desc: "If your application aligns with our needs, we'll invite you for a 15-minute intro call to discuss the partnership model and answer your questions.",
                  icon: "bg-purple-500/5 border-purple-500/10 text-purple-500/50"
                },
                {
                  title: "Onboarding & Activation",
                  desc: "Once approved, we'll guide you through onboarding, set up your profile, and connect you with your first clients.",
                  icon: "bg-emerald-500/5 border-emerald-500/10 text-emerald-500/50"
                }
              ].map((step, i) => (
                <div key={i} className="flex gap-6">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center ${step.icon}`}>
                    <span className="font-bold text-xs">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-serif text-white mb-1">{step.title}</h3>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-8 items-center justify-center mb-12"
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-600" />
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">Confirmation sent</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">5-day response time</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="border-t border-white/5 pt-12"
          >
            <p className="text-sm text-gray-500 mb-8 font-light">
              In the meantime, explore what Worktugal offers to professionals in Portugal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full text-xs uppercase tracking-widest font-bold h-12">
                  Back to Home
                </Button>
              </Link>
              <Link to="/checkup" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full text-xs uppercase tracking-widest font-bold h-12">
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
            className="mt-8 pt-8 border-t border-white/5"
          >
            <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] font-medium">
              Questions? Contact us at{' '}
              <a href="mailto:hello@worktugal.com" className="text-blue-500/50 hover:text-blue-400 transition-colors underline decoration-blue-500/20">
                hello@worktugal.com
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
