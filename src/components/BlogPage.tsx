import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { Seo } from './Seo';

interface CmsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
  featured_image: string | null;
}

// Fallback posts shown while DB is empty / loading
const FALLBACK_POSTS: CmsPost[] = [
  {
    id: 'f1',
    slug: 'portugal-tax-resident-183-days',
    title: 'The 183-day rule: what it actually means for you in Portugal',
    excerpt: 'Most remote workers miss this. Once you cross 183 days, Portuguese tax law kicks in automatically — regardless of where you registered your company or where your clients are based.',
    published_at: '2026-03-01',
    featured_image: null,
  },
  {
    id: 'f2',
    slug: 'nif-niss-difference',
    title: 'NIF vs NISS: the difference that costs people thousands',
    excerpt: 'Having a NIF (tax number) does not mean you have social security coverage. These are two completely different registrations with different deadlines, different penalties, and different offices.',
    published_at: '2026-02-14',
    featured_image: null,
  },
  {
    id: 'f3',
    slug: 'aima-appointment-guide',
    title: 'How to actually get an AIMA appointment in 2026',
    excerpt: 'The official booking system is chaotic. Here is the exact sequence that consistently works, including the right phone numbers, the right time windows, and what to say.',
    published_at: '2026-02-01',
    featured_image: null,
  },
];

export function BlogPage() {
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('cms_posts')
          .select('id, title, slug, excerpt, published_at, featured_image')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (error) throw error;
        setPosts(data && data.length > 0 ? data : FALLBACK_POSTS);
      } catch {
        setPosts(FALLBACK_POSTS);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <Seo
        title="Worktugal Blog — compliance guides for Portugal"
        description="Practical guides on Portugal tax residency, AIMA appointments, NIF registration, and compliance for remote workers and freelancers."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full mb-5">
            <BookOpen className="w-3 h-3" />
            The Worktugal Journal
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.05] mb-4">
            Stories of sovereignty
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Practical guidance for builders, nomads, and entrepreneurs navigating compliance, tax, and life in Portugal.
          </p>
        </motion.div>

        {/* ── Loading ───────────────────────────────────────────────── */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ── Post grid ─────────────────────────────────────────────── */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col h-full bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all overflow-hidden"
                >
                  {/* Featured image */}
                  {post.featured_image && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* No image — colored accent bar */}
                  {!post.featured_image && (
                    <div className="h-1 bg-gradient-to-r from-[#0F3D2E] to-[#10B981]" />
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    {/* Date */}
                    {post.published_at && (
                      <div className="flex items-center gap-1.5 mb-4">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          {new Date(post.published_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    )}

                    <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug mb-3 group-hover:text-[#0F3D2E] dark:group-hover:text-[#10B981] transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 flex-1 mb-5">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="mt-auto flex items-center gap-1.5 text-[#0F3D2E] dark:text-[#10B981] text-sm font-bold">
                      Read article
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Empty state ────────────────────────────────────────────── */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-[#161618] rounded-2xl border border-[#0F3D2E]/8 dark:border-white/8">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No posts published yet. Stay tuned.
            </p>
          </div>
        )}

        {/* ── Bottom CTA ─────────────────────────────────────────────── */}
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
              Know your compliance status
            </h3>
            <p className="text-white/60 text-sm mb-7 max-w-xs mx-auto leading-relaxed">
              Free 2-minute diagnostic. See your Setup Score and Exposure Index instantly.
            </p>
            <Link
              to="/diagnostic"
              className="inline-flex items-center gap-2 bg-[#10B981] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#059669] hover:scale-[1.03] active:scale-[0.97] transition-all shadow-lg shadow-black/20"
            >
              Run free diagnostic
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

      </div>
    </>
  );
}
