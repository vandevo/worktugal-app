import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAllAppointments, assignAccountant, updateAppointment } from '../../lib/appointments';
import { getAllActiveAccountants } from '../../lib/accountants';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Alert } from '../ui/Alert';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { Appointment, AccountantProfile } from '../../types/accountant';

export const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [accountants, setAccountants] = useState<AccountantProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [selectedAccountant, setSelectedAccountant] = useState<Record<number, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [appointmentsRes, accountantsRes] = await Promise.all([
        getAllAppointments(),
        getAllActiveAccountants(),
      ]);

      if (appointmentsRes.data) setAppointments(appointmentsRes.data);
      if (accountantsRes.data) setAccountants(accountantsRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load appointment data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignAccountant = async (appointmentId: number) => {
    const accountantId = selectedAccountant[appointmentId];
    if (!accountantId) {
      setError('Please select an accountant');
      return;
    }

    setAssigningId(appointmentId);
    setError(null);

    try {
      await assignAccountant(appointmentId, accountantId);
      await updateAppointment(appointmentId, { status: 'scheduled' });
      await loadData();
    } catch (err) {
      console.error('Error assigning accountant:', err);
      setError('Failed to assign accountant');
    } finally {
      setAssigningId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      pending_assignment: {
        bg: 'bg-yellow-400/10',
        text: 'text-yellow-400',
        icon: <AlertTriangle className="w-4 h-4" />,
      },
      scheduled: {
        bg: 'bg-blue-400/10',
        text: 'text-blue-400',
        icon: <Calendar className="w-4 h-4" />,
      },
      completed: {
        bg: 'bg-green-400/10',
        text: 'text-green-400',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      cancelled: {
        bg: 'bg-red-400/10',
        text: 'text-red-400',
        icon: <XCircle className="w-4 h-4" />,
      },
    };

    const config = statusConfig[status] || statusConfig.scheduled;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.icon}
        {status.replace('_', ' ')}
      </span>
    );
  };

  const formatServiceType = (type: string) => {
    const mapping: Record<string, string> = {
      triage: 'Tax Triage',
      start_pack: 'Freelancer Start Pack',
      annual_return: 'Annual Return',
      add_on: 'Add-On Service',
    };
    return mapping[type] || type;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pendingAssignments = appointments.filter(a => a.status === 'pending_assignment');
  const scheduled = appointments.filter(a => a.status === 'scheduled');
  const completed = appointments.filter(a => a.status === 'completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-yellow-400" />
          Pending Assignment ({pendingAssignments.length})
        </h2>

        {pendingAssignments.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-gray-400">All appointments have been assigned</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingAssignments.map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-yellow-400/20 bg-yellow-400/5 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {formatServiceType(appointment.service_type)}
                      </h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {appointment.duration_minutes} minutes
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Preferred: {formatDate(appointment.preferred_date)}
                      </div>
                    </div>
                    {appointment.client_notes && (
                      <div className="mt-3 p-3 bg-white/[0.02] rounded-lg">
                        <p className="text-sm text-gray-300">
                          <span className="font-semibold">Client Notes:</span> {appointment.client_notes}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-white">€{appointment.payment_amount?.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">Paid</p>
                  </div>
                </div>

                <div className="flex items-end gap-3 pt-4 border-t border-white/[0.08]">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Assign Accountant
                    </label>
                    <Select
                      value={selectedAccountant[appointment.id] || ''}
                      onChange={(e) => setSelectedAccountant(prev => ({
                        ...prev,
                        [appointment.id]: e.target.value
                      }))}
                      disabled={assigningId === appointment.id}
                    >
                      <option value="">Select accountant...</option>
                      {accountants.map((accountant) => (
                        <option key={accountant.id} value={accountant.id}>
                          {accountant.full_name} - {accountant.specializations?.join(', ')}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <Button
                    onClick={() => handleAssignAccountant(appointment.id)}
                    disabled={!selectedAccountant[appointment.id] || assigningId === appointment.id}
                  >
                    {assigningId === appointment.id ? 'Assigning...' : 'Assign'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-400" />
          Scheduled Appointments ({scheduled.length})
        </h2>

        {scheduled.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No scheduled appointments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduled.slice(0, 10).map((appointment) => (
              <div
                key={appointment.id}
                className="border border-white/[0.08] rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {formatServiceType(appointment.service_type)}
                      </h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Appointment #{appointment.id}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {appointment.duration_minutes} min
                      </span>
                      <span>
                        Scheduled: {formatDate(appointment.scheduled_date)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">€{appointment.payment_amount?.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-400" />
          Recent Completed ({completed.length})
        </h2>

        {completed.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No completed appointments yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {completed.slice(0, 5).map((appointment) => (
              <div
                key={appointment.id}
                className="border border-white/[0.08] rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {formatServiceType(appointment.service_type)}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Completed: {formatDate(appointment.consultation_completed_at)}</span>
                      {appointment.client_rating && (
                        <span className="flex items-center gap-1">
                          {'⭐'.repeat(appointment.client_rating)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">€{appointment.payment_amount?.toFixed(2)}</p>
                    <p className="text-sm text-green-400">€{appointment.platform_fee_amount?.toFixed(2)} fee</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
