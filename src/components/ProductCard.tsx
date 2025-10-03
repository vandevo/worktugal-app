import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Loader2 } from 'lucide-react';

interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  currencySymbol: string;
  mode: string;
}

interface ProductCardProps {
  product: Product;
  onPurchase: (priceId: string) => Promise<void>;
  className?: string;
}

export function ProductCard({ product, onPurchase, className = '' }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      await onPurchase(product.priceId);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
          <p className="text-gray-600 mt-2">{product.description}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">
            {product.currencySymbol}{product.price.toFixed(2)}
          </div>
          
          <Button
            onClick={handlePurchase}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Purchase'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}