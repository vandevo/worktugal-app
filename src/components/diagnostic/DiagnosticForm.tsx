import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Shield, Loader2, Mail } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { Seo } from '../Seo';
import {
  diagnosticQuestions,
  getActiveQuestions,
} from '../../lib/diagnostic';
import { runDiagnostic } from '../../lib/diagnostic';
import { submitDiagnostic } from '../../lib/diagnostic/submit';
import type { DiagnosticAnswers } from '../../lib/diagnostic';
import { trackFormSubmission } from '../../lib/analytics';

type FormStep = 'questions' | 'email' | 'analyzing';

const QUESTIONS_PER_PAGE = 4;

export const DiagnosticForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [answers, setAnswers] = useState<DiagnosticAnswers>({});
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [accountingInterest, setAccountingInterest] = useState(false);
  const [formStep, setFormStep] = useState<FormStep>('questions');
  const [questionPage, setQuestionPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const utmSource = searchParams.get('utm_source') || undefined;
  const utmMedium = searchParams.get('utm_medium') || undefined;
  const utmCampaign = searchParams.get('utm_campaign') || undefined;

  const activeQuestions = useMemo(() => getActiveQuestions(answers), [answers]);
  const totalPages = Math.ceil(activeQuestions.length / QUESTIONS_PER_PAGE);

  const currentPageQuestions = useMemo(() => {
    const start = questionPage * QUESTIONS_PER_PAGE;
    return activeQuestions.slice(start, start + QUESTIONS_PER_PAGE);
  }, [activeQuestions, questionPage]);

  const isPageComplete = useMemo(() => {
    return currentPageQuestions.every((q) => answers[q.id] !== undefined);
  }, [currentPageQuestions, answers]);

  const allQuestionsAnswered = useMemo(() => {
    return activeQuestions.every((q) => answers[q.id] !== undefined);
  }, [activeQuestions, answers]);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const progressPercent = useMemo(() => {
    if (formStep === 'email') return 95;
    if (formStep === 'analyzing') return 100;
    const answeredCount = activeQuestions.filter((q) => answers[q.id] !== undefined).length;
    return Math.round((answeredCount / activeQuestions.length) * 90);
  }, [formStep, activeQuestions, answers]);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (error) setError(null);
  };

  const handleNextPage = () => {
    if (questionPage < totalPages - 1) {
      setQuestionPage(questionPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (allQuestionsAnswered) {
      setFormStep('email');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    if (formStep === 'email') {
      setFormStep('questions');
      setQuestionPage(totalPages - 1);
      return;
    }
    if (questionPage > 0) {
      setQuestionPage(questionPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!isEmailValid) return;

    setFormStep('analyzing');
    setIsSubmitting(true);
    setError(null);

    try {
      const result = runDiagnostic(answers, 'portugal');

      const response = await submitDiagnostic({
        email,
        answers,
        result,
        country: 'portugal',
        utmSource,
        utmMedium,
        utmCampaign,
        contact: {
          name: name || undefined,
          phone: phone || undefined,
          marketing_consent: marketingConsent,
          accounting_interest: accountingInterest,
        },
      });

      trackFormSubmission('diagnostic_v2');
      navigate(`/diagnostic/results?id=${response.id}`);
    } catch (err) {
      console.error('Diagnostic submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
      setFormStep('email');
      setIsSubmitting(false);
    }
  };

  const renderQuestionInput = (question: typeof diagnosticQuestions[number]) => {
    const currentValue = answers[question.id];

    if (question.type === 'yes-no') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleAnswer(question.id, opt.value)}
              className={`w-full px-4 py-3.5 rounded-xl border transition-all text-sm font-light ${
                currentValue === opt.value
                  ? 'border-blue-500 bg-blue-500/10 text-white'
                  : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      );
    }

    if (question.options) {
      const cols = question.options.length <= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';
      return (
        <div className={`grid grid-cols-1 ${cols} gap-3`}>
          {question.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleAnswer(question.id, opt.value)}
              className={`w-full px-4 py-3.5 rounded-xl border transition-all text-sm font-light text-left ${
                currentValue === opt.value
                  ? 'border-blue-500 bg-blue-500/10 text-white'
                  : 'border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/10 hover:bg-white/[0.03]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  if (formStep === 'analyzing') {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <Seo title="Analyzing your compliance..." noindex={true} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-4"
        >
          <div className="relative w-16 h-16 mx-auto mb-8">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            <Shield className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-2xl font-serif text-white mb-3">Analyzing your setup</h2>
          <p className="text-gray-500 text-sm font-light max-w-md mx-auto">
            Cross-referencing your answers against Portuguese regulatory requirements and known compliance traps.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian py-12">
      <Seo
        title="Free compliance diagnostic: find hidden risks"
        description="Discover compliance risks you didn't know you had. Free diagnostic for remote professionals and freelancers in Portugal."
        canonicalUrl="https://app.worktugal.com/diagnostic"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] backdrop-blur-3xl rounded-3xl border border-white/[0.05] shadow-2xl shadow-black/30 p-8 md:p-12"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-2xl sm:text-3xl font-serif text-white mb-2">
                Compliance Risk Diagnostic
              </h2>
              <span className="text-xs font-light text-gray-500 uppercase tracking-widest">
                {formStep === 'email'
                  ? 'Final step'
                  : `Page ${questionPage + 1} of ${totalPages}`}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <div className="mt-4 text-xs font-light text-gray-500 uppercase tracking-widest">
              {formStep === 'email'
                ? 'Get Your Results'
                : `Setup & Compliance Questions`}
            </div>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              {formStep === 'questions' && (
                <motion.div
                  key={`page-${questionPage}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-10"
                >
                  {currentPageQuestions.map((question) => (
                    <div key={question.id}>
                      <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-2">
                        {question.text}
                      </label>
                      {question.description && (
                        <p className="text-[11px] text-gray-600 font-light mb-4 leading-relaxed">
                          {question.description}
                        </p>
                      )}
                      {renderQuestionInput(question)}
                    </div>
                  ))}
                </motion.div>
              )}

              {formStep === 'email' && (
                <motion.div
                  key="email-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-2xl font-serif text-white mb-2">
                      Your diagnostic is ready
                    </h3>
                    <p className="text-gray-500 font-light text-sm">
                      Enter your email to see your compliance risk results.
                    </p>
                  </div>

                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Shield className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-3">Your free results include</h4>
                        <ul className="text-sm text-gray-500 space-y-3 font-light">
                          <li className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-blue-500/50" />
                            Setup Score and Exposure Index
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-blue-500/50" />
                            Top compliance risks identified
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-blue-500/50" />
                            Risk severity classification
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-blue-500/50" />
                            Personalized action steps
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="bg-white/[0.02] border-white/5 font-light text-sm h-12 pl-11"
                      />
                    </div>
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mt-3">
                      Results delivered instantly. No spam.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-4">
                        First Name
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+351 9..."
                        className="bg-white/[0.02] border-white/5 font-light text-sm h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-start gap-4">
                      <div className="relative flex items-center h-5">
                        <input
                          type="checkbox"
                          id="marketing_consent"
                          checked={marketingConsent}
                          onChange={(e) => setMarketingConsent(e.target.checked)}
                          className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                      </div>
                      <label htmlFor="marketing_consent" className="text-xs text-gray-500 cursor-pointer select-none font-light leading-relaxed">
                        Send me compliance updates and tax deadline reminders.
                      </label>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="relative flex items-center h-5">
                        <input
                          type="checkbox"
                          id="accounting_interest"
                          checked={accountingInterest}
                          onChange={(e) => setAccountingInterest(e.target.checked)}
                          className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                      </div>
                      <label htmlFor="accounting_interest" className="text-xs text-gray-500 cursor-pointer select-none font-light leading-relaxed">
                        Keep me updated on available accounting partners.
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-12">
              {(questionPage > 0 || formStep === 'email') && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousPage}
                  className="flex items-center justify-center w-full sm:w-auto order-2 sm:order-1 border-white/5 hover:bg-white/5 text-xs font-medium uppercase tracking-widest px-8"
                >
                  <ArrowLeft className="w-3 h-3 mr-2" />
                  Back
                </Button>
              )}

              <div className="hidden sm:block flex-1" />

              {formStep === 'questions' ? (
                <Button
                  type="button"
                  onClick={handleNextPage}
                  disabled={!isPageComplete}
                  className="flex items-center justify-center w-full sm:w-auto order-1 sm:order-2 text-xs font-medium uppercase tracking-widest px-10"
                >
                  {questionPage < totalPages - 1 ? 'Next' : 'See Results'}
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isEmailValid || isSubmitting}
                  size="lg"
                  className="w-full sm:w-auto order-1 sm:order-2 text-xs font-medium uppercase tracking-widest px-10"
                >
                  {isSubmitting ? 'Analyzing...' : 'Get My Results'}
                </Button>
              )}
            </div>
          </form>
        </motion.div>

        <p className="text-[10px] text-gray-600 text-center mt-10 max-w-xl mx-auto uppercase tracking-[0.2em] font-medium leading-loose">
          Free compliance diagnostic. Data handled per our privacy policy. Not legal advice.
        </p>
      </div>
    </div>
  );
};
