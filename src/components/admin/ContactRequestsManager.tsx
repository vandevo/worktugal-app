import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
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
          <h1 className="text-4xl font-bold text-white mb-3">Contact Requests</h1>
          <p className="text-xl text-slate-400">Manage incoming contact requests and inquiries</p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-4"
          >
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 shadow-xl">
              <p className="text-sm text-slate-400 mb-1">Total</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl p-6 rounded-2xl border border-green-500/20 shadow-xl">
              <p className="text-sm text-slate-400 mb-1">New</p>
              <p className="text-3xl font-bold text-green-400">{stats.new}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-xl p-6 rounded-2xl border border-red-500/20 shadow-xl">
              <p className="text-sm text-slate-400 mb-1">High Priority</p>
              <p className="text-3xl font-bold text-red-400">{stats.highPriority}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl p-6 rounded-2xl border border-blue-500/20 shadow-xl">
              <p className="text-sm text-slate-400 mb-1">This Month</p>
              <p className="text-3xl font-bold text-blue-400">{stats.thisMonth}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-xl p-6 rounded-2xl border border-emerald-500/20 shadow-xl">
              <p className="text-sm text-slate-400 mb-1">Converted</p>
              <p className="text-3xl font-bold text-emerald-400">{stats.converted}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <Filter className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
                >
                  <option value="">All</option>
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="replied">Replied</option>
                  <option value="converted">Converted</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Purpose</label>
                <select
                  value={filters.purpose}
                  onChange={(e) => setFilters({ ...filters, purpose: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
                >
                  <option value="">All</option>
                  <option value="accounting">Accounting</option>
                  <option value="partnership">Partnership</option>
                  <option value="job">Job</option>
                  <option value="info">Info</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
                >
                  <option value="">All</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Purpose</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Budget</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Priority</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(request.created_at!).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {request.full_name}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <a
                          href={`mailto:${request.email}`}
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          {request.email}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getPurposeBadgeColor(
                            request.purpose
                          )}`}
                        >
                          {request.purpose}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {request.budget_range ? (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            €{request.budget_range}
                          </div>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getPriorityBadgeColor(
                            request.priority || 'normal'
                          )}`}
                        >
                          {request.priority || 'normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(
                            request.status || 'new'
                          )}`}
                        >
                          {request.status || 'new'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                          >
                            View
                          </button>
                          <select
                            value={request.status || 'new'}
                            onChange={(e) => handleStatusChange(request.id!, e.target.value)}
                            className="text-sm bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                          >
                            <option value="new">New</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="replied">Replied</option>
                            <option value="converted">Converted</option>
                            <option value="archived">Archived</option>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50 shadow-2xl"
          >
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Request Details</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-400 block mb-1">Name</label>
                <p className="text-white text-lg">{selectedRequest.full_name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-400 block mb-1">Email</label>
                <p className="text-white">{selectedRequest.email}</p>
              </div>

              {selectedRequest.company_name && (
                <div>
                  <label className="text-sm font-medium text-slate-400 block mb-1">Company</label>
                  <p className="text-white">{selectedRequest.company_name}</p>
                </div>
              )}

              {selectedRequest.website_url && (
                <div>
                  <label className="text-sm font-medium text-slate-400 block mb-1">Website</label>
                  <a
                    href={selectedRequest.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
                  >
                    {selectedRequest.website_url}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-400 block mb-1">Purpose</label>
                <p className="text-white capitalize">{selectedRequest.purpose}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-400 block mb-1">Message</label>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-slate-200 whitespace-pre-wrap">{selectedRequest.message}</p>
                </div>
              </div>

              {selectedRequest.budget_range && (
                <div>
                  <label className="text-sm font-medium text-slate-400 block mb-1">Budget Range</label>
                  <p className="text-white">€{selectedRequest.budget_range}</p>
                </div>
              )}

              {selectedRequest.timeline && (
                <div>
                  <label className="text-sm font-medium text-slate-400 block mb-1">Timeline</label>
                  <p className="text-white capitalize">
                    {selectedRequest.timeline.replace('_', ' ')}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-400 block mb-1">Priority</label>
                  <p className="text-white capitalize">
                    {selectedRequest.priority || 'normal'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-400 block mb-1">Status</label>
                  <p className="text-white capitalize">{selectedRequest.status || 'new'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-400 block mb-1">Submitted</label>
                <p className="text-white">
                  {new Date(selectedRequest.created_at!).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 px-6 py-4 flex gap-4">
              <Button
                variant="outline"
                onClick={() => setSelectedRequest(null)}
                className="flex-1 border-slate-700 hover:border-slate-600 bg-slate-800/50 hover:bg-slate-700/50"
              >
                Close
              </Button>
              <a
                href={`mailto:${selectedRequest.email}`}
                className="flex-1"
              >
                <Button className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600">
                  <Mail className="w-4 h-4 mr-2" />
                  Reply
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
