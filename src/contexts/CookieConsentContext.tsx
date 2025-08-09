import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ConsentState, ConsentAction } from '../types/cookie';
import { CONSENT_STORAGE_KEY, BANNER_DISMISS_KEY, DEFAULT_CONSENT_STATE, COOKIE_CATEGORIES } from '../utils/cookieConstants';

interface CookieConsentContextType {
  consentState: ConsentState;
  showBanner: boolean;
  showPreferencesModal: boolean;
  acceptAllCookies: () => void;
  rejectAllCookies: () => void;
  savePreferences: (preferences: Record<string, boolean>) => void;
  dismissBannerTemporarily: () => void;
  openPreferencesModal: () => void;
  closePreferencesModal: () => void;
  clearAllConsent: () => void; // For testing purposes
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

interface CookieConsentProviderProps {
  children: ReactNode;
}

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({ children }) => {
  const [consentState, setConsentState] = useState<ConsentState>(DEFAULT_CONSENT_STATE);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load consent state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      const dismissed = localStorage.getItem(BANNER_DISMISS_KEY);
      
      if (stored) {
        const parsedConsent = JSON.parse(stored) as ConsentState;
        setConsentState(parsedConsent);
        setShowBanner(false); // Don't show banner if consent was previously given
      } else if (dismissed) {
        // Banner was dismissed but no consent choice was made
        setShowBanner(false);
      } else {
        // No stored consent and not dismissed - show banner
        setShowBanner(true);
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading cookie consent from localStorage:', error);
      setShowBanner(true);
      setIsInitialized(true);
    }
  }, []);

  // Save consent state to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && consentState.hasChosenConsent) {
      try {
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentState));
        localStorage.removeItem(BANNER_DISMISS_KEY); // Clear any temporary dismiss
        
        // Load scripts based on consent
        loadConditionalScripts(consentState.preferences);
      } catch (error) {
        console.error('Error saving cookie consent to localStorage:', error);
      }
    }
  }, [consentState, isInitialized]);

  const acceptAllCookies = () => {
    const allAcceptedPreferences = COOKIE_CATEGORIES.reduce((acc, category) => {
      acc[category.id] = true;
      return acc;
    }, {} as Record<string, boolean>);

    const newState: ConsentState = {
      hasChosenConsent: true,
      preferences: allAcceptedPreferences,
      lastUpdated: new Date().toISOString(),
    };

    setConsentState(newState);
    setShowBanner(false);
    setShowPreferencesModal(false);
  };

  const rejectAllCookies = () => {
    const onlyEssentialPreferences = COOKIE_CATEGORIES.reduce((acc, category) => {
      acc[category.id] = category.isEssential;
      return acc;
    }, {} as Record<string, boolean>);

    const newState: ConsentState = {
      hasChosenConsent: true,
      preferences: onlyEssentialPreferences,
      lastUpdated: new Date().toISOString(),
    };

    setConsentState(newState);
    setShowBanner(false);
    setShowPreferencesModal(false);
  };

  const savePreferences = (preferences: Record<string, boolean>) => {
    const newState: ConsentState = {
      hasChosenConsent: true,
      preferences,
      lastUpdated: new Date().toISOString(),
    };

    setConsentState(newState);
    setShowBanner(false);
    setShowPreferencesModal(false);
  };

  const dismissBannerTemporarily = () => {
    setShowBanner(false);
    try {
      localStorage.setItem(BANNER_DISMISS_KEY, 'true');
    } catch (error) {
      console.error('Error saving banner dismiss state:', error);
    }
  };

  const openPreferencesModal = () => {
    setShowPreferencesModal(true);
  };

  const closePreferencesModal = () => {
    setShowPreferencesModal(false);
  };

  const clearAllConsent = () => {
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      localStorage.removeItem(BANNER_DISMISS_KEY);
      setConsentState(DEFAULT_CONSENT_STATE);
      setShowBanner(true);
      setShowPreferencesModal(false);
    } catch (error) {
      console.error('Error clearing consent:', error);
    }
  };

  const value: CookieConsentContextType = {
    consentState,
    showBanner: showBanner && isInitialized,
    showPreferencesModal,
    acceptAllCookies,
    rejectAllCookies,
    savePreferences,
    dismissBannerTemporarily,
    openPreferencesModal,
    closePreferencesModal,
    clearAllConsent,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};

// Function to load conditional scripts based on consent
const loadConditionalScripts = (preferences: Record<string, boolean>) => {
  // Load Google Analytics if analytics consent is given
  if (preferences.analytics && !document.querySelector('script[src*="googletagmanager.com"]')) {
    // Create and append Google Analytics script
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-FLJ2KM6R1Z';
    document.head.appendChild(gtagScript);

    // Add gtag configuration
    const gtagConfig = document.createElement('script');
    gtagConfig.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-FLJ2KM6R1Z');
    `;
    document.head.appendChild(gtagConfig);
  }

  // Load Simple Analytics if analytics consent is given
  if (preferences.analytics && !document.querySelector('script[src*="simpleanalyticscdn.com"]')) {
    const simpleScript = document.createElement('script');
    simpleScript.async = true;
    simpleScript.src = 'https://scripts.simpleanalyticscdn.com/latest.js';
    document.head.appendChild(simpleScript);

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.src = 'https://queue.simpleanalyticscdn.com/noscript.gif';
    img.alt = '';
    img.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    noscript.appendChild(img);
    document.head.appendChild(noscript);
  }
};