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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Changelog</h2>
          <p className="text-gray-600 mt-1">
            Track changes for documentation generation
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
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (required)
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Brief one-line description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Details
              </label>
              <textarea
                value={formData.details}
                onChange={(e) =>
                  setFormData({ ...formData, details: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed explanation of changes, technical specifics, why this change was made..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Affected Files (one per line)
                </label>
                <textarea
                  value={formData.affected_files}
                  onChange={(e) =>
                    setFormData({ ...formData, affected_files: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="src/components/Example.tsx&#10;src/lib/helper.ts"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Migration Files (one per line)
                </label>
                <textarea
                  value={formData.migration_files}
                  onChange={(e) =>
                    setFormData({ ...formData, migration_files: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="20251106_create_table.sql"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Version (optional)
              </label>
              <Input
                value={formData.version}
                onChange={(e) =>
                  setFormData({ ...formData, version: e.target.value })
                }
                placeholder="v1.2.0"
              />
            </div>

            <div className="flex gap-2">
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
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {entries.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            No changelog entries yet. Click "Log Change" to add one.
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{entry.date}</span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {entry.category}
                    </span>
                    {entry.version && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                        {entry.version}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {entry.title}
                  </h3>
                  {entry.details && (
                    <p className="text-sm text-gray-600 whitespace-pre-wrap mb-2">
                      {entry.details}
                    </p>
                  )}
                  {entry.affected_files && entry.affected_files.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-gray-500">
                        Files changed:
                      </span>
                      <ul className="text-xs text-gray-600 font-mono mt-1">
                        {entry.affected_files.map((file, i) => (
                          <li key={i}>• {file}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.migration_files && entry.migration_files.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-gray-500">
                        Migrations:
                      </span>
                      <ul className="text-xs text-gray-600 font-mono mt-1">
                        {entry.migration_files.map((file, i) => (
                          <li key={i}>• {file}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <Button
                  variant="secondary"
                  onClick={() => handleDelete(entry.id)}
                  className="ml-4"
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
