import { useState } from 'react';
import { motion } from 'framer-motion';
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 p-8 md:p-12 text-center"
        >
          <Building className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Redirecting to Jobs Board
          </h2>
          <p className="text-gray-400 mb-6">
            We list all verified remote jobs at jobs.worktugal.com. Redirecting you now...
          </p>
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
          <Button
            onClick={() => window.location.href = 'https://jobs.worktugal.com'}
            className="w-full"
          >
            Go Now →
          </Button>
        </motion.div>
      </div>
    );
  }

  const getStepNumber = () => {
    if (step === 'purpose') return 1;
    if (step === 'details') return 2;
    if (step === 'qualification') return 3;
    return 1;
  };

  const totalSteps = purpose === 'partnership' ? 3 : 2;

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Contact Us</h1>
            <p className="text-lg text-gray-400">
              Let us know how we can help you with your Portugal journey
            </p>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] overflow-hidden">
            {step !== 'purpose' && (
              <div className="p-6 md:p-8 border-b border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">
                    Step {getStepNumber()} of {totalSteps}
                  </span>
                  <span className="text-sm text-gray-400">
                    {step === 'details' && 'Your Details'}
                    {step === 'qualification' && 'Partnership Budget'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                        i < getStepNumber() ? 'bg-blue-400' : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {step === 'purpose' && (
                <div className="p-8 md:p-12">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    What brings you here?
                  </h2>
                  <div className="space-y-3">
                    {purposeOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => handlePurposeSelect(option.value)}
                          className="w-full text-center md:text-left p-5 md:p-6 border-2 border-white/[0.08] bg-white/[0.02] rounded-xl hover:border-blue-400/50 hover:bg-white/[0.05] transition-all duration-200 group"
                        >
                          <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4">
                            <div className="p-2.5 md:p-3 bg-blue-400/10 rounded-xl group-hover:bg-blue-400/20 transition-colors duration-200 shrink-0">
                              <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <h3 className="text-base md:text-lg font-semibold text-white">
                                {option.label}
                              </h3>
                              <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
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
                <div className="p-8 md:p-12">
                  {showInfoMessage && (
                    <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <p className="text-blue-400 font-medium mb-2">
                        Most questions are answered in our free guides
                      </p>
                      <a
                        href="https://worktugal.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline text-sm"
                      >
                        Browse Guides →
                      </a>
                      <p className="text-gray-400 text-sm mt-2">
                        Still need help? Fill out the form below.
                      </p>
                    </div>
                  )}

                  <h2 className="text-2xl font-bold text-white mb-6">
                    Tell us about you
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <Input
                        {...register('full_name')}
                        placeholder="John Doe"
                        error={errors.full_name?.message}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
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
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Company/Project
                          </label>
                          <Input
                            {...register('company_name')}
                            placeholder="Your company name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
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
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
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
                        className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors duration-150 resize-none border border-white/[0.08]"
                        placeholder="Tell us more about your needs..."
                        maxLength={500}
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
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
                <div className="p-8 md:p-12">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Partnership Details
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3">
                        Do you have a budget for this collaboration? *
                      </label>
                      <div className="space-y-3">
                        {[
                          { value: '200-499', label: 'Yes (€200 - €499)' },
                          { value: '500-999', label: 'Yes (€500 - €999)' },
                          { value: '1000+', label: 'Yes (€1,000+)' },
                          { value: 'not_yet', label: 'Not yet / Still exploring' },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-3 p-4 border-2 border-white/[0.08] bg-white/[0.02] rounded-xl hover:border-blue-400/50 cursor-pointer transition-all duration-200"
                          >
                            <input
                              type="radio"
                              {...register('budget_range')}
                              value={option.value}
                              className="w-4 h-4 text-blue-400"
                            />
                            <span className="text-white">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3">
                        When would you like to start? *
                      </label>
                      <div className="space-y-3">
                        {[
                          { value: 'this_month', label: 'This month' },
                          { value: '3_months', label: 'Within 3 months' },
                          { value: 'later', label: 'Later / Flexible' },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-3 p-4 border-2 border-white/[0.08] bg-white/[0.02] rounded-xl hover:border-blue-400/50 cursor-pointer transition-all duration-200"
                          >
                            <input
                              type="radio"
                              {...register('timeline')}
                              value={option.value}
                              className="w-4 h-4 text-blue-400"
                            />
                            <span className="text-white">{option.label}</span>
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
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
