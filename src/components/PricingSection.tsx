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
            €49 one time payment
          </p>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Cold outreach is noisy. Agencies are expensive.<br />
            This is the fastest way to get discovered by remote professionals in Lisbon.<br />
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
              <div className="text-center mb-8 sm:mb-10">
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
                  className={`inline-flex items-center space-x-2 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full border font-semibold shadow-lg ${
                    spotsLeft !== null && spotsLeft <= 5
                      ? 'bg-red-600/20 text-red-300 border-red-600/40 shadow-red-500/20'
                      : spotsLeft !== null && spotsLeft <= 10
                      ? 'bg-orange-600/20 text-orange-300 border-orange-600/40 shadow-orange-500/20'
                      : 'bg-blue-600/20 text-blue-300 border-blue-600/40'
                  }`}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Target className="h-4 w-4" />
                  </motion.div>
                  <span className="text-sm sm:text-base font-bold tracking-wide">
                    {spotsLeft !== null 
                      ? spotsLeft <= 5
                        ? `🔥 FINAL ${spotsLeft} SPOTS`
                        : spotsLeft <= 10
                        ? `⚡ Only ${spotsLeft} left`
                        : `${spotsLeft} spots remaining`
                      : 'Loading spots...'
                    }
                  </span>
                </motion.div>
                <div className="mt-4 sm:mt-6 space-y-3 max-w-md mx-auto">
                  <p className="text-sm sm:text-base font-medium text-orange-400">
                    Lock your spot. Get visibility. Be first
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed px-4 sm:px-0">
                    Only 25 listings available at this early access price. Once filled, the next tier will open at a higher rate.
                  </p>
                </div>
              </div>

              <Card className="p-6 sm:p-8 lg:p-10 text-center" hover>
                
                <div className="mb-8 sm:mb-10">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 leading-tight">
                    🎯 Early Access Lifetime Listing
                  </h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-400">€{product.price}</span>
                    <span className="text-gray-400 ml-3 text-base sm:text-lg">one time</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-400 mb-8">No renewals • No surprises</p>
                  
                  <div className="text-center mb-8">
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-md mx-auto">
                      Join the marketplace where quality remote professionals discover trusted local businesses. No spam, no cold calls - just genuine connections.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-5 mb-10 text-left max-w-lg mx-auto">
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base leading-relaxed">Listed on our public perk directory</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base leading-relaxed">"Trusted Partner" badge on your listing</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm sm:text-base leading-relaxed">
                        Verified profile access with a partner dashboard
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base leading-relaxed">Featured in our monthly newsletter</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base leading-relaxed">Shoutouts at select in-person events</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base leading-relaxed">Ongoing support to update or refresh your perks</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base leading-relaxed">Invite-only access to our Partner Insider Network as we grow</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full h-14 sm:h-16 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl"
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
                      Secure your listing for €{product.price}
                    </>
                  )}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <Lock className="h-4 w-4" />
            <span className="text-sm sm:text-base">Protected by Stripe • Encrypted checkout</span>
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