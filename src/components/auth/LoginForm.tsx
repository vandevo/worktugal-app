import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { signIn, resetPasswordForEmail } from '../../lib/auth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { trackLogin } from '../../lib/analytics';

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
    setLoading(true);
    setError(null);

    try {
      await signIn(data.email, data.password);
      trackLogin('email');
      onSuccess?.();
    } catch (err: any) {
      // Make Supabase error messages friendlier
      const message = err.message === 'Invalid login credentials'
        ? 'Email or password incorrect. Please try again.'
        : err.message || 'Failed to sign in';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError(null); // Clear any existing errors first
    setResetEmailSent(false); // Clear any existing success message
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address first');
      return;
    }

    try {
      await resetPasswordForEmail(email);

      setResetEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <LogIn className="h-5 w-5 text-blue-500/50" />
          </div>
          <div className="text-left flex-1">
            <h2 className="text-xl font-serif text-white leading-tight">Welcome back</h2>
            <p className="text-xs text-gray-500 font-light mt-1 uppercase tracking-widest">Sign in to your account</p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      {resetEmailSent && (
        <Alert variant="success" className="mb-4">
          <strong>Password reset email sent!</strong><br />
          Check your email for a link to reset your password.
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <div className="space-y-1">
          <label htmlFor="login-password" className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full px-4 py-3 pr-12 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/[0.06] focus:border-blue-400/40 focus:ring-2 focus:ring-blue-400/20 hover:bg-white/[0.04] transition-all duration-200 font-light text-sm shadow-lg shadow-black/20"
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

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={loading}
        >
          Sign In
        </Button>
      </form>

      {onSwitchToSignup && (
        <div className="mt-8 text-center pt-6 border-t border-white/5">
          <p className="text-gray-500 text-xs font-light">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-blue-400 hover:text-blue-300 font-medium transition-all duration-200"
            >
              Sign up
            </button>
          </p>
        </div>
      )}
    </motion.div>
  );
};
