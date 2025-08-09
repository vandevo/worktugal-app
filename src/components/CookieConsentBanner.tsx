import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check, Shield } from 'lucide-react';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export const CookieConsentBanner: React.FC = () => {
  const {
    showBanner,
    acceptAllCookies,
    rejectAllCookies,
    dismissBannerTemporarily,
    openPreferencesModal,
  } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      >
        <Card className="max-w-4xl mx-auto p-4 sm:p-6 shadow-2xl border-gray-600/50 backdrop-blur-md bg-gray-800/95">
          {/* Close button */}
          <button
            onClick={dismissBannerTemporarily}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-white transition-all duration-200 flex items-center justify-center group"
            aria-label="Dismiss cookie banner temporarily"
          >
            <X className="h-4 w-4 group-hover:scale-110 transition-transform" />
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            {/* Content */}
            <div className="flex-1 pr-8">
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Cookie className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">We use cookies to enhance your experience</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    We use cookies to provide essential website functionality and to analyze our traffic. 
                    You can choose which types of cookies to accept. 
                    <a 
                      href="/privacy-policy" 
                      className="text-blue-400 hover:text-blue-300 underline ml-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn more in our Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              {/* Mobile: Stack vertically, Desktop: Horizontal */}
              <Button
                variant="outline"
                size="sm"
                onClick={openPreferencesModal}
                className="order-3 sm:order-1 bg-gray-700/50 border-gray-600/60 hover:bg-gray-600/50 text-gray-300 hover:text-white text-sm"
              >
                <Settings className="mr-2 h-4 w-4" />
                Manage Preferences
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={rejectAllCookies}
                className="order-2 border-gray-600/60 hover:border-red-500/60 text-gray-300 hover:text-red-300 hover:bg-red-600/10 text-sm"
              >
                Reject All
              </Button>
              
              <Button
                variant="primary"
                size="sm"
                onClick={acceptAllCookies}
                className="order-1 sm:order-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-lg"
              >
                <Check className="mr-2 h-4 w-4" />
                Accept All
              </Button>
            </div>
          </div>

          {/* GDPR compliance notice */}
          <div className="mt-4 pt-3 border-t border-gray-700/50">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Shield className="h-3 w-3 text-green-400" />
              <span>GDPR compliant • Based in Portugal, EU • You can withdraw consent at any time</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};