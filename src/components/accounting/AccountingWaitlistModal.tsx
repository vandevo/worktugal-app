import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Alert } from '../ui/Alert';
import { insertLead } from '../../lib/leads';

interface AccountingWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountingWaitlistModal: React.FC<AccountingWaitlistModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    main_need: '',
    urgency: '',
    consent: false,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }

    if (!formData.consent) {
      setError('Please agree to receive updates to continue');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: leadError } = await insertLead({
        name: formData.name,
        email: formData.email,
        country: formData.country,
        main_need: formData.main_need,
        urgency: formData.urgency,
        consent: formData.consent,
        source: 'accounting_page',
      });

      if (leadError) {
        setError(leadError.message || 'Failed to submit. Please try again.');
        return;
      }

      setStep('success');
    } catch (err) {
      console.error('Error submitting lead:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setFormData({
      name: '',
      email: '',
      country: '',
      main_need: '',
      urgency: '',
      consent: false,
    });
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {step === 'form' ? (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Join Early Access</h2>
                <p className="text-gray-300">
                  Be the first to get access when we open booking slots. No commitment required.
                </p>
              </div>

              {error && (
                <Alert variant="error" className="mb-6">
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Country
                    </label>
                    <Input
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="e.g., Portugal, USA"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      How urgent is this?
                    </label>
                    <Select
                      value={formData.urgency}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                      disabled={isSubmitting}
                    >
                      <option value="">Select urgency</option>
                      <option value="This week">This week</option>
                      <option value="This month">This month</option>
                      <option value="Just exploring">Just exploring</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    What do you need help with?
                  </label>
                  <textarea
                    value={formData.main_need}
                    onChange={(e) => handleInputChange('main_need', e.target.value)}
                    rows={3}
                    placeholder="e.g., Setting up as a freelancer, filing annual return, NIF questions..."
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/70 hover:bg-gray-800/60 transition-colors duration-150 resize-none"
                  />
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={formData.consent}
                    onChange={(e) => handleInputChange('consent', e.target.checked)}
                    disabled={isSubmitting}
                    className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="consent" className="text-sm text-gray-300">
                    I agree to receive updates about Worktugal Accounting Desk Early Access. You can unsubscribe anytime. *
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.consent}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Join Waitlist'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
              >
                <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
              </motion.div>

              <h2 className="text-3xl font-bold text-white mb-4">You're on the list!</h2>

              <div className="max-w-lg mx-auto space-y-4 mb-8">
                <p className="text-lg text-gray-300">
                  We'll send you booking links as soon as slots open.
                </p>
                <p className="text-gray-400">
                  If your case is urgent, reply to the confirmation email with your main question and NIF status.
                </p>
              </div>

              <Button onClick={handleClose}>
                Close
              </Button>
            </div>
          )}
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
