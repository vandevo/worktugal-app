import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight, Sparkles, Euro, DollarSign, PoundSterling } from 'lucide-react';

interface Job {
  id: string; company_slug: string; title: string; location: string;
  locations: string[] | null; department: string | null; apply_url: string;
  source: string; posted_at: string; salary_min: number | null;
  salary_max: number | null; salary_currency: string | null;
  remote_policy: string | null; visa_sponsorship: boolean | null;
  d8_eligible: boolean | null; is_eu_eligible: boolean | null;
  seniority: string | null; skills: string[] | null; expires_at: string | null;
}

interface JobCardProps { job: Job; index: number; }

const DOMAIN_OVERRIDE: Record<string, string> = {
  'gitlab': 'about.gitlab.com', 'mistral-ai': 'mistral.ai',
  'xai': 'x.ai', 'datadog': 'datadoghq.com', 'grafana-labs': 'grafana.com',
  'neon': 'neon.tech', 'stability-ai': 'stability.ai',
  'scale-ai': 'scale.com', 'snyk': 'snyk.io',
  'notion': 'notion.so', 'linear': 'linear.app',
  'elastic': 'elastic.co', 'c3-ai': 'c3.ai',
};

const COMPANY_NAME_OVERRIDE: Record<string, string> = {
  'mistral-ai': 'Mistral AI', 'grafana-labs': 'Grafana Labs',
  'stability-ai': 'Stability AI', 'scale-ai': 'Scale AI',
  'c3-ai': 'C3 AI',
};

const getDomain = (slug: string): string =>
  DOMAIN_OVERRIDE[slug] || `${slug}.com`;

const getCompanyName = (slug: string): string =>
  COMPANY_NAME_OVERRIDE[slug] ||
  slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

const LOGO_TOKEN = 'pk_frb0ba107779627298c1c9';

const SENIORITY_BADGES: Record<string, { label: string; color: string }> = {
  'entry': { label: 'Entry', color: 'text-slate-400' },
  'mid': { label: 'Mid', color: 'text-slate-400' },
  'senior': { label: 'Senior', color: 'text-[#10B981]' },
  'lead': { label: 'Lead', color: 'text-[#059669]' },
  'executive': { label: 'Executive', color: 'text-[#047857]' },
};

const formatSalary = (val: number): string => {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
  return val.toString();
};

export const JobCard: React.FC<JobCardProps> = ({ job, index }) => {
  const companyName = getCompanyName(job.company_slug);
  const domain = getDomain(job.company_slug);
  const logoUrl = domain
    ? `https://img.logokit.com/${domain}?token=${LOGO_TOKEN}&size=64&fallback=monogram`
    : null;

  const displayLocations = job.locations && job.locations.length > 0 ? job.locations : [job.location];
  const primaryLocation = displayLocations[0];
  const extraCount = displayLocations.length - 1;

  const hoursSince = (Date.now() - new Date(job.posted_at).getTime()) / 3600000;
  const isNew = hoursSince < 48;
  const hasSalary = job.salary_min && job.salary_max;

  return (
    <motion.a
      href={job.apply_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.015, 0.8) }}
      className="block py-4 border-b border-[#0F3D2E]/6 dark:border-white/6 hover:border-[#0F3D2E]/15 dark:hover:border-white/15 transition-colors group"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg flex-shrink-0 mt-0.5 overflow-hidden bg-slate-100 dark:bg-white/5">
          {logoUrl ? (
            <img src={logoUrl} alt={companyName} className="w-full h-full object-cover" referrerPolicy="origin" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400">
              {companyName[0]}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                {companyName}
              </span>
              {isNew && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#10B981] whitespace-nowrap">
                  <Sparkles className="w-2.5 h-2.5" />New
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Apply <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-1.5 group-hover:text-[#0F3D2E] dark:group-hover:text-[#10B981] transition-colors">
            {job.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {primaryLocation}
              {extraCount > 0 && <span className="font-bold text-[#10B981]">+{extraCount}</span>}
            </span>
            {job.department && <span>{job.department}</span>}
            {hasSalary && (
              <span className="font-bold text-[#10B981]">
                {job.salary_currency === 'USD' ? <DollarSign className="w-3 h-3 inline mr-0.5" /> : job.salary_currency === 'GBP' ? <PoundSterling className="w-3 h-3 inline mr-0.5" /> : <Euro className="w-3 h-3 inline mr-0.5" />}
                {formatSalary(job.salary_min!)} – {formatSalary(job.salary_max!)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            {job.remote_policy === 'global_remote' && <span className="text-[10px] font-bold text-slate-400">Global Remote</span>}
            {job.remote_policy === 'eu_remote' && <span className="text-[10px] font-bold text-slate-400">EU Remote</span>}
            {job.visa_sponsorship && <span className="text-[10px] font-bold text-amber-500">Visa Sponsor</span>}
            {job.d8_eligible && <span className="text-[10px] font-bold text-[#10B981]">D8</span>}
            {job.seniority && SENIORITY_BADGES[job.seniority] && (
              <span className={`text-[10px] font-bold ${SENIORITY_BADGES[job.seniority].color}`}>
                {SENIORITY_BADGES[job.seniority].label}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.a>
  );
};
