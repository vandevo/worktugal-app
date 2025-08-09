import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Cookie } from 'lucide-react';
import { useCookieConsent } from '../../contexts/CookieConsentContext';

export const CookieManageTrigger: React.FC = () => {
  const { openPreferencesModal, consentState } = useCookieConsent();

  // Only show if user has made a consent choice
  if (!consentState.hasChosenConsent) {
    return null;
  }

  return (
    <motion.button
      onClick={openPreferencesModal}
      className="inline-flex items-center space-x-2 text-xs text-gray-400 hover:text-gray-300 transition-colors duration-200 group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label="Manage cookie preferences"
    >
      <Cookie className="h-3 w-3 group-hover:rotate-12 transition-transform duration-200" />
      <span>Manage Cookies</span>
    </motion.button>
  );
};