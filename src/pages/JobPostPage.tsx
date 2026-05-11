import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, CheckCircle } from 'lucide-react';
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
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-[#10B981]" />
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white mb-2">
            Your job is submitted
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            We'll review your listing and activate it shortly.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#10B981] hover:text-[#059669]"
          >
            Back to jobs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
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

  return (
    <>
      <Seo title="Post a Job – Worktugal" description="Post an AI or tech job for EUR 49. Reach qualified candidates in Europe." />

      <div className="max-w-lg mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/jobs" className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mb-4 inline-block">
            ← Back to jobs
          </Link>

          {session && (<>
              <h1 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                Post a Job
              </h1>
              <p className="text-sm text-slate-400 mb-6">
                EUR 49 one-time. Your listing goes live after a quick review.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Company name</label>
                  <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme AI"
                    className="w-full px-3 py-2.5 text-sm bg-transparent border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 text-slate-900 dark:text-white placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Job title</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior ML Engineer"
                    className="w-full px-3 py-2.5 text-sm bg-transparent border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 text-slate-900 dark:text-white placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Location</label>
                  <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Lisbon, Portugal or Remote"
                    className="w-full px-3 py-2.5 text-sm bg-transparent border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 text-slate-900 dark:text-white placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Apply URL</label>
                  <input type="url" required value={applyUrl} onChange={(e) => setApplyUrl(e.target.value)}
                    placeholder="https://company.com/careers/..."
                    className="w-full px-3 py-2.5 text-sm bg-transparent border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 text-slate-900 dark:text-white placeholder:text-slate-400" />
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0F3D2E] text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-[#1A5C44] disabled:opacity-50 transition-all">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Pay EUR 49 <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <p className="mt-4 text-[11px] text-slate-400 leading-relaxed">
                Your listing will be reviewed before going live. EUR 49 is non-refundable once the listing is live.
              </p>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
};
