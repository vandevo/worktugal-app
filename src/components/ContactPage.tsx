import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Send, Check } from 'lucide-react';
import { submitContactRequest } from '../lib/contacts';
import { Seo } from './Seo';
import { trackContactRequest } from '../lib/analytics';

const contactSchema = z.object({
  purpose: z.enum(['feedback', 'partnership', 'info', 'other']),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  company_name: z.string().optional(),
  website_url: z.string().optional(),
  message: z.string().min(10, 'Please write at least 10 characters').max(500),
  budget_range: z.string().optional(),
  timeline: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const topics = [
  { value: 'feedback', label: 'Feedback, bug, or feature request' },
  { value: 'partnership', label: 'Partnership or collaboration' },
  { value: 'info', label: 'Question about Portugal' },
  { value: 'other', label: 'Something else' },
];

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<ContactFormData['purpose']>('feedback');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { purpose: 'feedback' },
  });

  const handleTopicSelect = (value: ContactFormData['purpose']) => {
    setSelectedTopic(value);
    setValue('purpose', value);
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await submitContactRequest(data);
      trackContactRequest(data.purpose);
      navigate(`/contact/success?purpose=${data.purpose}&budget=none`);
    } catch (error) {
      console.error('Error submitting contact request:', error);
      alert('Failed to send. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Contact — Worktugal"
        description="Send feedback, report a bug, ask a question, or get in touch with the Worktugal team."
        canonicalUrl="https://app.worktugal.com/contact"
      />

      <div className="max-w-lg mx-auto px-4 py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Get in touch
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Feedback, bugs, ideas, partnerships — all welcome.
            </p>
          </div>

          <div className="bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <div>
                <label htmlFor="contact-name" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                  Name
                </label>
                <input
                  id="contact-name"
                  {...register('full_name')}
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/8 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981]/50 transition-all text-sm"
                />
                {errors.full_name && <p className="mt-1.5 text-xs text-red-500">{errors.full_name.message}</p>}
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                  Email
                </label>
                <input
                  id="contact-email"
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/8 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981]/50 transition-all text-sm"
                />
                {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <p className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                  Topic
                </p>
                <input type="hidden" {...register('purpose')} />
                <div className="grid grid-cols-2 gap-2">
                  {topics.map((t) => {
                    const active = selectedTopic === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => handleTopicSelect(t.value as ContactFormData['purpose'])}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold text-left transition-all ${
                          active
                            ? 'bg-[#0F3D2E]/8 dark:bg-[#10B981]/10 border-[#10B981]/40 dark:border-[#10B981]/30 text-[#0F3D2E] dark:text-[#10B981]'
                            : 'bg-transparent border-slate-200 dark:border-white/8 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/15'
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                        <span className="leading-snug">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  {...register('message')}
                  rows={5}
                  maxLength={500}
                  placeholder="Tell us more..."
                  className="w-full px-4 py-3 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/8 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981]/50 transition-all text-sm resize-none"
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#0F3D2E] hover:bg-[#1A5C44] text-white py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 mt-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Sending...' : 'Send message'}
              </button>

            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}
