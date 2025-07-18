import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormData } from '../hooks/useFormData';
import { BusinessForm } from './forms/BusinessForm';
import { PerkForm } from './forms/PerkForm';
import { PaymentForm } from './forms/PaymentForm';
import { SuccessScreen } from './forms/SuccessScreen';
import { ProgressBar } from './ui/ProgressBar';
import { BusinessFormData, PerkFormData } from '../lib/validations';
import { createPartnerSubmission } from '../lib/submissions';
import { useAuth } from '../hooks/useAuth';
import { Alert } from './ui/Alert';

interface FormWizardProps {
  onComplete: () => void;
}

export const FormWizard: React.FC<FormWizardProps> = ({ onComplete }) => {
  const { formData, currentStep, updateFormData, setCurrentStep, resetForm } = useFormData();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBusinessSubmit = (data: BusinessFormData) => {
    updateFormData('business', data);
    setCurrentStep('perk');
  };

  const handlePerkSubmit = async (data: PerkFormData) => {
    if (!user) {
      setError('You must be logged in to submit a form');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Save the submission to Supabase
      const submissionId = await createPartnerSubmission({
        business: formData.business,
        perk: data,
        userId: user.id,
      });

      // Update form data with submission ID
      updateFormData('submissionId', submissionId);
    } catch (err: any) {
      setError(err.message || 'Failed to save submission');
      setLoading(false);
      return;
    }

    updateFormData('perk', data);
    setLoading(false);
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = () => {
    setCurrentStep('success');
    // Here you would typically submit to your backend
    console.log('Submitting form data:', formData);
  };

  const handleViewDirectory = () => {
    onComplete();
    document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartOver = () => {
    resetForm();
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 'business': return 1;
      case 'perk': return 2;
      case 'payment': return 3;
      case 'success': return 4;
      default: return 1;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {currentStep !== 'success' && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">
              Step {getStepNumber()} of 3
            </span>
            <span className="text-sm text-gray-400">
              {getStepNumber() === 1 && 'Business Info'}
              {getStepNumber() === 2 && 'Perk Details'}
              {getStepNumber() === 3 && 'Payment'}
            </span>
          </div>
          <ProgressBar currentStep={getStepNumber()} totalSteps={3} />
        </div>
      )}

      {error && (
        <Alert variant="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 'business' && (
            <BusinessForm
              onSubmit={handleBusinessSubmit}
              initialData={formData.business}
            />
          )}
          {currentStep === 'perk' && (
            <PerkForm
              onSubmit={handlePerkSubmit}
              onBack={() => setCurrentStep('business')}
              initialData={formData.perk}
              loading={loading}
            />
          )}
          {currentStep === 'payment' && (
            <PaymentForm
              onSubmit={handlePaymentSubmit}
              onBack={() => setCurrentStep('perk')}
              submissionId={formData.submissionId}
            />
          )}
          {currentStep === 'success' && (
            <SuccessScreen
              onViewDirectory={handleViewDirectory}
              onStartOver={handleStartOver}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};