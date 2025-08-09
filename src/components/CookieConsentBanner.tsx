import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Settings, Check, ChevronUp } from 'lucide-react';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import { COOKIE_CATEGORIES } from '../utils/cookieConstants';
import { CookiePreferences } from '../types/cookie';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export const CookieConsentBanner: React.FC = () => {
  const {
    showBanner,
    showPreferences,
    acceptAllCookies,
    rejectAllCookies,
    savePreferences,
    dismissBannerTemporarily,
    togglePreferences,
    consentState,
  } = useCookieConsent();

  const [tempPreferences, setTempPreferences] = useState<CookiePreferences>(() => ({
    strictlyNecessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  }));

  // Update temp preferences when showing preferences panel
  React.useEffect(() => {
    if (showPreferences) {
      setTempPreferences(consentState?.preferences || {
        strictlyNecessary: true,
        analytics: false,
        marketing: false,
        functional: false,
      });
    }
  }, [showPreferences, consentState]);

  const handleSavePreferences = () => {
    savePreferences(tempPreferences);
  };

  const toggleCategory = (categoryId: string) => {
    setTempPreferences(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId as keyof CookiePreferences],
    }));
  };

  if (!showBanner) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto pointer-events-auto">
        <Card className="p-6 bg-gray-800/95 backdrop-blur-md border-gray-700/50 shadow-2xl">
          {/* Close button */}
          <button
            onClick={dismissBannerTemporarily}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-white transition-all duration-200 flex items-center justify-center"
            aria-label="Dismiss banner temporarily"
          >
            <X className="h-4 w-4" />
          </button>

          <AnimatePresence mode="wait">
            {!showPreferences ? (
              <motion.div
                key="main"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pr-10">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Cookie className="h-6 w-6 text-blue-400 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-white">We use cookies</h3>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      We use cookies to enhance your experience, analyze site traffic, and personalize content. 
                      You can accept all cookies, reject non-essential ones, or customize your preferences.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={acceptAllCookies}
                      className="sm:min-w-[120px]"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Accept All
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={rejectAllCookies}
                      className="sm:min-w-[120px]"
                    >
                      Reject All
                    </Button>
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={togglePreferences}
                      className="sm:min-w-[140px]"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Preferences
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="pr-10">
                  <div className="flex items-center space-x-3 mb-6">
                    <Settings className="h-6 w-6 text-blue-400 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-white">Cookie Preferences</h3>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {COOKIE_CATEGORIES.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-start justify-between p-4 bg-gray-700/30 rounded-xl border border-gray-600/20"
                      >
                        <div className="flex-1 mr-4">
                          <h4 className="font-medium text-white mb-1">{category.name}</h4>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {category.description}
                          </p>
                        </div>
                        
                        <div className="flex-shrink-0">
                          <button
                            type="button"
                            disabled={category.isEssential}
                            onClick={() => !category.isEssential && toggleCategory(category.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                              tempPreferences[category.id] ? 'bg-blue-600' : 'bg-gray-600'
                            } ${category.isEssential ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            aria-label={`Toggle ${category.name} cookies`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                                tempPreferences[category.id] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleSavePreferences}
                      className="sm:min-w-[140px]"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Save Preferences
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={togglePreferences}
                      className="sm:min-w-[100px]"
                    >
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </motion.div>
  );
};