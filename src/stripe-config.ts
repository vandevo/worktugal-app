export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  currencySymbol: string;
  mode: 'payment' | 'subscription';
}

export const STRIPE_PRODUCTS: Product[] = [
  {
    id: 'prod_TiwWNMoSapgc7X',
    priceId: 'price_1SksE3Bm1NepJXMzob4V7dzl',
    name: 'Compliance Readiness Review',
    description: 'A detailed compliance readiness assessment based on your intake. Includes AI-assisted research cross-referenced against official sources, verified by a human reviewer. Educational only, not tax advice.',
    price: 49.00,
    currency: 'eur',
    currencySymbol: '€',
    mode: 'payment'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return STRIPE_PRODUCTS.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return STRIPE_PRODUCTS.find(product => product.priceId === priceId);
};

export const STRIPE_CONFIG = {
  products: STRIPE_PRODUCTS,
};