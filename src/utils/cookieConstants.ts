import { CookieCategoryConfig } from '../types/cookie';

export const COOKIE_CATEGORIES: CookieCategoryConfig[] = [
  {
    id: 'strictlyNecessary',
    name: 'Strictly Necessary',
    description: 'Essential cookies for authentication, security, and saving your cookie preferences. These cannot be disabled.',
    isEssential: true,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'We use Google Analytics (GA4) and Simple Analytics to understand how visitors use our site. Google Analytics data is anonymized and retained for 26 months.',
    isEssential: false,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Used for advertising and retargeting. We currently do not use marketing cookies.',
    isEssential: false,
  },
  {
    id: 'functional',
    name: 'Functional',
    description: 'Remember your preferences and saved form progress. Uses localStorage to save draft forms so you can continue where you left off.',
    isEssential: false,
  },
];

export const DEFAULT_PREFERENCES = {
  strictlyNecessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

export const CONSENT_STORAGE_KEY = 'worktugal_cookie_consent';