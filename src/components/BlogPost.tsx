import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { Seo } from './Seo';
import { Button } from './ui/Button';

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

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<CmsPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const { data, error } = await supabase
          .from('cms_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (error) throw error;
        setPost(data);
      } catch (err) {
        console.error('Error loading blog post:', err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500 font-medium">Reading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
        <p className="text-gray-600 mb-8">The story you're looking for has moved or doesn't exist.</p>
        <Link to="/blog">
          <Button>Back to Stories</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white pb-24">
      <Seo 
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || ''}
      />

      {/* Header / Hero */}
      <div className="relative pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Journal
          </Link>

          <div className="flex items-center gap-3 text-sm text-gray-500 mb-8 font-medium">
            <Calendar className="w-4 h-4" />
            {new Date(post.published_at!).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 tracking-tight leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light mb-12">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between py-8 border-y border-gray-100 mb-16">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                V
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Van</div>
                <div className="text-xs text-gray-500">Cofounder, Worktugal</div>
              </div>
            </div>
            <div className="flex gap-4 text-gray-400">
              <button className="hover:text-blue-600 transition-colors"><Share2 className="w-5 h-5" /></button>
              <button className="hover:text-blue-600 transition-colors"><Bookmark className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        {post.featured_image && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg lg:prose-xl prose-blue max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:font-semibold">
            {/* Very simple manual markdown-to-html for now - in production use react-markdown */}
            {post.content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold my-6">{line.substring(2)}</h1>;
              if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold my-5">{line.substring(3)}</h2>;
              if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold my-4">{line.substring(4)}</h3>;
              if (line.startsWith('• ') || line.startsWith('- ')) return <li key={i} className="ml-6 mb-2">{line.substring(2)}</li>;
              if (line.trim() === '') return <br key={i} />;
              return <p key={i} className="mb-4 text-lg leading-relaxed">{line}</p>;
            })}
          </div>

          <div className="mt-24 p-8 bg-blue-50 rounded-3xl border border-blue-100 text-center">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Sovereignty is a choice.</h3>
            <p className="text-blue-800 mb-8 max-w-md mx-auto">
              Join 1,200+ nomads and entrepreneurs getting weekly guidance on building a life of freedom in Portugal.
            </p>
            <Link to="/partners/join">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold">
                Join the Network
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
