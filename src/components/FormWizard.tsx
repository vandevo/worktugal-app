import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormData } from '../hooks/useFormData';
import { BusinessForm } from './forms/BusinessForm';
import { PerkForm } from './forms/PerkForm';
import { PaymentForm } from './forms/PaymentForm';
import { SuccessScreen } from './forms/SuccessScreen';
import { ProgressBar } from './ui/ProgressBar';
import { BusinessFormData, PerkFormData } from '../lib/validations';

interface FormWizardProps {
  onComplete: () => void;
}

export const FormWizard: React.FC<FormWizardProps> = ({ onComplete }) => {
  const { formData, currentStep, updateFormData, setCurrentStep, resetForm } = useFormData();

  const handleBusinessSubmit = (data: BusinessFormData) => {
    updateFormData('business', data);
    setCurrentStep('perk');
  };

  const handlePerkSubmit = (data: PerkFormData) => {
    updateFormData('perk', data);
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
            />
          )}
          {currentStep === 'payment' && (
            <PaymentForm
              onSubmit={handlePaymentSubmit}
              onBack={() => setCurrentStep('perk')}
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