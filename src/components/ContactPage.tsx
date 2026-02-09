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
import { Seo } from './Seo';
import { trackContactRequest } from '../lib/analytics';

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
      trackContactRequest(data.purpose);
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
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl shadow-black/30 p-8 md:p-12 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
            <Building className="w-10 h-10 text-blue-500/50" />
          </div>
          <h2 className="text-3xl font-serif text-white mb-4">
            Redirecting to Jobs Board
          </h2>
          <p className="text-gray-500 font-light mb-10 leading-relaxed">
            We list all verified remote jobs at jobs.worktugal.com. Redirecting you now...
          </p>
          <div className="flex justify-center mb-10">
            <div className="w-8 h-8 border-2 border-white/5 border-t-white/40 rounded-full animate-spin"></div>
          </div>
          <Button
            onClick={() => window.location.href = 'https://jobs.worktugal.com'}
            variant="primary"
            className="w-full h-12 text-xs uppercase tracking-widest font-bold"
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
    <div className="min-h-screen bg-obsidian py-24 px-4">
      <Seo
        title="Contact Us - Get in Touch with Worktugal"
        description="Have questions about accounting services, partnerships, or work opportunities in Portugal? Contact Worktugal's team for personalized assistance."
        canonicalUrl="https://app.worktugal.com/contact"
      />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Contact us</h1>
            <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto">
              Let us know how we can help you with your Portugal journey.
            </p>
          </div>

          <div className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl shadow-black/30 overflow-hidden">
            {step !== 'purpose' && (
              <div className="p-6 md:p-8 border-b border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                    Step {getStepNumber()} of {totalSteps}
                  </span>
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                    {step === 'details' && 'Your Details'}
                    {step === 'qualification' && 'Partnership Budget'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                        i < getStepNumber() ? 'bg-white/20' : 'bg-white/5'
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
                  <h2 className="text-2xl font-serif text-white mb-8">
                    What brings you here?
                  </h2>
                  <div className="space-y-4">
                    {purposeOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => handlePurposeSelect(option.value)}
                          className="w-full text-left p-6 border border-white/5 bg-white/[0.01] rounded-2xl hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                              <Icon className="w-5 h-5 text-blue-500/50 group-hover:text-blue-400 transition-colors" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-serif text-white mb-1">
                                {option.label}
                              </h3>
                              <p className="text-gray-500 text-xs font-light leading-relaxed">
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
                    <div className="mb-10 p-6 bg-blue-500/[0.02] border border-blue-500/10 rounded-2xl">
                      <p className="text-blue-500/60 font-medium text-sm mb-2">
                        Most questions are answered in our free guides
                      </p>
                      <a
                        href="https://worktugal.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500/50 hover:text-blue-400 transition-colors underline decoration-blue-500/20 text-sm font-light"
                      >
                        Browse Guides →
                      </a>
                      <p className="text-gray-600 text-xs mt-4 font-light uppercase tracking-widest">
                        Still need help? Fill out the form below.
                      </p>
                    </div>
                  )}

                  <h2 className="text-2xl font-serif text-white mb-10">
                    Tell us about you
                  </h2>

                  <div className="space-y-8">
                    <div>
                      <label htmlFor="contact-full-name" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4">
                        Full Name *
                      </label>
                      <Input
                        id="contact-full-name"
                        {...register('full_name')}
                        placeholder="John Doe"
                        autoComplete="name"
                        className="bg-white/[0.02] border-white/5 font-light"
                        error={errors.full_name?.message}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4">
                        Email *
                      </label>
                      <Input
                        id="contact-email"
                        {...register('email')}
                        type="email"
                        placeholder="john@example.com"
                        autoComplete="email"
                        className="bg-white/[0.02] border-white/5 font-light"
                        error={errors.email?.message}
                      />
                    </div>

                    {(purpose === 'partnership' || purpose === 'accounting') && (
                      <>
                        <div>
                          <label htmlFor="contact-company" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4">
                            Company/Project
                          </label>
                          <Input
                            id="contact-company"
                            {...register('company_name')}
                            placeholder="Your company name"
                            autoComplete="organization"
                            className="bg-white/[0.02] border-white/5 font-light"
                          />
                        </div>

                        <div>
                          <label htmlFor="contact-website" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4">
                            Website or LinkedIn
                          </label>
                          <Input
                            id="contact-website"
                            {...register('website_url')}
                            type="url"
                            placeholder="https://example.com"
                            autoComplete="url"
                            className="bg-white/[0.02] border-white/5 font-light"
                            error={errors.website_url?.message}
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label htmlFor="contact-message" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4">
                        {purpose === 'partnership'
                          ? 'What would you like to collaborate on? *'
                          : purpose === 'accounting'
                          ? 'Briefly describe your situation *'
                          : purpose === 'info'
                          ? 'What do you need help with? *'
                          : 'How can we help? *'}
                      </label>
                      <textarea
                        id="contact-message"
                        {...register('message')}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/[0.06] hover:bg-white/[0.04] transition-all duration-200 resize-none font-light text-sm shadow-lg shadow-black/20"
                        placeholder="Tell us more about your needs..."
                        maxLength={500}
                      />
                      {errors.message && (
                        <p className="mt-2 text-xs text-red-500/60 font-light uppercase tracking-widest">{errors.message.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 mt-12 pt-8 border-t border-white/5">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setStep('purpose');
                        setShowInfoMessage(false);
                      }}
                      className="flex-1 h-12 text-xs uppercase tracking-widest font-bold"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleDetailsNext}
                      variant="primary"
                      className="flex-1 h-12 text-xs uppercase tracking-widest font-bold"
                      disabled={isSubmitting}
                    >
                      {purpose === 'partnership' ? 'Next' : 'Send Message'}
                    </Button>
                  </div>
                </div>
              )}

              {step === 'qualification' && purpose === 'partnership' && (
                <div className="p-8 md:p-12">
                  <h2 className="text-2xl font-serif text-white mb-10">
                    Partnership details
                  </h2>

                  <div className="space-y-10">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-6">
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
                            htmlFor={`budget-${option.value}`}
                            className="flex items-center gap-4 p-5 border border-white/5 bg-white/[0.01] rounded-2xl hover:border-white/10 cursor-pointer transition-all duration-300 group"
                          >
                            <input
                              id={`budget-${option.value}`}
                              type="radio"
                              {...register('budget_range')}
                              value={option.value}
                              className="w-4 h-4 bg-white/5 border-white/10 text-white focus:ring-0 focus:ring-offset-0"
                            />
                            <span className="text-sm text-gray-400 font-light group-hover:text-white transition-colors">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-6">
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
                            htmlFor={`timeline-${option.value}`}
                            className="flex items-center gap-4 p-5 border border-white/5 bg-white/[0.01] rounded-2xl hover:border-white/10 cursor-pointer transition-all duration-300 group"
                          >
                            <input
                              id={`timeline-${option.value}`}
                              type="radio"
                              {...register('timeline')}
                              value={option.value}
                              className="w-4 h-4 bg-white/5 border-white/10 text-white focus:ring-0 focus:ring-offset-0"
                            />
                            <span className="text-sm text-gray-400 font-light group-hover:text-white transition-colors">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 mt-12 pt-8 border-t border-white/5">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('details')}
                      className="flex-1 h-12 text-xs uppercase tracking-widest font-bold"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSubmit(onSubmit)}
                      variant="primary"
                      className="flex-1 h-12 text-xs uppercase tracking-widest font-bold"
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
