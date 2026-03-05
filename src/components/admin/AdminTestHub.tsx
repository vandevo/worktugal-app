import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  Briefcase, Users, BookOpen, MessageCircle,
  CheckCircle, AlertTriangle, Copy, Check,
  Database, Mail, MessageSquare, FileText, Eye, ExternalLink,
  Star, ArrowLeft
} from 'lucide-react';
import { submitContactRequest } from '../../lib/contacts';
import { submitTaxCheckup } from '../../lib/taxCheckup';
import { grantReviewAccessByEmail } from '../../lib/paidComplianceReviews';
import type { ContactRequest } from '../../lib/contacts';
import type { TaxCheckupFormData } from '../../lib/taxCheckup';

interface TestScenario {
  id: string;
  category: 'contact' | 'tax_checkup';
  title: string;
  description: string;
  icon: typeof Briefcase;
  color: string;
  data: Partial<ContactRequest> | Partial<TaxCheckupFormData>;
  triggers: string[];
  testsRules?: string[];
  expectedWarnings?: {
    red: number;
    yellow: number;
    green: number;
  };
}

const TEST_SCENARIOS: TestScenario[] = [
  {
    id: 'contact-accounting',
    category: 'contact',
    title: 'Accounting Inquiry',
    description: 'User needs English-speaking accountant',
    icon: Briefcase,
    color: 'blue',
    data: {
      purpose: 'accounting',
      full_name: 'Test User',
      email: 'vandevo.com@gmail.com',
      message: 'I need help with my Portuguese taxes. I\'m a freelancer working remotely from Lisbon.'
    },
    triggers: ['Airtable', 'Email', 'FluentCRM', 'Telegram']
  },
  {
    id: 'contact-partnership-high',
    category: 'contact',
    title: 'Partnership - High Budget',
    description: 'Partnership inquiry with €1000+ budget',
    icon: Users,
    color: 'green',
    data: {
      purpose: 'partnership',
      full_name: 'Test Partner Co.',
      email: 'vandevo.com@gmail.com',
      company_name: 'Test Company Ltd',
      website_url: 'https://example.com',
      message: 'We\'d like to partner with Worktugal for an event series.',
      budget_range: '1000+',
      timeline: 'this_month'
    },
    triggers: ['Airtable', 'Email', 'FluentCRM', 'Telegram']
  },
  {
    id: 'contact-partnership-medium',
    category: 'contact',
    title: 'Partnership - Medium Budget',
    description: 'Partnership inquiry with €500-€999 budget',
    icon: Users,
    color: 'green',
    data: {
      purpose: 'partnership',
      full_name: 'Test Partner',
      email: 'vandevo.com@gmail.com',
      company_name: 'Medium Budget Co.',
      message: 'Interested in content collaboration opportunities.',
      budget_range: '500-999',
      timeline: '3_months'
    },
    triggers: ['Airtable', 'Email', 'FluentCRM', 'Telegram']
  },
  {
    id: 'contact-partnership-starter',
    category: 'contact',
    title: 'Partnership - Starter Budget',
    description: 'Partnership inquiry with €200-€499 budget',
    icon: Users,
    color: 'yellow',
    data: {
      purpose: 'partnership',
      full_name: 'Test Starter',
      email: 'vandevo.com@gmail.com',
      message: 'Small business looking to collaborate on social media.',
      budget_range: '200-499',
      timeline: 'flexible'
    },
    triggers: ['Airtable', 'Email', 'FluentCRM', 'Telegram']
  },
  {
    id: 'contact-partnership-exploring',
    category: 'contact',
    title: 'Partnership - Exploring',
    description: 'Partnership inquiry with no budget yet',
    icon: Users,
    color: 'gray',
    data: {
      purpose: 'partnership',
      full_name: 'Test Explorer',
      email: 'vandevo.com@gmail.com',
      message: 'Just exploring partnership options at this stage.',
      budget_range: 'not_yet',
      timeline: 'later'
    },
    triggers: ['Airtable', 'Email', 'FluentCRM', 'Telegram']
  },
  {
    id: 'contact-info',
    category: 'contact',
    title: 'Portugal Setup Questions',
    description: 'General visa, NIF, housing questions',
    icon: BookOpen,
    color: 'purple',
    data: {
      purpose: 'info',
      full_name: 'Test Expat',
      email: 'vandevo.com@gmail.com',
      message: 'I have questions about getting my NIF and registering as a freelancer in Portugal.'
    },
    triggers: ['Airtable', 'Email', 'FluentCRM', 'Telegram']
  },
  {
    id: 'contact-other',
    category: 'contact',
    title: 'General Inquiry',
    description: 'Other questions or feedback',
    icon: MessageCircle,
    color: 'gray',
    data: {
      purpose: 'other',
      full_name: 'Test User',
      email: 'vandevo.com@gmail.com',
      message: 'I wanted to provide some feedback on your website.'
    },
    triggers: ['Airtable', 'Email', 'FluentCRM', 'Telegram']
  },
  {
    id: 'tax-checkup-critical',
    category: 'tax_checkup',
    title: 'Tax Checkup - Critical Issues',
    description: 'High earner with no registrations (4-5 red flags)',
    icon: AlertTriangle,
    color: 'red',
    data: {
      name: 'Test Critical User',
      email: 'vandevo.com@gmail.com',
      phone: '+351912345678',
      work_type: 'developer',
      months_in_portugal: 12,
      residency_status: 'residence_permit',
      has_nif: false,
      activity_opened: false,
      estimated_annual_income: 'over_50k',
      has_vat_number: false,
      has_niss: false,
      has_fiscal_representative: false,
      email_marketing_consent: true,
      utm_source: 'test',
      utm_campaign: 'admin_test',
      utm_medium: 'manual'
    },
    triggers: ['Airtable', 'Email', 'Make.com Webhook', 'Telegram'],
    testsRules: ['No NIF', 'No activity', 'No VAT', 'No NISS', 'VAT 125% rule'],
    expectedWarnings: { red: 4, yellow: 0, green: 1 }
  },
  {
    id: 'tax-checkup-warnings',
    category: 'tax_checkup',
    title: 'Tax Checkup - Some Warnings',
    description: 'Mid-income with some uncertainties (yellow flags)',
    icon: AlertTriangle,
    color: 'yellow',
    data: {
      name: 'Test Warning User',
      email: 'vandevo.com@gmail.com',
      phone: '+351912345678',
      work_type: 'designer',
      months_in_portugal: 8,
      residency_status: 'residence_permit',
      has_nif: true,
      activity_opened: true,
      estimated_annual_income: '10k_25k',
      has_vat_number: null,
      has_niss: true,
      has_fiscal_representative: null,
      email_marketing_consent: true,
      utm_source: 'test',
      utm_campaign: 'admin_test',
      utm_medium: 'manual'
    },
    triggers: ['Airtable', 'Email', 'Make.com Webhook', 'Telegram'],
    testsRules: ['Approaching VAT threshold', '15% expense rule'],
    expectedWarnings: { red: 0, yellow: 2, green: 3 }
  },
  {
    id: 'tax-checkup-compliant',
    category: 'tax_checkup',
    title: 'Tax Checkup - Mostly Compliant',
    description: 'All registrations complete (baseline positive)',
    icon: CheckCircle,
    color: 'green',
    data: {
      name: 'Test Compliant User',
      email: 'vandevo.com@gmail.com',
      phone: '+351912345678',
      work_type: 'consultant',
      months_in_portugal: 10,
      residency_status: 'residence_permit',
      has_nif: true,
      activity_opened: true,
      estimated_annual_income: '25k_50k',
      has_vat_number: true,
      has_niss: true,
      has_fiscal_representative: true,
      email_marketing_consent: false,
      utm_source: 'test',
      utm_campaign: 'admin_test',
      utm_medium: 'manual'
    },
    triggers: ['Airtable', 'Email', 'Telegram'],
    testsRules: ['Baseline compliant'],
    expectedWarnings: { red: 0, yellow: 0, green: 5 }
  },
  {
    id: 'tax-checkup-first-year',
    category: 'tax_checkup',
    title: 'Tax Checkup - New Freelancer',
    description: 'First year in Portugal (tests first-year discount)',
    icon: CheckCircle,
    color: 'green',
    data: {
      name: 'Test New Freelancer',
      email: 'vandevo.com@gmail.com',
      phone: '+351912345678',
      work_type: 'writer',
      months_in_portugal: 6,
      residency_status: 'residence_permit',
      has_nif: true,
      activity_opened: true,
      estimated_annual_income: '10k_25k',
      has_vat_number: false,
      has_niss: true,
      has_fiscal_representative: false,
      email_marketing_consent: true,
      utm_source: 'test',
      utm_campaign: 'admin_test',
      utm_medium: 'manual'
    },
    triggers: ['Airtable', 'Email', 'Make.com Webhook', 'Telegram'],
    testsRules: ['First-year tax discount', '15% expense rule', 'Approaching VAT'],
    expectedWarnings: { red: 0, yellow: 2, green: 4 }
  },
  {
    id: 'tax-checkup-vat-125',
    category: 'tax_checkup',
    title: 'Tax Checkup - VAT 125% Crisis',
    description: 'High income without VAT (tests VAT 125% rule)',
    icon: AlertTriangle,
    color: 'red',
    data: {
      name: 'Test VAT Crisis User',
      email: 'vandevo.com@gmail.com',
      phone: '+351912345678',
      work_type: 'developer',
      months_in_portugal: 18,
      residency_status: 'residence_permit',
      has_nif: true,
      activity_opened: true,
      estimated_annual_income: 'over_50k',
      has_vat_number: false,
      has_niss: true,
      has_fiscal_representative: false,
      email_marketing_consent: true,
      utm_source: 'test',
      utm_campaign: 'admin_test',
      utm_medium: 'manual'
    },
    triggers: ['Airtable', 'Email', 'Make.com Webhook', 'Telegram'],
    testsRules: ['VAT 125% immediate loss', '15% expense rule', 'Prepayments'],
    expectedWarnings: { red: 1, yellow: 3, green: 3 }
  },
  {
    id: 'tax-checkup-tourist',
    category: 'tax_checkup',
    title: 'Tax Checkup - Tourist Working',
    description: 'Tourist visa earning income (illegal status)',
    icon: AlertTriangle,
    color: 'red',
    data: {
      name: 'Test Tourist User',
      email: 'vandevo.com@gmail.com',
      phone: '+351912345678',
      work_type: 'consultant',
      months_in_portugal: 3,
      residency_status: 'tourist',
      has_nif: false,
      activity_opened: false,
      estimated_annual_income: '25k_50k',
      has_vat_number: false,
      has_niss: false,
      has_fiscal_representative: false,
      email_marketing_consent: true,
      utm_source: 'test',
      utm_campaign: 'admin_test',
      utm_medium: 'manual'
    },
    triggers: ['Airtable', 'Email', 'Make.com Webhook', 'Telegram'],
    testsRules: ['Tourist visa issue', 'Fiscal representative', 'No registrations'],
    expectedWarnings: { red: 4, yellow: 1, green: 0 }
  },
  {
    id: 'tax-checkup-dnv',
    category: 'tax_checkup',
    title: 'Tax Checkup - Digital Nomad',
    description: 'DNV visa with foreign clients (compliant)',
    icon: CheckCircle,
    color: 'green',
    data: {
      name: 'Test Digital Nomad',
      email: 'vandevo.com@gmail.com',
      phone: '+351912345678',
      work_type: 'developer',
      months_in_portugal: 8,
      residency_status: 'dnv',
      has_nif: true,
      activity_opened: false,
      estimated_annual_income: 'under_10k',
      has_vat_number: false,
      has_niss: false,
      has_fiscal_representative: false,
      email_marketing_consent: true,
      utm_source: 'test',
      utm_campaign: 'admin_test',
      utm_medium: 'manual'
    },
    triggers: ['Airtable', 'Email', 'Make.com Webhook', 'Telegram'],
    testsRules: ['DNV low risk', 'Foreign clients only'],
    expectedWarnings: { red: 0, yellow: 1, green: 3 }
  },
  {
    id: 'tax-checkup-high-earner',
    category: 'tax_checkup',
    title: 'Tax Checkup - Established High Earner',
    description: 'Veteran freelancer (tests €200k + prepayments)',
    icon: AlertTriangle,
    color: 'yellow',
    data: {
      name: 'Test High Earner',
      email: 'vandevo.com@gmail.com',
      phone: '+351912345678',
      work_type: 'consultant',
      months_in_portugal: 36,
      residency_status: 'residence_permit',
      has_nif: true,
      activity_opened: true,
      estimated_annual_income: 'over_50k',
      has_vat_number: true,
      has_niss: true,
      has_fiscal_representative: false,
      email_marketing_consent: true,
      utm_source: 'test',
      utm_campaign: 'admin_test',
      utm_medium: 'manual'
    },
    triggers: ['Airtable', 'Email', 'Make.com Webhook', 'Telegram'],
    testsRules: ['€200k threshold', 'Prepayments', '15% expense rule'],
    expectedWarnings: { red: 0, yellow: 3, green: 5 }
  },
  {
    id: 'tax-checkup-vat-exempt-2025',
    category: 'tax_checkup',
    title: 'Tax Checkup - VAT-Exempt 2025',
    description: 'Low income VAT-exempt (tests quarterly return)',
    icon: AlertTriangle,
    color: 'yellow',
    data: {
      name: 'Test VAT Exempt User',
      email: 'vandevo.com@gmail.com',
      phone: '+351912345678',
      work_type: 'designer',
      months_in_portugal: 14,
      residency_status: 'residence_permit',
      has_nif: true,
      activity_opened: true,
      estimated_annual_income: '10k_25k',
      has_vat_number: false,
      has_niss: true,
      has_fiscal_representative: false,
      email_marketing_consent: true,
      utm_source: 'test',
      utm_campaign: 'admin_test',
      utm_medium: 'manual'
    },
    triggers: ['Airtable', 'Email', 'Make.com Webhook', 'Telegram'],
    testsRules: ['Quarterly VAT return (July 2025)', '15% expense rule'],
    expectedWarnings: { red: 0, yellow: 2, green: 4 }
  },
  {
    id: 'tax-checkup-uncertainty',
    category: 'tax_checkup',
    title: 'Tax Checkup - Uncertainty King',
    description: 'All answers "Not Sure" (tests yellow warnings)',
    icon: AlertTriangle,
    color: 'yellow',
    data: {
      name: 'Test Uncertain User',
      email: 'vandevo.com@gmail.com',
      phone: '+351912345678',
      work_type: 'other',
      months_in_portugal: 5,
      residency_status: 'residence_permit',
      has_nif: null,
      activity_opened: null,
      estimated_annual_income: '10k_25k',
      has_vat_number: null,
      has_niss: null,
      has_fiscal_representative: null,
      email_marketing_consent: true,
      utm_source: 'test',
      utm_campaign: 'admin_test',
      utm_medium: 'manual'
    },
    triggers: ['Airtable', 'Email', 'Make.com Webhook', 'Telegram'],
    testsRules: ['All "Not Sure" handling', 'Yellow warning guidance'],
    expectedWarnings: { red: 0, yellow: 5, green: 1 }
  },
  {
    id: 'tax-checkup-nhr',
    category: 'tax_checkup',
    title: 'Tax Checkup - NHR Legacy User',
    description: 'NHR status before 2024 closure (informational)',
    icon: CheckCircle,
    color: 'green',
    data: {
      name: 'Test NHR User',
      email: 'vandevo.com@gmail.com',
      phone: '+351912345678',
      work_type: 'consultant',
      months_in_portugal: 24,
      residency_status: 'nhr',
      has_nif: true,
      activity_opened: true,
      estimated_annual_income: '25k_50k',
      has_vat_number: true,
      has_niss: true,
      has_fiscal_representative: false,
      email_marketing_consent: true,
      utm_source: 'test',
      utm_campaign: 'admin_test',
      utm_medium: 'manual'
    },
    triggers: ['Airtable', 'Email', 'Make.com Webhook', 'Telegram'],
    testsRules: ['NHR informational', 'IFICI alternative'],
    expectedWarnings: { red: 0, yellow: 0, green: 5 }
  }
];

