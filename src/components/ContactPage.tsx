import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Briefcase, MessageCircle, BookOpen, Users, Building } from 'lucide-react';
import { submitContactRequest } from '../lib/contacts';

const contactSchema = z.object({
  purpose: z.enum(['accounting', 'partnership', 'job', 'info', 'other']),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  company_name: z.string().optional(),
  website_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  message: z.string().min(10, 'Please provide at least 10 characters').max(500),
  budget_range: z.enum(['200-499', '500-999', '1000+', 'not_yet', 'exploring']).optional(),
  timeline: z.enum(['this_month', '3_months', 'later', 'flexible']).optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const purposeOptions = [
  {
    value: 'accounting' as const,
    label: 'Accounting & Tax Help',
    description: 'Connect with English-speaking accountants in Portugal',
    icon: Briefcase,
  },
  {
    value: 'partnership' as const,
    label: 'Partnership or Collaboration',
    description: 'Work with us on events, content, or sponsorships',
    icon: Users,
  },
  {
    value: 'job' as const,
    label: 'Looking for a Job',
    description: 'Browse our verified remote job board',
    icon: Building,
  },
  {
    value: 'info' as const,
    label: 'Portugal Setup Questions',
    description: 'Visa, NIF, housing, legal setup guidance',
    icon: BookOpen,
  },
  {
    value: 'other' as const,
    label: 'Something Else',
    description: 'General inquiry or feedback',
    icon: MessageCircle,
  },
];

export function ContactPage() {
  const [step, setStep] = useState<'purpose' | 'details' | 'qualification'>('purpose');
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showJobRedirect, setShowJobRedirect] = useState(false);
  const [showInfoMessage, setShowInfoMessage] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const purpose = watch('purpose');

  const handlePurposeSelect = (value: string) => {
    setSelectedPurpose(value);
    setValue('purpose', value as ContactFormData['purpose']);

    if (value === 'job') {
      setShowJobRedirect(true);
      setTimeout(() => {
        window.location.href = 'https://jobs.worktugal.com';
      }, 3000);
      return;
    }

    if (value === 'info') {
      setShowInfoMessage(true);
    }

    setStep('details');
  };

  const handleDetailsNext = () => {
    if (purpose === 'partnership') {
      setStep('qualification');
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await submitContactRequest(data);
      navigate(`/contact/success?purpose=${data.purpose}&budget=${data.budget_range || 'none'}`);
    } catch (error) {
      console.error('Error submitting contact request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showJobRedirect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Building className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Redirecting to Jobs Board
          </h2>
          <p className="text-slate-600 mb-6">
            We list all verified remote jobs at jobs.worktugal.com. Redirecting you now...
          </p>
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <Button
            onClick={() => window.location.href = 'https://jobs.worktugal.com'}
            className="w-full"
          >
            Go Now →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Contact Us</h1>
          <p className="text-lg text-slate-600">
            Let us know how we can help you with your Portugal journey
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {step === 'purpose' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                What brings you here?
              </h2>
              <div className="space-y-4">
                {purposeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePurposeSelect(option.value)}
                      className="w-full text-left p-6 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">
                            {option.label}
                          </h3>
                          <p className="text-slate-600 text-sm">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="p-8">
              {showInfoMessage && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-900 font-medium mb-2">
                    Most questions are answered in our free guides
                  </p>
                  <a
                    href="https://worktugal.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline text-sm"
                  >
                    Browse Guides →
                  </a>
                  <p className="text-blue-800 text-sm mt-2">
                    Still need help? Fill out the form below.
                  </p>
                </div>
              )}

              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Tell us about you
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    {...register('full_name')}
                    placeholder="John Doe"
                    error={errors.full_name?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="john@example.com"
                    error={errors.email?.message}
                  />
                </div>

                {(purpose === 'partnership' || purpose === 'accounting') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Company/Project
                      </label>
                      <Input
                        {...register('company_name')}
                        placeholder="Your company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Website or LinkedIn
                      </label>
                      <Input
                        {...register('website_url')}
                        type="url"
                        placeholder="https://example.com"
                        error={errors.website_url?.message}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {purpose === 'partnership'
                      ? 'What would you like to collaborate on? *'
                      : purpose === 'accounting'
                      ? 'Briefly describe your accounting/tax situation *'
                      : purpose === 'info'
                      ? 'What do you need help with? *'
                      : 'How can we help? *'}
                  </label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us more about your needs..."
                    maxLength={500}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep('purpose');
                    setShowInfoMessage(false);
                  }}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleDetailsNext}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {purpose === 'partnership' ? 'Next' : 'Send Message'}
                </Button>
              </div>
            </div>
          )}

          {step === 'qualification' && purpose === 'partnership' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Partnership Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Do you have a budget for this collaboration? *
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: '200-499', label: 'Yes (€200 - €499)' },
                      { value: '500-999', label: 'Yes (€500 - €999)' },
                      { value: '1000+', label: 'Yes (€1,000+)' },
                      { value: 'not_yet', label: 'Not yet / Still exploring' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          {...register('budget_range')}
                          value={option.value}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-slate-900">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    When would you like to start? *
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'this_month', label: 'This month' },
                      { value: '3_months', label: 'Within 3 months' },
                      { value: 'later', label: 'Later / Flexible' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          {...register('timeline')}
                          value={option.value}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-slate-900">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('details')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
