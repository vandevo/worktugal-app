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
    <>
      {/* Mobile: Full-screen modal for preferences */}
      {showPreferences && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-md flex items-end"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
            className="w-full bg-obsidian rounded-t-2xl border-t border-white/5 shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6 bg-obsidian">
              {/* Header with close button */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Settings className="h-6 w-6 text-blue-500/50 flex-shrink-0" />
                  <h3 className="text-lg font-serif text-white">Cookie Preferences</h3>
                </div>
                <button
                  onClick={dismissBannerTemporarily}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 flex items-center justify-center border border-white/5"
                  aria-label="Dismiss banner temporarily"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {/* Cookie categories */}
              <div className="space-y-4 mb-6">
                {COOKIE_CATEGORIES.map((category) => (
                  <div
                    key={category.id}
                    className="p-4 bg-white/[0.02] rounded-xl border border-white/5"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white">{category.name}</h4>
                      <button
                        type="button"
                        disabled={category.isEssential}
                        onClick={() => !category.isEssential && toggleCategory(category.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-obsidian ${
                          tempPreferences[category.id] ? 'bg-blue-600' : 'bg-white/10'
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
                    <p className="text-xs text-gray-500 leading-relaxed font-light">
                      {category.description}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Action buttons */}
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSavePreferences}
                  className="w-full"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={togglePreferences}
                  className="w-full"
                >
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Desktop: Expandable banner */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:block fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto pointer-events-auto">
          <Card variant="glass" className="p-6 shadow-2xl">
            {/* Close button */}
            <button
              onClick={dismissBannerTemporarily}
              className="absolute top-4 right-4 w-9 h-9 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center border border-white/5"
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
                        <Cookie className="h-6 w-6 text-blue-500/50 flex-shrink-0" />
                        <h3 className="text-lg font-serif text-white">We use cookies</h3>
                      </div>
                      <p className="text-sm text-gray-500 font-light leading-relaxed">
                        We use cookies to enhance your experience, analyze site traffic, and personalize content. 
                        You can accept all cookies, reject non-essential ones, or customize your preferences. 
                        Read our <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a> for more details.
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={acceptAllCookies}
                        className="sm:min-w-[120px] rounded-xl text-xs uppercase tracking-widest font-medium"
                      >
                        <Check className="mr-2 h-3 w-3" />
                        Accept All
                      </Button>
                      <Button
                        variant="outline"
                        size="md"
                        onClick={rejectAllCookies}
                        className="sm:min-w-[120px] rounded-xl text-xs uppercase tracking-widest font-medium border-white/5 hover:bg-white/5"
                      >
                        Reject All
                      </Button>
                      <Button
                        variant="ghost"
                        size="md"
                        onClick={togglePreferences}
                        className="sm:min-w-[140px] rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-white/5"
                      >
                        <Settings className="mr-2 h-3 w-3" />
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
                      <Settings className="h-6 w-6 text-blue-500/50 flex-shrink-0" />
                      <h3 className="text-lg font-serif text-white">Cookie Preferences</h3>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      {COOKIE_CATEGORIES.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-start justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5"
                        >
                          <div className="flex-1 mr-4">
                            <h4 className="font-medium text-white mb-1">{category.name}</h4>
                            <p className="text-xs text-gray-500 leading-relaxed font-light">
                              {category.description}
                            </p>
                          </div>
                          
                          <div className="flex-shrink-0">
                            <button
                              type="button"
                              disabled={category.isEssential}
                              onClick={() => !category.isEssential && toggleCategory(category.id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-obsidian ${
                                tempPreferences[category.id] ? 'bg-blue-600' : 'bg-white/10'
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
                        className="sm:min-w-[140px] rounded-xl text-xs uppercase tracking-widest font-medium"
                      >
                        <Check className="mr-2 h-3 w-3" />
                        Save Preferences
                      </Button>
                      <Button
                        variant="outline"
                        size="md"
                        onClick={togglePreferences}
                        className="sm:min-w-[100px] rounded-xl text-xs uppercase tracking-widest font-medium border-white/5 hover:bg-white/5"
                      >
                        <ChevronUp className="mr-2 h-3 w-3" />
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

      {/* Mobile: Compact banner that opens modal for preferences */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none"
      >
        <div className="pointer-events-auto">
          <Card variant="glass" className="p-4 shadow-2xl">
            {/* Close button */}
            <button
              onClick={dismissBannerTemporarily}
              className="absolute top-3 right-3 w-8 h-8 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center border border-white/5"
              aria-label="Dismiss banner temporarily"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="pr-8">
              <div className="flex items-center space-x-2 mb-3">
                <Cookie className="h-5 w-5 text-blue-500/50 flex-shrink-0" />
                <h3 className="text-base font-serif text-white">We use cookies</h3>
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed mb-4">
                We use cookies to enhance your experience. You can customize your preferences.
              </p>
              
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={acceptAllCookies}
                    className="flex-1 text-[10px] uppercase tracking-widest font-medium"
                  >
                    Accept All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={rejectAllCookies}
                    className="flex-1 text-[10px] uppercase tracking-widest font-medium border-white/5 hover:bg-white/5"
                  >
                    Reject All
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePreferences}
                  className="w-full text-[10px] uppercase tracking-widest font-medium hover:bg-white/5"
                >
                  <Settings className="mr-2 h-3 w-3" />
                  Manage Preferences
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </>
  );
};
