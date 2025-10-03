import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { StripeProduct, formatPrice } from '../stripe-config';

interface ProductCardProps {
  product: StripeProduct;
  onPurchase: (priceId: string, productName: string) => Promise<void>;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPurchase,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      await onPurchase(product.priceId, product.name);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            {product.name}
          </h3>
          
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            {product.description}
          </p>
          
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-3xl font-bold text-slate-900">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.mode === 'payment' && (
              <span className="text-slate-500 text-sm">one-time</span>
            )}
          </div>
        </div>

        <Button
          onClick={handlePurchase}
          disabled={isLoading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Purchase Now
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};