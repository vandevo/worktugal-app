import React, { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Building, Globe, Instagram, User, Mail, Phone, Tag } from 'lucide-react';
import { businessSchema, BusinessFormData } from '../../lib/validations';
import { BUSINESS_CATEGORIES, LISBON_NEIGHBORHOOD_GROUPS } from '../../utils/constants';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface BusinessFormProps {
  onSubmit: (data: BusinessFormData) => void;
  initialData?: Partial<BusinessFormData>;
}

export const BusinessForm: React.FC<BusinessFormProps> = ({ onSubmit, initialData }) => {
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: '',
      website: '',
      instagram: '',
      contact_name: '',
      email: '',
      phone: '+351 ',
      category: '',
      neighborhood: '',
      ...initialData,
    },
  });

  const phoneValue = watch('phone');

  // Handle cursor positioning for phone field
  useEffect(() => {
    const handlePhoneFocus = () => {
      if (phoneInputRef.current && phoneValue === '+351 ') {
        // Set cursor position after +351 
        setTimeout(() => {
          if (phoneInputRef.current) {
            phoneInputRef.current.setSelectionRange(5, 5);
          }
        }, 0);
      }
    };

    const phoneInput = phoneInputRef.current;
    if (phoneInput) {
      phoneInput.addEventListener('focus', handlePhoneFocus);
      return () => phoneInput.removeEventListener('focus', handlePhoneFocus);
    }
  }, [phoneValue]);

  const categoryOptions = BUSINESS_CATEGORIES.map(category => ({
    value: category,
    label: category,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Building className="h-12 w-12 text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Add your business details</h2>
        <p className="text-gray-400">This info creates your live listing and helps remote clients find you</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Business Name"
          placeholder="Your Amazing Business"
          {...register('name')}
          error={errors.name?.message}
        />

        <Input
          label="Contact Name"
          placeholder="John Doe"
          {...register('contact_name')}
          error={errors.contact_name?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="john@yourbusiness.com"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            ref={phoneInputRef}
            label="Phone/WhatsApp"
            type="tel"
            placeholder="912 345 678 or +44 7700 900123"
            {...register('phone')}
            error={errors.phone?.message}
            hint="Defaults to +351 (Portugal), but you can change it to any country code."
          />
        </div>

        {/* Location & Business Type - Grouped */}
        <div className="p-4 border border-gray-700 rounded-xl bg-gray-800/50 space-y-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Business Details</h3>
          <Select
            label="Business Category"
            hint="What type of business is this?"
            options={categoryOptions}
            {...register('category')}
            error={errors.category?.message}
          />
          <Select
            label="Neighborhood"
            hint="Where is your main Lisbon location?"
            options={LISBON_NEIGHBORHOOD_GROUPS}
            {...register('neighborhood')}
            error={errors.neighborhood?.message}
          />
        </div>

        {/* Optional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Website (optional)"
            placeholder="https://yourbusiness.com"
            {...register('website')}
            error={errors.website?.message}
          />
          <Input
            label="Instagram (optional)"
            placeholder="@yourbusiness"
            {...register('instagram')}
            error={errors.instagram?.message}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isSubmitting}
        >
          Continue to Perk Details
        </Button>
      </form>
    </motion.div>
  );
};