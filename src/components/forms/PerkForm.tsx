import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Gift, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { perkSchema, PerkFormData } from '../../lib/validations';
import { REDEMPTION_METHODS } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { AuthModal } from '../auth/AuthModal';
import { Alert } from '../ui/Alert';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { FileUpload } from '../ui/FileUpload';
import { Card } from '../ui/Card';

interface PerkFormProps {
  onSubmit: (data: PerkFormData) => void;
  onBack: () => void;
  initialData?: Partial<PerkFormData>;
}

export const PerkForm: React.FC<PerkFormProps> = ({ onSubmit, onBack, initialData }) => {
  const [showImageFields, setShowImageFields] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<PerkFormData>({
    resolver: zodResolver(perkSchema),
    defaultValues: initialData,
  });

  const redemptionMethod = watch('redemption_method');
  const redemptionDetails = watch('redemption_details');
  const isPortugueseOwned = watch('is_portuguese_owned');
  const needsNif = watch('needs_nif');
  const customerNif = watch('customer_nif');
  const images = watch('images') || [];
  const logo = watch('logo');

  // Move standardPlaceholders outside to prevent useEffect from running unnecessarily
  const standardPlaceholders = useMemo(() => [
    'Just mention you have Worktugal Pass at checkout.',
    'Show your digital Worktugal Pass when ordering.',
    'Use code WORKTUGAL10 during checkout.',
    'Scan the QR code displayed at your counter.',
    'Describe how the perk will be redeemed.',
    'How do customers redeem this perk?',
    ''
  ], []);

  // Dynamic placeholder text and pre-fill logic
  const getPlaceholderText = (method: string) => {
    switch (method) {
      case 'verbal':
        return 'Just mention you have Worktugal Pass at checkout.';
      case 'show_pass':
        return 'Show your digital Worktugal Pass when ordering.';
      case 'promo_code':
        return 'Use code WORKTUGAL10 during checkout.';
      case 'qr_code':
        return 'Scan the QR code displayed at your counter.';
      case 'direct_link':
        return 'Click claim perk to see your exclusive deals. https://your-deals-page.com/worktugal';
      case 'other':
        return 'Describe how the perk will be redeemed.';
      default:
        return 'How do customers redeem this perk?';
    }
  };

  // Update redemption details when method changes
  useEffect(() => {
    if (redemptionMethod) {
      const placeholderText = getPlaceholderText(redemptionMethod);
      
      // For 'other' method, only set placeholder if field is completely empty
      // For other methods, auto-update if current value is empty or standard placeholder
      const shouldUpdate = redemptionMethod === 'other' 
        ? !redemptionDetails || redemptionDetails === ''
        : (!redemptionDetails || standardPlaceholders.includes(redemptionDetails));
        
      if (shouldUpdate) {
        setValue('redemption_details', placeholderText);
      }
    }
  }, [redemptionMethod, setValue, standardPlaceholders]);

  const addImage = () => {
    const currentImages = getValues('images') || [];
    if (currentImages.length < 3) {
      setValue('images', [...currentImages, '']);
    }
  };

  const removeImage = (index: number) => {
    const currentImages = getValues('images') || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    setValue('images', newImages);
  };

  const updateImage = (index: number, url: string) => {
    const currentImages = getValues('images') || [];
    const newImages = [...currentImages];
    newImages[index] = url;
    setValue('images', newImages);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-400/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-400/20 shadow-lg">
          <Gift className="h-8 w-8 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Setup your perk</h2>
        <p className="text-gray-400">Tell us about the special offer you'll provide</p>
      </div>

      <Card variant="glass" className="p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Auth warning for image uploads */}
        {showImageFields && !user && (
          <Alert variant="info" className="mb-6">
            <strong>Sign in required for image uploads</strong><br />
            You can continue without images, or sign in to add photos to your perk listing.
          </Alert>
        )}

        {/* Core Perk Details - Top Priority */}
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
            className="w-full px-4 py-3 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/40 hover:bg-white/[0.03] transition-all duration-300 resize-none shadow-lg"
            rows={4}
            placeholder="Describe your perk in detail. What makes it special? Any restrictions?"
            {...register('description')}
          />
          <p className="text-xs text-gray-500">
            e.g., "Enjoy 20% off all food items, valid for dine-in only. Not combinable with other offers."
          </p>
          {errors.description && (
            <p className="text-xs text-red-400">{errors.description.message}</p>
          )}
        </div>

        {/* Redemption Method */}
        <Select
          label="How will customers redeem this perk?"
          hint="Choose the simplest way your staff can recognize a Worktugal member."
          options={REDEMPTION_METHODS}
          {...register('redemption_method')}
          error={errors.redemption_method?.message}
        />

        {redemptionMethod === 'direct_link' ? (
          <div className="space-y-4">
            <Input
              label="Perk Landing Page URL"
              type="url"
              placeholder="https://your-website.com/worktugal-deals"
              {...register('perk_url')}
              error={errors.perk_url?.message}
              hint="Direct link where customers can view and claim your perk"
            />
            <Input
              label="Instructions for Customers"
              placeholder="Click claim perk to see the latest member deals and exclusive offers."
              {...register('redemption_details')}
              error={errors.redemption_details?.message}
              hint="Friendly text explaining what happens when they click the link"
            />
          </div>
        ) : (
          <Input
            label="Redemption Details"
            placeholder={getPlaceholderText(redemptionMethod)}
            readOnly={redemptionMethod === 'verbal' || redemptionMethod === 'show_pass'}
            {...register('redemption_details')}
            error={errors.redemption_details?.message}
            hint={redemptionMethod === 'verbal' || redemptionMethod === 'show_pass' 
              ? "This is automatically set based on your selection above" 
              : "Provide specific details for your redemption method"}
          />
        )}

        {/* Optional Image/Logo Fields */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setShowImageFields(!showImageFields)}
              aria-label="Toggle image and logo upload fields"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                showImageFields ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  showImageFields ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <label className="text-sm text-gray-300 flex items-center space-x-2">
              <ImageIcon className="h-4 w-4" />
              <span>Add images or logo to your perk?</span>
            </label>
          </div>

          {showImageFields && (
            <div className="space-y-6 p-6 border border-white/[0.06] rounded-2xl bg-white/[0.02] backdrop-blur-xl">
              <FileUpload
                label="Business Logo (optional)"
                hint="Upload your business logo to make your perk more recognizable"
                value={logo}
                onChange={(url) => setValue('logo', url)}
                onClear={() => setValue('logo', '')}
                folder="business-logos"
                variant="logo"
                disabled={!user}
                onAuthRequired={() => setShowAuthModal(true)}
              />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-300">
                    Perk Images (optional)
                  </h4>
                  {images.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addImage}
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Image
                    </Button>
                  )}
                </div>
                
                {images.length > 0 && (
                  <div className="space-y-4">
                    {images.map((imageUrl, index) => (
                      <Card key={index} variant="frosted" className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-400">
                            Image {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeImage(index);
                            }}
                            className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                            aria-label={`Remove image ${index + 1}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <FileUpload
                          value={imageUrl}
                          onChange={(url) => updateImage(index, url)}
                          onClear={() => updateImage(index, '')}
                          folder="perk-images"
                          variant="image"
                          disabled={!user}
                          onAuthRequired={() => setShowAuthModal(true)}
                        />
                      </Card>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-gray-500">
                  Upload up to 3 images that showcase your perk or business atmosphere. Drag and drop multiple files or click to browse.
                </p>
            </div>
            </div>
          )}
        </div>

        {/* Business Characteristics */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setValue('is_portuguese_owned', !isPortugueseOwned)}
              aria-label="Mark as Portuguese-owned business"
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
              aria-label="Toggle requirement for NIF number"
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
            <div className="flex-1">
              <label htmlFor="needs_nif" className="text-sm text-gray-300 block">
                I need a legal invoice with my full tax information (Fatura or Recibo Verde)
              </label>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                For freelancers, companies, or anyone who needs a tax-deductible invoice in Portugal
              </p>
            </div>
          </div>

          {/* Conditional Tax Information Inputs */}
          {needsNif && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-6 border border-white/[0.06] rounded-2xl bg-white/[0.02] backdrop-blur-xl space-y-6"
            >
              <div className="mb-3">
                <h4 className="text-base font-semibold text-gray-200 mb-3">Customer Tax Information</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  We'll include this info in your official Fatura or Recibo Verde, as required by law.
                </p>
              </div>
              
              <Input
                label="Full Name or Company Name"
                placeholder="João Silva or ACME Lda"
                {...register('customer_name')}
                error={errors.customer_name?.message}
                hint="Name or company name for the tax invoice"
              />
              
              <Input
                label="NIF / VAT Number"
                placeholder="123456789"
                type="tel"
                inputMode="numeric"
                maxLength={9}
                pattern="[0-9]{9}"
                {...register('customer_nif')}
                error={errors.customer_nif?.message}
                hint="Enter your 9-digit Portuguese tax ID"
              />
            </motion.div>
          )}
        </div>

        <div className="flex space-x-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onBack}
            className="flex-1 rounded-2xl h-14"
          >
            Back
          </Button>
          <Button
            type="submit"
            size="lg"
            className="flex-1 rounded-2xl h-14 font-semibold"
            loading={isSubmitting}
          >
            Continue to Payment
          </Button>
        </div>
      </form>
      </Card>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signup"
      />
    </motion.div>
  );
};