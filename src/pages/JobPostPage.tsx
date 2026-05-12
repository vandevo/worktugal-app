import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, CheckCircle, Shield, Clock, Users, MapPin, Euro, Building2, TrendingUp } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Seo } from '../components/Seo';

export const JobPostPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasSession = searchParams.get('session_id');

  const [session, setSession] = useState<any>(null);

  const [companyName, setCompanyName] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!s) navigate('/login?redirect=/jobs/post', { replace: true });
      setSession(s);
    });
  }, [navigate]);

  if (hasSession) {
    return (
      <>
        <Seo title="Job Posted – Worktugal" />
        <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#0E0E10] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-6 border border-[#10B981]/20">
              <CheckCircle className="w-8 h-8 text-[#10B981]" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 font-jakarta">
              Your job is submitted
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              We'll review your listing and activate it shortly.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-[#0F3D2E] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#1A5C44] transition-all"
            >
              Back to jobs <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-job-posting-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session!.access_token}`,
          },
          body: JSON.stringify({ title, company_name: companyName, location, apply_url: applyUrl }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const previewTitle = title || 'Senior AI Engineer';
  const previewCompany = companyName || 'Your Company';
  const previewLocation = location || 'Lisbon, Portugal';

  return (
    <>
      <Seo title="Post a Job – Worktugal" description="Post an AI or tech job for EUR 49. Reach qualified candidates in Europe." />

      <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#0E0E10] relative overflow-hidden">

        {/* Background glow blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#10B981]/[0.04] dark:bg-[#10B981]/[0.06] blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0F3D2E]/[0.03] dark:bg-[#0F3D2E]/[0.06] blur-[120px] rounded-full pointer-events-none" />

        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
          {/* Header row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10 lg:mb-14"
          >
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white font-jakarta leading-tight">
                Create your listing
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1.5">
                Fill in the details and preview your listing in real time.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Step 1 of 2</span>
              <Link to="/jobs" className="text-sm font-medium text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                Cancel
              </Link>
            </div>
          </motion.div>

          {/* Split content */}
          <div className="flex flex-col lg:flex-row lg:gap-0 pb-16">

            {/* Left Column — Form */}
            <section className="flex-1 lg:pr-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl"
              >
                {session && (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Company name
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Anthropic"
                        className="w-full h-11 px-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-[#F5F4F2] dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus-visible:outline-none focus:border-[#0F3D2E] dark:focus:border-[#10B981] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Job title
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Senior AI Engineer"
                        className="w-full h-11 px-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-[#F5F4F2] dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus-visible:outline-none focus:border-[#0F3D2E] dark:focus:border-[#10B981] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Location
                      </label>
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Lisbon, Portugal"
                        className="w-full h-11 px-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-[#F5F4F2] dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus-visible:outline-none focus:border-[#0F3D2E] dark:focus:border-[#10B981] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Apply URL
                      </label>
                      <input
                        type="url"
                        required
                        value={applyUrl}
                        onChange={(e) => setApplyUrl(e.target.value)}
                        placeholder="https://company.com/careers/..."
                        className="w-full h-11 px-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-[#F5F4F2] dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus-visible:outline-none focus:border-[#0F3D2E] dark:focus:border-[#10B981] transition-colors"
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-4 py-2 rounded-lg border border-red-200 dark:border-red-500/20">
                        {error}
                      </p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#0F3D2E] text-white py-3.5 rounded-xl text-base font-bold hover:bg-[#1A5C44] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#0F3D2E]/20"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Post for EUR 49 <ArrowRight className="w-5 h-5" />
                        </span>
                      )}
                    </motion.button>
                  </form>
                )}

                {/* Trust Badges */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#F5F4F2] dark:bg-white/[0.03] rounded-full border border-slate-200 dark:border-white/5">
                    <Users className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">15K professionals browse weekly</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#F5F4F2] dark:bg-white/[0.03] rounded-full border border-slate-200 dark:border-white/5">
                    <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Posted within 24h</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#F5F4F2] dark:bg-white/[0.03] rounded-full border border-slate-200 dark:border-white/5">
                    <Shield className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Money-back guarantee</span>
                  </div>
                </div>

                {/* Pricing tiers */}
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Compare:</span>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">Standard EUR 99</span>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">Pro EUR 249</span>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">Premium EUR 279</span>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Right Column — Live Preview */}
            <section className="flex-1 mt-12 lg:mt-0 lg:pl-12 lg:border-l border-[#0F3D2E]/[0.06] dark:border-white/[0.06]">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-md lg:sticky lg:top-24"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[11px] font-bold text-[#10B981] uppercase tracking-[0.2em]">Live preview</span>
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-auto">Your listing</span>
                </div>

                {/* Preview Card */}
                <div className="bg-white dark:bg-[#161618] border border-[#0F3D2E]/8 dark:border-white/8 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F5F4F2] dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
                        <Building2 className="w-5 h-5 text-[#10B981]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mb-0.5">{previewCompany}</p>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white font-jakarta">{previewTitle}</h3>
                      </div>
                    </div>
                    <span className="bg-[#10B981]/10 text-[#10B981] dark:bg-[#10B981]/20 dark:text-[#10B981] px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-widest border border-[#10B981]/20 dark:border-[#10B981]/30">
                      D8
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-400 dark:text-slate-500 mb-4">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {previewLocation}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Euro className="w-3.5 h-3.5" />
                      €80k – €120k
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#F5F4F2] dark:bg-white/[0.04] text-[11px] font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                      {previewTitle}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#F5F4F2] dark:bg-white/[0.04] text-[11px] font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                      Remote friendly
                    </span>
                  </div>
                </div>

                {/* Boost visibility card */}
                <div className="mt-4 bg-white dark:bg-[#161618] border border-[#10B981]/20 dark:border-[#10B981]/20 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Boost visibility</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Listings with the <span className="font-bold text-[#10B981]">D8 badge</span> get 3x more applications from qualified candidates in the AI ecosystem.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider text-center">
                  Real-time preview updates as you type
                </p>
              </motion.div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};
