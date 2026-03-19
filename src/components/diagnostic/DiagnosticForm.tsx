import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Shield, Loader2, Mail } from 'lucide-react';
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
import { signInWithGoogle } from '../../lib/auth';

type FormStep = 'questions' | 'email' | 'analyzing';

const QUESTIONS_PER_PAGE = 1;

export const DiagnosticForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [answers, setAnswers] = useState<DiagnosticAnswers>(() => {
    try { return JSON.parse(sessionStorage.getItem('diag_answers') || '{}'); } catch { return {}; }
  });
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [accountingInterest, setAccountingInterest] = useState(false);
  const [formStep, setFormStep] = useState<FormStep>(() => {
    const saved = sessionStorage.getItem('diag_step') as FormStep | null;
    return saved === 'email' ? 'email' : 'questions';
  });
  const [questionPage, setQuestionPage] = useState(() => {
    try { return parseInt(sessionStorage.getItem('diag_page') || '0', 10); } catch { return 0; }
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persist state across OAuth redirect
  useEffect(() => { sessionStorage.setItem('diag_answers', JSON.stringify(answers)); }, [answers]);
  useEffect(() => { sessionStorage.setItem('diag_step', formStep); }, [formStep]);
  useEffect(() => { sessionStorage.setItem('diag_page', String(questionPage)); }, [questionPage]);

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
      sessionStorage.removeItem('diag_answers');
      sessionStorage.removeItem('diag_step');
      sessionStorage.removeItem('diag_page');
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
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleAnswer(question.id, opt.value)}
              className={`w-full px-5 py-4 rounded-xl border-2 transition-all text-sm font-semibold ${
                currentValue === opt.value
                  ? 'border-[#0F3D2E] bg-[#0F3D2E]/8 text-[#0F3D2E] dark:border-[#10B981] dark:bg-[#10B981]/10 dark:text-[#10B981]'
                  : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:border-[#0F3D2E]/40 dark:hover:border-white/20 hover:bg-[#0F3D2E]/3'
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
              className={`w-full px-4 py-4 rounded-xl border-2 transition-all text-sm font-semibold text-left ${
                currentValue === opt.value
                  ? 'border-[#0F3D2E] bg-[#0F3D2E]/8 text-[#0F3D2E] dark:border-[#10B981] dark:bg-[#10B981]/10 dark:text-[#10B981]'
                  : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:border-[#0F3D2E]/40 dark:hover:border-white/20 hover:bg-[#0F3D2E]/3'
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

  // ── Analyzing state ──────────────────────────────────────────────────────
  if (formStep === 'analyzing') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <Seo title="Analyzing your compliance..." noindex={true} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-16 h-16 mx-auto mb-8">
            <Loader2 className="w-16 h-16 text-[#10B981] animate-spin" />
            <Shield className="w-6 h-6 text-[#0F3D2E] dark:text-[#10B981] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Analyzing your setup
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Cross-referencing your answers against Portuguese regulatory requirements and known compliance traps.
          </p>
        </motion.div>
      </div>
    );
  }

  // ── Main form ────────────────────────────────────────────────────────────
  return (
    <>
      <Seo
        title="Free compliance diagnostic: find hidden risks"
        description="Discover compliance risks you didn't know you had. Free diagnostic for remote professionals and freelancers in Portugal."
        canonicalUrl="https://app.worktugal.com/diagnostic"
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-8 md:p-10"
        >
          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Compliance Risk Diagnostic
              </h1>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                {formStep === 'email'
                  ? 'Final step'
                  : `${questionPage + 1} / ${totalPages}`}
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#10B981] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              {formStep === 'email' ? 'Get your results' : 'Setup & compliance questions'}
            </p>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              {/* ── Questions ──────────────────────────────────────── */}
              {formStep === 'questions' && (
                <motion.div
                  key={`page-${questionPage}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  {currentPageQuestions.map((question) => (
                    <div key={question.id}>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-snug">
                        {question.text}
                      </h2>
                      {question.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                          {question.description}
                        </p>
                      )}
                      {renderQuestionInput(question)}
                    </div>
                  ))}
                </motion.div>
              )}

              {/* ── Email step ─────────────────────────────────────── */}
              {formStep === 'email' && (
                <motion.div
                  key="email-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-7"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1.5">
                      Your diagnostic is ready
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      Enter your email to see your compliance risk results.
                    </p>
                  </div>

                  {/* What's included */}
                  <div className="bg-[#0F3D2E]/5 dark:bg-[#10B981]/8 border border-[#0F3D2E]/10 dark:border-[#10B981]/15 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-[#0F3D2E]/10 dark:bg-[#10B981]/15 rounded-lg flex-shrink-0">
                        <Shield className="w-4 h-4 text-[#0F3D2E] dark:text-[#10B981]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2.5">
                          Your free results include
                        </p>
                        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                          {[
                            'Setup Score and Exposure Index',
                            'All compliance risks detected, with severity',
                            'Legal basis and penalty ranges for each risk',
                            'Official source citations you can verify yourself',
                          ].map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-[#10B981] flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Google fast-track */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => signInWithGoogle()}
                      className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/8 transition-all"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-slate-200 dark:bg-white/8" />
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">or</span>
                      <div className="flex-1 h-px bg-slate-200 dark:bg-white/8" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full h-12 pl-10 pr-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-[#F5F4F2] dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus-visible:outline-none focus:border-[#0F3D2E] dark:focus:border-[#10B981] transition-colors"
                      />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">
                      Results delivered instantly · No spam
                    </p>
                  </div>

                  {/* Name + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2.5">
                        First Name
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John"
                        className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-[#F5F4F2] dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus-visible:outline-none focus:border-[#0F3D2E] dark:focus:border-[#10B981] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2.5">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+351 9..."
                        className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-[#F5F4F2] dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus-visible:outline-none focus:border-[#0F3D2E] dark:focus:border-[#10B981] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Consents */}
                  <div className="space-y-3 pt-1">
                    {[
                      {
                        id: 'marketing_consent',
                        checked: marketingConsent,
                        onChange: setMarketingConsent,
                        label: 'Send me compliance updates and tax deadline reminders.',
                      },
                      {
                        id: 'accounting_interest',
                        checked: accountingInterest,
                        onChange: setAccountingInterest,
                        label: 'Keep me updated on available accounting partners.',
                      },
                    ].map(({ id, checked, onChange, label }) => (
                      <label key={id} htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center h-5 mt-0.5">
                          <input
                            type="checkbox"
                            id={id}
                            checked={checked}
                            onChange={(e) => onChange(e.target.checked)}
                            className="w-4 h-4 rounded border-2 border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#0F3D2E] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#0F3D2E]"
                          />
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Navigation ─────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              {(questionPage > 0 || formStep === 'email') && (
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-slate-400 hover:border-[#0F3D2E]/40 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white transition-all order-2 sm:order-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}

              <div className="hidden sm:block flex-1" />

              {formStep === 'questions' ? (
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={!isPageComplete}
                  className="flex items-center justify-center gap-2 bg-[#0F3D2E] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#1A5C44] hover:shadow-lg hover:shadow-[#0F3D2E]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none order-1 sm:order-2"
                >
                  {questionPage < totalPages - 1 ? 'Next' : 'See Results'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isEmailValid || isSubmitting}
                  className="flex items-center justify-center gap-2 bg-[#0F3D2E] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#1A5C44] hover:shadow-lg hover:shadow-[#0F3D2E]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none order-1 sm:order-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Get My Results
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>

        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center mt-8 leading-loose">
          Free diagnostic · Data handled per our privacy policy · Not legal advice
        </p>
      </div>
    </>
  );
};
