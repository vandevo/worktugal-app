import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Mail, Lock, Shield, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { signIn, resetPasswordForEmail } from '../../lib/auth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Turnstile } from '../ui/Turnstile';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToSignup }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaState, setCaptchaState] = useState<'loading' | 'ready' | 'verified' | 'error'>('loading');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const email = watch('email');

  const onSubmit = async (data: LoginFormData) => {
    if (!captchaToken) {
      setError('Please complete the CAPTCHA verification');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signIn(data.email, data.password, captchaToken);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      // Reset CAPTCHA on error
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!captchaToken) {
      setError('Please complete the CAPTCHA verification first');
      return;
    }

    setError(null); // Clear any existing errors first
    setResetEmailSent(false); // Clear any existing success message
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address first');
      return;
    }

    try {
      await resetPasswordForEmail(email, captchaToken);

      setResetEmailSent(true);
      // Reset CAPTCHA after successful reset
      setCaptchaToken(null);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
      // Reset CAPTCHA on error
      setCaptchaToken(null);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <LogIn className="h-12 w-12 text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
        <p className="text-gray-400">Sign in to your account</p>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {resetEmailSent && (
        <Alert variant="success" className="mb-6">
          <strong>Password reset email sent!</strong><br />
          Check your email for a link to reset your password.
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <motion.div
            className="flex items-center space-x-2"
            animate={{
              color: captchaState === 'verified' ? '#10b981' : captchaState === 'error' ? '#ef4444' : '#d1d5db'
            }}
          >
            <AnimatePresence mode="wait">
              {captchaState === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  exit={{ opacity: 0 }}
                  transition={{ rotate: { duration: 1, repeat: Infinity, ease: "linear" } }}
                >
                  <Loader2 className="h-4 w-4" />
                </motion.div>
              )}
              {captchaState === 'ready' && (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Shield className="h-4 w-4" />
                </motion.div>
              )}
              {captchaState === 'verified' && (
                <motion.div
                  key="verified"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <CheckCircle className="h-4 w-4" />
                </motion.div>
              )}
              {captchaState === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Shield className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
            <motion.label 
              className="block text-sm font-medium"
              animate={{
                fontWeight: captchaState === 'verified' ? 600 : 500
              }}
            >
              {captchaState === 'loading' && 'Loading Security Check...'}
              {captchaState === 'ready' && 'Security Verification'}
              {captchaState === 'verified' && 'Verification Complete'}
              {captchaState === 'error' && 'Verification Failed'}
            </motion.label>
          </motion.div>
          <Turnstile
            siteKey={import.meta.env.DEV ? "1x0000000000000000000000000000000AA" : "0x4AAAAAABl8_lJiTQti8Lh6"}
            onVerify={setCaptchaToken}
            onStateChange={setCaptchaState}
            onError={() => {
              setError('CAPTCHA verification failed. Please try again.');
              setCaptchaToken(null);
            }}
            onExpire={() => {
              setCaptchaToken(null);
            }}
            theme="dark"
            className="flex justify-center"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={loading}
          disabled={!captchaToken}
        >
          Sign In
        </Button>
      </form>

      {onSwitchToSignup && (
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      )}
    </motion.div>
  );
};