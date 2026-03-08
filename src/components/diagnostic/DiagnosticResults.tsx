import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  Shield,
  ArrowRight,
  Lock,
  ExternalLink,
  MessageCircle,
  Send,
  Users,
  Phone,
  Calendar,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Seo } from '../Seo';
import { ComplianceDisclaimer } from '../ComplianceDisclaimer';
import { getDiagnosticResult } from '../../lib/diagnostic/submit';
import { SEGMENT_MESSAGES } from '../../lib/diagnostic';
import type { DiagnosticSegment, TriggeredTrap } from '../../lib/diagnostic';

const SEVERITY_CONFIG = {
  high: {
    border: 'border-red-500/20',
    bg: 'bg-red-500/[0.03]',
    text: 'text-red-400',
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    label: 'High Risk',
  },
  medium: {
    border: 'border-yellow-500/20',
    bg: 'bg-yellow-500/[0.03]',
    text: 'text-yellow-400',
    badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    label: 'Medium Risk',
  },
  low: {
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/[0.03]',
    text: 'text-blue-400',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    label: 'Low Risk',
  },
} as const;

const FREE_TRAP_LIMIT = 2;

export const DiagnosticResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const diagnosticId = searchParams.get('id');

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
  } | null>(null);

  useEffect(() => {
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
        });
        setLoading(false);
      } catch (err) {
        console.error('Error loading diagnostic:', err);
        setError('Failed to load results. Please try again.');
        setLoading(false);
      }
    })();
  }, [diagnosticId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-6" />
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
            Loading results...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-obsidian py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="error" className="bg-red-500/5 border-red-500/10 text-red-400">
            {error || 'Results not found'}
          </Alert>
          <div className="mt-8 text-center">
            <Button
              onClick={() => navigate('/diagnostic')}
              className="text-xs font-medium uppercase tracking-widest px-8"
            >
              Start New Diagnostic
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = data.payment_status === 'paid';
  const segment = data.segment as DiagnosticSegment;
  const segmentMessage = SEGMENT_MESSAGES[segment] ?? '';
  const traps = data.trap_flags ?? [];
  const highTraps = traps.filter((t) => t.severity === 'high');
  const mediumTraps = traps.filter((t) => t.severity === 'medium');
  const lowTraps = traps.filter((t) => t.severity === 'low');
  const visibleTraps = isPaid ? traps : traps.slice(0, FREE_TRAP_LIMIT);
  const hiddenTrapCount = isPaid ? 0 : Math.max(traps.length - FREE_TRAP_LIMIT, 0);

  const setupColor =
    data.setup_score >= 70 ? 'text-emerald-400' : data.setup_score >= 40 ? 'text-yellow-400' : 'text-red-400';
  const exposureColor =
    data.exposure_index <= 15 ? 'text-emerald-400' : data.exposure_index <= 40 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="min-h-screen bg-obsidian py-12">
      <Seo title="Your Compliance Risk Results" noindex={true} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Dual Score Card */}
          <div className="bg-white/[0.02] backdrop-blur-3xl rounded-3xl border border-white/[0.05] p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10 mb-6">
                <Shield className="w-3 h-3 text-blue-400" />
                <span className="text-[9px] uppercase tracking-[0.2em] text-blue-400/80 font-bold">
                  Compliance Risk Diagnostic v2.0
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif text-white mb-4">
                Your Risk Profile
              </h1>
              <p className="text-gray-500 font-light text-sm max-w-xl mx-auto leading-relaxed">
                {segmentMessage}
              </p>
            </div>

            {/* Dual Scores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white/[0.01] border border-white/5 rounded-2xl p-8 text-center"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-4">
                  Setup Score
                </p>
                <div className={`text-6xl font-serif ${setupColor} mb-2`}>
                  {data.setup_score}
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                  out of 100
                </p>
              </motion.div>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/[0.01] border border-white/5 rounded-2xl p-8 text-center"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-4">
                  Exposure Index
                </p>
                <div className={`text-6xl font-serif ${exposureColor} mb-2`}>
                  {data.exposure_index}
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                  risk points
                </p>
              </motion.div>
            </div>

            {/* Segment Summary */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="p-4 rounded-xl bg-red-500/[0.03] border border-red-500/10 text-center">
                <div className="text-xl font-medium text-red-400">{highTraps.length}</div>
                <div className="text-[9px] uppercase tracking-widest text-gray-600 font-bold mt-1">
                  High
                </div>
              </div>
              <div className="p-4 rounded-xl bg-yellow-500/[0.03] border border-yellow-500/10 text-center">
                <div className="text-xl font-medium text-yellow-400">{mediumTraps.length}</div>
                <div className="text-[9px] uppercase tracking-widest text-gray-600 font-bold mt-1">
                  Medium
                </div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/10 text-center">
                <div className="text-xl font-medium text-emerald-400">{lowTraps.length}</div>
                <div className="text-[9px] uppercase tracking-widest text-gray-600 font-bold mt-1">
                  Low
                </div>
              </div>
            </div>

            {/* Comparison stat */}
            <div className="mt-8 bg-blue-500/[0.02] border border-blue-500/5 rounded-xl p-6">
              <p className="text-gray-500 text-xs text-center font-light leading-relaxed">
                Based on 865 diagnostic completions, the average Setup Score is <span className="text-white font-medium">72</span>.
                {data.setup_score >= 72
                  ? ' Your setup is above average.'
                  : ' Your setup is below average — review the risks below.'}
              </p>
            </div>
          </div>

          {/* Triggered Traps */}
          {traps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/[0.01] rounded-3xl border border-white/5 p-8"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center relative">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  {highTraps.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-medium text-white">
                    {traps.length} Compliance {traps.length === 1 ? 'Risk' : 'Risks'} Detected
                  </h2>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mt-1">
                    {isPaid ? 'Full breakdown with source citations' : `Showing ${visibleTraps.length} of ${traps.length}`}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {visibleTraps.map((trap, index) => {
                  const config = SEVERITY_CONFIG[trap.severity];
                  return (
                    <motion.div
                      key={trap.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className={`p-6 rounded-2xl border ${config.border} ${config.bg}`}
                    >
                      <div className="flex items-start gap-4 mb-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold border ${config.badge}`}
                        >
                          {config.label}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm font-light leading-relaxed mb-3">
                        {trap.fix}
                      </p>

                      {isPaid && (
                        <div className="pt-3 border-t border-white/5 space-y-2">
                          <p className="text-[10px] text-gray-500 font-light">
                            <span className="text-gray-400 font-medium">Legal basis:</span>{' '}
                            {trap.legal_basis}
                          </p>
                          {trap.penalty_range && (
                            <p className="text-[10px] text-gray-500 font-light">
                              <span className="text-gray-400 font-medium">Penalty range:</span>{' '}
                              {trap.penalty_range}
                            </p>
                          )}
                          <a
                            href={trap.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[10px] text-blue-400 hover:text-blue-300 font-medium transition-colors"
                          >
                            View official source
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Locked traps teaser */}
              {hiddenTrapCount > 0 && (
                <div className="mt-6 p-6 rounded-2xl border border-white/5 bg-white/[0.01] relative overflow-hidden">
                  <div className="absolute inset-0 backdrop-blur-[2px] bg-obsidian/40 z-10 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="w-6 h-6 text-gray-500 mx-auto mb-3" />
                      <p className="text-sm text-gray-400 font-light">
                        {hiddenTrapCount} more {hiddenTrapCount === 1 ? 'risk' : 'risks'} detected
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 opacity-30">
                    {traps.slice(FREE_TRAP_LIMIT, FREE_TRAP_LIMIT + 2).map((trap) => (
                      <div key={trap.id} className="h-16 rounded-xl bg-white/[0.02] border border-white/5" />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* No traps state */}
          {traps.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-emerald-500/[0.02] rounded-3xl border border-emerald-500/10 p-8 text-center"
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-400/60 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-white mb-2">No compliance traps detected</h2>
              <p className="text-gray-500 text-sm font-light max-w-md mx-auto">
                Based on your answers, we did not identify any of the 6 common Portugal compliance traps. Continue monitoring your setup as regulations evolve.
              </p>
            </motion.div>
          )}

          {/* Clarity Call CTA */}
          {traps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/[0.02] rounded-3xl border border-blue-500/20 p-8 md:p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -z-10" />

              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 mb-6">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span className="text-[9px] uppercase tracking-[0.2em] text-emerald-400/80 font-bold">
                    Expert Review
                  </span>
                </div>

                <h2 className="text-2xl font-serif text-white mb-4">
                  Walk Through Your Risks With an Expert
                </h2>
                <p className="text-gray-500 font-light text-sm mb-10 leading-relaxed">
                  Your diagnostic found{' '}
                  <span className="text-white font-medium">
                    {traps.length} compliance {traps.length === 1 ? 'risk' : 'risks'}
                  </span>
                  . In a 30-minute clarity call, we review your specific situation,
                  explain exactly what each risk means for you, and give you a
                  prioritized action plan.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                      What you get
                    </h4>
                    <ul className="space-y-3">
                      {[
                        'Pre-briefed expert who already knows your risk profile',
                        'Plain-language explanation of each triggered risk',
                        'Prioritized action steps specific to your situation',
                        'Referral to a vetted tax advisor or lawyer if needed',
                        'Full trap breakdown with legal citations',
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-xs text-gray-400 font-light"
                        >
                          <div className="w-1 h-1 rounded-full bg-blue-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col justify-end">
                    <div className="mb-6">
                      <div className="text-3xl font-serif text-white">
                        €149
                        <span className="text-sm text-gray-500 ml-2 font-sans font-light">
                          30 minutes
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">
                        Video call via Google Meet or Zoom
                      </p>
                    </div>
                    <Button
                      size="lg"
                      className="w-full text-xs font-medium uppercase tracking-widest px-8"
                      onClick={() => {
                        const calUrl = import.meta.env.VITE_CLARITY_CALL_URL;
                        if (calUrl) {
                          window.open(calUrl, '_blank');
                        }
                      }}
                    >
                      <Calendar className="w-3 h-3 mr-2" />
                      Book Clarity Call
                    </Button>
                    <p className="text-[10px] text-gray-600 mt-3 text-center">
                      Powered by Cal.com. Cancel or reschedule anytime.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Community CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.01] rounded-3xl border border-white/5 p-10"
          >
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-blue-500/50" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-serif text-white mb-3">Community Support</h3>
                <p className="text-gray-500 text-sm font-light mb-8 leading-relaxed max-w-xl">
                  Join 1,300+ remote professionals navigating Portugal compliance. Share
                  experiences and stay updated on regulatory changes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button
                    onClick={() => window.open('https://t.me/worktugal', '_blank')}
                    className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] uppercase tracking-widest font-bold px-8"
                  >
                    <Send className="w-3 h-3 mr-2" />
                    Telegram Community
                  </Button>
                  <Button
                    onClick={() =>
                      window.open('https://www.facebook.com/groups/worktugal', '_blank')
                    }
                    variant="outline"
                    className="border-white/5 hover:bg-white/5 text-gray-400 hover:text-white text-[10px] uppercase tracking-widest font-bold px-8"
                  >
                    <Users className="w-3 h-3 mr-2" />
                    Facebook Group
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Disclaimer */}
          <ComplianceDisclaimer
            variant="inline"
            className="text-center mt-12 pb-24 text-[10px] opacity-50"
          />
        </motion.div>
      </div>

      {/* Sticky bottom CTA for users with traps */}
      {traps.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-obsidian/90 backdrop-blur-xl border-t border-white/5 py-4 px-6">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-gray-400 text-xs font-light">
                <span className="text-white font-medium">
                  {traps.length} {traps.length === 1 ? 'risk' : 'risks'} found.
                </span>{' '}
                Get expert help understanding what these mean for your situation.
              </p>
            </div>
            <Button
              size="sm"
              className="whitespace-nowrap px-8 text-[10px] uppercase tracking-widest font-bold"
              onClick={() => {
                const calUrl = import.meta.env.VITE_CLARITY_CALL_URL;
                if (calUrl) {
                  window.open(calUrl, '_blank');
                }
              }}
            >
              Book Clarity Call — €149
              <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
