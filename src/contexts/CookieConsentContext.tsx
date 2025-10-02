import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CookiePreferences, ConsentState } from '../types/cookie';

interface CookieConsentContextType {
  consentState: ConsentState;
  updateConsent: (preferences: CookiePreferences) => void;
  resetConsent: () => void;
}

const defaultPreferences: CookiePreferences = {
  strictlyNecessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

const defaultConsentState: ConsentState = {
  hasConsented: false,
  preferences: defaultPreferences,
  timestamp: 0,
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const STORAGE_KEY = 'cookie_consent';

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consentState, setConsentState] = useState<ConsentState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading cookie consent:', error);
    }
    return defaultConsentState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consentState));
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  }, [consentState]);

  const updateConsent = (preferences: CookiePreferences) => {
    setConsentState({
      hasConsented: true,
      preferences,
      timestamp: Date.now(),
    });
  };

  const resetConsent = () => {
    setConsentState(defaultConsentState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error removing cookie consent:', error);
    }
  };

  return (
    <CookieConsentContext.Provider value={{ consentState, updateConsent, resetConsent }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}