export const AdminTestHub: React.FC = () => {
  const navigate = useNavigate();
  const [testEmail, setTestEmail] = useState('vandevo.com@gmail.com');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; id?: any; category?: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [quickPreviewId, setQuickPreviewId] = useState('');
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);
  const [grantEmail, setGrantEmail] = useState('');
  const [isGranting, setIsGranting] = useState(false);
  const [grantResult, setGrantResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('last_tax_checkup_id');
    if (stored) {
      setLastSubmittedId(stored);
    }
  }, []);

  const handleSubmitTest = async (scenario: TestScenario) => {
    setIsSubmitting(true);
    setResult(null);

    try {
      const dataWithEmail = { ...scenario.data, email: testEmail };

      if (scenario.category === 'contact') {
        const contactData = await submitContactRequest(dataWithEmail as ContactRequest);
        setResult({
          success: true,
          message: `Contact request submitted! Check your email (${testEmail}), Telegram, and Airtable.`,
          id: contactData.id,
          category: 'contact'
        });
      } else if (scenario.category === 'tax_checkup') {
        const checkupResult = await submitTaxCheckup(dataWithEmail as TaxCheckupFormData);
        const intakeId = String(checkupResult.intake.id);
        localStorage.setItem('last_tax_checkup_id', intakeId);
        setLastSubmittedId(intakeId);
        setResult({
          success: true,
          message: `Tax checkup submitted! Lead Quality Score: ${checkupResult.scores.leadQualityScore}/100. Check your email, Telegram, and Airtable.`,
          id: intakeId,
          category: 'tax_checkup'
        });
      }
    } catch (error) {
      console.error('Test submission error:', error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit test. Check console for details.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAndViewResults = async (scenario: TestScenario) => {
    setIsSubmitting(true);
    setResult(null);

    try {
      const dataWithEmail = { ...scenario.data, email: testEmail };
      const checkupResult = await submitTaxCheckup(dataWithEmail as TaxCheckupFormData);
      const intakeId = String(checkupResult.intake.id);
      localStorage.setItem('last_tax_checkup_id', intakeId);
      navigate(`/checkup/results?id=${intakeId}`);
    } catch (error) {
      console.error('Test submission error:', error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit test. Check console for details.'
      });
      setIsSubmitting(false);
    }
  };

  const handleViewResults = (intakeId: string) => {
    navigate(`/checkup/results?id=${intakeId}`);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGrantAccess = async () => {
    if (!grantEmail) return;

    setIsGranting(true);
    setGrantResult(null);

    try {
      const { reviewId } = await grantReviewAccessByEmail(grantEmail);
      setGrantResult({
        success: true,
        message: `Review access granted! User can now access the intake form at /compliance-review. Review ID: ${reviewId.slice(0, 8)}...`
      });
      setGrantEmail('');
    } catch (error) {
      console.error('Grant access error:', error);
      setGrantResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to grant access'
      });
    } finally {
      setIsGranting(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian py-24 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-6 mb-12">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-400/60" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-yellow-400/60 mb-1">
                Protocol: Terminal Test Mode
              </p>
              <p className="font-light text-yellow-300/60 text-sm leading-relaxed">
                Caution: This environment triggers live database mutations and production automation sequences (SES, Make.com, Telegram).
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-16">
            <Button
              variant="secondary"
              onClick={() => navigate('/dashboard')}
              className="mb-8 px-6 py-2 bg-white/5 border-white/10 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Overview
            </Button>
            <h1 className="font-serif text-5xl text-white mb-4 tracking-tight">Automation Terminal</h1>
            <p className="font-light text-gray-500 text-xl leading-relaxed">Systematic validation of sovereign triggers and data integrity.</p>
          </div>

          <div className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl p-8 mb-12">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4 block">
              Target Test Email Protocol
            </label>
            <div className="max-w-md">
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@worktugal.com"
                className="bg-white/[0.02] border-white/5 text-white py-4 px-6 rounded-xl"
              />
              <p className="text-[10px] uppercase tracking-widest text-gray-700 font-bold mt-4">
                Routing: All intelligence will be dispatched to this address.
              </p>
            </div>
          </div>

          {result && (
            <div className={`mb-12 p-8 rounded-3xl border shadow-2xl ${result.success ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
              <div className="flex items-center justify-between gap-8">
                <div className="flex-1">
                  <p className={`text-sm font-light leading-relaxed ${result.success ? 'text-emerald-400/80' : 'text-red-400/80'}`}>
                    {result.message}
                  </p>
                  {result.id && (
                    <div className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mt-4">
                      Protocol Log ID: <span className="text-white font-mono">{result.id}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {result.id && result.category === 'tax_checkup' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleViewResults(String(result.id))}
                      className="whitespace-nowrap"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Output
                    </Button>
                  )}
                  {result.id && (
                    <button
                      onClick={() => copyToClipboard(String(result.id), 'result')}
                      className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                    >
                      {copiedId === 'result' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mb-16">
            <h2 className="font-serif text-2xl text-white mb-8">Contact Sequence Scenarios</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TEST_SCENARIOS.filter(s => s.category === 'contact').map((scenario) => {
                const Icon = scenario.icon;
                return (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 p-8 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-start gap-6 mb-6">
                      <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors`}>
                        <Icon className="w-6 h-6 opacity-50" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-lg text-white mb-1">
                          {scenario.title}
                        </h3>
                        <p className="font-light text-gray-500 text-xs leading-relaxed">
                          {scenario.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {scenario.triggers.map(trigger => (
                        <span
                          key={trigger}
                          className="text-[8px] px-2 py-1 bg-white/5 border border-white/5 rounded text-gray-600 font-bold uppercase tracking-widest"
                        >
                          {trigger}
                        </span>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleSubmitTest(scenario)}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Syncing...' : 'Dispatch Signal'}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {lastSubmittedId && (
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-8 mb-16 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-blue-500/10 rounded-2xl">
                  <Eye className="w-6 h-6 text-blue-400/60" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-400/60 mb-1">
                    Last Logged Intelligence
                  </p>
                  <p className="font-serif text-xl text-white">
                    Protocol ID: <span className="font-mono">{lastSubmittedId}</span>
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => handleViewResults(lastSubmittedId)}
                className="px-8"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Inspect Results
              </Button>
            </div>
          )}

          <div className="mb-16">
            <h2 className="font-serif text-2xl text-white mb-8">Tax Checkup Intelligence Scenarios</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TEST_SCENARIOS.filter(s => s.category === 'tax_checkup').map((scenario) => {
                const Icon = scenario.icon;
                return (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 p-8 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-start gap-6 mb-6">
                      <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors`}>
                        <Icon className="w-6 h-6 opacity-50" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-lg text-white mb-1">
                          {scenario.title}
                        </h3>
                        <p className="font-light text-gray-500 text-xs leading-relaxed">
                          {scenario.description}
                        </p>
                      </div>
                    </div>

                    {scenario.expectedWarnings && (
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-400/60 shadow-[0_0_8px_rgba(248,113,113,0.4)]"></span>
                          <span className="text-[10px] font-bold text-gray-600">{scenario.expectedWarnings.red}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-400/60 shadow-[0_0_8px_rgba(250,204,21,0.4)]"></span>
                          <span className="text-[10px] font-bold text-gray-600">{scenario.expectedWarnings.yellow}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400/60 shadow-[0_0_8px_rgba(52,211,153,0.4)]"></span>
                          <span className="text-[10px] font-bold text-gray-600">{scenario.expectedWarnings.green}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleSubmitTest(scenario)}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? '...' : 'Log'}
                      </Button>
                      <Button
                        onClick={() => handleSubmitAndViewResults(scenario)}
                        disabled={isSubmitting}
                        variant="secondary"
                        className="px-4 opacity-60 hover:opacity-100"
                        title="Dispatch and Inspect"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 p-8 shadow-2xl">
              <h3 className="font-serif text-xl text-white mb-6 flex items-center gap-3">
                <Eye className="w-5 h-5 text-blue-400/50" />
                Intelligence Lookup
              </h3>
              <p className="font-light text-gray-500 text-sm mb-8 leading-relaxed">
                Manually retrieve results for an existing protocol ID or access the demonstration interface.
              </p>
              <div className="space-y-4">
                <Input
                  type="text"
                  value={quickPreviewId}
                  onChange={(e) => setQuickPreviewId(e.target.value)}
                  placeholder="Intelligence ID"
                  className="bg-white/[0.02] border-white/5 text-white"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={() => quickPreviewId && handleViewResults(quickPreviewId)}
                    disabled={!quickPreviewId}
                    className="flex-1"
                  >
                    Inspect
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/checkup/results/demo')}
                    className="px-8"
                  >
                    Demo
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 p-8 shadow-2xl">
              <h3 className="font-serif text-xl text-white mb-6 flex items-center gap-3">
                <Database className="w-5 h-5 text-emerald-400/50" />
                Trigger Schema
              </h3>
              <div className="space-y-4">
                {[
                  { icon: Database, label: 'Supabase Store', desc: 'Immutable record generation', color: 'text-blue-400/50' },
                  { icon: Mail, label: 'Amazon SES Dispatch', desc: 'Production email routing', color: 'text-emerald-400/50' },
                  { icon: FileText, label: 'Airtable Bridge', desc: 'Make.com CRM integration', color: 'text-purple-400/50' },
                  { icon: MessageSquare, label: 'Telegram Alert', desc: 'Secure bot notification', color: 'text-yellow-400/50' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <item.icon className={`w-4 h-4 mt-1 ${item.color}`} />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white font-bold">{item.label}</p>
                      <p className="text-xs text-gray-600 font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent backdrop-blur-3xl rounded-3xl border border-amber-500/20 p-8 shadow-2xl">
            <h3 className="font-serif text-2xl text-white mb-2 flex items-center gap-3">
              <Star className="w-6 h-6 text-amber-400/60" />
              Administrative Authorization Bypass
            </h3>
            <p className="font-light text-gray-500 text-sm mb-8 max-w-2xl leading-relaxed">
              Manually grant "Paid Client" status to an existing entity, bypassing Stripe protocols for testing or high-priority onboarding.
            </p>

            {grantResult && (
              <div className={`mb-8 p-6 rounded-2xl border ${grantResult.success ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400/80' : 'bg-red-500/5 border-red-500/10 text-red-400/80'} text-sm font-light`}>
                {grantResult.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                value={grantEmail}
                onChange={(e) => setGrantEmail(e.target.value)}
                placeholder="identity@ecosystem.com"
                className="flex-1 bg-white/[0.02] border-white/5 text-white"
              />
              <Button
                onClick={handleGrantAccess}
                disabled={!grantEmail || isGranting}
                className="px-12 bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
              >
                {isGranting ? 'Authorizing...' : 'Grant Privilege'}
              </Button>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-700 font-bold mt-6">
              Logic: Mutations occur in `paid_compliance_reviews` and `user_profiles`.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
