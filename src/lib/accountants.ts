import { supabase } from './supabase';
import type { AccountantProfile, AccountantApplication } from '../types/accountant';

export const getAccountantProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('accountant_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return { data, error: null };
};

export const getAllActiveAccountants = async () => {
  const { data, error } = await supabase
    .from('accountant_profiles')
    .select('id, full_name, email, bio, specializations, average_rating, languages, profile_picture_url')
    .eq('status', 'active')
    .order('average_rating', { ascending: false });

  if (error) throw error;
  return { data, error: null };
};

export const updateAccountantProfile = async (
  userId: string,
  updates: Partial<AccountantProfile>
) => {
  const { data, error } = await supabase
    .from('accountant_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};

export const createAccountantProfile = async (
  userId: string,
  profile: Omit<AccountantProfile, 'id' | 'created_at' | 'updated_at' | 'total_consultations' | 'total_earnings' | 'average_rating'>
) => {
  const { data, error } = await supabase
    .from('accountant_profiles')
    .insert([{ id: userId, ...profile }])
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};

export const submitAccountantApplication = async (
  application: Omit<AccountantApplication, 'id' | 'status' | 'created_at' | 'updated_at' | 'admin_notes' | 'reviewed_by' | 'reviewed_at'>
) => {
  const { data, error } = await supabase
    .from('accountant_applications')
    .insert([application])
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};

export const getAllApplications = async () => {
  const { data, error } = await supabase
    .from('accountant_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return { data, error: null };
};

export const updateApplicationStatus = async (
  applicationId: number,
  status: AccountantApplication['status'],
  adminNotes?: string,
  reviewerId?: string
) => {
  const updates: Partial<AccountantApplication> = {
    status,
    admin_notes: adminNotes,
    reviewed_by: reviewerId,
    reviewed_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('accountant_applications')
    .update(updates)
    .eq('id', applicationId)
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};

export const getAccountantStats = async (accountantId: string) => {
  const { data: appointments, error: appointmentsError } = await supabase
    .from('appointments')
    .select('status, client_rating, accountant_payout_amount')
    .eq('accountant_id', accountantId);

  if (appointmentsError) throw appointmentsError;

  const completedCount = appointments?.filter(a => a.status === 'completed').length || 0;
  const totalEarnings = appointments?.reduce((sum, a) => sum + (a.accountant_payout_amount || 0), 0) || 0;
  const ratings = appointments?.filter(a => a.client_rating).map(a => a.client_rating) || [];
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + (r || 0), 0) / ratings.length
    : 0;

  return {
    data: {
      total_consultations: completedCount,
      total_earnings: totalEarnings,
      average_rating: Number(averageRating.toFixed(2)),
    },
    error: null,
  };
};

export const updateAccountantStats = async (accountantId: string) => {
  const { data: stats } = await getAccountantStats(accountantId);

  if (stats) {
    await updateAccountantProfile(accountantId, stats);
  }
};
