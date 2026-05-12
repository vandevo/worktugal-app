import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Seo } from './Seo';
import { supabase } from '../lib/supabase';

interface Job {
  id: string; company_slug: string; title: string; location: string;
  salary_min: number | null; salary_max: number | null;
}

const COMPANY_NAME: Record<string, string> = {
  'anthropic': 'Anthropic', 'gitlab': 'GitLab',
  'databricks': 'Databricks', 'mistral-ai': 'Mistral AI',
  'stripe': 'Stripe', 'figma': 'Figma',
};

const COMPANY_DOMAIN: Record<string, string> = {
  'anthropic': 'anthropic.com', 'gitlab': 'about.gitlab.com',
  'databricks': 'databricks.com', 'mistral-ai': 'mistral.ai',
  'stripe': 'stripe.com', 'figma': 'figma.com',
};

const LOGO_QS = '?token=pk_frb0ba107779627298c1c9&size=64';

interface GhostPost {
  title: string; excerpt: string; slug: string;
  published_at: string; feature_image: string | null;
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const formatSalary = (min: number | null, max: number | null): string | null => {
  if (!min && !max) return null;
  const fmt = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v);
  if (min && max) return `€${fmt(min)}–€${fmt(max)}`;
  return `€${fmt(min || max!)}`;
};

const COMPANIES = ['Anthropic', 'Stripe', 'Databricks', 'GitLab', 'Mistral AI', 'Figma'];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

