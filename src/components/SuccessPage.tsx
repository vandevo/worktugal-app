import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Home, Gift, Calendar, Users, TrendingUp } from 'lucide-react';
import { Seo } from './Seo';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useSubscription } from '../hooks/useSubscription';

export const SuccessPage: React.FC = () => {
  const { hasActivePayment, activeProductName } = useSubscription();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <Seo
        title="Welcome to Early Access - Payment Successful"
        description="Congratulations! You've successfully joined Worktugal Pass as an early access partner. Your business will be featured to 1,000+ remote professionals in Lisbon."
        ogTitle="Successfully Joined Worktugal Pass Early Access"
        ogDescription="Now part of Lisbon's trusted perk marketplace for remote professionals"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <CheckCircle className="h-24 w-24 text-green-400 mx-auto" />
              {showConfetti && (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 2, duration: 1 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  {/* Confetti particles */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-blue-400 rounded-full"
                      initial={{
                        x: 0,
                        y: 0,
                        scale: 0,
                      }}
                      animate={{
                        x: (Math.random() - 0.5) * 200,
                        y: (Math.random() - 0.5) * 200,
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-4">Welcome to Early Access!</h1>
            <p className="text-xl text-gray-300 mb-6">
              You've successfully secured your spot in Lisbon's #1 perk marketplace
            </p>
            <div className="inline-flex items-center space-x-2 bg-green-600/20 text-green-300 px-4 py-2 rounded-full">
              <Gift className="h-4 w-4" />
              <span className="text-sm font-medium">Early Access Member</span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">1,000+</div>
              <div className="text-sm text-gray-400">Remote Workers</div>
            </Card>
            <Card className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">€49</div>
              <div className="text-sm text-gray-400">One-time Payment</div>
            </Card>
            <Card className="p-6 text-center">
              <Calendar className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">Lifetime</div>
              <div className="text-sm text-gray-400">Access</div>
            </Card>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Card className="p-8 max-w-2xl mx-auto text-left">
              <h2 className="text-2xl font-bold mb-6 text-center">What happens next?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Review & Verification</h3>
                    <p className="text-gray-400 text-sm">
                      Our team will review your submission and verify all details within 24 hours
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Contact & Clarification</h3>
                    <p className="text-gray-400 text-sm">
                      We'll contact you if we need any additional information or clarification
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Go Live with Priority Placement</h3>
                    <p className="text-gray-400 text-sm">
                      You'll be notified when your perk goes live in our directory with trusted partner badge and priority positioning
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Button
              size="lg"
              onClick={() => window.location.href = '/'}
              className="px-8"
            >
              Submit Another Business
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.location.href = '/'}
              className="px-8"
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-800 rounded-xl p-6 max-w-md mx-auto"
          >
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-gray-400 mb-3">
              Our team is here to help you get started. Reach out with any questions about your membership.
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-400">Email:</span>{' '}
                <a 
                  href="mailto:hello@worktugal.com" 
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  hello@worktugal.com
                </a>
              </p>
              <p>
                <span className="text-gray-400">WhatsApp:</span>{' '}
                <a 
                  href="https://wa.me/351928090121" 
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +351 928 090 121
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};