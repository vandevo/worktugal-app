import { supabase } from './supabase';

export interface PaidComplianceReview {
  id: string;
  user_id: string | null;
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
  customer_email: string;
  customer_name: string | null;
  access_token: string;
  status: 'form_pending' | 'submitted' | 'in_review' | 'completed' | 'escalated';
  form_data: Record<string, any>;
  form_progress: { sections_completed: string[] };
  escalation_flags: string[];
  ambiguity_score: number;
  admin_notes: string | null;
  review_delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ComplianceIntakeFormData {
  arrival_date: string;
  intended_duration: string;
  accommodation_type: string;
  lease_start_date: string;
  lease_term_months: string;
  previous_tax_residency: string[];
  work_type: string;
  client_location: string;
  client_type: string;
  estimated_annual_turnover: string;
  other_income_types: string[];
  crypto_activity: string;
  nif_status: string;
  nif_address_type: string;
  self_employment_registered: string;
  activity_start_date: string;
  vat_registration_status: string;
  social_security_registered: string;
  nhr_ifici_applied: string;
  nhr_ifici_application_date: string;
  other_tax_residencies: string;
  a1_certificate_status: string;
  foreign_social_security: string;
  single_client_dependency: string;
  quarterly_declarations_filed: string;
  additional_context: string;
}

export async function getReviewByToken(token: string): Promise<PaidComplianceReview | null> {
  const { data, error } = await supabase.rpc('get_review_by_token', { token });

  if (error) {
    console.error('Error fetching review by token:', error);
    throw new Error('Failed to load review');
  }

  return data?.[0] || null;
}

export async function updateReviewByToken(
  token: string,
  formData: Partial<ComplianceIntakeFormData>,
  formProgress: { sections_completed: string[] },
  status?: string,
  escalationFlags?: string[],
  ambiguityScore?: number
): Promise<PaidComplianceReview | null> {
  const { data, error } = await supabase.rpc('update_review_by_token', {
    token,
    new_form_data: formData,
    new_form_progress: formProgress,
    new_status: status || null,
    new_escalation_flags: escalationFlags || null,
    new_ambiguity_score: ambiguityScore ?? null
  });

  if (error) {
    console.error('Error updating review:', error);
    throw new Error('Failed to save progress');
  }

  return data;
}

export async function updateReviewById(
  reviewId: string,
  formData: Partial<ComplianceIntakeFormData>,
  formProgress: { sections_completed: string[] },
  status?: string,
  escalationFlags?: string[],
  ambiguityScore?: number
): Promise<PaidComplianceReview | null> {
  const updateData: Record<string, any> = {
    form_data: formData,
    form_progress: formProgress,
    updated_at: new Date().toISOString(),
  };

  if (status) updateData.status = status;
  if (escalationFlags) updateData.escalation_flags = escalationFlags;
  if (ambiguityScore !== undefined) updateData.ambiguity_score = ambiguityScore;

  const { data, error } = await supabase
    .from('paid_compliance_reviews')
    .update(updateData)
    .eq('id', reviewId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating review:', error);
    throw new Error('Failed to save progress');
  }

  return data;
}

export function calculateEscalationFlags(formData: Partial<ComplianceIntakeFormData>): string[] {
  const flags: string[] = [];

  if (formData.other_tax_residencies === 'yes') {
    flags.push('MULTI_JURISDICTION_RESIDENCY');
  }

  if (formData.a1_certificate_status === 'no' && formData.foreign_social_security === 'yes') {
    flags.push('A1_CERTIFICATE_MISSING');
  }

  if (formData.accommodation_type === 'long_term_lease' && formData.intended_duration === 'less_than_183_days') {
    flags.push('HABITUAL_ABODE_CONFLICT');
  }

  if (formData.single_client_dependency === 'yes_over_80') {
    flags.push('EMPLOYEE_MISCLASSIFICATION_RISK');
  }

  if (formData.client_type === 'b2c_eu' || formData.client_type === 'mixed_high_volume') {
    flags.push('COMPLEX_VAT_SCENARIO');
  }

  if (formData.crypto_activity === 'active_trading') {
    flags.push('CRYPTO_PROFESSIONAL_ACTIVITY');
  }

  const income = formData.estimated_annual_turnover;
  if ((income === '25k_50k' || income === 'over_50k') && formData.vat_registration_status === 'no') {
    flags.push('VAT_THRESHOLD_EXCEEDED');
  }

  if (formData.social_security_registered === 'yes' && formData.quarterly_declarations_filed === 'no') {
    flags.push('NISS_DECLARATION_MISSING');
  }

  return flags;
}

export function calculateAmbiguityScore(formData: Partial<ComplianceIntakeFormData>): number {
  let score = 0;
  const notSureValues = ['not_sure', 'unsure', 'unknown', ''];

  Object.values(formData).forEach(value => {
    if (typeof value === 'string' && notSureValues.includes(value.toLowerCase())) {
      score++;
    }
  });

  return score;
}

export async function getReviewsForAdmin(): Promise<PaidComplianceReview[]> {
  const { data, error } = await supabase
    .from('paid_compliance_reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews for admin:', error);
    throw new Error('Failed to load reviews');
  }

  return data || [];
}

export async function updateReviewStatus(
  reviewId: string,
  status: PaidComplianceReview['status'],
  adminNotes?: string
): Promise<void> {
  const updateData: Record<string, any> = { status };

  if (adminNotes !== undefined) {
    updateData.admin_notes = adminNotes;
  }

  if (status === 'completed') {
    updateData.review_delivered_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('paid_compliance_reviews')
    .update(updateData)
    .eq('id', reviewId);

  if (error) {
    console.error('Error updating review status:', error);
    throw new Error('Failed to update status');
  }
}
