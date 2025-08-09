import { CookieCategory } from '../types/cookie';

export const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'strictlyNecessary',
    name: 'Strictly Necessary',
    description: 'These cookies are essential for the website to function properly. They enable core functionality such as user authentication, security, and basic navigation. These cannot be disabled.',
    isEssential: true,
  },
  {
    id: 'analytics',
    name: 'Analytics & Performance',
    description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our service and user experience.',
    isEssential: false,
  },
  {
    id: 'marketing',
    name: 'Marketing & Advertising',
    description: 'These cookies are used to make advertising messages more relevant to you and your interests. They may be used to prevent the same ad from being shown to you repeatedly.',
    isEssential: false,
  },
  {
    id: 'functional',
    name: 'Functional',
    description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings for a better user experience.',
    isEssential: false,
  },
];

export const CONSENT_STORAGE_KEY = 'worktugal-cookie-consent';
export const BANNER_DISMISS_KEY = 'worktugal-banner-dismissed';

// Default consent state
export const DEFAULT_CONSENT_STATE = {
  hasChosenConsent: false,
  preferences: {
    strictlyNecessary: true, // Always true for essential cookies
    analytics: false,
    marketing: false,
    functional: false,
  },
  lastUpdated: new Date().toISOString(),
};