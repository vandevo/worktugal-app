import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { AdminNavigation } from './AdminNavigation';
import {
  getContactRequests,
  updateContactRequest,
  getContactRequestStats,
  type ContactRequest,
} from '../../lib/contacts';
import { getAllAppointments } from '../../lib/appointments';
import { getAllApplications } from '../../lib/accountants';
import { Mail, ExternalLink, Calendar, DollarSign, Clock, Filter } from 'lucide-react';

export function ContactRequestsManager() {
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
  const [scheduledCount, setScheduledCount] = useState(0);
  const [pendingApplications, setPendingApplications] = useState(0);

  useEffect(() => {
    loadRequests();
    loadStats();
    loadAdminData();
  }, [filters]);

  const loadAdminData = async () => {
    try {
      const [appointmentsRes, applicationsRes] = await Promise.all([
        getAllAppointments(),
        getAllApplications(),
      ]);

      if (appointmentsRes.data) {
        setScheduledCount(appointmentsRes.data.filter((a: any) => a.status === 'scheduled').length);
      }
      if (applicationsRes.data) {
        setPendingApplications(applicationsRes.data.filter((a: any) => a.status === 'pending').length);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

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
        return 'bg-purple-100 text-purple-800';
      case 'partnership':
        return 'bg-blue-100 text-blue-800';
      case 'job':
        return 'bg-green-100 text-green-800';
      case 'info':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'replied':
        return 'bg-purple-100 text-purple-800';
      case 'converted':
        return 'bg-emerald-100 text-emerald-800';
      case 'archived':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <AdminNavigation
        pendingCounts={{
          appointments: scheduledCount,
          applications: pendingApplications,
          contacts: stats.new,
        }}
      />
      <div className="min-h-screen bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Contact Requests</h1>
            <p className="text-gray-400">Manage incoming contact requests and inquiries</p>
          </div>
          <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600">Total</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600">New</p>
          <p className="text-2xl font-bold text-green-600">{stats.new}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600">High Priority</p>
          <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600">This Month</p>
          <p className="text-2xl font-bold text-blue-600">{stats.thisMonth}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600">Converted</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.converted}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-slate-700 mb-2">Purpose</label>
            <select
              value={filters.purpose}
              onChange={(e) => setFilters({ ...filters, purpose: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Purpose</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Budget</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Priority</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(request.created_at!).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {request.full_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <a
                      href={`mailto:${request.email}`}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                    >
                      <Mail className="w-4 h-4" />
                      {request.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPurposeBadgeColor(
                        request.purpose
                      )}`}
                    >
                      {request.purpose}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {request.budget_range ? (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        €{request.budget_range}
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadgeColor(
                        request.priority || 'normal'
                      )}`}
                    >
                      {request.priority || 'normal'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                        request.status || 'new'
                      )}`}
                    >
                      {request.status || 'new'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </button>
                      <select
                        value={request.status || 'new'}
                        onChange={(e) => handleStatusChange(request.id!, e.target.value)}
                        className="text-sm border border-slate-300 rounded px-2 py-1"
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
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Request Details</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Name</label>
                <p className="text-slate-900">{selectedRequest.full_name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <p className="text-slate-900">{selectedRequest.email}</p>
              </div>

              {selectedRequest.company_name && (
                <div>
                  <label className="text-sm font-medium text-slate-700">Company</label>
                  <p className="text-slate-900">{selectedRequest.company_name}</p>
                </div>
              )}

              {selectedRequest.website_url && (
                <div>
                  <label className="text-sm font-medium text-slate-700">Website</label>
                  <a
                    href={selectedRequest.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    {selectedRequest.website_url}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-700">Purpose</label>
                <p className="text-slate-900 capitalize">{selectedRequest.purpose}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Message</label>
                <p className="text-slate-900 whitespace-pre-wrap">{selectedRequest.message}</p>
              </div>

              {selectedRequest.budget_range && (
                <div>
                  <label className="text-sm font-medium text-slate-700">Budget Range</label>
                  <p className="text-slate-900">€{selectedRequest.budget_range}</p>
                </div>
              )}

              {selectedRequest.timeline && (
                <div>
                  <label className="text-sm font-medium text-slate-700">Timeline</label>
                  <p className="text-slate-900 capitalize">
                    {selectedRequest.timeline.replace('_', ' ')}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-700">Priority</label>
                <p className="text-slate-900 capitalize">
                  {selectedRequest.priority || 'normal'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Status</label>
                <p className="text-slate-900 capitalize">{selectedRequest.status || 'new'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Submitted</label>
                <p className="text-slate-900">
                  {new Date(selectedRequest.created_at!).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setSelectedRequest(null)}
                className="flex-1"
              >
                Close
              </Button>
              <a
                href={`mailto:${selectedRequest.email}`}
                className="flex-1"
              >
                <Button className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Reply
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    </>
  );
}
