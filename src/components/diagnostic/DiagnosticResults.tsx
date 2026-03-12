import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  Shield,
  ExternalLink,
  Send,
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

  const segment = data.segment as DiagnosticSegment;
  const segmentMessage = SEGMENT_MESSAGES[segment] ?? '';
  const traps = data.trap_flags ?? [];
  const highTraps = traps.filter((t) => t.severity === 'high');
  const mediumTraps = traps.filter((t) => t.severity === 'medium');
  const lowTraps = traps.filter((t) => t.severity === 'low');

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
            <p className="text-[10px] text-gray-600 text-center mt-4">
              Rules verified against official sources. Last updated: Feb 14, 2026.
            </p>
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
                        {trap.last_verified && (
                          <p className="text-[10px] text-gray-600 font-light">
                            <span className="text-gray-500 font-medium">Verified:</span>{' '}
                            {new Date(trap.last_verified).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
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


          {/* Community CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.01] rounded-3xl border border-white/5 p-10"
          >
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 mb-6">
                <Send className="w-3 h-3 text-gray-400" />
                <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                  Community
                </span>
              </div>
              <h3 className="text-xl font-serif text-white mb-3">
                Join the Worktugal community.
              </h3>
              <p className="text-gray-500 text-sm font-light mb-8 max-w-sm mx-auto">
                Ask questions, share your experience, and follow along as we build.
              </p>
              <Button
                onClick={() => window.open('https://t.me/worktugal', '_blank')}
                className="bg-white/[0.03] hover:bg-white/[0.06] text-gray-300 border border-white/5 text-[10px] uppercase tracking-widest font-bold px-8"
              >
                <Send className="w-3 h-3 mr-2" />
                Join Telegram
              </Button>
            </div>
          </motion.div>

          {/* Disclaimer */}
          <ComplianceDisclaimer
            variant="inline"
            className="text-center mt-12 pb-24 text-[10px] opacity-50"
          />
        </motion.div>
      </div>

    </div>
  );
};
