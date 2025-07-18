export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
}

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    id: 'prod_RtcuZS0sNnJcqn',
    priceId: 'price_1QzpeWBm1NepJXMzJzSMUrYf',
    name: 'Perk Marketplace Partner Listing (Early Bird)',
    description: 'Join Lisbon\'s top perk marketplace & attract high-spending remote workers, expats, and digital nomads. After payment, you\'ll submit your business details and get listed with full visibility. No renewals, no hidden fees—just instant exposure.',
    mode: 'payment',
    price: 99.00
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.id === id);
};