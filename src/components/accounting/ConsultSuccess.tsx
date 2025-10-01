import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, FileText, Mail } from 'lucide-react';
import { getConsultBooking } from '../../lib/consults';
import { CONSULT_SERVICES } from '../../types/accounting';

export const ConsultSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking');
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await getConsultBooking(parseInt(bookingId));
        if (data) {
          setBooking(data);
        }
      } catch (err) {
        console.error('Error loading booking:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  const service = booking ? CONSULT_SERVICES.find(s => s.id === booking.service_type) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-gray-50 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block"
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-xl text-gray-600">
              Your consult has been successfully booked and paid.
            </p>
          </div>

          {!loading && booking && service && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">Service Details</h3>
                <p className="text-lg font-semibold text-blue-900">{service.name}</p>
                <p className="text-gray-700">{service.duration} · €{service.price}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Next Step</h4>
                  <p className="text-sm text-gray-600">
                    We'll confirm your appointment within 24 hours
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Written Outcome</h4>
                  <p className="text-sm text-gray-600">
                    Delivered within 48 hours of your consult
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Mail className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Check Your Email</h4>
                  <p className="text-sm text-gray-600">
                    Confirmation sent to {booking.email}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">What Happens Next?</h3>
                <ol className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">1.</span>
                    <span>You'll receive a confirmation email with your booking details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">2.</span>
                    <span>We'll reach out within 24 hours to schedule your appointment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">3.</span>
                    <span>Meet with your OCC-certified accountant via video or phone</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">4.</span>
                    <span>Receive your written outcome note with clear next steps within 48 hours</span>
                  </li>
                </ol>
              </div>

              <div className="text-center pt-6">
                <Link
                  to="/accounting"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Back to Accounting Desk
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
