import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Download,
  Filter,
  Mail,
  Phone,
  ExternalLink,
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="mb-6 text-slate-400 hover:text-white border-slate-700/50 hover:border-slate-600 bg-slate-800/30 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>
          <h1 className="text-4xl font-bold text-white mb-3">Tax Checkup Leads</h1>
          <p className="text-xl text-slate-400">
            Lead generation from compliance diagnostic tool
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-gray-400">Total Leads</div>
          </div>
          <div className="bg-green-500/10 backdrop-blur-xl border border-green-500/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400">{stats.highQuality}</div>
            <div className="text-sm text-gray-400">High Quality</div>
          </div>
          <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-red-400">{stats.criticalIssues}</div>
            <div className="text-sm text-gray-400">Critical Issues</div>
          </div>
          <div className="bg-yellow-500/10 backdrop-blur-xl border border-yellow-500/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-400">{stats.warnings}</div>
            <div className="text-sm text-gray-400">With Warnings</div>
          </div>
          <div className="bg-blue-500/10 backdrop-blur-xl border border-blue-500/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-400">{stats.avgQuality}</div>
            <div className="text-sm text-gray-400">Avg Quality</div>
          </div>
          <div className="bg-purple-500/10 backdrop-blur-xl border border-purple-500/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-400">{stats.emailConsent}</div>
            <div className="text-sm text-gray-400">Email Consent</div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4 flex-wrap">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Filter by Type</label>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="w-48"
                >
                  <option value="all">All Leads ({stats.total})</option>
                  <option value="high_quality">High Quality ({stats.highQuality})</option>
                  <option value="needs_follow_up">Needs Follow-up ({stats.criticalIssues})</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Sort By</label>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-40"
                >
                  <option value="created">Latest First</option>
                  <option value="quality">Quality Score</option>
                  <option value="compliance">Critical Issues</option>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={exportLeads}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/[0.02] border-b border-white/[0.08]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Lead Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Work & Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Compliance
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Quality
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.08]">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No leads found matching your filters
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-white">{lead.name || 'Anonymous'}</div>
                          <div className="text-sm text-gray-400">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </div>
                          {lead.utm_source && (
                            <div className="text-xs text-gray-500 mt-1">
                              Source: {lead.utm_source}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-white capitalize">
                            {lead.work_type.replace(/_/g, ' ')}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {lead.months_in_portugal} months/year
                          </div>
                          <div className="text-xs text-gray-400">
                            {lead.estimated_annual_income.replace(/_/g, ' ')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          {lead.compliance_score_red > 0 && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded-lg">
                              <AlertTriangle className="w-3 h-3 text-red-400" />
                              <span className="text-xs font-semibold text-red-400">
                                {lead.compliance_score_red}
                              </span>
                            </div>
                          )}
                          {lead.compliance_score_yellow > 0 && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-lg">
                              <AlertCircle className="w-3 h-3 text-yellow-400" />
                              <span className="text-xs font-semibold text-yellow-400">
                                {lead.compliance_score_yellow}
                              </span>
                            </div>
                          )}
                          {lead.compliance_score_green > 0 && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-lg">
                              <CheckCircle2 className="w-3 h-3 text-green-400" />
                              <span className="text-xs font-semibold text-green-400">
                                {lead.compliance_score_green}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <span className={`text-lg font-bold ${
                            lead.lead_quality_score >= 70 ? 'text-green-400' :
                            lead.lead_quality_score >= 50 ? 'text-yellow-400' :
                            'text-gray-400'
                          }`}>
                            {lead.lead_quality_score}
                          </span>
                          <span className="text-xs text-gray-500">/ 100</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <a
                            href={`mailto:${lead.email}`}
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                          >
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </a>
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                            >
                              <Phone className="w-3 h-3" />
                              {lead.phone}
                            </a>
                          )}
                          {lead.email_marketing_consent && (
                            <div className="text-xs text-green-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Email consent
                            </div>
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

        {/* Summary Stats */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-2">Lead generation summary</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p>{filteredLeads.length} leads shown (filtered from {leads.length} total)</p>
            <p>{stats.emailConsent} leads consented to email marketing ({Math.round((stats.emailConsent / stats.total) * 100) || 0}%)</p>
            <p>Average lead quality score: {stats.avgQuality}/100</p>
            <p>{stats.criticalIssues} leads with critical compliance issues need follow-up</p>
          </div>
        </div>
      </div>
    </div>
  );
};
