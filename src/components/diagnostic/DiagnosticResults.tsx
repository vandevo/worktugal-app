import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  Shield,
  ExternalLink,
  Send,
  ListChecks,
  ArrowRight,
} from 'lucide-react';
import { Alert } from '../ui/Alert';
import { Seo } from '../Seo';
import { ComplianceDisclaimer } from '../ComplianceDisclaimer';
import { getDiagnosticResult } from '../../lib/diagnostic/submit';
import { SEGMENT_MESSAGES, getRecommendations } from '../../lib/diagnostic';
import type { DiagnosticSegment, TriggeredTrap, DiagnosticAnswers } from '../../lib/diagnostic';
import { ShareCard } from './ShareCard';
import { useAuth } from '../../hooks/useAuth';
import { signInWithGoogle } from '../../lib/auth';

// ── Severity config ─────────────────────────────────────────────────────────
const SEVERITY_CONFIG = {
  high: {
    leftBorder: 'border-l-4 border-l-red-500',
    bg: 'bg-white dark:bg-[#161618]',
    text: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
    label: 'High Risk',
  },
  medium: {
    leftBorder: 'border-l-4 border-l-amber-500',
    bg: 'bg-white dark:bg-[#161618]',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    label: 'Medium Risk',
  },
  low: {
    leftBorder: 'border-l-4 border-l-[#10B981]',
    bg: 'bg-white dark:bg-[#161618]',
    text: 'text-[#059669] dark:text-[#10B981]',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-[#10B981]/10 dark:text-[#10B981] dark:border-[#10B981]/20',
    label: 'Low Risk',
  },
} as const;

const DEMO_DATA = {
  id: 'demo',
  email: 'demo@worktugal.com',
  setup_score: 42,
  exposure_index: 55,
  segment: 'low_setup_high_exposure',
  payment_status: 'unpaid',
  trap_flags: [
    {
      id: 'permit_no_aima',
      severity: 'high' as const,
      fix: 'Your visa type requires an AIMA appointment to convert to a residence permit. Without scheduling this, you may be staying illegally once your visa entry period expires. AIMA appointments must be booked through the official AIMA portal. Fines for illegal stay: 80 to 700 EUR under Law 23/2007 Art. 192.',
      legal_basis: 'Law 23/2007 Art. 192 — illegal stay; AIMA residence permit conversion requirement',
      source_url: 'https://files.dre.pt/StaticContent/Lei_23_2007_EN.pdf',
      penalty_range: '80–700 EUR',
      exposureScore: 20,
      last_verified: '2026-03-12',
    },
    {
      id: 'unfiled_irs',
      severity: 'high' as const,
      fix: 'You have lived in Portugal over 183 days. Under CIRS Art. 16 you are a tax resident by law and must file IRS Modelo 3 including Annex J for foreign income and overseas bank accounts. The filing window is April 1 to June 30 each year. Penalty for late or missing filing: 150 to 3,750 EUR.',
      legal_basis: 'CIRS Art. 16 + IRS Modelo 3, Annex J — worldwide income declaration for residents',
      source_url: 'https://info.portaldasfinancas.gov.pt/pt/apoio_ao_contribuinte/Cidadaos/Rendimentos/Declaracao/Modelo_3/Paginas/default.aspx',
      penalty_range: '150–3,750 EUR for late filing',
      exposureScore: 20,
      last_verified: '2026-03-12',
    },
    {
      id: 'social_security_misalignment',
      severity: 'medium' as const,
      fix: 'Register for NISS (Social Security Identification Number). Freelancers must pay contributions between the 10th and 20th of each month. Missing payments result in debt accrual and benefit suspension.',
      legal_basis: 'Código Contributivo — freelancer contribution obligations',
      source_url: 'https://www2.gov.pt/pt/servicos/obter-informacoes-sobre-as-contribuicoes-para-a-seguranca-social-pagamento-de-trabalhador-independente',
      penalty_range: 'Arrears plus interest plus suspended benefits',
      exposureScore: 15,
      last_verified: '2026-03-05',
    },
  ],
  raw_answers: {
    visa_status: 'd7_visa',
    tax_residence: 'no',
    nif: 'yes',
    business_structure: 'freelancer_remote',
    social_security: 'no',
    banking: 'yes',
    time_in_portugal: 'more_than_183',
    aima_appointment: 'no',
    time_lived_in_portugal: 'more_than_183',
    monthly_income: '1020_to_4079',
    overstay_risk: 'no',
    foreign_tax_deregistration: 'unsure',
  },
};

export const DiagnosticResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const diagnosticId = searchParams.get('id');
  const isDemo = searchParams.get('demo') === 'true';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    id: string;
    email: string;
    setup_score: number;
    exposure_index: number;
    segment: string;
    trap_flags: TriggeredTrap[];
    payment_status: string;
    raw_answers: DiagnosticAnswers;
  } | null>(null);

  useEffect(() => {
    if (isDemo || diagnosticId === 'demo') {
      setData(DEMO_DATA);
      setLoading(false);
      return;
    }

    if (!diagnosticId) {
      setError('No diagnostic ID provided.');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const result = await getDiagnosticResult(diagnosticId);
        if (!result) {
          setError('Diagnostic not found.');
          setLoading(false);
          return;
        }
        setData({
          id: result.id,
          email: result.email,
          setup_score: result.setup_score,
          exposure_index: result.exposure_index,
          segment: result.segment,
          trap_flags: result.trap_flags as TriggeredTrap[],
          payment_status: result.payment_status,
          raw_answers: result.raw_answers,
        });
        setLoading(false);
      } catch (err) {
        console.error('Error loading diagnostic:', err);
        setError('Failed to load results. Please try again.');
        setLoading(false);
      }
    })();
  }, [diagnosticId, isDemo]);

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Loading results...
          </p>
        </div>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Alert variant="error">{error || 'Results not found'}</Alert>
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/diagnostic')}
            className="bg-[#0F3D2E] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#1A5C44] transition-all"
          >
            Start New Diagnostic
          </button>
        </div>
      </div>
    );
  }

  const segment = data.segment as DiagnosticSegment;
  const segmentMessage = SEGMENT_MESSAGES[segment] ?? '';
  const traps = data.trap_flags ?? [];
  const highTraps = traps.filter((t) => t.severity === 'high');
  const mediumTraps = traps.filter((t) => t.severity === 'medium');
  const lowTraps = traps.filter((t) => t.severity === 'low');
  const recommendations = getRecommendations(data.raw_answers ?? {});

  const setupScore = data.setup_score;
  const exposureIndex = data.exposure_index;

  const setupColor =
    setupScore >= 70 ? 'text-[#10B981]' : setupScore >= 40 ? 'text-amber-500' : 'text-red-500';
  const exposureColor =
    exposureIndex <= 15 ? 'text-[#10B981]' : exposureIndex <= 40 ? 'text-amber-500' : 'text-red-500';
  const setupBarColor =
    setupScore >= 70 ? 'bg-[#10B981]' : setupScore >= 40 ? 'bg-amber-500' : 'bg-red-500';
  const exposureBarColor =
    exposureIndex <= 15 ? 'bg-[#10B981]' : exposureIndex <= 40 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <>
      <Seo title="Your Compliance Risk Results" noindex={true} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >

          {/* ── Score Hero ─────────────────────────────────────────── */}
          <div className="bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-8 md:p-10">

            {/* Badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0F3D2E]/8 dark:bg-[#10B981]/10 border border-[#0F3D2E]/10 dark:border-[#10B981]/20">
                <Shield className="w-3 h-3 text-[#0F3D2E] dark:text-[#10B981]" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0F3D2E] dark:text-[#10B981]">
                  Compliance Risk Diagnostic v2.0
                </span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white text-center mb-3 tracking-tight">
              Your Risk Profile
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-xl mx-auto leading-relaxed mb-10">
              {segmentMessage}
            </p>

            {/* Dual score cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* Setup Score */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-[#F5F4F2] dark:bg-white/[0.04] rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Setup Score
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-5xl font-black ${setupColor}`}>{setupScore}</span>
                  <span className="text-lg font-bold text-slate-400">/100</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${setupBarColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${setupScore}%` }}
                    transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </motion.div>

              {/* Exposure Index */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-[#F5F4F2] dark:bg-white/[0.04] rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Exposure Index
                  </span>
                  <AlertTriangle className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className={`text-5xl font-black ${exposureColor}`}>{exposureIndex}</span>
                  <span className="text-base font-bold text-slate-500 dark:text-slate-400">pts</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${exposureBarColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(exposureIndex, 100)}%` }}
                    transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Risk breakdown */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/[0.05] border border-red-100 dark:border-red-500/10 text-center">
                <div className="text-2xl font-black text-red-500">{highTraps.length}</div>
                <div className="text-[9px] font-black uppercase tracking-[0.15em] text-red-400 mt-0.5">High</div>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/[0.05] border border-amber-100 dark:border-amber-500/10 text-center">
                <div className="text-2xl font-black text-amber-500">{mediumTraps.length}</div>
                <div className="text-[9px] font-black uppercase tracking-[0.15em] text-amber-400 mt-0.5">Medium</div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-[#10B981]/[0.05] border border-emerald-100 dark:border-[#10B981]/10 text-center">
                <div className="text-2xl font-black text-[#10B981]">{lowTraps.length}</div>
                <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#10B981]/70 mt-0.5">Low</div>
              </div>
            </div>

            {/* Benchmark */}
            <div className="bg-[#F5F4F2] dark:bg-white/[0.03] rounded-xl p-4 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Based on 865 diagnostic completions, the average Setup Score is{' '}
                <span className="text-slate-900 dark:text-white font-bold">72</span>.
                {setupScore >= 72
                  ? ' Your setup is above average.'
                  : ' Your setup is below average — review the risks below.'}
              </p>
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center mt-4">
              Rules verified against official sources · Last updated: Feb 14, 2026
            </p>
          </div>

          {/* ── Save banner (unauthenticated only) ─────────────────── */}
          {!user && !isDemo && (
            <div className="flex items-center justify-between gap-4 bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 px-5 py-4">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Save your results</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Access them anytime from My Account.</p>
              </div>
              <button
                onClick={() => signInWithGoogle()}
                className="flex-shrink-0 flex items-center gap-2.5 bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm whitespace-nowrap"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
          )}

          {/* ── Share Card ─────────────────────────────────────────── */}
          <ShareCard
            setupScore={data.setup_score}
            exposureIndex={data.exposure_index}
            highCount={highTraps.length}
            mediumCount={mediumTraps.length}
            lowCount={lowTraps.length}
            diagnosticId={data.id}
          />

          {/* ── Triggered Traps ────────────────────────────────────── */}
          {traps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-8"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
                  </div>
                  {highTraps.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#161618]" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {traps.length} Compliance {traps.length === 1 ? 'Risk' : 'Risks'} Detected
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">
                    Full breakdown with source citations
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {traps.map((trap, index) => {
                  const config = SEVERITY_CONFIG[trap.severity];
                  return (
                    <motion.div
                      key={trap.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className={`rounded-xl border border-slate-100 dark:border-white/8 ${config.leftBorder} ${config.bg} p-5 pl-6`}
                    >
                      <div className="mb-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${config.badge}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
                        {trap.fix}
                      </p>
                      <div className="pt-3 border-t border-slate-100 dark:border-white/8 space-y-1.5">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Legal basis:</span>{' '}
                          {trap.legal_basis}
                        </p>
                        {trap.penalty_range && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Penalty range:</span>{' '}
                            {trap.penalty_range}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-1">
                          <a
                            href={trap.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] text-[#0F3D2E] dark:text-[#10B981] hover:opacity-70 font-semibold transition-opacity"
                          >
                            View official source
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          {trap.last_verified && (
                            <p className="text-[10px] text-slate-400">
                              Verified{' '}
                              {new Date(trap.last_verified).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── No traps ───────────────────────────────────────────── */}
          {traps.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-emerald-50 dark:bg-[#10B981]/[0.04] rounded-2xl border border-emerald-100 dark:border-[#10B981]/15 p-10 text-center"
            >
              <CheckCircle2 className="w-10 h-10 text-[#10B981] mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                No compliance traps detected
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                Based on your answers, we did not identify any of the common Portugal compliance traps. Continue monitoring your setup as regulations evolve.
              </p>
            </motion.div>
          )}

          {/* ── Recommendations ────────────────────────────────────── */}
          {recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#0F3D2E]/8 dark:bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                  <ListChecks className="w-5 h-5 text-[#0F3D2E] dark:text-[#10B981]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Next steps for your setup
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">
                    Based on your answers
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* ── Community CTA ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#0F3D2E] rounded-2xl p-10 text-center relative overflow-hidden"
          >
            {/* Dot texture */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }}
            />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 mb-5">
                <Send className="w-3 h-3 text-[#10B981]" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#10B981]">
                  Community
                </span>
              </div>
              <h3 className="text-xl font-black text-white mb-3">
                Join the Worktugal community
              </h3>
              <p className="text-white/60 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
                Ask questions, share your experience, and get monthly compliance updates for Portugal.
              </p>
              <button
                onClick={() => window.open('https://t.me/worktugal', '_blank')}
                className="inline-flex items-center gap-2 bg-[#10B981] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#059669] hover:scale-[1.03] active:scale-[0.97] transition-all shadow-lg shadow-black/20"
              >
                <Send className="w-4 h-4" />
                Join Telegram
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* ── Run again ──────────────────────────────────────────── */}
          <div className="text-center">
            <button
              onClick={() => navigate('/diagnostic')}
              className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0F3D2E] dark:hover:text-white transition-colors"
            >
              Run diagnostic again →
            </button>
          </div>

          <ComplianceDisclaimer
            variant="inline"
            className="pb-8"
          />
        </motion.div>
      </div>
    </>
  );
};
