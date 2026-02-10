import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Alert } from '../ui/Alert';
import { Seo } from '../Seo';
import { trackCheckupCompletion } from '../../lib/analytics';
import {
  ArrowRight,
  ArrowLeft,
  Code,
  Palette,
  Users,
  PenTool,
  Camera,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Heart,
  MoreHorizontal,
  CheckCircle
} from 'lucide-react';
import { submitTaxCheckup, type TaxCheckupFormData } from '../../lib/taxCheckup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getConditionalHelperText, FEATURE_FLAGS } from '../../utils/taxCheckupEnhancements';

const WORK_TYPES = [
  { value: 'developer', label: 'Software Developer', icon: Code },
  { value: 'designer', label: 'Designer', icon: Palette },
  { value: 'consultant', label: 'Consultant', icon: Users },
  { value: 'content_creator', label: 'Content Creator', icon: PenTool },
  { value: 'photographer', label: 'Photographer', icon: Camera },
  { value: 'marketing', label: 'Marketing', icon: TrendingUp },
  { value: 'business_owner', label: 'Business Owner', icon: Briefcase },
  { value: 'teacher', label: 'Teacher/Educator', icon: GraduationCap },
  { value: 'healthcare', label: 'Healthcare', icon: Heart },
  { value: 'other', label: 'Other', icon: MoreHorizontal }
];

