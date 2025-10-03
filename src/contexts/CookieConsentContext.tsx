import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import { ConsentState, CookieCategory, CookiePreferences } from '../types/cookie';
import { DEFAULT_PREFERENCES, CONSENT_STORAGE_KEY } from '../utils/cookieConstants';

interface CookieConsentContextType {
  consentState: ConsentState | null;
  showBanner: boolean;
  showPreferences: boolean;
  acceptAllCookies: () => void;
  rejectAllCookies: () => void;
  savePreferences: (preferences: CookiePreferences) => void;
  dismissBannerTemporarily: () => void;
  togglePreferences: () => void;
  openConsentBanner: () => void;
  hasConsent: (category: CookieCategory) => boolean;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};

interface CookieConsentProviderProps {
  children: ReactNode;
}

export const CookieConsentProvider: FC<CookieConsentProviderProps> = ({ children }) => {
  const [consentState, setConsentState] = useState<ConsentState | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Load consent state from localStorage on mount
  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent) as ConsentState;
        setConsentState(parsed);
        setShowBanner(false);
      } catch (error) {
        console.error('Error parsing saved consent:', error);
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  // Save consent state to localStorage whenever it changes
  useEffect(() => {
    if (consentState) {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentState));
      loadConditionalScripts(consentState.preferences);
    }
  }, [consentState]);

  const acceptAllCookies = () => {
    const newState: ConsentState = {
      hasConsented: true,
      preferences: {
        strictlyNecessary: true,
        analytics: true,
        marketing: true,
        functional: true,
      },
      timestamp: Date.now(),
    };
    setConsentState(newState);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const rejectAllCookies = () => {
    const newState: ConsentState = {
      hasConsented: true,
      preferences: { ...DEFAULT_PREFERENCES },
      timestamp: Date.now(),
    };
    setConsentState(newState);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const savePreferences = (preferences: CookiePreferences) => {
    const newState: ConsentState = {
      hasConsented: true,
      preferences,
      timestamp: Date.now(),
    };
    setConsentState(newState);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const dismissBannerTemporarily = () => {
    setShowBanner(false);
    setShowPreferences(false);
  };

  const togglePreferences = () => {
    setShowPreferences(!showPreferences);
  };

  const openConsentBanner = () => {
    setShowBanner(true);
    setShowPreferences(false);
  };

  const hasConsent = (category: CookieCategory): boolean => {
    return consentState?.preferences[category] ?? false;
  };

  // Load scripts conditionally based on consent
  const loadConditionalScripts = (preferences: CookiePreferences) => {
    // Load Google Analytics if analytics consent is given
    if (preferences.analytics && !document.querySelector('script[src*="googletagmanager.com"]')) {
      const scriptGA = document.createElement('script');
      scriptGA.src = 'https://www.googletagmanager.com/gtag/js?id=G-FLJ2KM6R1Z';
      scriptGA.async = true;
      document.head.appendChild(scriptGA);

      scriptGA.onload = () => {
        (window as any).dataLayer = (window as any).dataLayer || [];
        function gtag(...args: any[]) {
          (window as any).dataLayer.push(args);
        }
        gtag('js', new Date());
        gtag('config', 'G-FLJ2KM6R1Z');
      };
    }

    // Load Simple Analytics if analytics consent is given
    if (preferences.analytics && !document.querySelector('script[src*="simpleanalyticscdn.com"]')) {
      const scriptSA = document.createElement('script');
      scriptSA.src = 'https://scripts.simpleanalyticscdn.com/latest.js';
      scriptSA.async = true;
      document.head.appendChild(scriptSA);
    }
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consentState,
        showBanner,
        showPreferences,
        acceptAllCookies,
        rejectAllCookies,
        savePreferences,
        dismissBannerTemporarily,
        togglePreferences,
        openConsentBanner,
        hasConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};