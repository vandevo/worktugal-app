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

const STRIPE_MODE = import.meta.env.VITE_STRIPE_MODE || 'test';

const getPriceId = () => {
  if (STRIPE_MODE === 'live') {
    return import.meta.env.VITE_STRIPE_PRICE_ID_LIVE || 'price_1SksE3Bm1NepJXMzob4V7dzl';
  }
  return import.meta.env.VITE_STRIPE_PRICE_ID_TEST || 'price_1SlUdKBm1NepJXMzGA6BmwUo';
};

export const STRIPE_PRODUCTS: Product[] = [
  {
    id: 'prod_TiwWNMoSapgc7X',
    priceId: getPriceId(),
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
  mode: STRIPE_MODE
};
