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
    priceId: 'price_1SlUdKBm1NepJXMzGA6BmwUo',
    name: 'Detailed Compliance Risk Review',
    description: 'A written compliance risk review based on the information you provide. Includes structured research and human review. This service does not provide tax advice, tax calculations, or filing services.',
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