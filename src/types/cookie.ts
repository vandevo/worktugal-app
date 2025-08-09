export interface CookieCategory {
  id: string;
  name: string;
  description: string;
  isEssential: boolean;
}

export interface ConsentState {
  hasChosenConsent: boolean;
  preferences: Record<string, boolean>;
  lastUpdated: string;
}

export type ConsentAction = 'accept-all' | 'reject-all' | 'save-preferences' | 'dismiss';