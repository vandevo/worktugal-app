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

const STANDARD_ACCOUNTANT_PASSWORD = 'Worktugal2025!';

export const approveApplicationAndCreateAccount = async (
  application: AccountantApplication,
  adminId: string
) => {
  try {
    // 1. Create auth user with standard password
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: application.email,
      password: STANDARD_ACCOUNTANT_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: application.full_name,
      }
    });

    if (authError) throw new Error(`Failed to create auth user: ${authError.message}`);
    if (!authData.user) throw new Error('No user returned from auth creation');

    const userId = authData.user.id;

    // 2. Create user_profiles record with accountant role
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        id: userId,
        email: application.email,
        full_name: application.full_name,
        role: 'accountant',
      }]);

    if (profileError) {
      // Rollback: delete auth user
      await supabase.auth.admin.deleteUser(userId);
      throw new Error(`Failed to create user profile: ${profileError.message}`);
    }

    // 3. Create accountant_profiles record
    const { error: accountantProfileError } = await supabase
      .from('accountant_profiles')
      .insert([{
        id: userId,
        full_name: application.full_name,
        email: application.email,
        phone: application.phone,
        bio: application.bio,
        experience_years: application.experience_years,
        specializations: application.specializations,
        certifications: application.certifications,
        languages: application.languages || ['Portuguese', 'English'],
        status: 'active',
        commission_rate: 0.65, // Default 65%
      }]);

    if (accountantProfileError) {
      // Rollback: delete auth user and profile
      await supabase.auth.admin.deleteUser(userId);
      await supabase.from('user_profiles').delete().eq('id', userId);
      throw new Error(`Failed to create accountant profile: ${accountantProfileError.message}`);
    }

    // 4. Update application status to accepted
    await updateApplicationStatus(application.id, 'accepted', 'Account created successfully', adminId);

    return {
      success: true,
      userId,
      email: application.email,
      password: STANDARD_ACCOUNTANT_PASSWORD,
      error: null,
    };
  } catch (error) {
    console.error('Error approving application:', error);
    return {
      success: false,
      userId: null,
      email: null,
      password: null,
      error: error instanceof Error ? error.message : 'Failed to create account',
    };
  }
};
