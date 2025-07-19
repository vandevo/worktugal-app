import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Gift, Type, FileText, QrCode, Check } from 'lucide-react';
import { perkSchema, PerkFormData } from '../../lib/validations';
import { REDEMPTION_METHODS } from '../../utils/constants';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface PerkFormProps {
  onSubmit: (data: PerkFormData) => void;
  onBack: () => void;
  initialData?: Partial<PerkFormData>;
  loading?: boolean;
}

export const PerkForm: React.FC<PerkFormProps> = ({ onSubmit, onBack, initialData, loading = false }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PerkFormData>({
    resolver: zodResolver(perkSchema),
    defaultValues: initialData,
  });

  const redemptionMethod = watch('redemption_method');
  const isPortugueseOwned = watch('is_portuguese_owned');
  const needsNif = watch('needs_nif');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Gift className="h-12 w-12 text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Setup your perk</h2>
        <p className="text-gray-400">Tell us about the special offer you'll provide</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Perk Title"
          placeholder="20% off all meals"
          {...register('title')}
          error={errors.title?.message}
          hint="Keep it short and compelling"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            rows={4}
            placeholder="Describe your perk in detail. What makes it special? Any restrictions?"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-xs text-red-400">{errors.description.message}</p>
          )}
        </div>

        <Select
          label="How will customers redeem this perk?"
          options={REDEMPTION_METHODS}
          {...register('redemption_method')}
          error={errors.redemption_method?.message}
        />

        <Input
          label="Redemption Details"
          placeholder={
            redemptionMethod === 'promo_code' 
              ? 'Enter the promo code' 
              : redemptionMethod === 'verbal'
              ? 'What should customers say?'
              : 'How do customers redeem this perk?'
          }
          {...register('redemption_details')}
          error={errors.redemption_details?.message}
        />

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setValue('is_portuguese_owned', !isPortugueseOwned)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                isPortugueseOwned ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  isPortugueseOwned ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <label htmlFor="portuguese_owned" className="text-sm text-gray-300">
              This is a Portuguese-owned business
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setValue('needs_nif', !needsNif)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                needsNif ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  needsNif ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <label htmlFor="needs_nif" className="text-sm text-gray-300">
              I need Fatura com NIF for transactions
            </label>
          </div>
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
            type="submit"
            size="lg"
            className="flex-1"
            loading={isSubmitting || loading}
          >
            {loading ? 'Saving...' : 'Continue to Payment'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};