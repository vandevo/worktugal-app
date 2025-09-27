import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Shield, User, Loader2 } from 'lucide-react';
import { useUserProfile } from '../hooks/useUserProfile';

export const UserRoleBadge: React.FC = () => {
  const { profile, loading } = useUserProfile();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-400">
        <Loader2 className="h-3.5 w-3.5 animate-spin flex-shrink-0" />
        <span className="text-xs font-medium">Loading...</span>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const role = profile.role || 'user';

  const getRoleConfig = () => {
    switch (role) {
      case 'partner':
        return {
          icon: Crown,
          bgColor: 'from-blue-400/20 to-purple-400/20',
          textColor: 'text-blue-300',
          borderColor: 'border-blue-400/30',
          fullText: 'Partner',
          shortText: 'P',
          description: 'Verified partner with active listing'
        };
      case 'admin':
        return {
          icon: Shield,
          bgColor: 'from-red-400/20 to-pink-400/20',
          textColor: 'text-red-300',
          borderColor: 'border-red-400/30',
          fullText: 'Admin',
          shortText: 'A',
          description: 'Administrator with full access'
        };
      case 'user':
      default:
        return {
          icon: User,
          bgColor: 'from-gray-400/20 to-gray-500/20',
          textColor: 'text-gray-300',
          borderColor: 'border-gray-400/30',
          fullText: 'Member',
          shortText: 'M',
          description: 'Registered community member'
        };
    }
  };

  const config = getRoleConfig();
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center space-x-1 sm:space-x-1.5 bg-gradient-to-r ${config.bgColor} backdrop-blur-xl ${config.textColor} px-3 sm:px-3.5 py-1.5 rounded-full border ${config.borderColor} shadow-lg`}
      title={config.description}
    >
      <IconComponent className="h-3.5 w-3.5 flex-shrink-0" />
      <span className="text-xs font-medium">{config.fullText}</span>
    </motion.div>
  );
};