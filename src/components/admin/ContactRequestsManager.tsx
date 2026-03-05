import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import {
  getContactRequests,
  updateContactRequest,
  getContactRequestStats,
  type ContactRequest,
} from '../../lib/contacts';
import { Mail, ExternalLink, Calendar, DollarSign, Filter, ArrowLeft, X } from 'lucide-react';

export function ContactRequestsManager() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    highPriority: 0,
    thisMonth: 0,
    converted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    purpose: '',
    priority: '',
  });

  useEffect(() => {
    loadRequests();
    loadStats();
  }, [filters]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getContactRequests(filters);
      setRequests(data);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getContactRequestStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const updates: Partial<ContactRequest> = { status: status as any };
      if (status === 'replied') {
        updates.replied_at = new Date().toISOString();
      }
      await updateContactRequest(id, updates);
      loadRequests();
      loadStats();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getPurposeBadgeColor = (purpose: string) => {
    switch (purpose) {
      case 'accounting':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'partnership':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'job':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'info':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'normal':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'low':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'reviewed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'replied':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'converted':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'archived':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
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
          <h1 className="font-serif text-5xl text-white mb-4 tracking-tight">Contact Requests</h1>
          <p className="font-light text-gray-500 text-xl leading-relaxed">Intelligence gathering and relationship management.</p>
        </motion.div>

        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-4"
          >
            <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 transition-all hover:border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1 font-bold">Total</p>
              <p className="text-3xl font-serif text-white">{stats.total}</p>
            </div>
            <div className="bg-[#121212] border border-emerald-500/10 rounded-2xl p-6 transition-all hover:border-emerald-500/20">
              <p className="text-[10px] uppercase tracking-widest text-emerald-600/60 mb-1 font-bold">New</p>
              <p className="text-3xl font-serif text-emerald-400/60">{stats.new}</p>
            </div>
            <div className="bg-[#121212] border border-red-500/10 rounded-2xl p-6 transition-all hover:border-red-500/20">
              <p className="text-[10px] uppercase tracking-widest text-red-600/60 mb-1 font-bold">High Priority</p>
              <p className="text-3xl font-serif text-red-400/60">{stats.highPriority}</p>
            </div>
            <div className="bg-[#121212] border border-blue-500/10 rounded-2xl p-6 transition-all hover:border-blue-500/20">
              <p className="text-[10px] uppercase tracking-widest text-blue-600/60 mb-1 font-bold">This Month</p>
              <p className="text-3xl font-serif text-blue-400/60">{stats.thisMonth}</p>
            </div>
            <div className="bg-[#121212] border border-emerald-500/10 rounded-2xl p-6 transition-all hover:border-emerald-500/20">
              <p className="text-[10px] uppercase tracking-widest text-emerald-600/60 mb-1 font-bold">Converted</p>
              <p className="text-3xl font-serif text-emerald-400/60">{stats.converted}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <Filter className="w-5 h-5 text-blue-400/50" />
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Signal Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4 block">Status</label>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="bg-white/[0.02] border-white/5 text-white"
                >
                  <option value="" className="bg-obsidian">All Signals</option>
                  <option value="new" className="bg-obsidian">New</option>
                  <option value="reviewed" className="bg-obsidian">Reviewed</option>
                  <option value="replied" className="bg-obsidian">Replied</option>
                  <option value="converted" className="bg-obsidian">Converted</option>
                  <option value="archived" className="bg-obsidian">Archived</option>
                </Select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4 block">Purpose</label>
                <Select
                  value={filters.purpose}
                  onChange={(e) => setFilters({ ...filters, purpose: e.target.value })}
                  className="bg-white/[0.02] border-white/5 text-white"
                >
                  <option value="" className="bg-obsidian">All Objectives</option>
                  <option value="accounting" className="bg-obsidian">Accounting</option>
                  <option value="partnership" className="bg-obsidian">Partnership</option>
                  <option value="job" className="bg-obsidian">Job</option>
                  <option value="info" className="bg-obsidian">Info</option>
                  <option value="other" className="bg-obsidian">Other</option>
                </Select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4 block">Priority</label>
                <Select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  className="bg-white/[0.02] border-white/5 text-white"
                >
                  <option value="" className="bg-obsidian">All Priorities</option>
                  <option value="high" className="bg-obsidian">High</option>
                  <option value="normal" className="bg-obsidian">Normal</option>
                  <option value="low" className="bg-obsidian">Low</option>
                </Select>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden mb-12"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/[0.02] border-b border-white/5 text-left">
                  <tr>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Chronology</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Identity</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Channel</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Objective</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Value</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Priority</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Phase</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-8 py-6 text-xs text-gray-500 font-light">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 opacity-50" />
                          {new Date(request.created_at!).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-serif text-white group-hover:text-blue-400/80 transition-colors">
                          {request.full_name}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs font-light">
                        <a
                          href={`mailto:${request.email}`}
                          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <Mail className="w-3 h-3 opacity-50" />
                          {request.email}
                        </a>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`bg-white/5 text-gray-400 px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-widest border border-white/10 ${getPurposeBadgeColor(
                            request.purpose
                          )}`}
                        >
                          {request.purpose}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-xs text-gray-500 font-light">
                        {request.budget_range ? (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 opacity-50" />
                            €{request.budget_range}
                          </div>
                        ) : (
                          <span className="opacity-20">-</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`bg-white/5 text-gray-400 px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-widest border border-white/10 ${getPriorityBadgeColor(
                            request.priority || 'normal'
                          )}`}
                        >
                          {request.priority || 'normal'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`bg-white/5 text-gray-400 px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-widest border border-white/10 ${getStatusBadgeColor(
                            request.status || 'new'
                          )}`}
                        >
                          {request.status || 'new'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-[10px] uppercase tracking-widest font-bold text-blue-400/60 hover:text-blue-400 transition-colors"
                          >
                            Inspect
                          </button>
                          <select
                            value={request.status || 'new'}
                            onChange={(e) => handleStatusChange(request.id!, e.target.value)}
                            className="text-[10px] uppercase tracking-widest bg-white/[0.02] border border-white/5 rounded px-2 py-1 text-gray-500 focus:outline-none focus:bg-white/[0.06] transition-all cursor-pointer"
                          >
                            <option value="new" className="bg-obsidian">New</option>
                            <option value="reviewed" className="bg-obsidian">Reviewed</option>
                            <option value="replied" className="bg-obsidian">Replied</option>
                            <option value="converted" className="bg-obsidian">Converted</option>
                            <option value="archived" className="bg-obsidian">Archived</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#121212] backdrop-blur-3xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/5 shadow-2xl"
          >
            <div className="sticky top-0 bg-obsidian/95 backdrop-blur-xl border-b border-white/5 px-8 py-6 flex items-center justify-between">
              <h3 className="font-serif text-2xl text-white">Request Intelligence</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-2 block">Name</label>
                  <p className="font-serif text-xl text-white">{selectedRequest.full_name}</p>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-2 block">Email</label>
                  <p className="font-light text-gray-400">{selectedRequest.email}</p>
                </div>
              </div>

              {selectedRequest.company_name && (
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-2 block">Company</label>
                  <p className="font-light text-gray-400">{selectedRequest.company_name}</p>
                </div>
              )}

              {selectedRequest.website_url && (
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-2 block">Website</label>
                  <a
                    href={selectedRequest.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400/60 hover:text-blue-400 flex items-center gap-2 transition-colors font-light"
                  >
                    {selectedRequest.website_url}
                    <ExternalLink className="w-4 h-4 opacity-50" />
                  </a>
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-2 block">Objective</label>
                <p className="font-light text-gray-400 capitalize">{selectedRequest.purpose}</p>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-2 block">Message Body</label>
                <div className="bg-white/[0.01] rounded-2xl p-6 border border-white/5">
                  <p className="text-gray-300 font-light leading-relaxed whitespace-pre-wrap italic">"{selectedRequest.message}"</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {selectedRequest.budget_range && (
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-2 block">Budget Profile</label>
                    <p className="font-light text-gray-400">€{selectedRequest.budget_range}</p>
                  </div>
                )}

                {selectedRequest.timeline && (
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-2 block">Strategic Timeline</label>
                    <p className="font-light text-gray-400 capitalize">
                      {selectedRequest.timeline.replace('_', ' ')}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-2 block">System Priority</label>
                  <span className={`bg-white/5 text-gray-400 px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-widest border border-white/10 ${getPriorityBadgeColor(selectedRequest.priority || 'normal')}`}>
                    {selectedRequest.priority || 'normal'}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-2 block">Current Phase</label>
                  <span className={`bg-white/5 text-gray-400 px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-widest border border-white/10 ${getStatusBadgeColor(selectedRequest.status || 'new')}`}>
                    {selectedRequest.status || 'new'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-2 block">Entry Registered</label>
                <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">
                  {new Date(selectedRequest.created_at!).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-obsidian/95 backdrop-blur-xl border-t border-white/5 px-8 py-6 flex gap-4">
              <Button
                variant="secondary"
                onClick={() => setSelectedRequest(null)}
                className="flex-1"
              >
                Dismiss
              </Button>
              <a
                href={`mailto:${selectedRequest.email}`}
                className="flex-1"
              >
                <Button className="w-full bg-white text-black hover:bg-gray-200">
                  <Mail className="w-4 h-4 mr-2" />
                  Initiate Reply
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
