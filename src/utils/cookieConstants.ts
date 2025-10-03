import { CookiePreferences } from '../types/cookie';

/**
 * Cookie consent configuration constants
 */

// LocalStorage key for storing consent preferences
export const CONSENT_STORAGE_KEY = 'worktugal-cookie-consent';

// Default cookie preferences (only strictly necessary enabled)
export const DEFAULT_PREFERENCES: CookiePreferences = {
  strictlyNecessary: true,  // Always enabled, required for basic functionality
  analytics: false,
  marketing: false,
  functional: false,
};

// Cookie categories with labels and descriptions
export const COOKIE_CATEGORIES = [
  {
    id: 'strictlyNecessary',
    label: 'Strictly Necessary',
    description: 'Essential cookies required for the website to function properly. These cannot be disabled.',
    required: true
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Help us understand how visitors interact with our website by collecting anonymous data.',
    required: false
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Used to track visitors across websites to display relevant advertisements.',
    required: false
  },
  {
    id: 'functional',
    label: 'Functional',
    description: 'Enable enhanced functionality and personalization, such as videos and live chat.',
    required: false
  }
] as const;

// Cookie descriptions for the preferences modal
export const COOKIE_DESCRIPTIONS = {
  strictlyNecessary: 'Essential cookies required for the website to function properly. These cannot be disabled.',
  analytics: 'Help us understand how visitors interact with our website by collecting anonymous data.',
  marketing: 'Used to track visitors across websites to display relevant advertisements.',
  functional: 'Enable enhanced functionality and personalization, such as videos and live chat.',
};
