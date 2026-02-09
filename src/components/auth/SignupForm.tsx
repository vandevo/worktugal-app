import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { signUp } from '../../lib/auth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { trackSignup } from '../../lib/analytics';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*\d).*$/, 'Password must contain at least one letter and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await signUp(data.email, data.password);
      trackSignup('email');
      setSuccess('Account created successfully! You can now sign in.');
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
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
            <UserPlus className="h-5 w-5 text-blue-500/50" />
          </div>
          <div className="text-left flex-1">
            <h2 className="text-xl font-serif text-white leading-tight">Create your account</h2>
            <p className="text-xs text-gray-500 font-light mt-1 uppercase tracking-widest">Access services and perks</p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-4">
          {success}
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
          <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
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
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mt-2">
            Letters and numbers (min 8 chars)
          </p>
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 pr-12 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/[0.06] focus:border-blue-400/40 focus:ring-2 focus:ring-blue-400/20 hover:bg-white/[0.04] transition-all duration-200 font-light text-sm shadow-lg shadow-black/20"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>


        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={loading}
        >
          Create Account
        </Button>
      </form>

      {onSwitchToLogin && (
        <div className="mt-8 text-center pt-6 border-t border-white/5">
          <p className="text-gray-500 text-xs font-light">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-400 hover:text-blue-300 font-medium transition-all duration-200"
            >
              Sign in
            </button>
          </p>
        </div>
      )}
    </motion.div>
  );
};