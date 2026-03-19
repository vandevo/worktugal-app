import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Settings, ChevronLeft } from 'lucide-react';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import { COOKIE_CATEGORIES } from '../utils/cookieConstants';
import { CookiePreferences } from '../types/cookie';

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

  // Sync temp preferences when panel opens
  if (showPreferences && consentState?.preferences) {
    // handled via useEffect below
  }

  const handleSave = () => savePreferences(tempPreferences);

  const toggleCategory = (id: string) => {
    setTempPreferences(prev => ({ ...prev, [id]: !prev[id as keyof CookiePreferences] }));
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50"
      >
        <div className="bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/10 dark:border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden">

          {/* Close */}
          <button
            onClick={dismissBannerTemporarily}
            className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/6 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white transition-all"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <AnimatePresence mode="wait">
            {!showPreferences ? (
              <motion.div
                key="main"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-5 pr-10"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] mb-2">Cookies</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">We use cookies</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
                  To analyze traffic and improve your experience. Read our{' '}
                  <a href="/privacy" className="text-[#0F3D2E] dark:text-[#10B981] hover:underline">
                    Privacy Policy
                  </a>.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={acceptAllCookies}
                    className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-[#0F3D2E] text-white text-xs font-bold rounded-xl hover:bg-[#1A5C44] transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    Accept all
                  </button>
                  <button
                    onClick={rejectAllCookies}
                    className="flex-1 h-9 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-white/4 transition-colors"
                  >
                    Reject all
                  </button>
                  <button
                    onClick={togglePreferences}
                    className="w-9 h-9 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/4 transition-colors"
                    aria-label="Manage preferences"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="prefs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={togglePreferences}
                    className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/6 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Cookie Preferences</p>
                </div>

                <div className="space-y-2 mb-4">
                  {COOKIE_CATEGORIES.map(cat => (
                    <div key={cat.id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/4">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{cat.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{cat.description}</p>
                      </div>
                      <button
                        type="button"
                        disabled={cat.isEssential}
                        onClick={() => !cat.isEssential && toggleCategory(cat.id)}
                        className={`relative flex-shrink-0 mt-0.5 inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          tempPreferences[cat.id as keyof CookiePreferences]
                            ? 'bg-[#10B981]'
                            : 'bg-slate-200 dark:bg-white/10'
                        } ${cat.isEssential ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                          tempPreferences[cat.id as keyof CookiePreferences] ? 'translate-x-4' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSave}
                  className="w-full h-9 bg-[#0F3D2E] text-white text-xs font-bold rounded-xl hover:bg-[#1A5C44] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3 h-3" />
                  Save preferences
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
