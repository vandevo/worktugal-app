const isProduction = import.meta.env.PROD;

export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  products: [
    {
      id: isProduction ? 'prod_TiIpH2ccZxbxLC' : 'prod_TiwWNMoSapgc7X',
      priceId: 'price_1SlUdKBm1NepJXMzGA6BmwUo',
      lookupKey: isProduction ? 'compliance_risk_review_49' : 'compliance_risk_review_49_test',
      name: 'Detailed Compliance Risk Review',
      description: 'Structured compliance risk mapping based on your specific situation. Written review with evidence-backed findings delivered within 48 hours. Human-reviewed analysis with escalation flags for complex cases.',
      price: 49.00,
      currency: 'eur',
      currencySymbol: '€',
      mode: 'payment'
    },
    {
      id: 'prod_T9sKwM6QHJCWMl',
      priceId: 'price_1SDYZRBm1NepJXMzyS81QIE7',
      name: 'Annual Return Consult',
      description: '60-minute annual tax situation review with deduction optimization and filing deadline guidance. Includes €149 credit toward filing if you book with us, written recommendations, IRS Form 3 overview, and social security guidance.',
      price: 149.00,
      currency: 'eur',
      currencySymbol: '€',
      mode: 'payment'
    },
    {
      id: 'prod_T9rpbwgk2Zo9Zi',
      priceId: 'price_1SDY5VBm1NepJXMzFOO40FhI',
      name: 'Freelancer Start Pack',
      description: 'Complete freelancer setup in Portugal. 90-minute consultation covering activity opening, VAT regime decision, eFatura configuration, and 60 days of email support.',
      price: 349.00,
      currency: 'eur',
      currencySymbol: '€',
      mode: 'payment'
    },
    {
      id: 'prod_T9rkaB7MxIoLMU',
      priceId: 'price_1SDY1RBm1NepJXMzW2Yb7Ve6',
      name: 'Tax Triage Consult',
      description: '30-minute video consultation with an OCC-certified accountant. Get clarity on your immediate tax question with a written outcome note delivered within 48 hours.',
      price: 59.00,
      currency: 'eur',
      currencySymbol: '€',
      mode: 'payment'
    },
    {
      id: 'prod_Shiq1q1rI5sZkR',
      priceId: 'price_1RmJOZBm1NepJXMzN8v22wZ6',
      name: 'Partner Listing Early Access (Lifetime)',
      description: 'Join Lisbon\'s #1 Perk Marketplace. Get lifetime visibility to remote workers, expats, and digital nomads. This early access offer is limited to 25 local businesses only. No renewals, no hidden fees.',
      price: 49.00,
      currency: 'eur',
      currencySymbol: '€',
      mode: 'payment'
    }
  ]
};

export const getProductByPriceId = (priceId: string) => {
  return STRIPE_CONFIG.products.find(product => product.priceId === priceId);
};

export const getProductById = (productId: string) => {
  return STRIPE_CONFIG.products.find(product => product.id === productId);
};