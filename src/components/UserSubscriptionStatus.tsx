import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Loader2, Check } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

export const UserSubscriptionStatus: React.FC = () => {
  const { loading, activeProductName, hasActivePayment } = useSubscription();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (!hasActivePayment) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 px-3 py-1.5 rounded-full border border-blue-600/30"
    >
      <Crown className="h-4 w-4" />
      <span className="text-sm font-medium">Early Access Member</span>
    </motion.div>
  );
};