export const ModernHomePage: React.FC = () => {
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [posts, setPosts] = useState<GhostPost[]>([]);
  const [jobCount, setJobCount] = useState(545);
  const [companyCount, setCompanyCount] = useState(6);

  useEffect(() => {
    supabase
      .from('ai_jobs')
      .select('id, company_slug, title, location, salary_min, salary_max')
      .eq('is_active', true)
      .eq('is_eu_eligible', true)
      .order('posted_at', { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (data) setRecentJobs(data);
      });

    // Fetch live counts
    supabase
      .from('ai_jobs')
      .select('id, company_slug', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('is_eu_eligible', true)
      .then(({ count }) => {
        if (count) setJobCount(count);
      });

    supabase
      .from('ai_jobs')
      .select('company_slug')
      .eq('is_active', true)
      .eq('is_eu_eligible', true)
      .then(({ data }) => {
        if (data) {
          const unique = new Set(data.map((j: any) => j.company_slug));
          setCompanyCount(unique.size);
        }
      });

    fetch(
      'https://blog.worktugal.com/ghost/api/content/posts/?key=6afbde9b4eeca3cce998422be6&limit=3&include=feature_image&fields=title,excerpt,slug,published_at,feature_image'
    )
      .then((r) => r.json())
      .then((d) => { if (d.posts) setPosts(d.posts); })
      .catch(() => {});
  }, []);

  return (
    <>
      <Seo
        title="AI Jobs in Europe – Worktugal"
        description="Curated AI and tech jobs for remote professionals in Europe. Browse roles from Anthropic, Stripe, Databricks, GitLab, Mistral AI, and more. Updated daily."
        ogTitle="AI Jobs in Europe"
        ogDescription="Curated AI and tech jobs open to candidates in Europe. No signup needed to browse."
      />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-36 lg:pb-20 relative">
        {/* Ambient gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#10B981]/[0.06] dark:bg-[#10B981]/[0.06] rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#0F3D2E]/[0.04] dark:bg-[#0F3D2E]/[0.06] rounded-full blur-[120px]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left — Copy */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full mb-6 border border-[#10B981]/15">
              <Sparkles className="w-3 h-3" />
              The AI career hub
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-5 font-jakarta">
              AI jobs in Europe.
            </h1>

            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed mb-8">
              Curated roles from leading AI companies. All open to candidates in Europe.
            </p>

            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-[#0F3D2E] text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-[#1A5C44] hover:shadow-lg hover:shadow-[#0F3D2E]/20 transition-all"
            >
              Browse {jobCount}+ jobs <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right — Preview cards */}
          <motion.div
            className="lg:col-span-5 hidden lg:flex flex-col gap-4 justify-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-white/20 dark:border-white/8 rounded-2xl p-5 shadow-[0_8px_30px_rgba(15,61,46,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] w-full max-w-sm ml-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#0F3D2E]/5 dark:bg-[#10B981]/10 flex items-center justify-center p-1.5">
                  <img
                    src="https://img.logokit.com/anthropic.com?token=pk_frb0ba107779627298c1c9&size=64"
                    alt="Anthropic"
                    className="w-full h-full object-contain"
                    referrerPolicy="origin"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Anthropic</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Research Scientist</div>
                </div>
                <span className="ml-auto text-[9px] text-slate-400 dark:text-slate-500">2d ago</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mb-3">
                <span>San Francisco / London</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="text-[#10B981] font-bold">€150k–250k</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full">Senior</span>
                <span className="text-[9px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">Visa Sponsor</span>
              </div>
            </div>

            <div className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-white/20 dark:border-white/8 rounded-2xl p-5 shadow-[0_8px_30px_rgba(15,61,46,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] w-full max-w-sm mr-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#0F3D2E]/5 dark:bg-[#10B981]/10 flex items-center justify-center p-1.5">
                  <img
                    src="https://img.logokit.com/stripe.com?token=pk_frb0ba107779627298c1c9&size=64"
                    alt="Stripe"
                    className="w-full h-full object-contain"
                    referrerPolicy="origin"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Stripe</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Engineering Manager</div>
                </div>
                <span className="ml-auto text-[9px] text-slate-400 dark:text-slate-500">5d ago</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mb-3">
                <span>Dublin / Remote</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="text-[#10B981] font-bold">€130k–180k</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full">Lead</span>
                <span className="text-[9px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full">D8</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          className="max-w-2xl mx-auto mt-20 grid grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {[
            { value: jobCount + '+', label: 'Active roles' },
            { value: '10K+', label: 'Job seekers' },
            { value: String(companyCount), label: 'Companies hiring' },
            { value: '€49', label: 'To post' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-jakarta">
                {stat.value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Company logos ─────────────────────────────────── */}
      <div className="border-y border-[#0F3D2E]/6 dark:border-white/6 bg-[#F5F4F2]/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 text-center mb-5">
            Featuring jobs from
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-3">
            {COMPANIES.map((name) => (
              <span key={name} className="text-sm font-bold text-slate-400 dark:text-slate-500 tracking-tight grayscale hover:grayscale-0 transition-all duration-300">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Live jobs preview ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <motion.div {...fadeUp} className="flex items-end justify-between max-w-4xl mx-auto mb-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981]">Recently posted</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2 font-jakarta">
              Latest opportunities in European AI
            </h2>
          </div>
          <Link
            to="/jobs"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-[#0F3D2E] dark:text-[#10B981] hover:opacity-70 transition-opacity"
          >
            View all jobs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {recentJobs.length === 0 ? (
          <div className="max-w-4xl mx-auto bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-white/20 dark:border-white/8 rounded-2xl p-10 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">Loading latest jobs...</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-white/20 dark:border-white/8 rounded-2xl shadow-[0_8px_30px_rgba(15,61,46,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] overflow-hidden">
            <div className="divide-y divide-[#0F3D2E]/6 dark:divide-white/[0.06]">
              {recentJobs.map((job, i) => {
                const name = COMPANY_NAME[job.company_slug] || job.company_slug;
                const domain = COMPANY_DOMAIN[job.company_slug];
                const salary = formatSalary(job.salary_min, job.salary_max);
                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 + i * 0.08 }}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 hover:bg-[#10B981]/[0.03] dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {domain ? (
                        <img
                          src={`https://img.logokit.com/${domain}${LOGO_QS}`}
                          alt={name}
                          className="w-8 h-8 object-contain flex-shrink-0 rounded-lg"
                          referrerPolicy="origin"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg flex-shrink-0 bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[9px] font-bold text-slate-400">
                          {name[0]}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">{name}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0F3D2E] dark:group-hover:text-[#10B981] transition-colors">
                          {job.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">{job.location}</span>
                        </div>
                      </div>
                    </div>
                    {salary && (
                      <div className="flex items-center justify-between sm:justify-end gap-4 mt-3 sm:mt-0">
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-900 dark:text-white">{salary}</div>
                          <div className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Salary range</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#10B981]/0 group-hover:bg-[#10B981]/10 transition-colors flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
            <div className="px-6 py-4 border-t border-[#0F3D2E]/6 dark:border-white/[0.06] flex items-center justify-between">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0F3D2E] dark:text-[#10B981] hover:opacity-70 transition-opacity md:hidden"
              >
                View all {jobCount}+ roles <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="https://t.me/worktugal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#0F3D2E] dark:hover:text-[#10B981] transition-colors ml-auto"
              >
                Get alerts on Telegram <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </section>

      {/* ── Blog ──────────────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="border-t border-[#0F3D2E]/6 dark:border-white/6 bg-[#F5F4F2]/30 dark:bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <motion.div {...fadeUp} className="flex items-end justify-between mb-12">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981]">Latest</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2 font-jakarta">From the blog</h2>
              </div>
              <a
                href="https://blog.worktugal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-[#0F3D2E] dark:text-[#10B981] hover:opacity-70 transition-opacity"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {posts.map((post, i) => (
                <motion.a
                  key={post.slug}
                  href={`https://blog.worktugal.com/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group block"
                >
                  <div className="rounded-2xl border border-[#0F3D2E]/8 dark:border-white/[0.06] overflow-hidden bg-white/50 dark:bg-white/[0.02] hover:bg-white/80 dark:hover:bg-white/[0.04] hover:border-[#0F3D2E]/15 dark:hover:border-white/10 transition-all h-full">
                    {post.feature_image && (
                      <div className="aspect-[16/9] overflow-hidden bg-[#F5F4F2] dark:bg-white/[0.03]">
                        <img src={post.feature_image} alt="" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" loading="lazy" />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mb-2">
                        {formatDate(post.published_at)}
                      </p>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#0F3D2E] dark:group-hover:text-[#10B981] transition-colors mb-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="text-center mt-8 md:hidden">
              <a
                href="https://blog.worktugal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0F3D2E] dark:text-[#10B981] hover:opacity-70 transition-opacity"
              >
                View all posts <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── For employers ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-white/20 dark:border-white/8 rounded-[32px] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_8px_30px_rgba(15,61,46,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#10B981]/[0.06] dark:bg-[#10B981]/[0.08] rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-xl mx-auto relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981]">For employers</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mt-4 mb-4 leading-tight font-jakarta">
              Hire the best AI talent in Europe.
            </h2>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed">
              Reach 10,000+ specialized AI developers and researchers currently active in the European ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/jobs/post"
                className="inline-flex items-center gap-2 bg-[#0F3D2E] text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-[#1A5C44] hover:shadow-lg hover:shadow-[#0F3D2E]/20 transition-all"
              >
                Post your job — €49 <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-sm text-slate-400 dark:text-slate-500 font-semibold">No subscription required</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Compliance ────────────────────────────────────── */}
      <section className="border-t border-[#0F3D2E]/6 dark:border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Also from Worktugal</span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-3 mb-3 font-jakarta">
              Free Portugal compliance check
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
              Most remote workers in Portugal miss a tax, visa, or social security step. Two minutes to find out if you are one of them.
            </p>
            <Link
              to="/diagnostic"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#10B981] hover:text-[#059669] transition-colors"
            >
              Run free diagnostic <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
