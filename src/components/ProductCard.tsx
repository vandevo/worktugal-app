import React, { useState } from 'react';
import { Product } from '../stripe-config';
import { CheckCircle, Loader2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onCheckout: (priceId: string) => Promise<void>;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onCheckout }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await onCheckout(product.priceId);
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {product.name}
        </h3>
        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900">
            {product.currencySymbol}{product.price.toFixed(2)}
          </span>
          <div className="text-sm text-gray-500 uppercase">
            {product.currency}
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        {product.description}
      </p>
      
      <div className="flex items-center mb-6 text-sm text-gray-500">
        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
        <span>Secure payment with Stripe</span>
      </div>
      
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          `Purchase ${product.name}`
        )}
      </button>
    </div>
  );
};