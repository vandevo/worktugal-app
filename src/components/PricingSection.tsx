import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard, Loader2, Lock, Target } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Alert } from './ui/Alert';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { createCheckoutSession } from '../lib/stripe';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { AuthModal } from './auth/AuthModal';
import { getApprovedSubmissionsCount } from '../lib/submissions';

const TOTAL_EARLY_ACCESS_SPOTS = 25;

export const PricingSection: React.FC = () => {
  const { user } = useAuth();
  const { hasActivePayment, loading: subscriptionLoading } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [spotsLeft, setSpotsLeft] = useState<number | null>(null);
  const [spotsLoading, setSpotsLoading] = useState(true);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        setSpotsLoading(true);
        const approvedCount = await getApprovedSubmissionsCount();
        setSpotsLeft(TOTAL_EARLY_ACCESS_SPOTS - approvedCount);
      } catch (err) {
        console.error('Failed to fetch spots left:', err);
        setSpotsLeft(null);
      } finally {
        setSpotsLoading(false);
      }
    };
    fetchSpots();
  }, []);

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

  if (subscriptionLoading || spotsLoading) {
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
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
            Reach Verified Remote Clients Without Ads or Agencies
          </h2>
          <p className="text-lg sm:text-xl text-blue-300 font-medium mb-4">
            €49 one time. No renewals. No stress.
          </p>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Forget cold outreach. Skip noisy platforms.<br />
            List your offer where remote professionals actually look.<br />
            You provide a perk. We give you visibility. They come to you.
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
                <motion.div
                  animate={spotsLeft !== null && spotsLeft <= 10 ? {
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(239, 68, 68, 0)",
                      "0 0 0 8px rgba(239, 68, 68, 0.1)",
                      "0 0 0 0 rgba(239, 68, 68, 0)"
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-full border font-semibold ${
                    spotsLeft !== null && spotsLeft <= 5
                      ? 'bg-red-600/20 text-red-300 border-red-600/40 shadow-red-500/20 shadow-lg'
                      : spotsLeft !== null && spotsLeft <= 10
                      ? 'bg-orange-600/20 text-orange-300 border-orange-600/40 shadow-orange-500/20 shadow-lg'
                      : 'bg-blue-600/20 text-blue-300 border-blue-600/40'
                  }`}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Target className="h-4 w-4" />
                  </motion.div>
                  <span className="text-sm font-bold tracking-wide">
                    {spotsLeft !== null 
                      ? spotsLeft <= 5
                        ? `🔥 FINAL ${spotsLeft} SPOTS`
                        : spotsLeft <= 10
                        ? `⚡ Only ${spotsLeft} left`
                        : `${spotsLeft} early access spots`
                      : 'Loading spots...'
                    }
                  </span>
                </motion.div>
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
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Only 25 spots at €49. Then the price goes up.<br />
                      Join early. Get seen first.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base">A trusted lifetime listing in Lisbon's remote-first network</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Access to a growing base of 1,000+ verified remote professionals</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Opportunities to be featured in meetups, content, and private channels</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Local support. Clear setup. No guesswork</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base">No commissions. No middlemen. One clear offer</span>
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
                      Secure Your Spot for €{product.price}
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
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">Secure Payment Processing</span>
            </div>
            <p className="text-sm">Securely processed with Stripe • Your information is encrypted and protected</p>
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