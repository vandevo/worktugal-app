import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Briefcase, ArrowUpRight, Euro, Users } from 'lucide-react';

interface Job {
  id: string;
  company_slug: string;
  title: string;
  location: string;
  locations: string[] | null;
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
  is_eu_eligible: boolean | null;
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

const COMPANY_COLORS: Record<string, string> = {
  'anthropic': 'bg-amber-500',
  'gitlab': 'bg-orange-500',
  'databricks': 'bg-blue-600',
  'mistral-ai': 'bg-indigo-600',
};

const SENIORITY_BADGES: Record<string, { label: string; color: string }> = {
  'entry': { label: 'Entry', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  'mid': { label: 'Mid', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  'senior': { label: 'Senior', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  'lead': { label: 'Lead', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  'executive': { label: 'Executive', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
};

const daysSince = (dateStr: string): string => {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

export const JobCard: React.FC<JobCardProps> = ({ job, index }) => {
  const companyName = COMPANY_NAMES[job.company_slug] || job.company_slug;
  const companyColor = COMPANY_COLORS[job.company_slug] || 'bg-emerald-500';
  const initial = companyName[0];

  const displayLocations = job.locations && job.locations.length > 0 ? job.locations : [job.location];
  const primaryLocation = displayLocations[0];
  const extraCount = displayLocations.length - 1;

  const hasSalary = job.salary_min && job.salary_max;
  const currency = job.salary_currency || 'EUR';

  const formatSalary = (val: number): string => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
    return val.toString();
  };

  return (
    <motion.a
      href={job.apply_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 1) }}
      className="block bg-white dark:bg-[#161618] rounded-xl border border-[#0F3D2E]/8 dark:border-white/8 hover:border-[#0F3D2E]/25 dark:hover:border-[#10B981]/25 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_24px_rgba(0,255,170,0.03)] transition-all duration-200 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Company avatar */}
          <div className={`w-10 h-10 rounded-xl ${companyColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5`}>
            {initial}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {/* Company + date row */}
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider">
                {companyName}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                {daysSince(job.posted_at)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-[#0F3D2E] dark:group-hover:text-[#10B981] transition-colors">
              {job.title}
            </h3>

            {/* Details row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                {primaryLocation}
                {extraCount > 0 && (
                  <span className="text-[10px] text-[#10B981] font-bold bg-[#10B981]/10 px-1.5 py-0.5 rounded">
                    +{extraCount} more
                  </span>
                )}
              </span>
              {job.department && (
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  {job.department}
                </span>
              )}
              {hasSalary && (
                <span className="inline-flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
                  <Euro className="w-3.5 h-3.5" />
                  {formatSalary(job.salary_min!)} – {formatSalary(job.salary_max!)}
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              {job.remote_policy === 'global_remote' && (
                <span className="inline-flex items-center text-[10px] font-bold px-2 py-1 rounded bg-[#10B981]/10 text-[#10B981]">
                  Global Remote
                </span>
              )}
              {job.remote_policy === 'eu_remote' && (
                <span className="inline-flex items-center text-[10px] font-bold px-2 py-1 rounded bg-[#10B981]/10 text-[#10B981]">
                  EU Remote
                </span>
              )}
              {job.visa_sponsorship && (
                <span className="inline-flex items-center text-[10px] font-bold px-2 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Visa Sponsor
                </span>
              )}
              {job.d8_eligible && (
                <span className="inline-flex items-center text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  D8 Eligible
                </span>
              )}
              {job.seniority && SENIORITY_BADGES[job.seniority] && (
                <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded ${SENIORITY_BADGES[job.seniority].color}`}>
                  {SENIORITY_BADGES[job.seniority].label}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply bar */}
      <div className="flex items-center justify-end px-5 py-2.5 bg-slate-50 dark:bg-white/[0.02] border-t border-[#0F3D2E]/5 dark:border-white/5">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#10B981] group-hover:text-[#059669] transition-colors">
          Apply now
          <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </motion.a>
  );
};
