import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Download,
  Mail,
  Phone,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TaxCheckupLead {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  work_type: string;
  residency_status: string;
  months_in_portugal: number;
  estimated_annual_income: string;
  compliance_score_red: number;
  compliance_score_yellow: number;
  compliance_score_green: number;
  lead_quality_score: number;
  email_marketing_consent: boolean;
  status: string;
  utm_source: string | null;
  utm_campaign: string | null;
}

export const TaxCheckupLeads: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<TaxCheckupLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high_quality' | 'needs_follow_up'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'quality' | 'compliance'>('created');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('tax_checkup_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setLeads(data || []);
    } catch (error) {
      console.error('Error loading checkup leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportLeads = () => {
    const csvContent = [
      ['Date', 'Name', 'Email', 'Phone', 'Work Type', 'Red Flags', 'Warnings', 'Quality Score', 'Email Consent', 'UTM Source'].join(','),
      ...filteredLeads.map(lead => [
        new Date(lead.created_at).toLocaleDateString(),
        lead.name || '',
        lead.email,
        lead.phone || '',
        lead.work_type,
        lead.compliance_score_red,
        lead.compliance_score_yellow,
        lead.lead_quality_score,
        lead.email_marketing_consent ? 'Yes' : 'No',
        lead.utm_source || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-checkup-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredLeads = leads
    .filter(lead => {
      if (filter === 'all') return true;
      if (filter === 'high_quality') return (lead.lead_quality_score || 0) >= 70;
      if (filter === 'needs_follow_up') return (lead.compliance_score_red || 0) >= 2;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'quality') {
        return (b.lead_quality_score || 0) - (a.lead_quality_score || 0);
      }
      if (sortBy === 'compliance') {
        return (b.compliance_score_red || 0) - (a.compliance_score_red || 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const stats = {
    total: leads.length,
    highQuality: leads.filter(l => (l.lead_quality_score || 0) >= 70).length,
    criticalIssues: leads.filter(l => (l.compliance_score_red || 0) >= 2).length,
    warnings: leads.filter(l => (l.compliance_score_yellow || 0) > 0).length,
    avgQuality: Math.round(leads.reduce((sum, l) => sum + (l.lead_quality_score || 0), 0) / leads.length) || 0,
    emailConsent: leads.filter(l => l.email_marketing_consent).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian py-24 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Button
            variant="secondary"
            onClick={() => navigate('/dashboard')}
            className="mb-8 px-6 py-2 bg-white/5 border-white/10 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>
          <h1 className="font-serif text-5xl text-white mb-4 tracking-tight">Tax Checkup Leads</h1>
          <p className="font-light text-gray-500 text-xl leading-relaxed">
            Intelligence gathered from the compliance diagnostic engine.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 transition-all hover:border-white/10">
            <div className="text-3xl font-serif text-white mb-1">{stats.total}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Total Leads</div>
          </div>
          <div className="bg-[#121212] border border-emerald-500/10 rounded-2xl p-6 transition-all hover:border-emerald-500/20">
            <div className="text-3xl font-serif text-emerald-400/60 mb-1">{stats.highQuality}</div>
            <div className="text-[10px] uppercase tracking-widest text-emerald-600/60 font-bold">High Quality</div>
          </div>
          <div className="bg-[#121212] border border-red-500/10 rounded-2xl p-6 transition-all hover:border-red-500/20">
            <div className="text-3xl font-serif text-red-400/60 mb-1">{stats.criticalIssues}</div>
            <div className="text-[10px] uppercase tracking-widest text-red-600/60 font-bold">Critical Issues</div>
          </div>
          <div className="bg-[#121212] border border-yellow-500/10 rounded-2xl p-6 transition-all hover:border-yellow-500/20">
            <div className="text-3xl font-serif text-yellow-400/60 mb-1">{stats.warnings}</div>
            <div className="text-[10px] uppercase tracking-widest text-yellow-600/60 font-bold">With Warnings</div>
          </div>
          <div className="bg-[#121212] border border-blue-500/10 rounded-2xl p-6 transition-all hover:border-blue-500/20">
            <div className="text-3xl font-serif text-blue-400/60 mb-1">{stats.avgQuality}</div>
            <div className="text-[10px] uppercase tracking-widest text-blue-600/60 font-bold">Avg Quality</div>
          </div>
          <div className="bg-[#121212] border border-purple-500/10 rounded-2xl p-6 transition-all hover:border-purple-500/20">
            <div className="text-3xl font-serif text-purple-400/60 mb-1">{stats.emailConsent}</div>
            <div className="text-[10px] uppercase tracking-widest text-purple-600/60 font-bold">Email Consent</div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-end justify-between">
            <div className="flex gap-8 flex-wrap flex-1">
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4 block">Filter by Intelligence</label>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="bg-white/[0.02] border-white/5 text-white"
                >
                  <option value="all" className="bg-obsidian">All Leads ({stats.total})</option>
                  <option value="high_quality" className="bg-obsidian">High Quality ({stats.highQuality})</option>
                  <option value="needs_follow_up" className="bg-obsidian">Needs Follow-up ({stats.criticalIssues})</option>
                </Select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4 block">Order Sequence</label>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white/[0.02] border-white/5 text-white"
                >
                  <option value="created" className="bg-obsidian">Chronological (Newest)</option>
                  <option value="quality" className="bg-obsidian">Quality Metric</option>
                  <option value="compliance" className="bg-obsidian">Compliance Risk</option>
                </Select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={exportLeads}
                className="flex items-center gap-2 px-6 py-4 bg-white/5 border-white/10 text-gray-400 hover:text-white"
              >
                <Download className="w-4 h-4" />
                Export Ledger
              </Button>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/[0.02] border-b border-white/5 text-left">
                <tr>
                  <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
                    Sovereign Identity
                  </th>
                  <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
                    Operational Status
                  </th>
                  <th className="px-8 py-6 text-center text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
                    Compliance Radar
                  </th>
                  <th className="px-8 py-6 text-center text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
                    Quality Index
                  </th>
                  <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
                    Comm Channel
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <p className="font-light text-gray-500 italic">No leads detected matching the current filter sequence.</p>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-8 py-6">
                        <div>
                          <div className="font-serif text-lg text-white mb-1 group-hover:text-blue-400/80 transition-colors">{lead.name || 'Anonymous Entity'}</div>
                          <div className="text-[10px] uppercase tracking-widest text-gray-600">
                            Logged: {new Date(lead.created_at).toLocaleDateString()}
                          </div>
                          {lead.utm_source && (
                            <div className="mt-2 inline-block px-2 py-0.5 bg-white/5 rounded text-[10px] text-gray-500 border border-white/10 uppercase tracking-tighter">
                              Ref: {lead.utm_source}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <div className="text-sm text-gray-400 font-light mb-1">
                            {lead.work_type.replace(/_/g, ' ')}
                          </div>
                          <div className="text-[10px] uppercase tracking-widest text-gray-600">
                            {lead.months_in_portugal} months p/a • {lead.estimated_annual_income.replace(/_/g, ' ')}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-3 justify-center">
                          {lead.compliance_score_red > 0 && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-red-500/5 border border-red-500/10 rounded-full">
                              <AlertTriangle className="w-3 h-3 text-red-400/60" />
                              <span className="text-[10px] font-bold text-red-400/60">
                                {lead.compliance_score_red}
                              </span>
                            </div>
                          )}
                          {lead.compliance_score_yellow > 0 && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/5 border border-yellow-500/10 rounded-full">
                              <AlertCircle className="w-3 h-3 text-yellow-400/60" />
                              <span className="text-[10px] font-bold text-yellow-400/60">
                                {lead.compliance_score_yellow}
                              </span>
                            </div>
                          )}
                          {lead.compliance_score_green > 0 && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400/60" />
                              <span className="text-[10px] font-bold text-emerald-400/60">
                                {lead.compliance_score_green}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`font-serif text-2xl ${
                            lead.lead_quality_score >= 70 ? 'text-emerald-400/60' :
                            lead.lead_quality_score >= 50 ? 'text-yellow-400/60' :
                            'text-gray-600'
                          }`}>
                            {lead.lead_quality_score}
                          </span>
                          <span className="text-[8px] uppercase tracking-widest text-gray-700 font-bold">Metric / 100</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-2">
                          <a
                            href={`mailto:${lead.email}`}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-light"
                          >
                            <Mail className="w-3 h-3 opacity-50" />
                            {lead.email}
                          </a>
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-light"
                            >
                              <Phone className="w-3 h-3 opacity-50" />
                              {lead.phone}
                            </a>
                          )}
                          {lead.email_marketing_consent && (
                            <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-emerald-500/40">
                              Marketing Authorized
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Ledger */}
        <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-8">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-6">Lead Intelligence Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Exposure</p>
              <p className="font-light text-gray-400 text-sm">{filteredLeads.length} leads in current sequence</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Conversion Permission</p>
              <p className="font-light text-gray-400 text-sm">{Math.round((stats.emailConsent / stats.total) * 100) || 0}% authorized marketing</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Average Integrity</p>
              <p className="font-light text-gray-400 text-sm">{stats.avgQuality}/100 quality score</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Critical Response</p>
              <p className="font-light text-gray-400 text-sm">{stats.criticalIssues} entities require immediate audit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
