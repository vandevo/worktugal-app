import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Alert } from '../ui/Alert';
import { ArrowRight, ArrowLeft, CheckCircle, Upload, FileCheck } from 'lucide-react';
import { submitAccountingIntake } from '../../lib/intakes';
import { useNavigate } from 'react-router-dom';
import type { AccountingIntakeData } from '../../types/intake';

const INCOME_SOURCES = [
  { value: 'freelance', label: 'Freelance/Self-employed' },
  { value: 'employment', label: 'Employment (W2/PAYE)' },
  { value: 'rental', label: 'Rental Income' },
  { value: 'investment', label: 'Investment Income' },
  { value: 'pension', label: 'Pension' },
  { value: 'business', label: 'Business Ownership' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'other', label: 'Other' }
];

export const ComprehensiveIntakeForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<AccountingIntakeData>>({
    name: '',
    email: '',
    phone: '',
    country: '',
    residency_status: '',
    days_in_portugal: undefined,
    city: '',
    income_sources: [],
    has_nif: undefined,
    nif_number: '',
    has_niss: undefined,
    niss_number: '',
    has_iban: undefined,
    iban_number: '',
    has_vat_number: undefined,
    vat_regime: '',
    has_fiscal_representative: undefined,
    has_electronic_notifications: undefined,
    activity_opened: undefined,
    activity_code: '',
    activity_date: '',
    previous_accountant: undefined,
    accounting_software: '',
    urgency_level: 'medium',
    biggest_worry: '',
    special_notes: '',
    files: {}
  });

  const totalSteps = 4;

  const handleInputChange = (field: keyof AccountingIntakeData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (error) setError(null);
  };

  const toggleIncomeSource = (source: string) => {
    setFormData(prev => ({
      ...prev,
      income_sources: prev.income_sources?.includes(source)
        ? prev.income_sources.filter((s: string) => s !== source)
        : [...(prev.income_sources || []), source]
    }));
  };

  const handleNext = () => {
    if (step < totalSteps && isStepValid()) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid()) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const intake = await submitAccountingIntake(formData);

      // Navigate to success page with intake ID
      navigate(`/accounting/intake/success?id=${intake.id}`);
    } catch (err) {
      console.error('Error submitting intake:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit intake');
      setIsSubmitting(false);
    }
  };

  // Step 1: Personal & Contact Info
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-serif text-white mb-2">Let's start with your details</h3>
        <p className="text-gray-500 font-light text-sm">
          We'll use this to contact you about your intake.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Full Name *
        </label>
        <Input
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="John Doe"
          required
          className="bg-white/[0.02] border-white/5 font-light text-sm h-12"
        />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Email Address *
        </label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="you@example.com"
          required
          className="bg-white/[0.02] border-white/5 font-light text-sm h-12"
        />
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mt-3">
          We'll send your intake summary and next steps here
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Phone Number (Optional)
        </label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="+351 912 345 678"
          className="bg-white/[0.02] border-white/5 font-light text-sm h-12"
        />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Current Country of Residence
        </label>
        <Input
          value={formData.country}
          onChange={(e) => handleInputChange('country', e.target.value)}
          placeholder="e.g., Portugal, United States, Brazil"
          className="bg-white/[0.02] border-white/5 font-light text-sm h-12"
        />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          City in Portugal (if applicable)
        </label>
        <Input
          value={formData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          placeholder="e.g., Lisbon, Porto, Albufeira"
          className="bg-white/[0.02] border-white/5 font-light text-sm h-12"
        />
      </div>
    </div>
  );

  // Step 2: Residency & Income
  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-serif text-white mb-2">Residency & Income</h3>
        <p className="text-gray-500 font-light text-sm">
          This determines your tax obligations in Portugal.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Residency Status in Portugal *
        </label>
        <Select
          value={formData.residency_status}
          onChange={(e) => handleInputChange('residency_status', e.target.value)}
          required
          className="bg-white/[0.02] border-white/5 font-light text-sm"
        >
          <option value="">Select your status</option>
          <option value="tourist">Tourist / Short Stay</option>
          <option value="digital_nomad_visa">Digital Nomad Visa</option>
          <option value="d7_visa">D7 Visa Holder</option>
          <option value="d2_visa">D2 Visa (Entrepreneur)</option>
          <option value="resident">Tax Resident</option>
          <option value="nhr">NHR (Non-Habitual Resident)</option>
          <option value="citizen">Portuguese Citizen</option>
          <option value="other">Other</option>
        </Select>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Days in Portugal (per year) *
        </label>
        <Input
          type="number"
          value={formData.days_in_portugal || ''}
          onChange={(e) => handleInputChange('days_in_portugal', e.target.value ? parseInt(e.target.value) : undefined)}
          placeholder="e.g., 183"
          required
          min="0"
          max="365"
          className="bg-white/[0.02] border-white/5 font-light text-sm h-12"
        />
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mt-3">
          Important: 183+ days = tax resident
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Income Sources (select all that apply) *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {INCOME_SOURCES.map(source => (
            <button
              key={source.value}
              type="button"
              onClick={() => toggleIncomeSource(source.value)}
              className={`px-4 py-3 rounded-xl border transition-all text-left text-sm font-light ${
                formData.income_sources?.includes(source.value)
                  ? 'border-blue-500 bg-blue-500/10 text-white'
                  : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 ${
                  formData.income_sources?.includes(source.value)
                    ? 'border-blue-400 bg-blue-400'
                    : 'border-white/10'
                }`}>
                  {formData.income_sources?.includes(source.value) && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </div>
                <span>{source.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Step 3: Tax Registration
  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-serif text-white mb-2">Tax Registration Status</h3>
        <p className="text-gray-500 font-light text-sm">
          Tell us what you already have set up.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Do you have a Portuguese NIF (tax ID)? *
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleInputChange('has_nif', true)}
            className={`flex-1 px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.has_nif === true
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('has_nif', false)}
            className={`flex-1 px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.has_nif === false
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            No
          </button>
        </div>
      </div>

      {formData.has_nif && (
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
            NIF Number (optional)
          </label>
          <Input
            type="text"
            value={formData.nif_number}
            onChange={(e) => handleInputChange('nif_number', e.target.value)}
            placeholder="9 digits"
            maxLength={9}
            className="bg-white/[0.02] border-white/5 font-light text-sm h-12"
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Do you have a Portuguese IBAN (bank account)?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleInputChange('has_iban', true)}
            className={`flex-1 px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.has_iban === true
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('has_iban', false)}
            className={`flex-1 px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.has_iban === false
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            No
          </button>
        </div>
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mt-3">
          Required for receiving payments in Portugal
        </p>
      </div>

      {formData.has_iban && (
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
            IBAN Number (optional)
          </label>
          <Input
            type="text"
            value={formData.iban_number}
            onChange={(e) => handleInputChange('iban_number', e.target.value.toUpperCase())}
            placeholder="PT50..."
            maxLength={25}
            className="bg-white/[0.02] border-white/5 font-light text-sm h-12"
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Are you VAT registered in Portugal?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleInputChange('has_vat_number', true)}
            className={`flex-1 px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.has_vat_number === true
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('has_vat_number', false)}
            className={`flex-1 px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.has_vat_number === false
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            No
          </button>
        </div>
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mt-3">
          Required if income exceeds €15,000
        </p>
      </div>

      {formData.has_vat_number && (
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
            VAT Regime
          </label>
          <Select
            value={formData.vat_regime}
            onChange={(e) => handleInputChange('vat_regime', e.target.value)}
            className="bg-white/[0.02] border-white/5 font-light text-sm"
          >
            <option value="">Select VAT regime</option>
            <option value="normal">Normal Regime (quarterly filing)</option>
            <option value="simplified">Simplified Regime</option>
            <option value="exempt">Exempt from VAT</option>
            <option value="not_sure">Not Sure</option>
          </Select>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Do you have a fiscal representative?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleInputChange('has_fiscal_representative', true)}
            className={`flex-1 px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.has_fiscal_representative === true
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('has_fiscal_representative', false)}
            className={`flex-1 px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.has_fiscal_representative === false
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            No
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Have you opened activity at Financas?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleInputChange('activity_opened', true)}
            className={`flex-1 px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.activity_opened === true
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('activity_opened', false)}
            className={`flex-1 px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.activity_opened === false
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );

  // Step 4: Background & Urgency
  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Final Details</h3>
        <p className="text-gray-400 text-sm">
          Help us understand your situation and prioritize your intake
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Have you worked with an accountant before? *
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleInputChange('previous_accountant', true)}
            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
              formData.previous_accountant === true
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('previous_accountant', false)}
            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
              formData.previous_accountant === false
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            No
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Accounting Software Used
        </label>
        <Select
          value={formData.accounting_software}
          onChange={(e) => handleInputChange('accounting_software', e.target.value)}
        >
          <option value="">Select if applicable</option>
          <option value="none">None / Manual</option>
          <option value="excel">Excel / Sheets</option>
          <option value="invoicexpress">InvoiceXpress</option>
          <option value="moloni">Moloni</option>
          <option value="sage">Sage</option>
          <option value="quickbooks">QuickBooks</option>
          <option value="other">Other</option>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          How urgent is your situation? *
        </label>
        <Select
          value={formData.urgency_level}
          onChange={(e) => handleInputChange('urgency_level', e.target.value)}
          required
        >
          <option value="low">Low - General planning</option>
          <option value="medium">Medium - Need answer in 1-2 weeks</option>
          <option value="high">High - Deadline approaching or penalty risk</option>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          What's your biggest worry right now?
        </label>
        <textarea
          value={formData.biggest_worry}
          onChange={(e) => handleInputChange('biggest_worry', e.target.value)}
          rows={3}
          placeholder="e.g., Not sure if I'm paying enough Social Security, worried about a letter from Financas..."
          className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors duration-150 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Additional Information
        </label>
        <textarea
          value={formData.special_notes}
          onChange={(e) => handleInputChange('special_notes', e.target.value)}
          rows={4}
          placeholder="Any other details you think we should know..."
          className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors duration-150 resize-none"
        />
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <FileCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-white font-semibold mb-2">What happens next?</h4>
            <ul className="text-sm text-gray-300 space-y-1.5">
              <li>✓ We'll review your intake within 48 hours</li>
              <li>✓ You'll get a written summary of your compliance status</li>
              <li>✓ We'll email you with clear next steps</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const isStepValid = () => {
    if (step === 1) {
      return formData.name && formData.email;
    }
    if (step === 2) {
      return formData.residency_status &&
             formData.days_in_portugal !== undefined &&
             formData.income_sources &&
             formData.income_sources.length > 0;
    }
    if (step === 3) {
      return formData.has_nif !== undefined;
    }
    if (step === 4) {
      return formData.previous_accountant !== undefined && formData.urgency_level;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-obsidian py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] backdrop-blur-3xl rounded-3xl border border-white/[0.05] shadow-2xl shadow-black/30 p-8 md:p-12"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-2xl sm:text-3xl font-serif text-white mb-2">Compliance Intake</h2>
              <span className="text-xs font-light text-gray-500 uppercase tracking-widest">Step {step} of {totalSteps}</span>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                    i <= step ? 'bg-blue-500' : 'bg-white/5'
                  }`}
                />
              ))}
            </div>

            <div className="mt-4 text-xs font-light text-gray-500 uppercase tracking-widest">
              {step === 1 && 'Personal & Contact'}
              {step === 2 && 'Residency & Income'}
              {step === 3 && 'Tax Registration'}
              {step === 4 && 'Background & Urgency'}
            </div>
          </div>

          {error && (
            <Alert variant="error" className="mb-6 bg-red-500/5 border-red-500/10 text-red-400">
              {error}
            </Alert>
          )}

          {/* Form Steps */}
          <form onSubmit={(e) => e.preventDefault()}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-10">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex items-center justify-center w-full sm:w-auto order-2 sm:order-1 border-white/5 hover:bg-white/5 text-xs font-medium uppercase tracking-widest px-8"
                >
                  <ArrowLeft className="w-3 h-3 mr-2" />
                  Back
                </Button>
              )}

              <div className="hidden sm:block flex-1" />

              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex items-center justify-center w-full sm:w-auto order-1 sm:order-2 text-xs font-medium uppercase tracking-widest px-10"
                >
                  Next Step
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  size="lg"
                  className="w-full sm:w-auto order-1 sm:order-2 text-xs font-medium uppercase tracking-widest px-10"
                >
                  {isSubmitting ? 'Submitting...' : 'Complete Intake'}
                </Button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Privacy Notice */}
        <p className="text-[10px] text-gray-600 text-center mt-10 max-w-xl mx-auto uppercase tracking-[0.2em] font-medium leading-loose">
          Secure intake process. Your information is stored according to our privacy policy and used only for compliance guidance.
        </p>
      </div>
    </div>
  );
};
