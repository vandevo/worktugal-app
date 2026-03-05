import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { Card } from '../ui/Card';
import { Plus, Save, Trash2, Calendar, FileText, Globe } from 'lucide-react';

interface CmsPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: 'draft' | 'published' | 'archived';
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export function CmsManager() {
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft' as CmsPost['status'],
    meta_title: '',
    meta_description: ''
  });

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cms_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load CMS posts');
    } finally {
      setLoading(false);
    }
  }

  // Auto-generate slug from title
  useEffect(() => {
    if (!editingId && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, editingId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt || null,
        status: formData.status,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      };

      let error;
      if (editingId) {
        ({ error } = await supabase
          .from('cms_posts')
          .update(payload)
          .eq('id', editingId));
      } else {
        ({ error } = await supabase
          .from('cms_posts')
          .insert(payload));
      }

      if (error) throw error;

      setSuccess(editingId ? 'Post updated successfully!' : 'Post created successfully!');
      resetForm();
      loadPosts();
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save post. Check if slug is unique.');
    }
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      status: 'draft',
      meta_title: '',
      meta_description: ''
    });
  }

  function handleEdit(post: CmsPost) {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      status: post.status,
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || ''
    });
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('Permanently delete this post?')) return;

    try {
      const { error } = await supabase
        .from('cms_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSuccess('Post deleted');
      loadPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    }
  }

  if (loading && !posts.length) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-white mb-2">AI-Native CMS</h2>
          <p className="font-light text-gray-500">
            Manage your sovereign content pipeline through the Obsidian control center.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'New Post'}
        </Button>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {showForm && (
        <Card className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4 block">
                  Title (required)
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Post title"
                  className="bg-white/[0.02] border-white/5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4 block">
                  Slug (required)
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="post-url-slug"
                  className="bg-white/[0.02] border-white/5 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4 block">
                Content (Markdown)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/[0.06] hover:bg-white/[0.04] transition-all duration-200 font-light text-sm shadow-lg font-mono"
                placeholder="# Your markdown content here..."
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4 block">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/[0.06] hover:bg-white/[0.04] transition-all duration-200 font-light text-sm shadow-lg"
                placeholder="Brief summary for search/previews"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-white/[0.01] rounded-3xl border border-white/5">
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">SEO Metadata</h4>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-2 block">Meta Title</label>
                  <Input
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    placeholder="SEO Title"
                    className="bg-white/[0.02] border-white/5"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-2 block">Meta Description</label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/[0.06] hover:bg-white/[0.04] transition-all duration-200 font-light text-sm"
                    placeholder="SEO Description"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Status</h4>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-2 block">Publishing Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as CmsPost['status'] })}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white focus:outline-none focus:bg-white/[0.06] transition-all duration-200"
                  >
                    <option value="draft" className="bg-obsidian">Draft</option>
                    <option value="published" className="bg-obsidian">Published</option>
                    <option value="archived" className="bg-obsidian">Archived</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Update Asset' : 'Launch Asset'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {posts.length === 0 ? (
          <div className="p-12 text-center bg-[#121212] rounded-3xl border border-white/5 border-dashed">
            <p className="font-light text-gray-500 italic">No sovereign assets found. Create your first one above.</p>
          </div>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="bg-[#121212] border-white/5 p-6 hover:border-white/10 transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-white/5 border border-white/5 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-400/50" />
                    </div>
                    <span className={`bg-white/5 text-gray-400 px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-widest border border-white/10 ${
                      post.status === 'published' ? 'border-emerald-500/20 text-emerald-400/60' : 
                      post.status === 'draft' ? 'border-yellow-500/20 text-yellow-400/60' : 
                      ''
                    }`}>
                      {post.status}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-600 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-600 flex items-center gap-2">
                      <Globe className="w-3 h-3" />
                      /{post.slug}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-white mb-2 group-hover:text-blue-400/80 transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="font-light text-gray-500 text-sm line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-6">
                  <Button variant="secondary" onClick={() => handleEdit(post)} className="px-4 py-2">
                    Edit
                  </Button>
                  <Button variant="secondary" onClick={() => handleDelete(post.id)} className="px-4 py-2 text-red-400/60 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
