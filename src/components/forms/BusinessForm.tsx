import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Building, Globe, Instagram, User, Mail, Phone, Tag } from 'lucide-react';
import { businessSchema, BusinessFormData } from '../../lib/validations';
import { BUSINESS_CATEGORIES, LISBON_NEIGHBORHOODS } from '../../utils/constants';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface BusinessFormProps {
  onSubmit: (data: BusinessFormData) => void;
  initialData?: Partial<BusinessFormData>;
}

export const BusinessForm: React.FC<BusinessFormProps> = ({ onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: initialData,
  });

  const categoryOptions = BUSINESS_CATEGORIES.map(category => ({
    value: category,
    label: category,
  }));

  const neighborhoodOptions = LISBON_NEIGHBORHOODS.map(neighborhood => ({
    value: neighborhood,
    label: neighborhood,
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
        <h2 className="text-2xl font-bold mb-2">Tell us about your business</h2>
        <p className="text-gray-400">We'll use this information to create your listing</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Business Name"
          placeholder="Your Amazing Business"
          {...register('name')}
          error={errors.name?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Website"
            placeholder="https://yourbusiness.com"
            {...register('website')}
            error={errors.website?.message}
          />
          <Input
            label="Instagram"
            placeholder="@yourbusiness"
            {...register('instagram')}
            error={errors.instagram?.message}
          />
        </div>

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
            label="Phone/WhatsApp"
            type="tel"
            placeholder="+351 912 345 678"
            {...register('phone')}
            error={errors.phone?.message}
          />
        </div>

        <Select
          label="Business Category"
          options={categoryOptions}
          {...register('category')}
          error={errors.category?.message}
        />

        <Select
          label="Neighborhood in Lisbon"
          options={neighborhoodOptions}
          {...register('neighborhood')}
          error={errors.neighborhood?.message}
        />

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