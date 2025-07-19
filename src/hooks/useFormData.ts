import { useState, useEffect } from 'react';
import { FormData, FormStep } from '../types';
import { getPartnerSubmissionById } from '../lib/submissions';
import { useAuth } from './useAuth';

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
  submissionId: undefined,
};

export const useFormData = (submissionId?: number) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState<FormStep>('business');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load existing submission data if submissionId is provided
  useEffect(() => {
    const loadExistingSubmission = async () => {
      if (!submissionId || !user) return;

      setLoading(true);
      try {
        const submission = await getPartnerSubmissionById(submissionId);
        
        if (submission && submission.user_id === user.id) {
          // Convert submission data back to form format
          const loadedFormData: FormData = {
            business: {
              name: submission.business_name,
              website: submission.business_website || '',
              instagram: submission.business_instagram || '',
              contact_name: submission.contact_name,
              email: submission.contact_email,
              phone: submission.contact_phone,
              category: submission.business_category,
              neighborhood: submission.business_neighborhood,
            },
            perk: {
              title: submission.perk_title,
              description: submission.perk_description,
              redemption_method: submission.perk_redemption_method,
              redemption_details: submission.perk_redemption_details,
              images: submission.perk_images || [],
              logo: submission.perk_logo || '',
              is_portuguese_owned: submission.perk_is_portuguese_owned,
              needs_nif: submission.perk_needs_nif,
            },
            submissionId: submission.id,
          };
          
          setFormData(loadedFormData);
          
          // Set step based on submission status
          if (submission.status === 'pending_payment') {
            setCurrentStep('payment');
          } else if (submission.status === 'completed_payment') {
            setCurrentStep('success');
          }
        }
      } catch (error) {
        console.error('Error loading existing submission:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExistingSubmission();
  }, [submissionId, user]);

  const updateFormData = (section: keyof FormData, data: Partial<FormData[keyof FormData]>) => {
    if (section === 'submissionId') {
      setFormData(prev => ({
        ...prev,
        submissionId: data as number,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], ...data },
      }));
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep('business');
  };

  return {
    formData,
    currentStep,
    loading,
    updateFormData,
    setCurrentStep,
    resetForm,
  };
};