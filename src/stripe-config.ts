export const stripeProducts = {
  'tax-triage-consult': {
    id: 'prod_T9rkaB7MxIoLMU',
    priceId: 'price_1SDY1RBm1NepJXMzW2Yb7Ve6',
    name: 'Tax Triage Consult',
    description: '30-minute video consultation with an OCC-certified accountant. Get clarity on your immediate tax question with a written outcome note delivered within 48 hours.',
    price: 59.00,
    currency: 'eur',
    currencySymbol: '€',
    mode: 'payment'
  },
  'partner-listing-lifetime': {
    id: 'prod_Shiq1q1rI5sZkR',
    priceId: 'price_1RmJOZBm1NepJXMzN8v22wZ6',
    name: 'Partner Listing Early Access (Lifetime)',
    description: 'Join Lisbon\'s #1 Perk Marketplace. Get lifetime visibility to remote workers, expats, and digital nomads. This early access offer is limited to 25 local businesses only. No renewals, no hidden fees.',
    price: 49.00,
    currency: 'eur',
    currencySymbol: '€',
    mode: 'payment'
  }
} as const;

export type ProductKey = keyof typeof stripeProducts;

export const getProductByKey = (key: ProductKey) => stripeProducts[key];

export const getAllProducts = () => Object.values(stripeProducts);