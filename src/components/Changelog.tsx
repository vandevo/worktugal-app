import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Rocket,
  Sparkles,
  Shield,
  Cpu,
  Layout as LayoutIcon,
  Globe,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Seo } from './Seo';

interface ChangelogEntry {
  id: string;
  date: string;
  category: 'feature' | 'fix' | 'database' | 'ui' | 'integration' | 'security' | 'performance' | 'content' | 'docs';
  title: string;
  details: string | null;
  version: string | null;
}

// ── Category config ──────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<string, {
  label: string;
  icon: React.ReactNode;
  dot: string;
  badge: string;
}> = {
  feature: {
    label: 'New Feature',
    icon: <Rocket className="w-3.5 h-3.5" />,
    dot: 'bg-[#0F3D2E]',
    badge: 'bg-[#0F3D2E]/8 text-[#0F3D2E] border-[#0F3D2E]/15 dark:bg-[#10B981]/10 dark:text-[#10B981] dark:border-[#10B981]/20',
  },
  fix: {
    label: 'Improvement',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    dot: 'bg-[#10B981]',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-[#10B981]/10 dark:text-[#10B981] dark:border-[#10B981]/20',
  },
  ui: {
    label: 'Design',
    icon: <LayoutIcon className="w-3.5 h-3.5" />,
    dot: 'bg-violet-500',
    badge: 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20',
  },
  security: {
    label: 'Security',
    icon: <Shield className="w-3.5 h-3.5" />,
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  },
  performance: {
    label: 'Performance',
    icon: <Cpu className="w-3.5 h-3.5" />,
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  },
  integration: {
    label: 'Integration',
    icon: <Globe className="w-3.5 h-3.5" />,
    dot: 'bg-teal-500',
    badge: 'bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20',
  },
  database: {
    label: 'Core Update',
    icon: <FileText className="w-3.5 h-3.5" />,
    dot: 'bg-slate-500',
    badge: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/8 dark:text-slate-400 dark:border-white/10',
  },
  content: {
    label: 'Content',
    icon: <FileText className="w-3.5 h-3.5" />,
    dot: 'bg-slate-500',
    badge: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/8 dark:text-slate-400 dark:border-white/10',
  },
  docs: {
    label: 'Guide',
    icon: <FileText className="w-3.5 h-3.5" />,
    dot: 'bg-slate-500',
    badge: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/8 dark:text-slate-400 dark:border-white/10',
  },
};

function getCategoryConfig(category: string) {
  return CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.docs;
}

// ── Static fallback entries ──────────────────────────────────────────────────
const FALLBACK_ENTRIES: ChangelogEntry[] = [
  // ── v4.2 — 2026-05-02 ─────────────────────────────────────────────────────
  {
    id: 'homepage-copy-refresh',
    date: '2026-05-02',
    category: 'ui',
    title: 'Homepage refreshed with clearer messaging',
    details: 'Hero rewritten to highlight the average uncovered compliance exposure (over €3,750). Feature cards now show what you actually get: your Setup Score, Exposure Index, and prioritized Action Plan. New social proof bar with real numbers. Updated CTA section with stronger framing.',
    version: 'v4.2',
  },
  // ── v4.1 — 2026-05-01 ─────────────────────────────────────────────────────
  {
    id: 'uptime-monitoring',
    date: '2026-05-01',
    category: 'feature',
    title: 'Live uptime status on every page',
    details: 'Every page now shows a live status indicator in the footer. Green dot means all systems operational, checked every 60 seconds.',
    version: 'v4.1',
  },
  // ── v4.0 — 2026-04-28 ─────────────────────────────────────────────────────
  {
    id: 'radar-launch',
    date: '2026-04-28',
    category: 'feature',
    title: 'Portugal Radar — compliance monitoring for your situation',
    details: 'New B2C product at app.worktugal.com/radar. Weekly digest of Portuguese law changes that affect your visa, tax, or residency. Official government sources (Diário da República, AIMA, Portal das Finanças) translated into plain English. Sign up with email or Google. €5/mo.',
    version: 'v4.0',
  },
  {
    id: 'compliance-monitor-pipeline',
    date: '2026-04-25',
    category: 'integration',
    title: 'Compliance Monitor active - tracking Portuguese law daily',
    details: 'Every regulatory change published in Diário da República is detected and summarized within hours. New rules affecting visa, tax, and social security are flagged and categorized so you know what changed and whether it affects your situation.',
    version: 'v4.0',
  },
  // ── v3.2 — 2026-03-25 ─────────────────────────────────────────────────────
  {
    id: 'welcome-email',
    date: '2026-03-25',
    category: 'feature',
    title: 'Welcome email when you create an account',
    details: 'New accounts at app.worktugal.com now receive a welcome email automatically — with a direct link to run your diagnostic, the Telegram channel for compliance updates, and a pointer to the free guides library.',
    version: 'v3.2',
  },
  {
    id: 'blog-guides-launch',
    date: '2026-03-25',
    category: 'feature',
    title: 'Compliance guides — blog.worktugal.com',
    details: 'Launched a free compliance knowledge base at blog.worktugal.com. First guide: NISS in Portugal — a deep-dive on social security registration, including the December 2025 change to employer reporting deadlines.',
    version: 'v3.2',
  },
  {
    id: 'first-time-diagnostic-redirect',
    date: '2026-03-25',
    category: 'fix',
    title: 'New accounts go straight to the diagnostic',
    details: 'If you sign up and have no previous diagnostic results, you are now taken directly to the diagnostic instead of an empty dashboard.',
    version: 'v3.2',
  },
  {
    id: 'dashboard-guides-card',
    date: '2026-03-25',
    category: 'fix',
    title: 'Guides shortcut on the dashboard',
    details: 'The My Account dashboard now has a quick-access card linking to the compliance guides library at blog.worktugal.com.',
    version: 'v3.2',
  },
  {
    id: 'telegram-channel',
    date: '2026-03-25',
    category: 'feature',
    title: 'Worktugal on Telegram',
    details: 'The official Worktugal Telegram channel is live at t.me/worktugal. Subscribe for compliance law changes, new guide alerts, and AIMA and AT deadline reminders specific to Portugal.',
    version: 'v3.2',
  },
  // ── v3.1 — 2026-03-19 ─────────────────────────────────────────────────────
  {
    id: 'my-account-dashboard',
    date: '2026-03-19',
    category: 'feature',
    title: 'My Account dashboard',
    details: 'New personal dashboard showing your latest compliance score, diagnostic history, and account settings — all in one place. Accessible from the nav menu for every signed-in user. Replaces the old admin-only Dashboard with a user-first design.',
    version: 'v3.1',
  },
  {
    id: 'inline-profile-editing',
    date: '2026-03-19',
    category: 'fix',
    title: 'Inline profile editing — ProfileModal removed',
    details: 'Display name editing is now built directly into the My Account page with a Save button that turns green on success. The separate Edit Profile modal has been removed entirely for a simpler, less disruptive flow.',
    version: 'v3.1',
  },
  {
    id: 'google-signin-diagnostic',
    date: '2026-03-19',
    category: 'feature',
    title: 'Google Sign-In on the diagnostic contact step',
    details: 'Added a "Continue with Google" button on the final diagnostic step so users can save their results without typing an email. Diagnostic answers, current step, and question page are persisted in sessionStorage so nothing is lost across the OAuth redirect.',
    version: 'v3.1',
  },
  {
    id: 'save-results-banner',
    date: '2026-03-19',
    category: 'feature',
    title: '"Save results" sign-in prompt on results page',
    details: 'Unauthenticated users who complete the diagnostic now see a compact "Save your results — Continue with Google" banner directly on the results page, reducing friction for account creation at the moment of highest intent.',
    version: 'v3.1',
  },
  {
    id: 'footer-legal-faq-rebuild',
    date: '2026-03-19',
    category: 'ui',
    title: 'Footer, legal pages, FAQ, and cookie banner rebuilt',
    details: 'Footer, Privacy Policy, Terms of Service, FAQ accordion, and Cookie Consent Banner all rebuilt from scratch in Emerald Zenith. Forest green footer with no phone/WhatsApp, clean prose legal pages, Telegram + LinkedIn links, and a compact bottom-right cookie card with per-category toggle switches.',
    version: 'v3.1',
  },
  {
    id: 'compliance-disclaimer',
    date: '2026-03-19',
    category: 'content',
    title: 'Compliance disclaimer module',
    details: 'Added a reusable ComplianceDisclaimer component with three layout variants (inline, banner, footer). Surfaces the "for informational purposes only — not legal advice" notice consistently wherever diagnostic results are shown.',
    version: 'v3.1',
  },
  // ── v3.0 — 2026-03-19 ─────────────────────────────────────────────────────
  {
    id: 'v3-redesign',
    date: '2026-03-19',
    category: 'ui',
    title: 'Emerald Zenith — full UI/UX redesign',
    details: 'Complete rebuild of the design system. Light mode first, Inter font, forest green (#0F3D2E) brand palette, glassmorphism score cards on the homepage, and redesigned diagnostic flow with 4px colored left borders on risk cards. All pages now adapt seamlessly between light and dark modes.',
    version: 'v3.0',
  },
  {
    id: 'google-oauth',
    date: '2026-03-19',
    category: 'feature',
    title: 'Google Sign-In added',
    details: 'Users can now sign in or create an account with a single click using their Google account. No separate password needed.',
    version: 'v3.0',
  },
  // ── v2.8 — 2026-03-13 ─────────────────────────────────────────────────────
  {
    id: 'share-card',
    date: '2026-03-13',
    category: 'feature',
    title: 'Shareable result card with PNG export',
    details: 'After completing the diagnostic, you can download a branded PNG score card or copy a pre-formatted text snippet to share on Reddit, LinkedIn, or Telegram.',
    version: 'v2.8',
  },
  // ── v2.0 — 2025-12-01 ─────────────────────────────────────────────────────
  {
    id: 'diagnostic-v2',
    date: '2025-12-01',
    category: 'feature',
    title: 'Dual-score diagnostic engine',
    details: 'Launched the Setup Score + Exposure Index methodology. 13 conditional questions mapped to Portugal\'s compliance framework across AT (tax authority), AIMA (immigration), and Segurança Social. Each triggered trap includes legal basis, penalty range, and a verified official source URL.',
    version: 'v2.0',
  },
  // ── v1.0 — 2025-10-01 ─────────────────────────────────────────────────────
  {
    id: 'launch',
    date: '2025-10-01',
    category: 'feature',
    title: 'Worktugal launched',
    details: 'First public release. Email-gated compliance risk diagnostic for freelancers and remote workers planning to live in Portugal. Results delivered via the platform with a breakdown across tax, immigration, and social security risk categories.',
    version: 'v1.0',
  },
];

export const Changelog: React.FC = () => {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('project_changelog')
          .select('id, date, category, title, details, version')
          .eq('is_public', true)
          .order('date', { ascending: false });

        if (error) throw error;
        setEntries(data && data.length > 0 ? data : FALLBACK_ENTRIES);
      } catch {
        setEntries(FALLBACK_ENTRIES);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Group entries by year/month for section headers
  const grouped = entries.reduce<Record<string, ChangelogEntry[]>>((acc, entry) => {
    const key = new Date(entry.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  return (
    <>
      <Seo
        title="Changelog — Worktugal product updates"
        description="Product updates, new features, and compliance intelligence improvements for Worktugal."
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-20">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <span className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full mb-5">
            Product Updates
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.05] mb-4">
            What's new in Worktugal
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            Tracking our journey building compliance risk intelligence for remote workers and freelancers in Portugal.
          </p>
        </motion.div>

        {/* ── Loading ───────────────────────────────────────────────── */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ── Timeline ──────────────────────────────────────────────── */}
        {!loading && (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-200 dark:bg-white/8" />

            <div className="space-y-10">
              {Object.entries(grouped).map(([monthYear, monthEntries]) => (
                <div key={monthYear}>
                  {/* Month label */}
                  <div className="flex items-center gap-4 mb-6 ml-[28px]">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                      {monthYear}
                    </span>
                  </div>

                  <div className="space-y-5">
                    {monthEntries.map((entry, i) => {
                      const config = getCategoryConfig(entry.category);
                      return (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.05 }}
                          className="flex gap-5"
                        >
                          {/* Dot */}
                          <div className="flex-shrink-0 mt-5">
                            <div className={`w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0E0E10] ${config.dot} relative z-10`} />
                          </div>

                          {/* Card */}
                          <div className="flex-1 bg-white dark:bg-[#161618] rounded-xl border border-[#0F3D2E]/8 dark:border-white/8 p-5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all">
                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border ${config.badge}`}>
                                {config.icon}
                                {config.label}
                              </span>
                              {entry.version && (
                                <span className="text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-[#0F3D2E]/8 text-[#0F3D2E] border border-[#0F3D2E]/15 dark:bg-[#10B981]/10 dark:text-[#10B981] dark:border-[#10B981]/20">
                                  {entry.version}
                                </span>
                              )}
                              <span className="ml-auto text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                                {new Date(entry.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>

                            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                              {entry.title}
                            </h2>

                            {entry.details && (
                              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                {entry.details}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-[#0F3D2E] rounded-2xl p-10 text-center relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
          <div className="relative z-10">
            <h3 className="text-xl font-black text-white mb-3">
              Try the diagnostic yourself
            </h3>
            <p className="text-white/60 text-sm mb-7 max-w-xs mx-auto leading-relaxed">
              Free 2-minute compliance check. No account needed to get your results.
            </p>
            <button
              onClick={() => navigate('/diagnostic')}
              className="inline-flex items-center gap-2 bg-[#10B981] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#059669] hover:scale-[1.03] active:scale-[0.97] transition-all shadow-lg shadow-black/20"
            >
              Run free diagnostic
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

      </div>
    </>
  );
};
