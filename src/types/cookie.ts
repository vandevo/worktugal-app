/**
 * Cookie consent types for GDPR compliance
 * Manages user preferences for different cookie categories
 */

export type CookieCategory = 'strictlyNecessary' | 'analytics' | 'marketing' | 'functional';

export interface CookiePreferences {
  strictlyNecessary: boolean; // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface ConsentState {
  hasConsented: boolean;
  preferences: CookiePreferences;
  timestamp: number;
}
