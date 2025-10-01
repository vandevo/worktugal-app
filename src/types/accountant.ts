export type AccountantStatus = 'active' | 'inactive' | 'pending_approval' | 'suspended';

export type PayoutMethod = 'wise' | 'revolut' | 'stripe' | 'sepa';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type DisputeStatus = 'open' | 'investigating' | 'resolved_refund' | 'resolved_no_refund' | 'closed';

export type ApplicationStatus = 'pending' | 'reviewing' | 'interview_scheduled' | 'accepted' | 'rejected';

export interface Certification {
  name: string;
  number: string;
  expiry?: string;
  issuer?: string;
}

export interface AccountantProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  bio?: string;
  specializations: string[];
  certifications: Certification[];
  commission_rate: number;
  status: AccountantStatus;
  cal_link?: string;
  cal_api_key?: string;
  bank_account_name?: string;
  bank_iban?: string;
  bank_bic?: string;
  tax_id?: string;
  preferred_payout_method?: PayoutMethod;
  minimum_monthly_guarantee: number;
  total_consultations: number;
  total_earnings: number;
  average_rating: number;
  profile_picture_url?: string;
  languages: string[];
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  client_id: string;
  accountant_id?: string;
  booking_id?: number;
  service_type: string;
  cal_event_id?: string;
  cal_event_uid?: string;
  scheduled_date?: string;
  duration_minutes: number;
  status: AppointmentStatus;
  consultation_started_at?: string;
  consultation_completed_at?: string;
  outcome_document_url?: string;
  outcome_submitted_at?: string;
  client_approved_at?: string;
  escrow_hold_until?: string;
  meeting_url?: string;
  meeting_notes?: string;
  client_rating?: number;
  client_feedback?: string;
  accountant_payout_amount?: number;
  platform_fee_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface Payout {
  id: number;
  accountant_id: string;
  appointment_id?: number;
  amount: number;
  currency: string;
  status: PayoutStatus;
  payout_method: PayoutMethod;
  payout_reference?: string;
  bank_details_snapshot?: Record<string, unknown>;
  initiated_by?: string;
  initiated_at?: string;
  completed_at?: string;
  failed_at?: string;
  failure_reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Dispute {
  id: number;
  appointment_id: number;
  client_id: string;
  accountant_id?: string;
  reason: string;
  status: DisputeStatus;
  resolution_notes?: string;
  refund_amount?: number;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AccountantApplication {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  bio?: string;
  experience_years?: number;
  specializations: string[];
  certifications: Certification[];
  resume_url?: string;
  linkedin_url?: string;
  status: ApplicationStatus;
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentWithDetails extends Appointment {
  client_name?: string;
  client_email?: string;
  accountant_name?: string;
  accountant_email?: string;
  service_name?: string;
  service_price?: number;
}

export interface PayoutWithDetails extends Payout {
  accountant_name?: string;
  accountant_email?: string;
  appointment_details?: Appointment;
}
