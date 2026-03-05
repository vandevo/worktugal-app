import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllAppointments, assignAccountant, updateAppointment } from '../../lib/appointments';
import { getAllActiveAccountants } from '../../lib/accountants';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Alert } from '../ui/Alert';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import type { Appointment, AccountantProfile } from '../../types/accountant';

export const AppointmentManagement: React.FC = () => {
  const navigate = useNavigate();
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
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian py-24 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <Button
            variant="secondary"
            onClick={() => navigate('/dashboard')}
            className="mb-8 px-6 py-2 bg-white/5 border-white/10 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>
          <h1 className="font-serif text-5xl text-white mb-4 tracking-tight">Appointment Management</h1>
          <p className="font-light text-gray-500 text-xl leading-relaxed">Manage and assign consultations through the sovereign control center.</p>
        </div>

        <div className="space-y-12">
          {error && (
            <Alert variant="error" className="mb-8">
              {error}
            </Alert>
          )}

          <section>
            <h2 className="font-serif text-2xl text-white mb-8 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400/50" />
              Pending Assignment
              <span className="ml-2 text-sm font-sans font-light text-gray-500">({pendingAssignments.length})</span>
            </h2>

            {pendingAssignments.length === 0 ? (
              <div className="p-16 text-center bg-[#121212] rounded-3xl border border-white/5 border-dashed">
                <CheckCircle className="w-12 h-12 text-emerald-400/20 mx-auto mb-4" />
                <p className="font-light text-gray-500 italic text-lg">All appointments have been successfully assigned.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {pendingAssignments.map((appointment) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl p-8 transition-all hover:border-white/10"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <h3 className="font-serif text-2xl text-white">
                            {formatServiceType(appointment.service_type)}
                          </h3>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-500 font-light">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-lg">
                              <Clock className="w-4 h-4 text-blue-400/50" />
                            </div>
                            <span>{appointment.duration_minutes} minute session</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-lg">
                              <Calendar className="w-4 h-4 text-blue-400/50" />
                            </div>
                            <span>Preferred: {formatDate(appointment.preferred_date)}</span>
                          </div>
                        </div>
                        {appointment.client_notes && (
                          <div className="mt-6 p-6 bg-white/[0.01] border border-white/5 rounded-2xl">
                            <p className="text-sm text-gray-400 leading-relaxed italic">
                              <span className="text-[10px] uppercase tracking-widest text-gray-600 block mb-2 font-bold not-italic">Client Notes</span>
                              "{appointment.client_notes}"
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-8">
                        <p className="font-serif text-3xl text-white mb-1">€{appointment.payment_amount?.toFixed(2)}</p>
                        <span className="bg-emerald-500/5 text-emerald-400/60 px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest border border-emerald-500/10">
                          Transaction Verified
                        </span>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-end gap-6">
                      <div className="flex-1 w-full">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-4 block">
                          Assign Designated Accountant
                        </label>
                        <Select
                          value={selectedAccountant[appointment.id] || ''}
                          onChange={(e) => setSelectedAccountant(prev => ({
                            ...prev,
                            [appointment.id]: e.target.value
                          }))}
                          className="bg-white/[0.02] border-white/5 text-white"
                          disabled={assigningId === appointment.id}
                        >
                          <option value="" className="bg-obsidian">Select an authorized professional...</option>
                          {accountants.map((accountant) => (
                            <option key={accountant.id} value={accountant.id} className="bg-obsidian text-white">
                              {accountant.full_name} • {accountant.specializations?.join(', ')}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <Button
                        onClick={() => handleAssignAccountant(appointment.id)}
                        disabled={!selectedAccountant[appointment.id] || assigningId === appointment.id}
                        className="px-8 py-4 h-[50px] whitespace-nowrap"
                      >
                        {assigningId === appointment.id ? 'Processing...' : 'Confirm Assignment'}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white mb-8 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-400/50" />
              Scheduled Queue
              <span className="ml-2 text-sm font-sans font-light text-gray-500">({scheduled.length})</span>
            </h2>

            {scheduled.length === 0 ? (
              <div className="p-12 text-center bg-[#121212] rounded-3xl border border-white/5 border-dashed">
                <p className="font-light text-gray-500 italic">No appointments in the active queue.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {scheduled.slice(0, 10).map((appointment) => (
                  <Card
                    key={appointment.id}
                    className="bg-[#121212] border-white/5 p-6 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="font-serif text-xl text-white">
                            {formatServiceType(appointment.service_type)}
                          </h3>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-gray-600">
                          <span className="flex items-center gap-2">
                            <User className="w-3 h-3" />
                            Ref #{appointment.id}
                          </span>
                          <span className="flex items-center gap-2 text-blue-400/60">
                            <Clock className="w-3 h-3" />
                            Scheduled: {formatDate(appointment.scheduled_date)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-2xl text-white">€{appointment.payment_amount?.toFixed(2)}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-serif text-2xl text-white mb-8 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400/50" />
              History Archive
              <span className="ml-2 text-sm font-sans font-light text-gray-500">({completed.length})</span>
            </h2>

            {completed.length === 0 ? (
              <div className="p-12 text-center bg-[#121212] rounded-3xl border border-white/5 border-dashed">
                <p className="font-light text-gray-500 italic">Archive is currently empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {completed.slice(0, 5).map((appointment) => (
                  <Card
                    key={appointment.id}
                    className="bg-[#121212] border-white/5 p-6 hover:border-white/10 opacity-60 hover:opacity-100 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-serif text-xl text-white mb-2">
                          {formatServiceType(appointment.service_type)}
                        </h3>
                        <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-gray-600">
                          <span>Verified: {formatDate(appointment.consultation_completed_at)}</span>
                          {appointment.client_rating && (
                            <span className="flex items-center gap-1 text-yellow-400/50">
                              {'⭐'.repeat(appointment.client_rating)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-2xl text-white">€{appointment.payment_amount?.toFixed(2)}</p>
                        <p className="text-[10px] uppercase tracking-widest text-emerald-400/60 font-bold">Platform Fee: €{appointment.platform_fee_amount?.toFixed(2)}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
