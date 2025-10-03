/**
 * Stripe Product Configuration
 * Defines all products/services available for purchase in the platform
 *
 * Two main product categories:
 * 1. Accounting Desk Services - Tax consultations for expats in Portugal
 * 2. Partner Marketplace - Business listings in the Perks Directory
 *
 * Important: Price IDs must match those created in Stripe Dashboard
 * Mode: 'payment' = one-time payment, 'subscription' = recurring
 */
export const STRIPE_PRODUCTS = {
  // Accounting Desk Services
  'Tax Triage Consult': {
    id: 'prod_T9rkaB7MxIoLMU',
    priceId: 'price_1SDY1RBm1NepJXMzW2Yb7Ve6',
    description: '30-minute video consultation with an OCC-certified accountant. Get clarity on your immediate tax question with a written outcome note delivered within 48 hours.',
    price: 59.00,
    currency: 'eur',
    mode: 'payment'
  },
  'Annual Return Consult': {
    id: 'prod_T9sKwM6QHJCWMl',
    priceId: 'price_1SDYZRBm1NepJXMzyS81QIE7',
    description: '60-minute annual tax situation review with deduction optimization and filing deadline guidance. Includes €149 credit toward filing if you book with us, written recommendations, IRS Form 3 overview, and social security guidance.',
    price: 149.00,
    currency: 'eur',
    mode: 'payment'
  },
  'Freelancer Start Pack': {
    id: 'prod_T9rpbwgk2Zo9Zi',
    priceId: 'price_1SDY5VBm1NepJXMzFOO40FhI',
    description: 'Complete freelancer setup in Portugal. 90-minute consultation covering activity opening, VAT regime decision, eFatura configuration, and 60 days of email support.',
    price: 349.00,
    currency: 'eur',
    mode: 'payment'
  },
  // Partner Marketplace
  'Partner Listing Early Access (Lifetime)': {
    id: 'prod_Shiq1q1rI5sZkR',
    priceId: 'price_1RmJOZBm1NepJXMzN8v22wZ6',
    description: 'Join Lisbon\'s #1 Perk Marketplace. Get lifetime visibility to remote workers, expats, and digital nomads. This early access offer is limited to 25 local businesses only. No renewals, no hidden fees.',
    price: 49.00,
    currency: 'eur',
    mode: 'payment'
  }
} as const;

export type ProductName = keyof typeof STRIPE_PRODUCTS;

export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;