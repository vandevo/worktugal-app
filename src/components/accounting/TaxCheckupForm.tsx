import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Alert } from '../ui/Alert';
import { Seo } from '../Seo';
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
      navigate(`/checkup/results?id=${intake.id}`);
    } catch (err) {
      console.error('Error submitting checkup:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit checkup');
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Let's check your compliance status</h3>
        <p className="text-gray-400 text-sm">
          Answer a few quick questions about your work and residency
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
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
                className={`px-4 py-3 rounded-xl border-2 transition-all text-left ${
                  formData.work_type === type.value
                    ? 'border-blue-400 bg-blue-400/10 text-white'
                    : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{type.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          How many months per year are you in Portugal?
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="1"
            max="12"
            value={formData.months_in_portugal || 6}
            onChange={(e) => handleInputChange('months_in_portugal', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-400"
          />
          <div className="flex justify-between text-sm text-gray-400">
            <span>1 month</span>
            <span className="text-blue-400 font-semibold">{formData.months_in_portugal || 6} months</span>
            <span>12 months</span>
          </div>
          {(formData.months_in_portugal || 0) >= 6 && (
            <p className="text-xs text-yellow-400 mt-2">
              Note: 6+ months = tax resident (must file taxes in Portugal)
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          What's your residency status in Portugal?
        </label>
        <Select
          value={formData.residency_status}
          onChange={(e) => handleInputChange('residency_status', e.target.value)}
          required
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
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Do you have a Portuguese tax number (NIF - número de identificação fiscal)?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleInputChange('has_nif', true)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
              formData.has_nif === true
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('has_nif', false)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
              formData.has_nif === false
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            No
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('has_nif', null)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
              formData.has_nif === null
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            Not Sure
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Have you opened activity at Financas (abertura de atividade)?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleInputChange('activity_opened', true)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
              formData.activity_opened === true
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('activity_opened', false)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
              formData.activity_opened === false
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            No
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('activity_opened', null)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
              formData.activity_opened === null
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            Not Sure
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Required before you can legally issue invoices (faturas) to clients
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Income and registration</h3>
        <p className="text-gray-400 text-sm">
          Help us understand your income and compliance status
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Estimated annual income from Portuguese work
        </label>
        <Select
          value={formData.estimated_annual_income}
          onChange={(e) => handleInputChange('estimated_annual_income', e.target.value)}
          required
        >
          <option value="">Select income range</option>
          <option value="under_10k">Under €10,000</option>
          <option value="10k_25k">€10,000 - €25,000</option>
          <option value="25k_50k">€25,000 - €50,000</option>
          <option value="over_50k">Over €50,000</option>
        </Select>
        <p className="text-xs text-gray-400 mt-2">
          Important: VAT registration is mandatory over €15,000 annual income
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Are you VAT registered in Portugal?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleInputChange('has_vat_number', true)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
              formData.has_vat_number === true
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('has_vat_number', false)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
              formData.has_vat_number === false
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            No
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('has_vat_number', null)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
              formData.has_vat_number === null
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            Not Sure
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Do you have Social Security (NISS) registration?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleInputChange('has_niss', true)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
              formData.has_niss === true
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('has_niss', false)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
              formData.has_niss === false
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            No
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('has_niss', null)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
              formData.has_niss === null
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            Not Sure
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Required for self-employed work and AIMA residence permit renewal
        </p>
      </div>

      {(formData.residency_status === 'tourist' || formData.residency_status === 'digital_nomad_visa') && (
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Do you have a fiscal representative in Portugal?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleInputChange('has_fiscal_representative', true)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                formData.has_fiscal_representative === true
                  ? 'border-blue-400 bg-blue-400/10 text-white'
                  : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('has_fiscal_representative', false)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                formData.has_fiscal_representative === false
                  ? 'border-blue-400 bg-blue-400/10 text-white'
                  : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
              }`}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('has_fiscal_representative', null)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                formData.has_fiscal_representative === null
                  ? 'border-blue-400 bg-blue-400/10 text-white'
                  : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
              }`}
            >
              Not Sure
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Required for non-residents earning Portuguese-source income
          </p>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Get your compliance report</h3>
        <p className="text-gray-400 text-sm">
          You're 89% done - enter your email to see your personalized results
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-white font-semibold mb-3">What you'll get instantly</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>✓ Personalized compliance status report</li>
              <li>✓ Specific action steps ranked by priority</li>
              <li>✓ Timeline and penalty information</li>
              <li>✓ Email copy of your full report</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Email Address *
        </label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="you@example.com"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          We'll send your compliance report here. No spam.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            First Name (Optional)
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Phone (Optional)
          </label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+351 912 345 678"
          />
          <p className="text-xs text-gray-500 mt-1">
            For priority callback if urgent
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="email_consent"
          checked={formData.email_marketing_consent}
          onChange={(e) => handleInputChange('email_marketing_consent', e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-400 focus:ring-blue-400"
        />
        <label htmlFor="email_consent" className="text-sm text-gray-300 cursor-pointer">
          Send me compliance updates and tax deadline reminders (unsubscribe anytime)
        </label>
      </div>

      <div className="text-center pt-4">
        <p className="text-xs text-gray-500">
          Join 200+ professionals who checked their compliance status this month
        </p>
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
    <div className="min-h-screen bg-gray-900 py-12">
      <Seo
        title="Free Tax Compliance Checkup for Freelancers in Portugal"
        description="Take our free 3-minute tax compliance checkup. Get your score, see what you're missing, and receive a personalized action plan for staying compliant in Portugal."
        canonicalUrl="https://app.worktugal.com/checkup"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8 md:p-12"
        >
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Tax Compliance Checkup</h2>
              <span className="text-sm text-gray-400">Step {step} of {totalSteps}</span>
            </div>

            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    i <= step ? 'bg-blue-400' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-400">
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

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-10">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex items-center justify-center w-full sm:w-auto order-2 sm:order-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}

              <div className="hidden sm:block flex-1" />

              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex items-center justify-center w-full sm:w-auto order-1 sm:order-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  size="lg"
                  className="w-full sm:w-auto order-1 sm:order-2"
                >
                  {isSubmitting ? 'Analyzing...' : 'Get My Compliance Report'}
                </Button>
              )}
            </div>
          </form>
        </motion.div>

        <p className="text-xs text-gray-500 text-center mt-6 max-w-2xl mx-auto">
          Your information is securely stored and will only be used to provide compliance guidance.
          We will never share your data without your consent.
        </p>
      </div>
    </div>
  );
};
