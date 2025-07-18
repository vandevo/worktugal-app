import { useState } from 'react';
import { FormData, FormStep } from '../types';

const initialFormData: FormData = {
  business: {
    name: '',
    website: '',
    instagram: '',
    contact_name: '',
    email: '',
    phone: '',
    category: '',
    neighborhood: '',
  },
  perk: {
    title: '',
    description: '',
    redemption_method: '',
    redemption_details: '',
    images: [],
    logo: '',
    is_portuguese_owned: false,
    needs_nif: false,
  },
};

export const useFormData = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState<FormStep>('business');

  const updateFormData = (section: keyof FormData, data: Partial<FormData[keyof FormData]>) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep('business');
  };

  return {
    formData,
    currentStep,
    updateFormData,
    setCurrentStep,
    resetForm,
  };
};