declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined' && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

export const event = (
  action: string,
  params?: {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: any;
  }
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, params);
  }
};

export const trackFormSubmission = (formName: string) => {
  event('form_submission', {
    category: 'engagement',
    label: formName,
  });
};

export const trackCheckupCompletion = (score: number) => {
  event('checkup_completed', {
    category: 'conversion',
    label: 'tax_checkup',
    value: score,
  });
};

export const trackConsultBooking = (consultType: string, amount: number) => {
  event('consult_booking', {
    category: 'conversion',
    label: consultType,
    value: amount,
  });
};

export const trackPurchase = (
  transactionId: string,
  value: number,
  currency: string,
  items?: Array<{
    item_id: string;
    item_name: string;
    price: number;
  }>
) => {
  event('purchase', {
    transaction_id: transactionId,
    value,
    currency,
    items,
  });
};

export const trackSignup = (method: string) => {
  event('sign_up', {
    method,
  });
};

export const trackLogin = (method: string) => {
  event('login', {
    method,
  });
};

export const trackContactRequest = (purpose: string) => {
  event('contact_request', {
    category: 'engagement',
    label: purpose,
  });
};

export const trackPartnerJoin = (partnerType: string) => {
  event('partner_join', {
    category: 'conversion',
    label: partnerType,
  });
};
