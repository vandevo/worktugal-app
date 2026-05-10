import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
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
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  remote_policy: string | null;
  visa_sponsorship: boolean | null;
  d8_eligible: boolean | null;
  seniority: string | null;
}

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

      if (err) {
        setError('Failed to load jobs.');
        setLoading(false);
        return;
      }
      setAllJobs((data || []) as Job[]);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const companies = [...new Set(allJobs.map((j) => j.company_slug))].sort();

  const filtered = allJobs.filter((job) => {
    const name = job.company_slug.replace(/-/g, ' ');
    if (search && !job.title.toLowerCase().includes(search.toLowerCase()) && !name.includes(search.toLowerCase())) return false;
    if (companyFilter && job.company_slug !== companyFilter) return false;
    return true;
  });

  const visible = filtered.slice(0, visibleCount);
  const totalFiltered = filtered.length;
  const hasMore = visibleCount < totalFiltered;

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
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-2">
            AI Jobs in Europe
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mb-6">
            Curated AI roles open to candidates in Europe. Updated daily.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-[#161618] border border-[#0F3D2E]/10 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#0F3D2E]/30 dark:focus:border-[#10B981]/30 transition-colors text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white dark:bg-[#161618] border border-[#0F3D2E]/10 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#0F3D2E]/30 dark:focus:border-[#10B981]/30 text-slate-900 dark:text-white"
          >
            <option value="">All companies</option>
            {companies.map((c) => (
              <option key={c} value={c}>
                {c.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

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
            <button
              onClick={() => { setSearch(''); setCompanyFilter(''); setVisibleCount(PER_PAGE); }}
              className="text-sm text-[#10B981] hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="text-xs text-slate-400 mb-3">{totalFiltered} job{totalFiltered !== 1 ? 's' : ''}</p>
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
                  Load {Math.min(PER_PAGE, totalFiltered - visibleCount)} more jobs
                </button>
              </div>
            )}
          </>
        )}

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
              Post your job and reach 446+ curated AI candidates in our network. EUR 49 per listing.
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
      </div>
    </>
  );
};
