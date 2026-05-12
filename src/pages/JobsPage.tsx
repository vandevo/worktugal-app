import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { supabase } from '../lib/supabase';
import { JobCard } from '../components/jobs/JobCard';

interface Job {
  id: string; company_slug: string; title: string; location: string;
  department: string | null; apply_url: string; source: string;
  posted_at: string; remote_policy: string | null;
  visa_sponsorship: boolean | null; d8_eligible: boolean | null;
  seniority: string | null; skills: string[] | null; expires_at: string | null;
  salary_min: number | null; salary_max: number | null;
  salary_currency: string | null; locations: string[] | null;
  is_eu_eligible: boolean | null;
}

const COMPANY: Record<string, string> = {
  'anthropic': 'Anthropic', 'gitlab': 'GitLab',
  'databricks': 'Databricks', 'mistral-ai': 'Mistral AI',
  'stripe': 'Stripe', 'figma': 'Figma',
};

const PER_PAGE = 50;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

export const JobsPage: React.FC = () => {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('ai_jobs')
        .select('*')
        .eq('is_active', true)
        .eq('is_eu_eligible', true)
        .order('posted_at', { ascending: false });
      if (err) { setError('Failed to load jobs.'); setLoading(false); return; }
      setAllJobs((data || []) as Job[]);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const companies = useMemo(() => [...new Set(allJobs.map((j) => j.company_slug))].sort(), [allJobs]);

  const departments = useMemo(
    () => [...new Set(allJobs.map((j) => j.department).filter(Boolean))].sort().slice(0, 30),
    [allJobs]
  );

  const jobStats = useMemo(() => {
    const now = Date.now();
    const day = 86400000;
    const today = allJobs.filter((j) => now - new Date(j.posted_at).getTime() < day).length;
    const week = allJobs.filter((j) => now - new Date(j.posted_at).getTime() < 7 * day).length;
    return { today, week };
  }, [allJobs]);

  const filtered = useMemo(() => {
    return allJobs.filter((job) => {
      if (companyFilter && job.company_slug !== companyFilter) return false;
      if (deptFilter && job.department !== deptFilter) return false;
      return true;
    });
  }, [allJobs, companyFilter, deptFilter]);

  const visible = filtered.slice(0, visibleCount);
  const totalFiltered = filtered.length;
  const hasMore = visibleCount < totalFiltered;
  const hasActiveFilters = companyFilter || deptFilter;

  const clearFilters = () => {
    setCompanyFilter('');
    setDeptFilter('');
    setVisibleCount(PER_PAGE);
  };

  return (
    <>
      <Seo
        title="AI & Tech Jobs in Europe – Worktugal"
        description="Curated AI and tech jobs for remote workers in Europe. Browse roles from Anthropic, Databricks, GitLab, Mistral AI, and more."
        ogTitle="AI & Tech Jobs in Europe – Worktugal"
        ogDescription="Curated AI and tech jobs for remote workers in Europe."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div {...fadeUp}>
          <div className="flex items-baseline justify-between gap-4 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              AI Jobs in Europe
            </h1>
            {!loading && (
              <span className="text-sm text-slate-400 dark:text-slate-500 whitespace-nowrap">
                {totalFiltered} job{totalFiltered !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">
            Curated AI roles open to candidates in Europe. Updated daily.
          </p>
        </motion.div>

        {/* ── Teaser counters ──────────────────────────────── */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex items-center gap-3 mb-6 text-[11px] text-slate-400 dark:text-slate-500"
          >
            <span>{jobStats.today} posted today</span>
            <span className="w-px h-3 bg-[#0F3D2E]/10 dark:bg-white/10" />
            <span>{jobStats.week} added this week</span>
          </motion.div>
        )}

        {/* ── Filters ──────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-6">
          <select
            value={companyFilter}
            onChange={(e) => { setCompanyFilter(e.target.value); setVisibleCount(PER_PAGE); }}
            className="flex-1 px-2.5 py-2 text-sm bg-transparent border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-[#0F3D2E] dark:focus:border-[#10B981] text-slate-900 dark:text-white appearance-none cursor-pointer transition-colors"
          >
            <option value="">All companies</option>
            {companies.map((c) => (
              <option key={c} value={c}>{COMPANY[c] || c}</option>
            ))}
          </select>

          <select
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setVisibleCount(PER_PAGE); }}
            className="flex-1 px-2.5 py-2 text-sm bg-transparent border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-[#0F3D2E] dark:focus:border-[#10B981] text-slate-900 dark:text-white appearance-none cursor-pointer transition-colors"
          >
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex-shrink-0 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── Results ──────────────────────────────────────── */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Loading jobs...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-sm text-slate-400 mb-2">No jobs match your filters.</p>
            <button onClick={clearFilters} className="text-sm text-[#10B981] hover:underline">
              Clear all filters
            </button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <div className="divide-y divide-[#0F3D2E]/6 dark:divide-white/[0.06]">
              {visible.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setVisibleCount((c) => c + PER_PAGE)}
                  className="px-5 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 border border-slate-200 dark:border-white/10 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 transition-all"
                >
                  Load {Math.min(PER_PAGE, totalFiltered - visibleCount)} more
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Bottom CTA ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-14 pt-8 border-t border-[#0F3D2E]/6 dark:border-white/[0.06] text-center"
        >
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
            Hiring AI talent across Europe?
          </p>
          <Link
            to="/jobs/post"
            className="inline-flex items-center gap-2 bg-[#0F3D2E] text-white px-7 py-3.5 rounded-xl text-sm font-bold hover:bg-[#1A5C44] hover:shadow-lg hover:shadow-[#0F3D2E]/20 transition-all"
          >
            Post a job for €49 <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* ── Job data transparency ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-8 pt-6 border-t border-[#0F3D2E]/6 dark:border-white/[0.06]"
        >
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <span>Seniority classified from titles</span>
            <span>D8 eligibility flagged for Portugal</span>
            <span>EU compatibility from location data</span>
            <span>All listings from verified ATS feeds</span>
          </div>
        </motion.div>
      </div>
    </>
  );
};
