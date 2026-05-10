import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Briefcase, ExternalLink } from 'lucide-react';

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

interface JobCardProps {
  job: Job;
  index: number;
}

const COMPANY_NAMES: Record<string, string> = {
  'anthropic': 'Anthropic',
  'gitlab': 'GitLab',
  'databricks': 'Databricks',
  'mistral-ai': 'Mistral AI',
};

const BADGES: Record<string, { label: string; color: string }> = {
  'eu_remote': { label: 'EU Remote', color: 'bg-[#10B981]/10 text-[#10B981]' },
  'global_remote': { label: 'Global Remote', color: 'bg-[#10B981]/10 text-[#10B981]' },
  'hybrid': { label: 'Hybrid', color: 'bg-blue-500/10 text-blue-500' },
  'on_site': { label: 'On-site', color: 'bg-slate-500/10 text-slate-500' },
};

export const JobCard: React.FC<JobCardProps> = ({ job, index }) => {
  const companyName = COMPANY_NAMES[job.company_slug] || job.company_slug;
  const postedDate = new Date(job.posted_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });
  const salary =
    job.salary_min && job.salary_max
      ? `${job.salary_currency || 'EUR'} ${(job.salary_min / 1000).toFixed(0)}K - ${(job.salary_max / 1000).toFixed(0)}K`
      : null;

  return (
    <motion.a
      href={job.apply_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className="block bg-white dark:bg-[#161618] rounded-xl border border-[#0F3D2E]/8 dark:border-white/8 hover:border-[#0F3D2E]/20 dark:hover:border-[#10B981]/20 transition-all duration-200 p-5 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider">
              {companyName}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#0F3D2E] dark:group-hover:text-[#10B981] transition-colors">
            {job.title}
          </h3>
        </div>
        <ExternalLink className="w-4 h-4 text-slate-300 dark:text-slate-600 mt-1 flex-shrink-0 group-hover:text-[#10B981] transition-colors" />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {job.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <Briefcase className="w-3 h-3" />
          {job.department || 'General'}
        </span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {postedDate}
        </span>
        {salary && (
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {salary}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {job.remote_policy && BADGES[job.remote_policy] && (
          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded ${BADGES[job.remote_policy].color}`}>
            {BADGES[job.remote_policy].label}
          </span>
        )}
        {job.visa_sponsorship && (
          <span className="inline-flex items-center text-[10px] font-bold px-2 py-1 rounded bg-amber-500/10 text-amber-600">
            Visa Sponsor
          </span>
        )}
        {job.d8_eligible && (
          <span className="inline-flex items-center text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-600">
            D8 Eligible
          </span>
        )}
      </div>
    </motion.a>
  );
};
