import React from 'react';
import { motion } from 'framer-motion';
import { Store, Star, Timer } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { useStripeCheckout } from '../hooks/useStripeCheckout';

export const PartnerServices: React.FC = () => {
  const { createCheckoutSession, isLoading } = useStripeCheckout();

  const partnerProducts = STRIPE_PRODUCTS.filter(product => 
    product.name.includes('Partner Listing')
  );

  const handlePurchase = async (priceId: string, productName: string) => {
    await createCheckoutSession(priceId, productName);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Store className="w-4 h-4" />
            Partner Marketplace
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
          >
            Join Lisbon's #1 Perk Marketplace
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-3xl mx-auto"
          >
            Connect with remote workers, expats, and digital nomads. 
            Get exclusive access to our growing community of location-independent professionals.
          </motion.p>
        </div>

        <div className="max-w-md mx-auto">
          {partnerProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
            >
              <ProductCard
                product={product}
                onPurchase={handlePurchase}
                className="border-2 border-orange-200 relative overflow-hidden"
              />
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Early Access
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Targeted Audience</h3>
            <p className="text-sm text-slate-600">
              Reach remote workers and digital nomads actively seeking local services
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Premium Visibility</h3>
            <p className="text-sm text-slate-600">
              Featured placement in our curated directory with professional branding
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Timer className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Lifetime Access</h3>
            <p className="text-sm text-slate-600">
              One-time payment, no recurring fees. Secure your spot forever.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};