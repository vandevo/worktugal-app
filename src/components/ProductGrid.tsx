import React from 'react';
import { ProductCard } from './ProductCard';
import { STRIPE_CONFIG } from '../stripe-config';
import { supabase } from '../lib/supabase';

interface ProductGridProps {
  className?: string;
}

export function ProductGrid({ className = '' }: ProductGridProps) {
  const handlePurchase = async (priceId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          priceId,
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: window.location.href
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {STRIPE_CONFIG.products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onPurchase={handlePurchase}
        />
      ))}
    </div>
  );
}