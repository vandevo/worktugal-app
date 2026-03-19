import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { signUp, signInWithGoogle } from '../../lib/auth';
import { Alert } from '../ui/Alert';
import { trackSignup } from '../../lib/analytics';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*\d).*$/, 'Must contain at least one letter and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await signUp(data.email, data.password);
      trackSignup('email');
      setSuccess('Account created! You can now sign in.');
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Create your account
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Free forever. No credit card needed.
        </p>
      </div>

      {error && <Alert variant="error" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">{success}</Alert>}

      {/* Google button */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading || loading}
        className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 text-sm font-semibold hover:border-[#0F3D2E]/40 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/[0.07] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-5"
      >
        {googleLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">or</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-[#F5F4F2] dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-[#0F3D2E] dark:focus:border-[#10B981] transition-colors"
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              autoComplete="new-password"
              {...register('password')}
              className="w-full h-11 pl-10 pr-11 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-[#F5F4F2] dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-[#0F3D2E] dark:focus:border-[#10B981] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1.5">
            Min 8 chars · letters and numbers
          </p>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat your password"
              autoComplete="new-password"
              {...register('confirmPassword')}
              className="w-full h-11 pl-10 pr-11 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-[#F5F4F2] dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-[#0F3D2E] dark:focus:border-[#10B981] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full h-12 bg-[#0F3D2E] text-white rounded-xl text-sm font-bold hover:bg-[#1A5C44] hover:shadow-lg hover:shadow-[#0F3D2E]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account...</> : 'Create Free Account'}
        </button>
      </form>

      {onSwitchToLogin && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6 pt-6 border-t border-slate-100 dark:border-white/8">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bold text-[#0F3D2E] dark:text-[#10B981] hover:opacity-70 transition-opacity"
          >
            Sign in
          </button>
        </p>
      )}
    </motion.div>
  );
};
