import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import {
  Briefcase, Users, BookOpen, MessageCircle,
  Send, CheckCircle, AlertTriangle, Loader, Copy, Check,
  Database, Mail, MessageSquare, FileText, Eye, ExternalLink,
  Star, UserPlus
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
  const [selectedScenario, setSelectedScenario] = useState<TestScenario | null>(null);
  const [testEmail, setTestEmail] = useState('vandevo.com@gmail.com');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; id?: any; category?: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [quickPreviewId, setQuickPreviewId] = useState('');
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);
  const [grantEmail, setGrantEmail] = useState('');
  const [isGranting, setIsGranting] = useState(false);
  const [grantResult, setGrantResult] = useState<{ success: boolean; message: string } | null>(null);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      green: 'bg-green-500/10 border-green-500/30 text-green-400',
      yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
      purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      red: 'bg-red-500/10 border-red-500/30 text-red-400',
      gray: 'bg-gray-500/10 border-gray-500/30 text-gray-400',
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

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
      const { userId, reviewId } = await grantReviewAccessByEmail(grantEmail);
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
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-yellow-300 font-semibold">
                TEST MODE - Creates Real Database Records & Triggers Automations
              </p>
              <p className="text-yellow-400/80 text-sm mt-1">
                All submissions will trigger Make.com workflows, send emails via Amazon SES, create Airtable records, and send Telegram notifications
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Test Automation Hub
            </h1>
            <p className="text-gray-400">
              Quick access to test all form submission scenarios with real automation triggers
            </p>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.10] p-6 mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Test Email Address
            </label>
            <Input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="vandevo.com@gmail.com"
              className="max-w-md"
            />
            <p className="text-xs text-gray-500 mt-2">
              All test submissions will use this email. Default is your Gmail for testing.
            </p>
          </div>

          {result && (
            <Alert
              variant={result.success ? 'success' : 'error'}
              className="mb-8"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  {result.message}
                  {result.id && (
                    <div className="text-xs mt-2 opacity-70">
                      Record ID: {result.id}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {result.id && result.category === 'tax_checkup' && (
                    <Button
                      size="sm"
                      onClick={() => handleViewResults(String(result.id))}
                      className="whitespace-nowrap"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Results
                    </Button>
                  )}
                  {result.id && (
                    <button
                      onClick={() => copyToClipboard(String(result.id), 'result')}
                      className="ml-2 p-2 hover:bg-white/10 rounded transition-colors"
                    >
                      {copiedId === 'result' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </Alert>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Contact Form Scenarios</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEST_SCENARIOS.filter(s => s.category === 'contact').map((scenario) => {
                const Icon = scenario.icon;
                return (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/[0.03] backdrop-blur-3xl rounded-xl border border-white/[0.10] p-5 hover:border-white/[0.15] transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${getColorClasses(scenario.color)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-sm mb-1">
                          {scenario.title}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {scenario.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {scenario.triggers.map(trigger => (
                        <span
                          key={trigger}
                          className="text-xs px-2 py-0.5 bg-white/[0.05] border border-white/[0.08] rounded text-gray-400"
                        >
                          {trigger}
                        </span>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleSubmitTest(scenario)}
                      disabled={isSubmitting}
                      className="w-full text-sm py-2"
                      size="sm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="w-3 h-3 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3 mr-2" />
                          Send Test
                        </>
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {lastSubmittedId && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-blue-300 font-semibold">
                      Last Submitted Tax Checkup
                    </p>
                    <p className="text-blue-400/80 text-xs mt-1">
                      ID: {lastSubmittedId}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleViewResults(lastSubmittedId)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Results
                </Button>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Tax Checkup Scenarios</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEST_SCENARIOS.filter(s => s.category === 'tax_checkup').map((scenario) => {
                const Icon = scenario.icon;
                return (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/[0.03] backdrop-blur-3xl rounded-xl border border-white/[0.10] p-5 hover:border-white/[0.15] transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${getColorClasses(scenario.color)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-sm mb-1">
                          {scenario.title}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {scenario.description}
                        </p>
                      </div>
                    </div>

                    {scenario.expectedWarnings && (
                      <div className="flex items-center gap-2 mb-3 text-xs">
                        <span className="flex items-center gap-1 text-red-400">
                          <span className="w-2 h-2 rounded-full bg-red-400"></span>
                          {scenario.expectedWarnings.red}
                        </span>
                        <span className="flex items-center gap-1 text-yellow-400">
                          <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                          {scenario.expectedWarnings.yellow}
                        </span>
                        <span className="flex items-center gap-1 text-green-400">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          {scenario.expectedWarnings.green}
                        </span>
                      </div>
                    )}

                    {scenario.testsRules && scenario.testsRules.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Tests:</p>
                        <div className="flex flex-wrap gap-1">
                          {scenario.testsRules.slice(0, 2).map((rule, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400"
                            >
                              {rule}
                            </span>
                          ))}
                          {scenario.testsRules.length > 2 && (
                            <span className="text-xs px-2 py-0.5 text-gray-500">
                              +{scenario.testsRules.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mb-3">
                      {scenario.triggers.map(trigger => (
                        <span
                          key={trigger}
                          className="text-xs px-2 py-0.5 bg-white/[0.05] border border-white/[0.08] rounded text-gray-400"
                        >
                          {trigger}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSubmitTest(scenario)}
                        disabled={isSubmitting}
                        className="flex-1 text-sm py-2"
                        size="sm"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader className="w-3 h-3 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3 mr-2" />
                            Send Test
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleSubmitAndViewResults(scenario)}
                        disabled={isSubmitting}
                        variant="outline"
                        className="text-sm py-2 px-3"
                        size="sm"
                        title="Submit and view results page"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.10] p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Quick Preview - View Results
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Enter any existing intake ID to view its results page directly, or view the demo page
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                value={quickPreviewId}
                onChange={(e) => setQuickPreviewId(e.target.value)}
                placeholder="Enter intake ID (e.g., 123)"
                className="flex-1"
              />
              <Button
                onClick={() => quickPreviewId && handleViewResults(quickPreviewId)}
                disabled={!quickPreviewId}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Results
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/checkup/results/demo')}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Demo
              </Button>
            </div>
          </div>

          <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              What Gets Triggered?
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <Database className="w-4 h-4 mt-0.5 text-blue-400" />
                <div>
                  <p className="font-medium">Supabase Database</p>
                  <p className="text-xs text-gray-400">Creates real records in contact_requests or accounting_intakes tables</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-green-400" />
                <div>
                  <p className="font-medium">Amazon SES Emails</p>
                  <p className="text-xs text-gray-400">Sends confirmation emails via FluentCRM integration</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 mt-0.5 text-purple-400" />
                <div>
                  <p className="font-medium">Airtable Records</p>
                  <p className="text-xs text-gray-400">Creates or updates records in your Airtable base via Make.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 mt-0.5 text-yellow-400" />
                <div>
                  <p className="font-medium">Telegram Notifications</p>
                  <p className="text-xs text-gray-400">Sends alerts to your Worktugal bot</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5 backdrop-blur-xl rounded-2xl border border-amber-500/30 p-6">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Grant Paid Review Access
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Bypass Stripe payment and grant a user access to the compliance review form. User must have an existing account.
            </p>

            {grantResult && (
              <Alert
                variant={grantResult.success ? 'success' : 'error'}
                className="mb-4"
              >
                {grantResult.message}
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                value={grantEmail}
                onChange={(e) => setGrantEmail(e.target.value)}
                placeholder="user@example.com"
                className="flex-1"
              />
              <Button
                onClick={handleGrantAccess}
                disabled={!grantEmail || isGranting}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold"
              >
                {isGranting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Granting...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Grant Access
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              This will create a paid_compliance_reviews record and update user_profiles. User will see "Client" badge and can access the form.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
