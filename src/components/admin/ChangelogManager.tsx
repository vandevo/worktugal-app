import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { Card } from '../ui/Card';
import { Plus, Save, Trash2, Calendar } from 'lucide-react';

interface ChangelogEntry {
  id: string;
  created_at: string;
  date: string;
  category: string;
  title: string;
  details: string | null;
  affected_files: string[] | null;
  migration_files: string[] | null;
  version: string | null;
}

const CATEGORIES = [
  'feature',
  'fix',
  'database',
  'ui',
  'integration',
  'security',
  'performance',
  'content',
  'docs'
] as const;

export function ChangelogManager() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'feature' as typeof CATEGORIES[number],
    title: '',
    details: '',
    affected_files: '',
    migration_files: '',
    version: ''
  });

  useEffect(() => {
    loadChangelog();
  }, []);

  async function loadChangelog() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_changelog')
        .select('*')
        .order('date', { ascending: false })
        .limit(50);

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('Error loading changelog:', err);
      setError('Failed to load changelog entries');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from('project_changelog')
        .insert({
          date: formData.date,
          category: formData.category,
          title: formData.title,
          details: formData.details || null,
          affected_files: formData.affected_files
            ? formData.affected_files.split('\n').filter(Boolean)
            : null,
          migration_files: formData.migration_files
            ? formData.migration_files.split('\n').filter(Boolean)
            : null,
          version: formData.version || null
        });

      if (error) throw error;

      setSuccess('Change logged successfully!');
      setShowForm(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: 'feature',
        title: '',
        details: '',
        affected_files: '',
        migration_files: '',
        version: ''
      });
      loadChangelog();
    } catch (err) {
      console.error('Error adding changelog entry:', err);
      setError('Failed to add changelog entry');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this changelog entry?')) return;

    try {
      const { error } = await supabase
        .from('project_changelog')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSuccess('Entry deleted');
      loadChangelog();
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError('Failed to delete entry');
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading changelog...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-white mb-2">Project Changelog</h2>
          <p className="font-light text-gray-500">
            Track sovereign evolution and system updates.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Log Change
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
                  Date
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="bg-white/[0.02] border-white/5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4 block">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as typeof CATEGORIES[number]
                    })
                  }
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white focus:outline-none focus:bg-white/[0.06] transition-all duration-200"
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-obsidian">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4 block">
                Title (required)
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Brief one-line description"
                className="bg-white/[0.02] border-white/5 text-white"
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4 block">
                Details
              </label>
              <textarea
                value={formData.details}
                onChange={(e) =>
                  setFormData({ ...formData, details: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/[0.06] hover:bg-white/[0.04] transition-all duration-200 font-light text-sm shadow-lg shadow-black/20"
                placeholder="Detailed explanation of changes..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4 block">
                  Affected Files (one per line)
                </label>
                <textarea
                  value={formData.affected_files}
                  onChange={(e) =>
                    setFormData({ ...formData, affected_files: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/[0.06] hover:bg-white/[0.04] transition-all duration-200 font-light text-sm shadow-lg font-mono"
                  placeholder="src/components/Example.tsx"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4 block">
                  Migration Files (one per line)
                </label>
                <textarea
                  value={formData.migration_files}
                  onChange={(e) =>
                    setFormData({ ...formData, migration_files: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/[0.06] hover:bg-white/[0.04] transition-all duration-200 font-light text-sm shadow-lg font-mono"
                  placeholder="20251106_create_table.sql"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4 block">
                  Version (optional)
                </label>
                <Input
                  value={formData.version}
                  onChange={(e) =>
                    setFormData({ ...formData, version: e.target.value })
                  }
                  placeholder="v1.2.0"
                  className="bg-white/[0.02] border-white/5 text-white"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Save Change
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {entries.length === 0 ? (
          <div className="p-12 text-center bg-[#121212] rounded-3xl border border-white/5 border-dashed">
            <p className="font-light text-gray-500 italic">No changelog entries yet. Click "Log Change" to add one.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="bg-[#121212] border-white/5 p-6 hover:border-white/10 transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-white/5 border border-white/5 rounded-lg">
                      <Calendar className="w-4 h-4 text-blue-400/50" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-gray-600">{entry.date}</span>
                    <span className="bg-white/5 text-gray-400 px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-widest border border-white/10">
                      {entry.category}
                    </span>
                    {entry.version && (
                      <span className="bg-emerald-500/5 text-emerald-400/60 px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-widest border border-emerald-500/10">
                        {entry.version}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl text-white mb-2 group-hover:text-blue-400/80 transition-colors">
                    {entry.title}
                  </h3>
                  {entry.details && (
                    <p className="font-light text-gray-500 text-sm leading-relaxed mb-4">
                      {entry.details}
                    </p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {entry.affected_files && entry.affected_files.length > 0 && (
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-gray-600 block mb-2">
                          Files affected:
                        </span>
                        <ul className="text-xs text-gray-500 font-mono space-y-1">
                          {entry.affected_files.map((file, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-white/20 rounded-full" />
                              {file}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {entry.migration_files && entry.migration_files.length > 0 && (
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-gray-600 block mb-2">
                          Migrations:
                        </span>
                        <ul className="text-xs text-gray-500 font-mono space-y-1">
                          {entry.migration_files.map((file, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-emerald-500/20 rounded-full" />
                              {file}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => handleDelete(entry.id)}
                  className="ml-6 px-4 py-2 text-red-400/60 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
