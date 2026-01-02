import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Alert } from '../ui/Alert';
import {
  ArrowRight,
  ArrowLeft,
  Save,
  CheckCircle,
  Home,
  Briefcase,
  FileText,
  Calendar,
  Globe,
  Users,
  MessageSquare
} from 'lucide-react';
import {
  type ComplianceIntakeFormData,
  updateReviewByToken,
  calculateEscalationFlags,
  calculateAmbiguityScore
} from '../../lib/paidComplianceReviews';

interface PaidReviewIntakeFormProps {
  accessToken: string;
  initialData?: Partial<ComplianceIntakeFormData>;
  initialProgress?: { sections_completed: string[] };
  onComplete: () => void;
}

const SECTIONS = [
  { id: 'residency', title: 'Residency & Intent', icon: Home },
  { id: 'activity', title: 'Activity & Income', icon: Briefcase },
  { id: 'registration', title: 'Registration Status', icon: FileText },
  { id: 'timing', title: 'Timing & Dates', icon: Calendar },
  { id: 'crossborder', title: 'Cross-Border Exposure', icon: Globe },
  { id: 'remote', title: 'Remote Work & Dependency', icon: Users },
  { id: 'context', title: 'Additional Context', icon: MessageSquare }
];

export const PaidReviewIntakeForm: React.FC<PaidReviewIntakeFormProps> = ({
  accessToken,
  initialData = {},
  initialProgress = { sections_completed: [] },
  onComplete
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Partial<ComplianceIntakeFormData>>(initialData);
  const [progress, setProgress] = useState(initialProgress);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ComplianceIntakeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const saveProgress = useCallback(async (newProgress?: { sections_completed: string[] }) => {
    setIsSaving(true);
    try {
      const progressToSave = newProgress || progress;
      await updateReviewByToken(accessToken, formData, progressToSave);
      setLastSaved(new Date());
      if (newProgress) setProgress(newProgress);
    } catch (err) {
      console.error('Error saving progress:', err);
    } finally {
      setIsSaving(false);
    }
  }, [accessToken, formData, progress]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(formData).length > 0) {
        saveProgress();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [saveProgress, formData]);

  const handleNextSection = async () => {
    const sectionId = SECTIONS[currentSection].id;
    const newProgress = {
      sections_completed: [...new Set([...progress.sections_completed, sectionId])]
    };
    await saveProgress(newProgress);

    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const escalationFlags = calculateEscalationFlags(formData);
      const ambiguityScore = calculateAmbiguityScore(formData);
      const finalProgress = { sections_completed: SECTIONS.map(s => s.id) };

      await updateReviewByToken(
        accessToken,
        formData,
        finalProgress,
        'submitted',
        escalationFlags,
        ambiguityScore
      );

      onComplete();
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit form');
      setIsSubmitting(false);
    }
  };

  const renderOptionButton = (
    field: keyof ComplianceIntakeFormData,
    value: string,
    label: string
  ) => (
    <button
      type="button"
      onClick={() => handleInputChange(field, value)}
      className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-left ${
        formData[field] === value
          ? 'border-blue-400 bg-blue-400/10 text-white'
          : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
      }`}
    >
      {label}
    </button>
  );

  const renderSection1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          1. When did you arrive (or plan to arrive) in Portugal with the intention of residing?
        </label>
        <Input
          type="date"
          value={formData.arrival_date || ''}
          onChange={(e) => handleInputChange('arrival_date', e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-2">This starts the 183-day count for tax residency</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          2. What is your intended duration of stay in Portugal?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {renderOptionButton('intended_duration', 'less_than_183_days', 'Less than 183 days')}
          {renderOptionButton('intended_duration', '183_days_or_more', '183 days or more')}
          {renderOptionButton('intended_duration', 'permanent', 'Permanent / Indefinite')}
          {renderOptionButton('intended_duration', 'not_sure', 'Not sure yet')}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          3. Do you have accommodation available in Portugal?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {renderOptionButton('accommodation_type', 'own_property', 'Own property')}
          {renderOptionButton('accommodation_type', 'long_term_lease', 'Long-term lease (6+ months)')}
          {renderOptionButton('accommodation_type', 'short_term_rental', 'Short-term rental / Airbnb')}
          {renderOptionButton('accommodation_type', 'no_accommodation', 'No accommodation yet')}
        </div>
      </div>

      {(formData.accommodation_type === 'long_term_lease' || formData.accommodation_type === 'own_property') && (
        <>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              4. When did your lease or ownership start?
            </label>
            <Input
              type="date"
              value={formData.lease_start_date || ''}
              onChange={(e) => handleInputChange('lease_start_date', e.target.value)}
            />
            <p className="text-xs text-yellow-400 mt-2">Important: This can trigger "habitual abode" residency from day one</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              5. What is the term of your lease?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderOptionButton('lease_term_months', 'less_than_6', 'Less than 6 months')}
              {renderOptionButton('lease_term_months', '6_to_12', '6 to 12 months')}
              {renderOptionButton('lease_term_months', 'over_12', 'Over 12 months')}
              {renderOptionButton('lease_term_months', 'indefinite', 'Indefinite / Owned')}
            </div>
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          {formData.accommodation_type === 'long_term_lease' || formData.accommodation_type === 'own_property' ? '6' : '4'}. Where were you a tax resident in the last 5 years? (Select all that apply)
        </label>
        <Select
          value={formData.previous_tax_residency?.[0] || ''}
          onChange={(e) => handleInputChange('previous_tax_residency', [e.target.value])}
        >
          <option value="">Select primary country</option>
          <option value="portugal">Portugal</option>
          <option value="usa">United States</option>
          <option value="uk">United Kingdom</option>
          <option value="germany">Germany</option>
          <option value="france">France</option>
          <option value="netherlands">Netherlands</option>
          <option value="spain">Spain</option>
          <option value="other_eu">Other EU country</option>
          <option value="other_non_eu">Other non-EU country</option>
          <option value="multiple">Multiple countries</option>
        </Select>
        <p className="text-xs text-gray-500 mt-2">NHR/IFICI requires no Portuguese residency in prior 5 years</p>
      </div>
    </div>
  );

  const renderSection2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          7. What type of professional activity do you do?
        </label>
        <Select
          value={formData.work_type || ''}
          onChange={(e) => handleInputChange('work_type', e.target.value)}
        >
          <option value="">Select activity type</option>
          <option value="software_dev">Software Development</option>
          <option value="consulting">Consulting / Advisory</option>
          <option value="design">Design / Creative</option>
          <option value="marketing">Marketing / Communications</option>
          <option value="content_creation">Content Creation</option>
          <option value="teaching">Teaching / Education</option>
          <option value="healthcare">Healthcare</option>
          <option value="legal_financial">Legal / Financial Services</option>
          <option value="other">Other</option>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          8. Where are your clients located?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {renderOptionButton('client_location', 'portugal_only', 'Portugal only')}
          {renderOptionButton('client_location', 'eu_only', 'EU only (no Portugal)')}
          {renderOptionButton('client_location', 'non_eu_only', 'Non-EU only')}
          {renderOptionButton('client_location', 'mixed', 'Mix of locations')}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          9. Are your clients businesses (B2B) or consumers (B2C)?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {renderOptionButton('client_type', 'b2b_only', 'B2B only (businesses)')}
          {renderOptionButton('client_type', 'b2c_only', 'B2C only (consumers)')}
          {renderOptionButton('client_type', 'b2c_eu', 'B2C to EU consumers')}
          {renderOptionButton('client_type', 'mixed_high_volume', 'Mixed / High volume')}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          10. What is your estimated annual turnover from this activity?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {renderOptionButton('estimated_annual_turnover', 'under_15k', 'Under 15,000 EUR')}
          {renderOptionButton('estimated_annual_turnover', '15k_25k', '15,000 - 25,000 EUR')}
          {renderOptionButton('estimated_annual_turnover', '25k_50k', '25,000 - 50,000 EUR')}
          {renderOptionButton('estimated_annual_turnover', 'over_50k', 'Over 50,000 EUR')}
        </div>
        <p className="text-xs text-yellow-400 mt-2">VAT registration is mandatory over 15,000 EUR</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          11. Do you have other income types? (Select all that apply)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['investments', 'rental', 'pension', 'employment', 'crypto', 'none'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => {
                const current = formData.other_income_types || [];
                const updated = current.includes(type)
                  ? current.filter(t => t !== type)
                  : [...current, type];
                handleInputChange('other_income_types', updated);
              }}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-left ${
                (formData.other_income_types || []).includes(type)
                  ? 'border-blue-400 bg-blue-400/10 text-white'
                  : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-white/[0.15]'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          12. Have you bought, sold, or traded cryptocurrency since 2023?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {renderOptionButton('crypto_activity', 'no', 'No crypto activity')}
          {renderOptionButton('crypto_activity', 'holding_only', 'Holding only (no sales)')}
          {renderOptionButton('crypto_activity', 'occasional', 'Occasional trades')}
          {renderOptionButton('crypto_activity', 'active_trading', 'Active / Frequent trading')}
        </div>
        <p className="text-xs text-yellow-400 mt-2">Since 2023: gains from crypto held less than 365 days are taxed at 28%</p>
      </div>
    </div>
  );

  const renderSection3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          13. Do you have a Portuguese NIF (tax number)?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {renderOptionButton('nif_status', 'yes', 'Yes')}
          {renderOptionButton('nif_status', 'no', 'No')}
          {renderOptionButton('nif_status', 'not_sure', 'Not sure')}
        </div>
      </div>

      {formData.nif_status === 'yes' && (
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            14. Is your NIF registered to a Portuguese address or a foreign address?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {renderOptionButton('nif_address_type', 'portuguese', 'Portuguese address (resident)')}
            {renderOptionButton('nif_address_type', 'foreign', 'Foreign address (non-resident)')}
            {renderOptionButton('nif_address_type', 'not_sure', 'Not sure')}
          </div>
          <p className="text-xs text-yellow-400 mt-2">NIF address creates presumption of residency. Must update within 60 days of moving.</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          15. Have you registered self-employment at Financas (abertura de atividade)?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {renderOptionButton('self_employment_registered', 'yes', 'Yes')}
          {renderOptionButton('self_employment_registered', 'no', 'No')}
          {renderOptionButton('self_employment_registered', 'not_sure', 'Not sure')}
        </div>
      </div>

      {formData.self_employment_registered === 'yes' && (
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            16. When did you open activity?
          </label>
          <Input
            type="date"
            value={formData.activity_start_date || ''}
            onChange={(e) => handleInputChange('activity_start_date', e.target.value)}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          17. Are you VAT registered in Portugal?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {renderOptionButton('vat_registration_status', 'yes', 'Yes, VAT registered')}
          {renderOptionButton('vat_registration_status', 'no', 'No, using Article 53 exemption')}
          {renderOptionButton('vat_registration_status', 'not_applicable', 'Not applicable / No activity yet')}
          {renderOptionButton('vat_registration_status', 'not_sure', 'Not sure')}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          18. Are you registered with Portuguese Social Security (NISS)?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {renderOptionButton('social_security_registered', 'yes', 'Yes')}
          {renderOptionButton('social_security_registered', 'no', 'No')}
          {renderOptionButton('social_security_registered', 'not_sure', 'Not sure')}
        </div>
      </div>
    </div>
  );

  const renderSection4 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          19. Have you applied for or received NHR or IFICI status?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {renderOptionButton('nhr_ifici_applied', 'nhr_active', 'Yes, NHR active')}
          {renderOptionButton('nhr_ifici_applied', 'ifici_applied', 'Applied for IFICI')}
          {renderOptionButton('nhr_ifici_applied', 'not_applied', 'Not applied')}
          {renderOptionButton('nhr_ifici_applied', 'not_eligible', 'Not eligible')}
          {renderOptionButton('nhr_ifici_applied', 'not_sure', 'Not sure')}
        </div>
        <p className="text-xs text-gray-500 mt-2">NHR closed Jan 1, 2024. IFICI has stricter eligibility.</p>
      </div>

      {(formData.nhr_ifici_applied === 'nhr_active' || formData.nhr_ifici_applied === 'ifici_applied') && (
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            20. When did you apply?
          </label>
          <Input
            type="date"
            value={formData.nhr_ifici_application_date || ''}
            onChange={(e) => handleInputChange('nhr_ifici_application_date', e.target.value)}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          21. If registered for Social Security, have you filed all quarterly declarations?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {renderOptionButton('quarterly_declarations_filed', 'yes', 'Yes, all filed')}
          {renderOptionButton('quarterly_declarations_filed', 'no', 'No / Missed some')}
          {renderOptionButton('quarterly_declarations_filed', 'not_applicable', 'Not registered yet')}
          {renderOptionButton('quarterly_declarations_filed', 'not_sure', 'Not sure')}
        </div>
        <p className="text-xs text-red-400 mt-2">Missing declarations can void your 12-month exemption</p>
      </div>
    </div>
  );

  const renderSection5 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          22. Are you claiming tax residency in any other country simultaneously?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {renderOptionButton('other_tax_residencies', 'yes', 'Yes')}
          {renderOptionButton('other_tax_residencies', 'no', 'No')}
          {renderOptionButton('other_tax_residencies', 'not_sure', 'Not sure')}
        </div>
        <p className="text-xs text-yellow-400 mt-2">Dual residency requires DTA tie-breaker analysis - professional review needed</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          23. Do you have an A1 certificate for social security coordination?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {renderOptionButton('a1_certificate_status', 'yes', 'Yes, valid A1')}
          {renderOptionButton('a1_certificate_status', 'no', 'No A1 certificate')}
          {renderOptionButton('a1_certificate_status', 'expired', 'A1 expired')}
          {renderOptionButton('a1_certificate_status', 'not_applicable', 'Not applicable (non-EU)')}
          {renderOptionButton('a1_certificate_status', 'not_sure', 'Not sure')}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          24. Are you currently paying social security contributions in another country?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {renderOptionButton('foreign_social_security', 'yes', 'Yes')}
          {renderOptionButton('foreign_social_security', 'no', 'No')}
          {renderOptionButton('foreign_social_security', 'not_sure', 'Not sure')}
        </div>
        <p className="text-xs text-yellow-400 mt-2">Without A1, you may be obligated to pay in both countries</p>
      </div>
    </div>
  );

  const renderSection6 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          25. Do more than 80% of your income come from a single client?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {renderOptionButton('single_client_dependency', 'yes_over_80', 'Yes, over 80% from one client')}
          {renderOptionButton('single_client_dependency', 'yes_50_80', 'Yes, 50-80% from one client')}
          {renderOptionButton('single_client_dependency', 'no_multiple', 'No, multiple clients')}
          {renderOptionButton('single_client_dependency', 'not_sure', 'Not sure')}
        </div>
        <p className="text-xs text-yellow-400 mt-2">High single-client dependency may trigger employee misclassification risk</p>
      </div>
    </div>
  );

  const renderSection7 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          26. Is there anything else about your situation we should know?
        </label>
        <textarea
          value={formData.additional_context || ''}
          onChange={(e) => handleInputChange('additional_context', e.target.value)}
          placeholder="Any special circumstances, concerns, or questions..."
          rows={5}
          className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.10] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
        <p className="text-xs text-gray-500 mt-2">Optional but helpful for complex situations</p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
        <h4 className="text-white font-semibold mb-3">Review summary</h4>
        <p className="text-gray-300 text-sm mb-4">
          You've completed all sections. After submission:
        </p>
        <ul className="text-gray-400 text-sm space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            We'll review your responses within 48 hours
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            You'll receive a written report via email
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Complex cases will be flagged with specific recommendations
          </li>
        </ul>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0: return renderSection1();
      case 1: return renderSection2();
      case 2: return renderSection3();
      case 3: return renderSection4();
      case 4: return renderSection5();
      case 5: return renderSection6();
      case 6: return renderSection7();
      default: return null;
    }
  };

  const SectionIcon = SECTIONS[currentSection].icon;

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8 md:p-12"
        >
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <SectionIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {SECTIONS[currentSection].title}
                  </h2>
                  <span className="text-sm text-gray-400">
                    Section {currentSection + 1} of {SECTIONS.length}
                  </span>
                </div>
              </div>
              {lastSaved && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Save className="w-3 h-3" />
                  Saved {lastSaved.toLocaleTimeString()}
                </div>
              )}
            </div>

            <div className="flex gap-1">
              {SECTIONS.map((section, i) => (
                <div
                  key={section.id}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    i <= currentSection ? 'bg-blue-400' : 'bg-gray-700'
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
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentSection()}
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-10">
              {currentSection > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousSection}
                  className="flex items-center justify-center w-full sm:w-auto order-2 sm:order-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}

              <div className="hidden sm:block flex-1" />

              {currentSection < SECTIONS.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNextSection}
                  disabled={isSaving}
                  className="flex items-center justify-center w-full sm:w-auto order-1 sm:order-2"
                >
                  {isSaving ? 'Saving...' : 'Continue'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full sm:w-auto order-1 sm:order-2"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                </Button>
              )}
            </div>
          </form>
        </motion.div>

        <p className="text-xs text-gray-500 text-center mt-6 max-w-2xl mx-auto">
          Your progress is automatically saved. You can close this page and return anytime using the link in your email.
        </p>
      </div>
    </div>
  );
};
