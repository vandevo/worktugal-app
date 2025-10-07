import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export const signUp = async (email: string, password: string, captchaToken?: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin, // Set proper redirect
        data: {
          email_confirm: false, // Explicitly disable email confirmation
        },
      },
    });

    if (error) {
      console.error('Supabase signup error:', error);
      throw error;
    }

    // Fire signup webhook notification (non-blocking)
    // This notifies Make.com → FluentCRM, Telegram, and Amazon SES
    if (data.user) {
      setTimeout(() => {
        notifySignup(data.user!.id, email).catch((err) => {
          // Log but don't throw - we don't want to break signup
          console.warn('Signup notification failed (non-critical):', err);
        });
      }, 0);
    }

    return data;
  } catch (error: any) {
    console.error('Signup error details:', error);

    // Handle the JSON parse error specifically
    if (error.message && error.message.includes('Invalid JSON')) {
      throw new Error('Unable to connect to authentication service. Please check your connection and try again.');
    }

    throw error;
  }
};

// Notify Make.com webhook about new signup
// This is fire-and-forget - errors are logged but don't block signup
async function notifySignup(userId: string, email: string): Promise<void> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    if (!supabaseUrl) {
      console.warn('[Webhook] VITE_SUPABASE_URL not configured - skipping signup notification');
      return;
    }

    console.log('[Webhook] Sending signup notification for:', email);

    // Fire and forget - completely ignore response to avoid ANY errors from bubbling up
    // Using void to explicitly discard the promise
    void fetch(`${supabaseUrl}/functions/v1/notify-signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        email: email,
        display_name: email.split('@')[0],
        created_at: new Date().toISOString(),
      }),
    });

    console.log('[Webhook] Notification queued (fire-and-forget)');
    // Return immediately - don't wait for webhook
  } catch (error) {
    // Silently log - this is intentionally non-blocking
    console.warn('[Webhook] Notification error:', error instanceof Error ? error.message : 'Unknown error');
  }
}

export const signIn = async (email: string, password: string, captchaToken?: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error: any) {
    // For any error during logout (including 403, session_not_found, etc.),
    // treat it as successful since the goal is to clear the user's session
    console.warn('Sign out error (treating as successful):', error.message || error);
  }
  
  // Always return successfully - if there was an error, the session is likely
  // already invalid anyway, which achieves the same result as a successful logout
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

export const resetPasswordForEmail = async (email: string, captchaToken?: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
  return data;
};