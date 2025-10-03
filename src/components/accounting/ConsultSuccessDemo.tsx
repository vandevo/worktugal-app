import { FC } from 'react';

export const ConsultSuccessDemo: FC = () => {
  const mockBooking = {
    id: 123,
    email: 'demo@example.com',
    full_name: 'John Doe',
    service_type: 'triage',
    amount_paid: 59,
    created_at: new Date().toISOString(),
  };

  const service = CONSULT_SERVICES.find(s => s.id === mockBooking.service_type);

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 text-center">
          <p className="text-yellow-300 font-semibold">
            DEMO MODE - This is a preview of the success page
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8 md:p-12"
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
            <h1 className="text-4xl font-bold text-white mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-xl text-gray-300">
              Your consult has been successfully booked and paid.
            </p>
          </div>

          {service && (
            <div className="space-y-6">
              <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-blue-400/20">
                <h3 className="font-semibold text-white mb-2">Service Details</h3>
                <p className="text-lg font-semibold text-blue-300">{service.name}</p>
                <p className="text-gray-300">{service.duration} · €{service.price}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl p-8 border border-blue-400/30 mb-6">
                <div className="text-center mb-4">
                  <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-2">Schedule Your Appointment</h3>
                  <p className="text-gray-300">
                    Choose a time that works for you. Our accountants are available Monday-Friday.
                  </p>
                </div>
                <button
                  onClick={() => alert('In real version, this would open Cal.com booking: ' + service.calcomLink)}
                  className="block w-full bg-gradient-to-br from-blue-500/90 to-blue-600/90 hover:from-blue-400/90 hover:to-blue-500/90 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-blue-500/40 hover:shadow-2xl border border-blue-400/30 text-center"
                >
                  Book Your {service.duration} Appointment
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-4 text-center border border-white/[0.08]">
                  <FileText className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white mb-1">Written Outcome</h4>
                  <p className="text-sm text-gray-300">
                    Delivered within 48 hours of your consult
                  </p>
                </div>

                <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-4 text-center border border-white/[0.08]">
                  <Mail className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white mb-1">Check Your Email</h4>
                  <p className="text-sm text-gray-300">
                    Confirmation sent to {mockBooking.email}
                  </p>
                </div>
              </div>

              <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
                <h3 className="font-semibold text-white mb-3">What Happens Next?</h3>
                <ol className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">1.</span>
                    <span>Book your appointment using the button above</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">2.</span>
                    <span>You'll receive calendar invites and reminders</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">3.</span>
                    <span>Meet with your OCC-certified accountant via video call</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">4.</span>
                    <span>Receive your written outcome note within 48 hours</span>
                  </li>
                </ol>
              </div>

              <div className="text-center pt-6">
                <Link
                  to="/accounting"
                  className="inline-block bg-white/[0.04] hover:bg-white/[0.08] text-white px-8 py-3 rounded-lg font-semibold transition-colors border border-white/[0.12] hover:border-white/[0.20]"
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
