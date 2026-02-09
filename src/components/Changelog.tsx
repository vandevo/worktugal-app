import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Tag, ChevronRight, Rocket, Sparkles, Shield, Cpu, Layout as LayoutIcon, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Seo } from './Seo';

interface ChangelogEntry {
  id: string;
  date: string;
  category: 'feature' | 'fix' | 'database' | 'ui' | 'integration' | 'security' | 'performance' | 'content' | 'docs';
  title: string;
  details: string | null;
  version: string | null;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  feature: <Rocket className="w-4 h-4" />,
  fix: <Sparkles className="w-4 h-4" />,
  ui: <LayoutIcon className="w-4 h-4" />,
  integration: <Globe className="w-4 h-4" />,
  security: <Shield className="w-4 h-4" />,
  performance: <Cpu className="w-4 h-4" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  feature: 'New Feature',
  fix: 'Improvement',
  database: 'Core Update',
  ui: 'Design',
  integration: 'Connection',
  security: 'Security',
  performance: 'Speed',
  content: 'Content',
  docs: 'Guide',
};

export const Changelog: React.FC = () => {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChangelog();
  }, []);

  const fetchChangelog = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_changelog')
        .select('id, date, category, title, details, version')
        .order('date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching changelog:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] py-20 px-4">
      <Seo 
        title="Changelog & Updates - Worktugal"
        description="Stay updated with the latest features, improvements, and releases for Worktugal and ReadyFile."
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">
              Product Updates
            </h1>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Tracking our journey towards making Portuguese tax compliance 
              effortless for foreign freelancers.
            </p>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="relative space-y-12">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 hidden md:block" />

            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Date Bubble (Desktop) */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white/20 border-4 border-[#050505] z-10" />

                {/* Content Card */}
                <div className="flex-1">
                  <Card className="p-8 hover:border-white/10 transition-all duration-500">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                          {new Date(entry.date).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      
                      {entry.version && (
                        <div className="px-3 py-1.5 bg-emerald-400/5 text-emerald-400/60 rounded-full border border-emerald-400/10 text-[10px] font-medium uppercase tracking-widest">
                          {entry.version}
                        </div>
                      )}

                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                        <Tag className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                          {CATEGORY_LABELS[entry.category] || entry.category}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-2xl font-serif text-white mb-4">
                      {entry.title}
                    </h2>
                    
                    {entry.details && (
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-400 font-light leading-relaxed text-sm whitespace-pre-wrap">
                          {entry.details}
                        </p>
                      </div>
                    )}

                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center gap-3 text-gray-500">
                        {CATEGORY_ICONS[entry.category] || <Sparkles className="w-4 h-4" />}
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                          {entry.category === 'feature' ? 'New Release' : 'System Polish'}
                        </span>
                      </div>
                      
                      <button className="text-white/40 hover:text-white transition-colors group flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                        Learn More
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </Card>
                </div>

                {/* Spacer for Desktop Alignment */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-32 text-center pb-20">
          <Card className="p-12">
            <h3 className="text-3xl font-serif text-white mb-6">
              Ready for your own compliance check?
            </h3>
            <p className="text-gray-400 font-light mb-10 max-w-xl mx-auto leading-relaxed">
              Experience the platform updates firsthand. Run our 2-minute diagnostic 
              and see where you stand with Portuguese tax laws.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={() => navigate('/checkup')} className="w-full sm:w-auto">
                Start Free Checkup
              </Button>
              <Button onClick={() => navigate('/contact')} variant="outline" className="w-full sm:w-auto">
                Talk to Us
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
