export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  currencySymbol: string;
  mode: 'payment' | 'subscription';
}

const stripeMode = import.meta.env.VITE_STRIPE_MODE || 'test';

const getTestProducts = (): StripeProduct[] => [
  {
    priceId: import.meta.env.VITE_STRIPE_PRICE_ID_TEST || 'price_1SlUdKBm1NepJXMzGA6BmwUo',
    name: 'Partner Perks Listing',
    description: 'One-time payment to list your business perk in the Worktugal directory. Reach thousands of expats and remote workers in Portugal.',
    price: 49.00,
    currency: 'eur',
    currencySymbol: '€',
    mode: 'payment'
  },
  {
    priceId: import.meta.env.VITE_STRIPE_PRICE_REVIEW_TEST || 'price_1SlUdKBm1NepJXMzGA6BmwUo',
    name: 'Detailed Compliance Risk Review',
    description: 'A written compliance risk review based on the information you provide. Includes structured research and human review. This service does not provide tax advice, tax calculations, or filing services.',
    price: 49.00,
    currency: 'eur',
    currencySymbol: '€',
    mode: 'payment'
  }
];

const getLiveProducts = (): StripeProduct[] => [
  {
    priceId: import.meta.env.VITE_STRIPE_PRICE_ID_LIVE || '',
    name: 'Partner Perks Listing',
    description: 'One-time payment to list your business perk in the Worktugal directory. Reach thousands of expats and remote workers in Portugal.',
    price: 49.00,
    currency: 'eur',
    currencySymbol: '€',
    mode: 'payment'
  },
  {
    priceId: import.meta.env.VITE_STRIPE_PRICE_REVIEW_LIVE || '',
    name: 'Detailed Compliance Risk Review',
    description: 'A written compliance risk review based on the information you provide. Includes structured research and human review. This service does not provide tax advice, tax calculations, or filing services.',
    price: 49.00,
    currency: 'eur',
    currencySymbol: '€',
    mode: 'payment'
  }
];

export const STRIPE_CONFIG = {
  mode: stripeMode as 'test' | 'live',
  publishableKey: stripeMode === 'live'
    ? import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_LIVE
    : import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_TEST,
  products: stripeMode === 'live' ? getLiveProducts() : getTestProducts(),
};

export const STRIPE_PRODUCTS = STRIPE_CONFIG.products;

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return STRIPE_CONFIG.products.find(p => p.priceId === priceId);
};
