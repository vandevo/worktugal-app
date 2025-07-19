import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { updateEmail } from '../lib/auth';
import { useAuth } from '../hooks/useAuth';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';
import { Card } from './ui/Card';

const emailChangeSchema = z.object({
  newEmail: z.string().email('Please enter a valid email address'),
  confirmEmail: z.string(),
}).refine((data) => data.newEmail === data.confirmEmail, {
  message: "Email addresses don't match",
  path: ["confirmEmail"],
});

type EmailChangeFormData = z.infer<typeof emailChangeSchema>;

export const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailChangeFormData>({
    resolver: zodResolver(emailChangeSchema),
  });

  const onSubmit = async (data: EmailChangeFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateEmail(data.newEmail);
      setSuccess('Email change request sent! Please check your new email address for a confirmation link.');
      reset();
    } catch (err: any) {
      setError(err.message || 'Failed to update email address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Account Settings</h1>
        <p className="text-gray-400">Manage your account information</p>
      </div>

      {/* Current Email Display */}
      <Card className="p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Mail className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold">Current Email</h2>
        </div>
        <p className="text-gray-300 bg-gray-800 px-4 py-2 rounded-lg">
          {user?.email}
        </p>
      </Card>

      {/* Email Change Form */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Mail className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold">Change Email Address</h2>
        </div>

        {/* Warning Alert */}
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <div>
            <strong>Important:</strong> Changing your email will require verification. 
            You'll need to confirm the change from your new email address before it takes effect.
          </div>
        </Alert>

        {error && (
          <Alert variant="error" className="mb-6" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-6" onClose={() => setSuccess(null)}>
            <Check className="h-4 w-4" />
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="New Email Address"
            type="email"
            placeholder="your.new@email.com"
            {...register('newEmail')}
            error={errors.newEmail?.message}
          />

          <Input
            label="Confirm New Email"
            type="email"
            placeholder="your.new@email.com"
            {...register('confirmEmail')}
            error={errors.confirmEmail?.message}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Verification...
              </>
            ) : (
              'Change Email Address'
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-2 text-sm">How email changes work:</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>1. We'll send a verification link to your new email</li>
            <li>2. Click the link to confirm the change</li>
            <li>3. Your email will be updated after verification</li>
            <li>4. You'll use the new email for future logins</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};