export const TaxCheckupForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<TaxCheckupFormData>>({
    work_type: '',
    months_in_portugal: 6,
    residency_status: '',
    has_nif: undefined,
    activity_opened: undefined,
    estimated_annual_income: '',
    has_vat_number: undefined,
    has_niss: undefined,
    has_fiscal_representative: undefined,
    email: '',
    name: '',
    phone: '',
    email_marketing_consent: false,
    interested_in_accounting_services: false,
    utm_source: searchParams.get('utm_source') || undefined,
    utm_campaign: searchParams.get('utm_campaign') || undefined,
    utm_medium: searchParams.get('utm_medium') || undefined
  });

  const totalSteps = 3;

  const handleInputChange = (field: keyof TaxCheckupFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
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
      const { intake, scores } = await submitTaxCheckup(formData as TaxCheckupFormData);
      trackCheckupCompletion(scores.overall_score);
      navigate(`/checkup/results?id=${intake.id}`);
    } catch (err) {
      console.error('Error submitting checkup:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit checkup');
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-serif text-white mb-2">Check your readiness</h3>
        <p className="text-gray-500 font-light text-sm">
          Answer a few quick questions about your work and residency.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          What type of work do you do in Portugal?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {WORK_TYPES.map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange('work_type', type.value)}
                className={`px-4 py-4 rounded-xl border transition-all text-left group ${
                  formData.work_type === type.value
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${formData.work_type === type.value ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'}`} />
                  <span className="text-sm font-light">{type.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          How many months per year are you in Portugal?
        </label>
        <div className="space-y-4">
          <input
            type="range"
            min="1"
            max="12"
            value={formData.months_in_portugal || 6}
            onChange={(e) => handleInputChange('months_in_portugal', parseInt(e.target.value))}
            className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs font-light text-gray-500">
            <span>1 month</span>
            <span className="text-blue-400 font-medium">{formData.months_in_portugal || 6} months</span>
            <span>12 months</span>
          </div>
          {(formData.months_in_portugal || 0) >= 6 && (
            <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
              <p className="text-[11px] text-blue-300 font-light">
                <span className="font-medium">Note:</span> 6+ months typically triggers tax residency.
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Residency status
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
          Do you have a Portuguese tax number (NIF)?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleInputChange('has_nif', true)}
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-light ${
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
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.has_nif === false
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            No
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('has_nif', null)}
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.has_nif === null
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            Not Sure
          </button>
        </div>
        {FEATURE_FLAGS.useConditionalHelpers && getConditionalHelperText('has_nif', formData) && (
          <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
            <p className="text-[11px] text-blue-300 font-light leading-relaxed">
              {getConditionalHelperText('has_nif', formData)}
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Have you opened activity at Finanças?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleInputChange('activity_opened', true)}
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-light ${
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
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.activity_opened === false
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            No
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('activity_opened', null)}
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.activity_opened === null
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            Not Sure
          </button>
        </div>
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mt-3">
          Required to issue legal invoices
        </p>
        {FEATURE_FLAGS.useConditionalHelpers && getConditionalHelperText('activity_opened', formData) && (
          <div className="mt-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
            <p className="text-[11px] text-yellow-300 font-light leading-relaxed">
              {getConditionalHelperText('activity_opened', formData)}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-serif text-white mb-2">Income and registration</h3>
        <p className="text-gray-500 font-light text-sm">
          Help us understand your income and compliance status.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Estimated annual income from work
        </label>
        <Select
          value={formData.estimated_annual_income}
          onChange={(e) => handleInputChange('estimated_annual_income', e.target.value)}
          required
          className="bg-white/[0.02] border-white/5 font-light text-sm"
        >
          <option value="">Select income range</option>
          <option value="under_10k">Under €10,000</option>
          <option value="10k_25k">€10,000 - €25,000</option>
          <option value="25k_50k">€25,000 - €50,000</option>
          <option value="over_50k">Over €50,000</option>
        </Select>
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mt-3">
          VAT registration is mandatory over €15,000
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Are you VAT registered in Portugal?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleInputChange('has_vat_number', true)}
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-light ${
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
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.has_vat_number === false
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            No
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('has_vat_number', null)}
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.has_vat_number === null
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            Not Sure
          </button>
        </div>
        {FEATURE_FLAGS.useConditionalHelpers && getConditionalHelperText('has_vat_number', formData) && (
          <div className="mt-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
            <p className="text-[11px] text-yellow-300 font-light leading-relaxed">
              {getConditionalHelperText('has_vat_number', formData)}
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
          Do you have Social Security (NISS) registration?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleInputChange('has_niss', true)}
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.has_niss === true
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('has_niss', false)}
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.has_niss === false
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            No
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('has_niss', null)}
            className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-light ${
              formData.has_niss === null
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            Not Sure
          </button>
        </div>
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mt-3">
          Required for residence permit renewal
        </p>
        {FEATURE_FLAGS.useConditionalHelpers && getConditionalHelperText('has_niss', formData) && (
          <div className="mt-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
            <p className="text-[11px] text-yellow-300 font-light leading-relaxed">
              {getConditionalHelperText('has_niss', formData)}
            </p>
          </div>
        )}
      </div>

      {(formData.residency_status === 'tourist' || formData.residency_status === 'digital_nomad_visa') && (
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
            Do you have a fiscal representative?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleInputChange('has_fiscal_representative', true)}
              className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-light ${
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
              className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-light ${
                formData.has_fiscal_representative === false
                  ? 'border-blue-500 bg-blue-500/10 text-white'
                  : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
              }`}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('has_fiscal_representative', null)}
              className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-light ${
                formData.has_fiscal_representative === null
                  ? 'border-blue-500 bg-blue-500/10 text-white'
                  : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
              }`}
            >
              Not Sure
            </button>
          </div>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mt-3">
            Required for non-residents
          </p>
          {FEATURE_FLAGS.useConditionalHelpers && getConditionalHelperText('has_fiscal_representative', formData) && (
            <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
              <p className="text-[11px] text-blue-300 font-light leading-relaxed">
                {getConditionalHelperText('has_fiscal_representative', formData)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-serif text-white mb-2">Final Step</h3>
        <p className="text-gray-500 font-light text-sm">
          You're almost done. Enter your email to receive your report.
        </p>
      </div>

      <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <CheckCircle className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium mb-3">Included in your report</h4>
            <ul className="text-sm text-gray-500 space-y-3 font-light">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-500/50" />
                Personalized readiness assessment
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-500/50" />
                Prioritized action steps
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-500/50" />
                Penalty risk evaluation
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-6">
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
            We'll send your readiness report here
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
              First Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="John"
              className="bg-white/[0.02] border-white/5 font-light text-sm h-12"
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
              Phone
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+351 9..."
              className="bg-white/[0.02] border-white/5 font-light text-sm h-12"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-start gap-4">
            <div className="relative flex items-center h-5">
              <input
                type="checkbox"
                id="email_consent"
                checked={formData.email_marketing_consent}
                onChange={(e) => handleInputChange('email_marketing_consent', e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
            </div>
            <label htmlFor="email_consent" className="text-xs text-gray-500 cursor-pointer select-none font-light leading-relaxed">
              Send me compliance updates and tax deadline reminders.
            </label>
          </div>

          <div className="flex items-start gap-4">
            <div className="relative flex items-center h-5">
              <input
                type="checkbox"
                id="accounting_services_interest"
                checked={formData.interested_in_accounting_services}
                onChange={(e) => handleInputChange('interested_in_accounting_services', e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
            </div>
            <label htmlFor="accounting_services_interest" className="text-xs text-gray-500 cursor-pointer select-none font-light leading-relaxed">
              Keep me updated on available accounting partners.
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const isStepValid = () => {
    if (step === 1) {
      return formData.work_type &&
             formData.months_in_portugal !== undefined &&
             formData.residency_status &&
             formData.has_nif !== undefined &&
             formData.activity_opened !== undefined;
    }
    if (step === 2) {
      return formData.estimated_annual_income &&
             formData.has_vat_number !== undefined &&
             formData.has_niss !== undefined;
    }
    if (step === 3) {
      return formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-obsidian py-12">
      <Seo
        title="Free tax compliance checkup: identify your risks"
        description="Check your tax compliance status in 3 minutes. Avoid surprise fines and protect your residence permit with our free diagnostic."
        canonicalUrl="https://app.worktugal.com/checkup"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] backdrop-blur-3xl rounded-3xl border border-white/[0.05] shadow-2xl shadow-black/30 p-8 md:p-12"
        >
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-2xl sm:text-3xl font-serif text-white mb-2">Compliance Readiness Checkup</h2>
              <span className="text-xs font-light text-gray-500 uppercase tracking-widest">Step {step} of {totalSteps}</span>
            </div>

            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                    i <= step ? 'bg-blue-500' : 'bg-white/5'
                  }`}
                />
              ))}
            </div>

            <div className="mt-4 text-xs font-light text-gray-500 uppercase tracking-widest">
              {step === 1 && 'Work & Residency'}
              {step === 2 && 'Income & Registration'}
              {step === 3 && 'Get Your Report'}
            </div>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

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
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-12">
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
                  {isSubmitting ? 'Analyzing...' : 'Generate Report'}
                </Button>
              )}
            </div>
          </form>
        </motion.div>

        <p className="text-[10px] text-gray-600 text-center mt-10 max-w-xl mx-auto uppercase tracking-[0.2em] font-medium leading-loose">
          Secure readiness assessment. Data is handled according to our privacy policy and will only be used for compliance guidance.
        </p>
      </div>
    </div>
  );
};
