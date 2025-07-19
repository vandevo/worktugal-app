import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Check, Euro } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { LISTING_PRICE } from '../../utils/constants';
import { STRIPE_PRODUCTS } from '../../stripe-config';
import { createCheckoutSession } from '../../lib/stripe';
import { createPartnerSubmission } from '../../lib/submissions';
import { useAuth } from '../../hooks/useAuth';
import { FormData } from '../../types';
import { AuthModal } from '../auth/AuthModal';

interface PaymentFormProps {
  onSubmit: () => void;
  onBack: () => void;
  formData: FormData;
  updateFormData: (section: keyof FormData, data: any) => void;
  isPreviewMode?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, onBack, formData, updateFormData, isPreviewMode = false }) => {
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(false);

  // Handle payment after user authentication
  useEffect(() => {
    if (user && pendingPayment) {
      setPendingPayment(false);
      handlePayment();
    }
  }, [user, pendingPayment]);

  const handlePayment = async () => {
    if (isPreviewMode) {
      setError('Payment disabled in preview mode. This is for development/design testing only.');
      return;
    }
    
    if (!user) {
      setShowAuthModal(true);
      setPendingPayment(true);
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      let submissionId = formData.submissionId;
      
      // Create submission if it doesn't exist yet
      if (!submissionId) {
        submissionId = await createPartnerSubmission({
          business: formData.business,
          perk: formData.perk,
          userId: user.id,
        });
        
        // Update form data with submission ID
        updateFormData('submissionId', submissionId);
      }
      
      const product = STRIPE_PRODUCTS[0]; // Get the first (and only) product
      
      const { url } = await createCheckoutSession({
        priceId: product.priceId,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: submissionId 
          ? `${window.location.origin}/?submission=${submissionId}`
          : window.location.href,
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
        <h2 className="text-2xl font-bold mb-2">Join Lisbon's Most Trusted Perk Marketplace</h2>
        <p className="text-gray-400">Secure your spot in the partner network that remote professionals actually use</p>
      </div>

      {error && (
        <Alert variant="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {isPreviewMode && (
        <Alert variant="info" className="mb-6">
          <strong>🔧 Preview Mode</strong><br />
          This is a development preview with dummy data. Payment processing is disabled.
        </Alert>
      )}

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Partner Listing Early Access (Lifetime)</span>
            <span className="text-2xl font-bold text-blue-400">€{LISTING_PRICE}</span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>Lifetime visibility in Lisbon's trusted perk marketplace</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>Exposure to 1,000+ verified remote professionals</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>Featured in events & community channels</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>Performance tracking & customer insights</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>No renewal fees • No commissions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>Portugal-based team & support</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="bg-orange-600/10 border border-orange-600/20 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="h-5 w-5 text-blue-400" />
          <span className="font-medium text-orange-400">Early Access - 21 Spots Remaining</span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          Join the first 25 partners in the marketplace that remote workers trust. Quality customers who stay, spend, and share their experiences.
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-center text-sm text-gray-400">
          <p>Payments securely processed with Stripe • By proceeding, you agree to our Terms of Service</p>
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
            disabled={isPreviewMode}
          >
            {isPreviewMode 
              ? '🔧 Preview Mode - Payment Disabled' 
              : processing 
                ? 'Processing...' 
                : `Secure Your Spot — €${LISTING_PRICE}`
            }
          </Button>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingPayment(false);
        }}
        initialMode="signup"
      />
    </motion.div>
  );
};