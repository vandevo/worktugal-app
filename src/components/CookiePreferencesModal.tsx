import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Shield, Save, RotateCcw } from 'lucide-react';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import { COOKIE_CATEGORIES } from '../utils/cookieConstants';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface CookiePreferencesModalProps {
  onClose: () => void;
}

export const CookiePreferencesModal: React.FC<CookiePreferencesModalProps> = ({ onClose }) => {
  const {
    consentState,
    savePreferences,
    acceptAllCookies,
    rejectAllCookies,
  } = useCookieConsent();

  const [localPreferences, setLocalPreferences] = useState<Record<string, boolean>>(
    consentState.preferences
  );

  // Update local preferences when consent state changes
  useEffect(() => {
    setLocalPreferences(consentState.preferences);
  }, [consentState.preferences]);

  const handleToggleCategory = (categoryId: string) => {
    const category = COOKIE_CATEGORIES.find(cat => cat.id === categoryId);
    if (category?.isEssential) return; // Can't toggle essential cookies

    setLocalPreferences(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleSavePreferences = () => {
    savePreferences(localPreferences);
  };

  const handleResetToDefaults = () => {
    const defaultPrefs = COOKIE_CATEGORIES.reduce((acc, category) => {
      acc[category.id] = category.isEssential;
      return acc;
    }, {} as Record<string, boolean>);
    
    setLocalPreferences(defaultPrefs);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                <Cookie className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Cookie Preferences</h2>
                <p className="text-sm text-gray-400">Manage your cookie and privacy settings</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-white transition-all duration-200 flex items-center justify-center"
              aria-label="Close cookie preferences"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="p-6 space-y-6">
              {/* GDPR Notice */}
              <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-300 mb-1">Your Privacy Rights</h3>
                    <p className="text-sm text-blue-200/80 leading-relaxed">
                      Under GDPR, you have the right to accept or reject non-essential cookies. 
                      You can change your preferences at any time by clicking "Manage Cookies" in the footer.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cookie Categories */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Cookie Categories</h3>
                
                {COOKIE_CATEGORIES.map((category) => (
                  <Card key={category.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-white">{category.name}</h4>
                          {category.isEssential && (
                            <span className="bg-gray-600/50 text-gray-300 px-2 py-1 rounded-md text-xs font-medium">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                      
                      {/* Toggle Switch */}
                      <div className="flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleCategory(category.id)}
                          disabled={category.isEssential}
                          aria-label={`Toggle ${category.name} cookies`}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                            localPreferences[category.id]
                              ? 'bg-blue-600'
                              : 'bg-gray-600'
                          } ${category.isEssential ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-opacity-80'}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                              localPreferences[category.id] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetToDefaults}
                  className="flex-1 text-gray-300 border-gray-600/60 hover:border-gray-500/60"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset to Defaults
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rejectAllCookies}
                  className="flex-1 border-gray-600/60 hover:border-red-500/60 text-gray-300 hover:text-red-300 hover:bg-red-600/10"
                >
                  Reject All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptAllCookies}
                  className="flex-1 border-blue-600/60 hover:border-blue-500/60 text-blue-300 hover:text-blue-200 hover:bg-blue-600/10"
                >
                  Accept All
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-700/50 p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-600/60 text-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePreferences}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </div>
            
            <p className="text-xs text-gray-400 text-center mt-4">
              Your preferences are stored locally and respected across all sessions
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};