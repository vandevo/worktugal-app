import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard, Loader2, AlertCircle, Target } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Alert } from './ui/Alert';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { createCheckoutSession } from '../lib/stripe';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { AuthModal } from './auth/AuthModal';

export const PricingSection: React.FC = () => {
  const { user } = useAuth();
  const { hasActivePayment, loading: subscriptionLoading } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handlePurchase = async (priceId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (hasActivePayment) {
      setError('You already have an active membership');
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

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Failed to create checkout session');
    } finally {
      setLoading(null);
    }
  };

  if (subscriptionLoading) {
    return (
      <section className="py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-400">Loading pricing information...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="pricing" className="py-20 bg-gray-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
            Get Your Business in Front of Lisbon's Most Trusted Remote Professionals
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join the curated partner network trusted by 1,000+ remote professionals in Lisbon
          </p>
        </div>

        {error && (
          <Alert variant="error" className="mb-8 max-w-2xl mx-auto" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {hasActivePayment && (
          <Alert variant="success" className="mb-8 max-w-2xl mx-auto">
            You're already a member of our partner network!
          </Alert>
        )}

        <div className="max-w-lg mx-auto">
          {STRIPE_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* FOMO Badge */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center space-x-2 bg-orange-600/20 text-orange-300 px-3 py-2 rounded-full border border-orange-600/30">
                  <Target className="h-3.5 w-3.5" />
                  <span className="text-xs sm:text-sm font-medium">21 spots left</span>
                </div>
              </div>

              <Card className="p-6 sm:p-8 text-center" hover>
                
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 leading-tight">
                    Early Access Lifetime Listing
                  </h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-3xl sm:text-4xl font-bold text-blue-400">€{product.price}</span>
                    <span className="text-gray-400 ml-2 text-sm">one time</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-6">No renewals • No surprises</p>
                  
                  <div className="text-gray-300 mb-6 text-left space-y-3">
                    <p className="text-base leading-relaxed font-medium">
                      Join the first 25 partners in Lisbon's most trusted perk marketplace for remote professionals.
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Drive quality foot traffic from verified members who spend more and stay longer.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Lifetime listing in partner directory</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Exposure to 1,000+ verified professionals</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Featured in events & community channels</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Performance tracking & insights</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base">No renewal fees • No commissions</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Portugal-based team & support</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold"
                  onClick={() => handlePurchase(product.priceId)}
                  disabled={hasActivePayment}
                >
                  {hasActivePayment ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Already a Member
                    </>
                  ) : loading === product.priceId ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Secure Your Spot — €{product.price}
                    </>
                  )}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <div className="text-gray-400 space-y-2">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <p className="text-sm">Payments are securely processed with Stripe</p>
            <p className="text-xs sm:text-sm">Your information is encrypted and protected</p>
          </div>
        </div>
        </div>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signup"
      />
    </>
  );
};