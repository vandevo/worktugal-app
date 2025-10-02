import { useState } from 'react';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import { CookiePreferences } from '../types/cookie';

export function CookieConsentBanner() {
  const { consentState, updateConsent } = useCookieConsent();
  const [showBanner, setShowBanner] = useState(!consentState.hasConsented);

  if (!showBanner) {
    return null;
  }

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      strictlyNecessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    updateConsent(allAccepted);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const essentialOnly: CookiePreferences = {
      strictlyNecessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    updateConsent(essentialOnly);
    setShowBanner(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleRejectAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reject All
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
