import { supabase } from './supabase';
import type { BusinessFormData, PerkFormData, PartnerSubmission } from '../types';

export interface CreateSubmissionData {
  business: BusinessFormData;
  perk: PerkFormData;
  userId: string;
  accessType: 'lifetime' | 'subscription';
}

export const createPartnerSubmission = async ({
  business,
  perk,
  userId,
  accessType,
}: CreateSubmissionData): Promise<number> => {
  const submissionData = {
    user_id: userId,
    // Business details
    business_name: business.name,
    business_website: business.website || null,
    business_instagram: business.instagram || null,
    contact_name: business.contact_name,
    contact_email: business.email,
    contact_phone: business.phone,
    business_category: business.category,
    business_neighborhood: business.neighborhood,
    // Perk details
    perk_title: perk.title,
    perk_description: perk.description,
    perk_redemption_method: perk.redemption_method,
    perk_redemption_details: perk.redemption_details,
    perk_images: perk.images || [],
    perk_logo: perk.logo || null,
    perk_is_portuguese_owned: perk.is_portuguese_owned,
    perk_needs_nif: perk.needs_nif,
    perk_customer_nif: perk.customer_nif || null,
    perk_customer_name: perk.customer_name || null,
    status: 'pending_payment' as const,
    access_type: accessType,
  };

  const { data, error } = await supabase
    .from('partner_submissions')
    .insert([submissionData])
    .select('id')
    .single();

  if (error) {
    console.error('Error creating partner submission:', error);
    throw new Error(`Failed to save submission: ${error.message}`);
  }

  return data.id;
};

export const updateSubmissionStatus = async (
  submissionId: number,
  status: PartnerSubmission['status'],
  stripeOrderId?: number
): Promise<void> => {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (stripeOrderId) {
    updateData.stripe_order_id = stripeOrderId;
  }

  const { error } = await supabase
    .from('partner_submissions')
    .update(updateData)
    .eq('id', submissionId);

  if (error) {
    console.error('Error updating submission status:', error);
    throw new Error(`Failed to update submission: ${error.message}`);
  }
};

export const getPartnerSubmissions = async (userId: string): Promise<PartnerSubmission[]> => {
  const { data, error } = await supabase
    .from('partner_submissions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching partner submissions:', error);
    throw new Error(`Failed to fetch submissions: ${error.message}`);
  }

  return data || [];
};

export const getPartnerSubmissionById = async (submissionId: number): Promise<PartnerSubmission | null> => {
  const { data, error } = await supabase
    .from('partner_submissions')
    .select('*')
    .eq('id', submissionId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching partner submission by ID:', error);
    throw new Error(`Failed to fetch submission: ${error.message}`);
  }

  return data;
};

// New function to get the count of approved submissions
export const getApprovedSubmissionsCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('partner_submissions')
    .select('*', { count: 'exact', head: true }) // Use head: true for count only
    .eq('status', 'approved'); // Count only approved submissions

  if (error) {
    console.error('Error fetching approved submissions count:', error);
    throw new Error(`Failed to fetch approved submissions count: ${error.message}`);
  }

  return count || 0;
};

// New function to get the count of approved perks (same as approved submissions)
export const getApprovedPerksCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('partner_submissions')
    .select('*', { count: 'exact', head: true }) // Use head: true for count only
    .eq('status', 'approved'); // Count only approved submissions

  if (error) {
    console.error('Error fetching approved perks count:', error);
    throw new Error(`Failed to fetch approved perks count: ${error.message}`);
  }

  return count || 0;
};