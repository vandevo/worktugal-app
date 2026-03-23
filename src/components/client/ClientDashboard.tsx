import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile, notifyProfileUpdate } from '../../hooks/useUserProfile';
import { supabase } from '../../lib/supabase';
import { updateUserProfile } from '../../lib/profile';
import {
  ClipboardCheck,
  ArrowRight,
  BookOpen,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  Check,
} from 'lucide-react';

interface PastDiagnostic {
  id: string;
  setup_score: number;
  exposure_index: number;
  segment: string;
  country_target: string;
  created_at: string;
  trap_flags: Array<{ id: string; severity: string }> | null;
}

function SegmentBadge({ segment }: { segment: string }) {
  const configs: Record<string, { label: string; classes: string; icon: typeof CheckCircle }> = {
    protected:   { label: 'Protected',   classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', icon: CheckCircle },
    exposed:     { label: 'Exposed',     classes: 'bg-amber-50   text-amber-700   dark:bg-amber-500/10   dark:text-amber-400',   icon: AlertTriangle },
    critical:    { label: 'Critical',    classes: 'bg-red-50     text-red-700     dark:bg-red-500/10     dark:text-red-400',     icon: AlertTriangle },
    transitional:{ label: 'In Progress', classes: 'bg-blue-50    text-blue-700    dark:bg-blue-500/10    dark:text-blue-400',    icon: Clock },
  };
  const cfg = configs[segment] ?? configs.transitional;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] ${cfg.classes}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/8 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-xs font-black text-slate-700 dark:text-slate-300 w-7 text-right">{value}</span>
    </div>
  );
}

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { profile, getDisplayName } = useUserProfile();
  const [diagnostics, setDiagnostics] = useState<PastDiagnostic[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  useEffect(() => {
    setDisplayName(profile?.display_name || '');
  }, [profile]);

  const handleSaveName = async () => {
    if (!user) return;
    setNameSaving(true);
    try {
      await updateUserProfile(user.id, { display_name: displayName.trim() || null });
      notifyProfileUpdate();
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    } catch {
      // silent
    } finally {
      setNameSaving(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await supabase
          .from('compliance_diagnostics')
          .select('id, setup_score, exposure_index, segment, country_target, created_at, trap_flags')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        setDiagnostics(data ?? []);
      } catch {
        setDiagnostics([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const latest = diagnostics[0] ?? null;
  const firstName = getDisplayName().split(' ')[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] mb-2">
            Your Account
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Welcome back, {firstName}
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
            Track your Portugal compliance status and run new diagnostics.
          </p>
        </div>

        {/* ── Score summary if we have a latest run ───────────────── */}
        {latest && (
          <div className="bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 p-6 mb-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                  Latest diagnostic
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <SegmentBadge segment={latest.segment} />
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(latest.created_at).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <Link
                to={`/diagnostic/results?id=${latest.id}`}
                className="flex items-center gap-1.5 text-xs font-bold text-[#0F3D2E] dark:text-[#10B981] hover:underline"
              >
                View full results
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2">
                  Setup Score
                </p>
                <ScoreBar
                  value={latest.setup_score}
                  color={latest.setup_score >= 70 ? 'bg-[#10B981]' : latest.setup_score >= 40 ? 'bg-amber-400' : 'bg-red-400'}
                />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2">
                  Exposure Index
                </p>
                <ScoreBar
                  value={latest.exposure_index}
                  color={latest.exposure_index <= 30 ? 'bg-[#10B981]' : latest.exposure_index <= 60 ? 'bg-amber-400' : 'bg-red-400'}
                />
              </div>
            </div>

            {latest.trap_flags && latest.trap_flags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/6">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2">
                  Risks flagged
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {latest.trap_flags.slice(0, 6).map(t => (
                    <span
                      key={t.id}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.severity === 'high'
                          ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                          : t.severity === 'medium'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-white/6 dark:text-slate-400'
                      }`}
                    >
                      {t.id}
                    </span>
                  ))}
                  {latest.trap_flags.length > 6 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 dark:bg-white/6 dark:text-slate-400">
                      +{latest.trap_flags.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Quick action cards ───────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {/* Run diagnostic */}
          <Link
            to="/diagnostic"
            className="group flex flex-col gap-3 bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 p-5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0F3D2E]/8 dark:bg-[#10B981]/10 flex items-center justify-center">
              <ClipboardCheck className="w-4.5 h-4.5 text-[#0F3D2E] dark:text-[#10B981]" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Run Diagnostic</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Get your current compliance score in 2 min.
              </p>
            </div>
            <div className="mt-auto flex items-center gap-1 text-xs font-bold text-[#0F3D2E] dark:text-[#10B981]">
              Start now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Community */}
          <a
            href="https://t.me/worktugal"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 p-5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0F3D2E]/8 dark:bg-[#10B981]/10 flex items-center justify-center">
              <Users className="w-4.5 h-4.5 text-[#0F3D2E] dark:text-[#10B981]" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Community</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Follow for rule changes and compliance updates in Portugal.
              </p>
            </div>
            <div className="mt-auto flex items-center gap-1 text-xs font-bold text-[#0F3D2E] dark:text-[#10B981]">
              Join Telegram <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>
        </div>

        {/* ── Diagnostic history ───────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Diagnostic History
            </h2>
            <Link
              to="/diagnostic"
              className="text-xs font-bold text-[#0F3D2E] dark:text-[#10B981] hover:underline flex items-center gap-1"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Run new
            </Link>
          </div>

          {diagnostics.length === 0 ? (
            <div className="bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 p-10 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#0F3D2E]/6 dark:bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck className="w-6 h-6 text-[#0F3D2E] dark:text-[#10B981]" />
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">No diagnostics yet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
                Run your first compliance check to see your Setup Score and Exposure Index.
              </p>
              <Link
                to="/diagnostic"
                className="inline-flex items-center gap-2 bg-[#0F3D2E] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#1A5C44] transition-all"
              >
                Run free diagnostic
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 overflow-hidden">
              {diagnostics.map((d, i) => (
                <Link
                  key={d.id}
                  to={`/diagnostic/results?id=${d.id}`}
                  className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group ${
                    i !== 0 ? 'border-t border-slate-100 dark:border-white/6' : ''
                  }`}
                >
                  {/* Score bubble */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    d.setup_score >= 70
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                      : d.setup_score >= 40
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                      : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                  }`}>
                    {d.setup_score}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <SegmentBadge segment={d.segment} />
                      <span className="text-[10px] text-slate-400">
                        Exposure {d.exposure_index}
                      </span>
                      {d.trap_flags && d.trap_flags.length > 0 && (
                        <span className="text-[10px] text-red-500 dark:text-red-400 font-semibold">
                          {d.trap_flags.filter(t => t.severity === 'high').length} high risks
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(d.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                      {d.country_target && ` · ${d.country_target}`}
                    </p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-[#0F3D2E] dark:group-hover:text-[#10B981] transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── Useful links ─────────────────────────────────────────── */}
        <div className="bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 p-5 mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
            Official Resources
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: 'Portal das Finanças', href: 'https://info.portaldasfinancas.gov.pt' },
              { label: 'Segurança Social', href: 'https://www.seg-social.pt' },
              { label: 'AIMA (Immigration)', href: 'https://www.aima.gov.pt' },
              { label: 'ePortugal.gov.pt', href: 'https://eportugal.gov.pt' },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#0F3D2E] dark:hover:text-white transition-colors py-1.5 group"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-[#0F3D2E] dark:group-hover:text-[#10B981] transition-colors flex-shrink-0" />
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── Account settings ────────────────────────────────────── */}
        <div className="bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 p-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
            Account Settings
          </p>
          <div className="space-y-4">
            {/* Email — read only */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Email
              </label>
              <div className="h-11 flex items-center px-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-[#F5F4F2] dark:bg-white/[0.04] text-sm text-slate-400 dark:text-slate-500">
                {user?.email}
              </div>
            </div>

            {/* Display name */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Display Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="flex-1 h-11 px-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-[#F5F4F2] dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus-visible:outline-none focus:border-[#0F3D2E] dark:focus:border-[#10B981] transition-colors"
                />
                <button
                  onClick={handleSaveName}
                  disabled={nameSaving}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    nameSaved
                      ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                      : 'bg-[#0F3D2E] text-white hover:bg-[#1A5C44]'
                  }`}
                >
                  {nameSaved ? <><Check className="w-3.5 h-3.5" /> Saved</> : 'Save'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Leave empty to use your email username.
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom CTA ───────────────────────────────────────────── */}
        <div className="bg-[#0F3D2E] rounded-2xl p-8 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
          <div className="relative z-10">
            <h3 className="text-lg font-black text-white mb-2">
              Stay ahead of your compliance
            </h3>
            <p className="text-white/60 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
              Re-run the diagnostic whenever your situation changes — new clients, new visa, new country.
            </p>
            <Link
              to="/diagnostic"
              className="inline-flex items-center gap-2 bg-[#10B981] text-white px-7 py-3 rounded-xl text-sm font-bold hover:bg-[#059669] hover:scale-[1.03] active:scale-[0.97] transition-all shadow-lg shadow-black/20"
            >
              Run diagnostic now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
