import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Alert } from './ui/Alert';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { createCheckoutSession } from '../lib/stripe';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './auth/AuthModal';

export const PricingSection: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handlePurchase = async (priceId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(priceId);
    setError(null);

    try {
      const { url } = await createCheckoutSession({
        priceId,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: window.location.href,
        mode: 'payment',
      });

      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Failed to create checkout session');
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="py-20 bg-gray-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Join Our Partner Network</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get your business in front of 1,000+ high-spending remote workers in Lisbon
          </p>
        </div>

        {error && (
          <Alert variant="error" className="mb-8 max-w-2xl mx-auto">
            {error}
          </Alert>
        )}

        <div className="max-w-2xl mx-auto">
          {STRIPE_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <Card className="p-8 text-center" hover>
                {/* Limited availability badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Limited: 25 spots only
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-blue-400">€{product.price}</span>
                    <span className="text-gray-400 ml-2">lifetime</span>
                  </div>
                  <p className="text-gray-300">{product.description}</p>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-left">Lifetime listing in partner directory</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-left">Access to 1,000+ verified remote workers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-left">Promotion through events and community</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-left">Analytics and performance tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-left">Early access pricing - limited time</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-left">No renewals, no hidden fees</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => handlePurchase(product.priceId)}
                  loading={loading === product.priceId}
                >
                  {loading === product.priceId ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Secure Your Spot - €{product.price}
                    </>
                  )}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signup"
      />
    </section>
  );
};