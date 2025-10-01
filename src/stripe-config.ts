export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'payment' | 'subscription';
}

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    id: 'prod_T9rpbwgk2Zo9Zi',
    priceId: 'price_1SDY5VBm1NepJXMzFOO40FhI',
    name: 'Freelancer Start Pack',
    description: 'Complete freelancer setup in Portugal. 90-minute consultation covering activity opening, VAT regime decision, eFatura configuration, and 60 days of email support.',
    price: 349.00,
    currency: 'eur',
    mode: 'payment'
  },
  {
    id: 'prod_T9rkaB7MxIoLMU',
    priceId: 'price_1SDY1RBm1NepJXMzW2Yb7Ve6',
    name: 'Tax Triage Consult',
    description: '30-minute video consultation with an OCC-certified accountant. Get clarity on your immediate tax question with a written outcome note delivered within 48 hours.',
    price: 59.00,
    currency: 'eur',
    mode: 'payment'
  },
  {
    id: 'prod_Shiq1q1rI5sZkR',
    priceId: 'price_1RmJOZBm1NepJXMzN8v22wZ6',
    name: 'Partner Listing Early Access (Lifetime)',
    description: 'Join Lisbon\'s #1 Perk Marketplace. Get lifetime visibility to remote workers, expats, and digital nomads. This early access offer is limited to 25 local businesses only. No renewals, no hidden fees.',
    price: 49.00,
    currency: 'eur',
    mode: 'payment'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.priceId === priceId);
};

export const getProductById = (productId: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.id === productId);
};

export const formatPrice = (price: number, currency: string = 'eur'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(price);
};