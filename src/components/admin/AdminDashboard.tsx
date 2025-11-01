import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAllAppointments } from '../../lib/appointments';
import { getAllPayouts, getPendingPayouts } from '../../lib/payouts';
import { getAllApplications } from '../../lib/accountants';
import { getContactRequestStats, getRecentContactRequests } from '../../lib/contacts';
import { Users, DollarSign, Calendar, Briefcase, Mail } from 'lucide-react';
import { Alert } from '../ui/Alert';
import { AdminNavigation } from './AdminNavigation';
import type { Appointment, Payout, AccountantApplication } from '../../types/accountant';
import type { ContactRequest } from '../../lib/contacts';

export const AdminDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [pendingPayouts, setPendingPayouts] = useState<Payout[]>([]);
  const [applications, setApplications] = useState<AccountantApplication[]>([]);
  const [contactStats, setContactStats] = useState<any>(null);
  const [recentContacts, setRecentContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [appointmentsRes, payoutsRes, pendingPayoutsRes, applicationsRes, contactStatsData, recentContactsData] = await Promise.all([
        getAllAppointments(),
        getAllPayouts(),
        getPendingPayouts(),
        getAllApplications(),
        getContactRequestStats(),
        getRecentContactRequests(5),
      ]);

      if (appointmentsRes.data) setAppointments(appointmentsRes.data);
      if (payoutsRes.data) setPayouts(payoutsRes.data);
      if (pendingPayoutsRes.data) setPendingPayouts(pendingPayoutsRes.data);
      if (applicationsRes.data) setApplications(applicationsRes.data);
      setContactStats(contactStatsData);
      setRecentContacts(recentContactsData);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const scheduledCount = appointments.filter(a => a.status === 'scheduled').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const totalRevenue = appointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + (a.platform_fee_amount || 0), 0);
  const pendingApplications = applications.filter(a => a.status === 'pending').length;
  const pendingPayoutAmount = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <AdminNavigation
        pendingCounts={{
          appointments: scheduledCount,
          applications: pendingApplications,
          contacts: contactStats?.new || 0,
        }}
      />
      <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">
              Monitor consultations, payouts, and platform performance
            </p>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-10 h-10 text-blue-400" />
                <span className="text-xs text-gray-400">Consultations</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{scheduledCount}</p>
              <p className="text-sm text-gray-400">Scheduled</p>
              <p className="text-xs text-gray-500 mt-2">{completedCount} completed</p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-10 h-10 text-green-400" />
                <span className="text-xs text-gray-400">Revenue</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                €{totalRevenue.toFixed(2)}
              </p>
              <p className="text-sm text-gray-400">Platform earnings</p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-10 h-10 text-yellow-400" />
                <span className="text-xs text-gray-400">Pending Payouts</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                €{pendingPayoutAmount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-400">{pendingPayouts.length} pending</p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
              <div className="flex items-center justify-between mb-4">
                <Briefcase className="w-10 h-10 text-purple-400" />
                <span className="text-xs text-gray-400">Applications</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{pendingApplications}</p>
              <p className="text-sm text-gray-400">To review</p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
              <div className="flex items-center justify-between mb-4">
                <Mail className="w-10 h-10 text-teal-400" />
                <span className="text-xs text-gray-400">Contacts</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{contactStats?.new || 0}</p>
              <p className="text-sm text-gray-400">New requests</p>
              <p className="text-xs text-gray-500 mt-2">{contactStats?.total || 0} total</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Appointments</h2>
              <div className="space-y-3">
                {appointments.slice(0, 5).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-white/[0.08] rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">
                          {appointment.service_type.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-400">
                          ID: #{appointment.id} • {appointment.status}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        appointment.status === 'completed' ? 'bg-green-400/10 text-green-400' :
                        appointment.status === 'scheduled' ? 'bg-blue-400/10 text-blue-400' :
                        'bg-gray-400/10 text-gray-400'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Contact Requests</h2>
              <div className="space-y-3">
                {recentContacts.length > 0 ? (
                  recentContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="border border-white/[0.08] rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white font-medium">{contact.full_name}</p>
                          <p className="text-sm text-gray-400">{contact.email}</p>
                          <p className="text-xs text-teal-400 mt-1">
                            {contact.purpose.charAt(0).toUpperCase() + contact.purpose.slice(1)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          contact.status === 'new' ? 'bg-teal-400/10 text-teal-400' :
                          contact.status === 'converted' ? 'bg-green-400/10 text-green-400' :
                          'bg-gray-400/10 text-gray-400'
                        }`}>
                          {contact.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No contact requests yet</p>
                  </div>
                )}
                {recentContacts.length > 0 && (
                  <a
                    href="/admin/contacts"
                    className="block text-center text-teal-400 hover:text-teal-300 text-sm font-medium pt-2"
                  >
                    View All Contacts →
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
              <h2 className="text-xl font-bold text-white mb-4">Pending Actions</h2>
              <div className="space-y-4">
                {pendingPayouts.length > 0 && (
                  <div className="border border-yellow-400/20 bg-yellow-400/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Payouts Awaiting Processing</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      {pendingPayouts.length} payout{pendingPayouts.length > 1 ? 's' : ''} totaling €{pendingPayoutAmount.toFixed(2)}
                    </p>
                    <a
                      href="/admin/appointments"
                      className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                    >
                      Manage Appointments →
                    </a>
                  </div>
                )}

                {pendingApplications > 0 && (
                  <div className="border border-purple-400/20 bg-purple-400/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">New Accountant Applications</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      {pendingApplications} application{pendingApplications > 1 ? 's' : ''} awaiting review
                    </p>
                    <a
                      href="/admin/applications"
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                    >
                      Review Applications →
                    </a>
                  </div>
                )}

                {(contactStats?.new || 0) > 0 && (
                  <div className="border border-teal-400/20 bg-teal-400/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">New Contact Requests</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      {contactStats.new} new contact request{contactStats.new > 1 ? 's' : ''} awaiting review
                    </p>
                    <a
                      href="/admin/contacts"
                      className="text-teal-400 hover:text-teal-300 text-sm font-medium"
                    >
                      Review Contacts →
                    </a>
                  </div>
                )}

                {pendingPayouts.length === 0 && pendingApplications === 0 && (contactStats?.new || 0) === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No pending actions</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
};
