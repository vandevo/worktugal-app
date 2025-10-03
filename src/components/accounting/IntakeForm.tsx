import { FC } from 'react';

interface IntakeFormData {
  residency_status: string;
  days_in_portugal: number | '';
  income_sources: string[];
  has_nif: boolean | null;
  nif_number: string;
  has_vat_number: boolean | null;
  vat_regime: string;
  has_fiscal_representative: boolean | null;
  has_electronic_notifications: boolean | null;
  urgency_level: string;
  accounting_software: string;
  previous_accountant: boolean | null;
  special_notes: string;
}

interface IntakeFormProps {
  onSubmit: (data: Partial<IntakeFormData>) => Promise<void>;
  onBack?: () => void;
  initialData?: Partial<IntakeFormData>;
}

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

export const IntakeForm: FC<IntakeFormProps> = ({ onSubmit, onBack, initialData }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<IntakeFormData>({
    residency_status: initialData?.residency_status || '',
    days_in_portugal: initialData?.days_in_portugal || '',
    income_sources: initialData?.income_sources || [],
    has_nif: initialData?.has_nif ?? null,
    nif_number: initialData?.nif_number || '',
    has_vat_number: initialData?.has_vat_number ?? null,
    vat_regime: initialData?.vat_regime || '',
    has_fiscal_representative: initialData?.has_fiscal_representative ?? null,
    has_electronic_notifications: initialData?.has_electronic_notifications ?? null,
    urgency_level: initialData?.urgency_level || 'medium',
    accounting_software: initialData?.accounting_software || '',
    previous_accountant: initialData?.previous_accountant ?? null,
    special_notes: initialData?.special_notes || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 3;

  const handleInputChange = (field: keyof IntakeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleIncomeSource = (source: string) => {
    setFormData(prev => ({
      ...prev,
      income_sources: prev.income_sources.includes(source)
        ? prev.income_sources.filter(s => s !== source)
        : [...prev.income_sources, source]
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Error submitting intake form:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit form');
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Residency & Location</h3>
        <p className="text-gray-400 text-sm mb-6">
          Help us understand your residency situation in Portugal
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Residency Status in Portugal *
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
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Days in Portugal (per year) *
        </label>
        <Input
          type="number"
          value={formData.days_in_portugal}
          onChange={(e) => handleInputChange('days_in_portugal', e.target.value ? parseInt(e.target.value) : '')}
          placeholder="e.g., 183"
          required
          min="0"
          max="365"
        />
        <p className="text-xs text-gray-400 mt-2">
          This helps determine your tax residency status (183+ days = tax resident)
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Income Sources (select all that apply) *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {INCOME_SOURCES.map(source => (
            <button
              key={source.value}
              type="button"
              onClick={() => toggleIncomeSource(source.value)}
              className={`px-4 py-3 rounded-xl border-2 transition-all text-left ${
                formData.income_sources.includes(source.value)
                  ? 'border-blue-400 bg-blue-400/10 text-white'
                  : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                  formData.income_sources.includes(source.value)
                    ? 'border-blue-400 bg-blue-400'
                    : 'border-gray-500'
                }`}>
                  {formData.income_sources.includes(source.value) && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm">{source.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Tax Registration</h3>
        <p className="text-gray-400 text-sm mb-6">
          Information about your Portuguese tax setup
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Do you have a Portuguese NIF (tax ID)? *
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleInputChange('has_nif', true)}
            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
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
            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
              formData.has_nif === false
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            No
          </button>
        </div>
      </div>

      {formData.has_nif && (
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            NIF Number (optional)
          </label>
          <Input
            type="text"
            value={formData.nif_number}
            onChange={(e) => handleInputChange('nif_number', e.target.value)}
            placeholder="9 digits"
            maxLength={9}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Are you VAT registered in Portugal? *
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleInputChange('has_vat_number', true)}
            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
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
            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
              formData.has_vat_number === false
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            No
          </button>
        </div>
      </div>

      {formData.has_vat_number && (
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            VAT Regime *
          </label>
          <Select
            value={formData.vat_regime}
            onChange={(e) => handleInputChange('vat_regime', e.target.value)}
            required
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
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Do you have a fiscal representative?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleInputChange('has_fiscal_representative', true)}
            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
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
            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
              formData.has_fiscal_representative === false
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            No
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Required for non-residents earning Portuguese-source income
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Have you set up electronic notifications (eFatura)?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleInputChange('has_electronic_notifications', true)}
            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
              formData.has_electronic_notifications === true
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('has_electronic_notifications', false)}
            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
              formData.has_electronic_notifications === false
                ? 'border-blue-400 bg-blue-400/10 text-white'
                : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
            }`}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Background & Urgency</h3>
        <p className="text-gray-400 text-sm mb-6">
          Help us prioritize and prepare for your consultation
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
          <option value="high">High - Deadline approaching</option>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Additional Information
        </label>
        <textarea
          value={formData.special_notes}
          onChange={(e) => handleInputChange('special_notes', e.target.value)}
          rows={4}
          placeholder="Any specific questions or concerns you'd like to address during the consultation..."
          className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors duration-150 resize-none"
        />
      </div>
    </div>
  );

  const isStepValid = () => {
    if (step === 1) {
      return formData.residency_status && formData.days_in_portugal && formData.income_sources.length > 0;
    }
    if (step === 2) {
      return formData.has_nif !== null && formData.has_vat_number !== null;
    }
    if (step === 3) {
      return formData.previous_accountant !== null && formData.urgency_level;
    }
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Intake Questionnaire</h2>
            <span className="text-sm text-gray-400">Step {step} of {totalSteps}</span>
          </div>

          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  i <= step ? 'bg-blue-400' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}

            {onBack && step === 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
              >
                Cancel
              </Button>
            )}

            <div className="flex-1" />

            {step < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Complete Intake'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
};
