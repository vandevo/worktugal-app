import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Calendar, FileText, User, Clock, CheckCircle, Download, Star, AlertCircle, Video } from 'lucide-react';
import { getUserConsultBookings } from '../../lib/consults';
import { getClientAppointments, approveAppointment, rateAppointment } from '../../lib/appointments';
import { CONSULT_SERVICES } from '../../types/accounting';
import type { ConsultBooking } from '../../types/accounting';
import type { Appointment } from '../../types/accountant';

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<ConsultBooking[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const [bookingsRes, appointmentsRes] = await Promise.all([
        getUserConsultBookings(),
        getClientAppointments(user.id)
      ]);

      if (bookingsRes.error) throw bookingsRes.error;
      if (appointmentsRes.error) throw appointmentsRes.error;

      setBookings(bookingsRes.data || []);
      setAppointments(appointmentsRes.data || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appointmentId: number) => {
    try {
      await approveAppointment(appointmentId);
      await loadData();
    } catch (err) {
      console.error('Error approving appointment:', err);
      alert('Failed to approve appointment');
    }
  };

  const handleRate = async (appointmentId: number, stars: number) => {
    try {
      await rateAppointment(appointmentId, stars);
      await loadData();
    } catch (err) {
      console.error('Error rating appointment:', err);
      alert('Failed to submit rating');
    }
  };

  const getService = (serviceType: string) => {
    return CONSULT_SERVICES.find(s => s.id === serviceType);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const configs: { [key: string]: { label: string; color: string; icon: any } } = {
      pending: { label: 'Pending', color: 'yellow', icon: Clock },
      confirmed: { label: 'Confirmed', color: 'blue', icon: CheckCircle },
      completed: { label: 'Completed', color: 'green', icon: CheckCircle },
      cancelled: { label: 'Cancelled', color: 'red', icon: AlertCircle }
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
        config.color === 'green' ? 'bg-green-400/10 text-green-400' :
        config.color === 'blue' ? 'bg-blue-400/10 text-blue-400' :
        config.color === 'yellow' ? 'bg-yellow-400/10 text-yellow-400' :
        'bg-red-400/10 text-red-400'
      }`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                My Dashboard
              </h1>
              <p className="text-gray-400">
                Track your accounting consultations and manage your tax services
              </p>
            </div>
            <Button onClick={() => window.location.href = '/accounting'}>
              Book New Consultation
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-8 h-8 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
              </div>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/accounting"
                    className="block text-gray-300 hover:text-white transition-colors py-2 text-sm"
                  >
                    → Book a consultation
                  </a>
                </li>
                <li>
                  <a
                    href="/accounting#faq"
                    className="block text-gray-300 hover:text-white transition-colors py-2 text-sm"
                  >
                    → View FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/accounting#pricing"
                    className="block text-gray-300 hover:text-white transition-colors py-2 text-sm"
                  >
                    → See pricing
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Resources</h3>
              </div>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://info.portaldasfinancas.gov.pt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-300 hover:text-white transition-colors py-2 text-sm"
                  >
                    → Portal das Finanças ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.seg-social.pt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-300 hover:text-white transition-colors py-2 text-sm"
                  >
                    → Segurança Social ↗
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-8 h-8 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Support</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Need help? Contact our support team.
              </p>
              <a
                href="mailto:hello@worktugal.com"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                hello@worktugal.com
              </a>
            </div>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Upcoming Appointments */}
          <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Your Appointments</h2>
              <button
                onClick={loadData}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Refresh
              </button>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <Video className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No appointments scheduled yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => {
                  const service = getService(appointment.service_type);
                  return (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/[0.03] backdrop-blur-3xl rounded-xl border border-white/[0.10] p-6 hover:border-white/[0.20] transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {service?.name || appointment.service_type}
                            </h3>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <p className="text-sm text-gray-400">Case ID: #{appointment.id}</p>
                        </div>
                        {service && (
                          <div className="text-right">
                            <p className="text-xl font-bold text-white">€{service.price}</p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Scheduled For</p>
                          <p className="text-sm font-semibold text-blue-400">
                            {formatDate(appointment.scheduled_date)}
                          </p>
                        </div>

                        {appointment.calcom_booking_url && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Booking Details</p>
                            <a
                              href={appointment.calcom_booking_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-400 hover:text-blue-300"
                            >
                              View in Cal.com ↗
                            </a>
                          </div>
                        )}

                        {appointment.consultation_completed_at && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Completed On</p>
                            <p className="text-sm text-green-400">
                              {formatDate(appointment.consultation_completed_at)}
                            </p>
                          </div>
                        )}
                      </div>

                      {appointment.outcome_document_url && (
                        <div className="border-t border-white/[0.10] pt-4 mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-white mb-1">Outcome Document Ready</p>
                              <p className="text-xs text-gray-400">
                                Submitted on {formatDate(appointment.outcome_submitted_at)}
                              </p>
                            </div>
                            <a
                              href={appointment.outcome_document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-semibold transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </a>
                          </div>

                          {!appointment.client_approved_at && (
                            <div className="mt-4">
                              <Button
                                onClick={() => handleApprove(appointment.id)}
                                size="sm"
                                className="w-full"
                              >
                                Approve & Release Payment
                              </Button>
                              <p className="text-xs text-gray-500 mt-2 text-center">
                                Payment held in escrow until {formatDate(appointment.escrow_hold_until)}
                              </p>
                            </div>
                          )}

                          {appointment.client_approved_at && !appointment.client_rating && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-300 mb-3">Rate your experience:</p>
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => handleRate(appointment.id, star)}
                                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                                  >
                                    <Star className="w-6 h-6" fill={star <= (rating[appointment.id] || 0) ? 'currentColor' : 'none'} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {appointment.client_rating && (
                            <div className="mt-4 flex items-center gap-2">
                              <p className="text-sm text-gray-400">Your rating:</p>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className="w-4 h-4 text-yellow-400"
                                    fill={star <= appointment.client_rating! ? 'currentColor' : 'none'}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Consultation History */}
          <div className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/[0.10] p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Consultation History</h2>

            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">No consultations booked yet</p>
                <Button onClick={() => window.location.href = '/accounting'}>
                  Book Your First Consultation
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => {
                  const service = getService(booking.service_type);
                  return (
                    <div
                      key={booking.id}
                      className="bg-white/[0.02] rounded-lg border border-white/[0.08] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">{service?.name}</p>
                          <p className="text-xs text-gray-400">Booked on {formatDate(booking.created_at)}</p>
                        </div>
                        <p className="text-lg font-bold text-white">€{service?.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
