import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Check, Euro } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { LISTING_PRICE } from '../../utils/constants';
import { STRIPE_PRODUCTS } from '../../stripe-config';
import { createCheckoutSession } from '../../lib/stripe';
import { useAuth } from '../../hooks/useAuth';
import { AuthModal } from '../auth/AuthModal';

interface PaymentFormProps {
  onSubmit: () => void;
  onBack: () => void;
  submissionId?: number;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, onBack, submissionId }) => {
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const product = STRIPE_PRODUCTS[0]; // Get the first (and only) product
      
      const { url } = await createCheckoutSession({
        priceId: product.priceId,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: window.location.href,
        mode: product.mode,
        submissionId,
      });

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Failed to create checkout session');
      setProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <CreditCard className="h-12 w-12 text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Complete your listing</h2>
        <p className="text-gray-400">One-time payment to join our partner network</p>
      </div>

      {error && (
        <Alert variant="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Early Access Listing</span>
            <span className="text-2xl font-bold text-blue-400">€{LISTING_PRICE}</span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>Lifetime listing in our partner directory</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>Access to 1,000+ verified remote workers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>Priority placement and early access benefits</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>Analytics and performance tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>Limited to 25 businesses only</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="bg-orange-600/10 border border-orange-600/20 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="h-5 w-5 text-blue-400" />
          <span className="font-medium text-orange-400">Early Access - Limited Time</span>
        </div>
        <p className="text-sm text-gray-300">
          Only 25 spots available at this early access price. Regular pricing will be €99 after launch.
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-center text-sm text-gray-400">
          <p>By proceeding, you agree to our Terms of Service and Privacy Policy</p>
        </div>

        <div className="flex space-x-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={handlePayment}
            loading={processing}
          >
            {processing ? 'Processing...' : `Pay €${LISTING_PRICE}`}
          </Button>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signup"
      />
    </motion.div>
  );
};