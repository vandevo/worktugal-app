import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  display_name?: string;
  created_at: string;
  updated_at: string;
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }

  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<void> => {
  const { error } = await supabase
    .from('user_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
  
  // Add a small delay to ensure database consistency
  await new Promise(resolve => setTimeout(resolve, 100));
};

export const createUserProfile = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('user_profiles')
    .insert([{ id: userId }]);

  if (error && !error.message.includes('duplicate key')) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};