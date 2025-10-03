import { CookieCategoryConfig } from '../types/cookie';

export const COOKIE_CATEGORIES: CookieCategoryConfig[] = [
  {
    id: 'strictlyNecessary',
    name: 'Strictly Necessary',
    description: 'Essential cookies required for basic website functionality and security.',
    isEssential: true,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Help us understand how visitors interact with our website to improve performance.',
    isEssential: false,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Used to track visitors across websites to display relevant advertisements.',
    isEssential: false,
  },
  {
    id: 'functional',
    name: 'Functional',
    description: 'Enable enhanced functionality and personalization, such as videos and live chats.',
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