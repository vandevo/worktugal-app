export type CookieCategory = 'strictlyNecessary' | 'analytics' | 'marketing' | 'functional';

export interface CookiePreferences {
  [key: string]: boolean;
  strictlyNecessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface ConsentState {
  hasConsented: boolean;
  preferences: CookiePreferences;
  timestamp: number;
}

export interface CookieCategoryConfig {
  id: CookieCategory;
  name: string;
  description: string;
  isEssential: boolean;
}