import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { getAccountantProfile } from '../../lib/accountants';
import { getAccountantAppointments } from '../../lib/appointments';
import { getAccountantPendingEarnings, getAccountantCompletedEarnings } from '../../lib/payouts';
import { Calendar, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Alert } from '../ui/Alert';
import type { AccountantProfile, Appointment } from '../../types/accountant';

export const AccountantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AccountantProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pendingEarnings, setPendingEarnings] = useState(0);
  const [completedEarnings, setCompletedEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const [profileRes, appointmentsRes, pendingRes, completedRes] = await Promise.all([
        getAccountantProfile(user.id),
        getAccountantAppointments(user.id),
        getAccountantPendingEarnings(user.id),
        getAccountantCompletedEarnings(user.id),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (appointmentsRes.data) setAppointments(appointmentsRes.data);
      if (pendingRes.data !== null) setPendingEarnings(pendingRes.data);
      if (completedRes.data !== null) setCompletedEarnings(completedRes.data);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled');
  const completedAppointments = appointments.filter(a => a.status === 'completed');

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert variant="error">
            Accountant profile not found. Please contact support.
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {profile.full_name}!
            </h1>
            <p className="text-gray-400">
              Manage your consultations and track your earnings
            </p>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-10 h-10 text-green-400" />
                <span className="text-xs text-gray-400">In Escrow</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                €{pendingEarnings.toFixed(2)}
              </p>
              <p className="text-sm text-gray-400">Pending release</p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-10 h-10 text-blue-400" />
                <span className="text-xs text-gray-400">Total Paid</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                €{completedEarnings.toFixed(2)}
              </p>
              <p className="text-sm text-gray-400">{completedAppointments.length} consultations</p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-10 h-10 text-purple-400" />
                <span className="text-xs text-gray-400">Upcoming</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {upcomingAppointments.length}
              </p>
              <p className="text-sm text-gray-400">Scheduled appointments</p>
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-6">Upcoming Consultations</h2>

            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No upcoming consultations</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-white/[0.08] rounded-xl p-4 hover:border-white/[0.15] transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {appointment.service_type.replace('_', ' ').toUpperCase()}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(appointment.scheduled_date)}
                          </span>
                          <span>
                            {appointment.duration_minutes} minutes
                          </span>
                        </div>
                        {appointment.meeting_url && (
                          <a
                            href={appointment.meeting_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium"
                          >
                            Join Meeting →
                          </a>
                        )}
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-400/10 text-blue-400">
                        Scheduled
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Completed Consultations</h2>

            {completedAppointments.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No completed consultations yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedAppointments.slice(0, 5).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-white/[0.08] rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {appointment.service_type.replace('_', ' ').toUpperCase()}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>
                            Completed: {formatDate(appointment.consultation_completed_at)}
                          </span>
                          {appointment.client_rating && (
                            <span className="flex items-center gap-1">
                              {'⭐'.repeat(appointment.client_rating)}
                            </span>
                          )}
                        </div>
                        {appointment.outcome_document_url && (
                          <p className="text-sm text-green-400 mt-2">
                            ✓ Outcome document delivered
                          </p>
                        )}
                      </div>
                      {appointment.accountant_payout_amount && (
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">
                            €{appointment.accountant_payout_amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">Your earnings</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
