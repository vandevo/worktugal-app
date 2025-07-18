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
    id: 'prod_Shj8ClbwZXY3Yu',
    priceId: 'price_1RmJftBm1NepJXMzaOL3DG8d',
    name: 'Partner Listing Early Access (Lifetime)',
    description: 'Join Lisbon\'s #1 Perk Marketplace. Get lifetime visibility to remote workers, expats, and digital nomads. This early access offer is limited to 25 local businesses only. No renewals, no hidden fees.',
    mode: 'payment',
    price: 49.00
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.id === id);
};