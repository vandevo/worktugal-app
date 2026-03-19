import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Calendar, ArrowLeft, Share2, ArrowRight } from 'lucide-react';
import { Seo } from './Seo';

interface CmsPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published_at: string | null;
  featured_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

function renderContent(content: string) {
  return content.split('\n').map((line, i) => {
    if (line.startsWith('# '))
      return <h2 key={i} className="text-2xl font-black text-slate-900 dark:text-white mt-10 mb-4 tracking-tight">{line.substring(2)}</h2>;
    if (line.startsWith('## '))
      return <h3 key={i} className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-3">{line.substring(3)}</h3>;
    if (line.startsWith('### '))
      return <h4 key={i} className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-6 mb-2">{line.substring(4)}</h4>;
    if (line.startsWith('• ') || line.startsWith('- '))
      return (
        <li key={i} className="flex items-start gap-2.5 mb-2 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
          {line.substring(2)}
        </li>
      );
    if (line.trim() === '') return <div key={i} className="h-3" />;
    return (
      <p key={i} className="text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        {line}
      </p>
    );
  });
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<CmsPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('cms_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (error) throw error;
        setPost(data);
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  // ── Loading ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────
  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
          Post not found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
          The article you're looking for has moved or doesn't exist.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 bg-[#0F3D2E] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#1A5C44] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: post.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <Seo
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || ''}
      />

      <article>
        {/* ── Hero area ───────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Back link */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0F3D2E] dark:hover:text-white transition-colors mb-10 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Journal
            </Link>

            {/* Date */}
            {post.published_at && (
              <div className="flex items-center gap-1.5 mb-5">
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

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-6">
              {post.title}
            </h1>

            {/* Excerpt / lead */}
            {post.excerpt && (
              <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                {post.excerpt}
              </p>
            )}

            {/* Author + share bar */}
            <div className="flex items-center justify-between py-5 border-y border-slate-100 dark:border-white/8 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0F3D2E] flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                  V
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Van</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                    Founder, Worktugal
                  </div>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#0F3D2E] dark:hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── Featured image ──────────────────────────────────────── */}
        {post.featured_image && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
            <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* ── Article body ────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="space-y-0">
            {renderContent(post.content)}
          </div>

          {/* ── Bottom CTA ──────────────────────────────────────── */}
          <div className="mt-16 bg-[#0F3D2E] rounded-2xl p-10 text-center relative overflow-hidden">
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
                Free 2-minute diagnostic. See where you actually stand with Portuguese law.
              </p>
              <Link
                to="/diagnostic"
                className="inline-flex items-center gap-2 bg-[#10B981] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#059669] hover:scale-[1.03] active:scale-[0.97] transition-all shadow-lg shadow-black/20"
              >
                Run free diagnostic
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* ── Back link ───────────────────────────────────────── */}
          <div className="mt-10 text-center">
            <Link
              to="/blog"
              className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0F3D2E] dark:hover:text-white transition-colors"
            >
              ← Back to Journal
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
