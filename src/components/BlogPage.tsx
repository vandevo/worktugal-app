import { useState, useEffect } from 'react';
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

export function BlogPage() {
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const { data, error } = await supabase
          .from('cms_posts')
          .select('id, title, slug, excerpt, published_at, featured_image')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error('Error loading blog posts:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 font-medium">Loading our stories...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Seo 
        title="Worktugal Blog | Stories of Freedom & Sovereignty"
        description="Insights on Portugal migration, digital nomadism, and building sovereign businesses."
      />

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            The Worktugal Journal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Stories of Sovereignty
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Guidance for builders, nomads, and entrepreneurs navigating the path to freedom in Portugal and beyond.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-lg">No posts published yet. Stay tuned.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <a 
                key={post.id} 
                href={`/blog/${post.slug}`} 
                className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                {post.featured_image && (
                  <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
                    <img 
                      src={post.featured_image} 
                      alt={post.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.published_at!).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-auto flex items-center gap-2 text-blue-600 font-semibold text-sm">
                    Read Story
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
