import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Check, Euro } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LISTING_PRICE } from '../../utils/constants';

interface PaymentFormProps {
  onSubmit: () => void;
  onBack: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, onBack }) => {
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessing(false);
    onSubmit();
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

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Partner Listing Fee</span>
            <span className="text-2xl font-bold text-blue-400">€{LISTING_PRICE}</span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>Permanent listing in our partner directory</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>Access to 1,000+ verified remote workers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>Promotion through our events and community</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-400" />
              <span>Analytics and performance tracking</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="h-5 w-5 text-blue-400" />
          <span className="font-medium text-blue-400">Secure Payment</span>
        </div>
        <p className="text-sm text-gray-300">
          Your payment is processed securely through Stripe. We never store your card details.
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
    </motion.div>
  );
};