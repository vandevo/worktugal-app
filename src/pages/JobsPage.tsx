import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { supabase } from '../lib/supabase';
import { JobCard } from '../components/jobs/JobCard';

interface Job {
  id: string;
  company_slug: string;
  title: string;
  location: string;
  department: string | null;
  apply_url: string;
  source: string;
  posted_at: string;
  remote_policy: string | null;
  visa_sponsorship: boolean | null;
  d8_eligible: boolean | null;
  seniority: string | null;
  skills: string[] | null;
  expires_at: string | null;
}

const COMPANY: Record<string, string> = {
  'anthropic': 'Anthropic',
  'gitlab': 'GitLab',
  'databricks': 'Databricks',
  'mistral-ai': 'Mistral AI',
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
  const [search, setSearch] = useState('');
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
      const name = COMPANY[job.company_slug] || job.company_slug;
      const q = search.toLowerCase();

      if (search) {
        const titleMatch = job.title.toLowerCase().includes(q);
        const companyMatch = name.toLowerCase().includes(q);
        const locMatch = job.location.toLowerCase().includes(q);
        const deptMatch = job.department?.toLowerCase().includes(q) ?? false;
        if (!titleMatch && !companyMatch && !locMatch && !deptMatch) return false;
      }

      if (companyFilter && job.company_slug !== companyFilter) return false;
      if (deptFilter && job.department !== deptFilter) return false;

      return true;
    });
  }, [allJobs, search, companyFilter, deptFilter]);

  const visible = filtered.slice(0, visibleCount);
  const totalFiltered = filtered.length;
  const hasMore = visibleCount < totalFiltered;
  const hasActiveFilters = search || companyFilter || deptFilter;

  const clearFilters = () => {
    setSearch('');
    setCompanyFilter('');
    setDeptFilter('');
    setVisibleCount(PER_PAGE);
  };

  const activeFilterCount =
    (search ? 1 : 0) +
    (companyFilter ? 1 : 0) +
    (deptFilter ? 1 : 0);

  return (
    <>
      <Seo
        title="AI & Tech Jobs in Europe – Worktugal"
        description="Curated AI and tech jobs for remote workers in Europe. Browse roles from Anthropic, Databricks, GitLab, Mistral AI, and more."
        ogTitle="AI & Tech Jobs in Europe – Worktugal"
        ogDescription="Curated AI and tech jobs for remote workers in Europe."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div {...fadeUp}>
          <span className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full mb-4">
            AI & TECH JOBS IN EUROPE
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-1">
                AI Jobs in Europe
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Curated AI roles open to candidates in Europe. Updated daily.
              </p>
            </div>
            {!loading && (
              <div className="flex items-center gap-4 text-xs flex-shrink-0">
                <div className="text-center">
                  <div className="text-lg font-black text-slate-900 dark:text-white">{totalFiltered}</div>
                  <div className="text-slate-400">Jobs</div>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-white/10" />
                <div className="text-center">
                  <div className="text-lg font-black text-slate-900 dark:text-white">{companies.length}</div>
                  <div className="text-slate-400">Companies</div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Teaser counters ──────────────────────────────── */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex items-center gap-5 mb-6 text-xs"
          >
            <div>
              <span className="font-black text-slate-900 dark:text-white">{jobStats.today}</span>
              <span className="text-slate-400 ml-1">posted today</span>
            </div>
            <div className="w-px h-4 bg-slate-200 dark:bg-white/10" />
            <div>
              <span className="font-black text-slate-900 dark:text-white">{jobStats.week}</span>
              <span className="text-slate-400 ml-1">added this week</span>
            </div>
            <div className="w-px h-4 bg-slate-200 dark:bg-white/10" />
            <div>
              <span className="text-slate-400">Viewing</span>
              <span className="font-black text-slate-900 dark:text-white ml-1">{totalFiltered}</span>
              <span className="text-slate-400 ml-1">of {allJobs.length} total jobs</span>
            </div>
          </motion.div>
        )}

        {/* ── Filters ──────────────────────────────────────── */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, company, location, or department..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(PER_PAGE); }}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-[#161618] border border-[#0F3D2E]/10 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#0F3D2E]/30 dark:focus:border-[#10B981]/30 transition-colors text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={companyFilter}
              onChange={(e) => { setCompanyFilter(e.target.value); setVisibleCount(PER_PAGE); }}
              className="px-3 py-2.5 text-sm bg-white dark:bg-[#161618] border border-[#0F3D2E]/10 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#0F3D2E]/30 dark:focus:border-[#10B981]/30 text-slate-900 dark:text-white appearance-none cursor-pointer"
            >
              <option value="">All companies</option>
              {companies.map((c) => (
                <option key={c} value={c}>{COMPANY[c] || c}</option>
              ))}
            </select>

            <select
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); setVisibleCount(PER_PAGE); }}
              className="px-3 py-2.5 text-sm bg-white dark:bg-[#161618] border border-[#0F3D2E]/10 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#0F3D2E]/30 dark:focus:border-[#10B981]/30 text-slate-900 dark:text-white appearance-none cursor-pointer"
            >
              <option value="">All departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#10B981] hover:text-[#059669] transition-colors"
            >
              <X className="w-3 h-3" />
              Clear {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
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
            <p className="text-xs text-slate-400 mb-3">{totalFiltered} result{totalFiltered !== 1 ? 's' : ''}</p>
            <div className="space-y-3">
              {visible.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setVisibleCount((c) => c + PER_PAGE)}
                  className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-[#161618] border border-[#0F3D2E]/10 dark:border-white/10 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-[#0F3D2E]/30 dark:hover:border-[#10B981]/30 transition-all"
                >
                  Load {Math.min(PER_PAGE, totalFiltered - visibleCount)} more
                </button>
              </div>
            )}
          </>
        )}

        {/* ── CTA ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 bg-[#0F3D2E] rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
          />
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl font-black text-white mb-2">
              Hire AI talent across Europe
            </h2>
            <p className="text-sm text-white/60 mb-4 max-w-md mx-auto">
              Post your job and reach qualified AI candidates in our network. EUR 49 per listing.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#10B981] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#059669] active:scale-[0.97] transition-all min-h-[44px]"
            >
              Post a Job for EUR 49
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* ── AI Transparency ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-[#0F3D2E]/5 dark:border-white/5"
        >
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            How AI powers this board
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[11px] text-slate-400 dark:text-slate-500">
            <span>AI classifies seniority from job titles (senior/lead/mid/entry)</span>
            <span>AI detects D8 visa eligibility for Portugal</span>
            <span>AI filters jobs by EU compatibility from location data</span>
            <span>All job listings verified against official ATS feeds</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">
            No black-box scoring. No candidate ranking. Every badge and filter is explainable.
            Influenced by Greenhouse AI's structured hiring principles.
          </p>
        </motion.div>
      </div>
    </>
  );
};
