import { supabase } from './supabase';
import type { Appointment, AppointmentWithDetails, Dispute } from '../types/accountant';

export const createAppointment = async (
  appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>
) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointment])
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};

export const getAppointment = async (appointmentId: number) => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', appointmentId)
    .maybeSingle();

  if (error) throw error;
  return { data, error: null };
};

export const getClientAppointments = async (clientId: string) => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return { data, error: null };
};

export const getAccountantAppointments = async (accountantId: string) => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('accountant_id', accountantId)
    .order('scheduled_date', { ascending: true });

  if (error) throw error;
  return { data, error: null };
};

export const getAllAppointments = async () => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return { data, error: null };
};

export const updateAppointment = async (
  appointmentId: number,
  updates: Partial<Appointment>
) => {
  const { data, error } = await supabase
    .from('appointments')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', appointmentId)
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};

export const markAppointmentCompleted = async (appointmentId: number) => {
  const completedAt = new Date().toISOString();

  const { data, error } = await supabase
    .from('appointments')
    .update({
      status: 'completed',
      consultation_completed_at: completedAt,
      updated_at: completedAt,
    })
    .eq('id', appointmentId)
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};

export const submitOutcomeDocument = async (
  appointmentId: number,
  outcomeDocumentUrl: string
) => {
  const submittedAt = new Date().toISOString();
  const escrowHoldUntil = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('appointments')
    .update({
      outcome_document_url: outcomeDocumentUrl,
      outcome_submitted_at: submittedAt,
      escrow_hold_until: escrowHoldUntil,
      updated_at: submittedAt,
    })
    .eq('id', appointmentId)
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};

export const approveAppointment = async (appointmentId: number) => {
  const approvedAt = new Date().toISOString();

  const { data, error } = await supabase
    .from('appointments')
    .update({
      client_approved_at: approvedAt,
      updated_at: approvedAt,
    })
    .eq('id', appointmentId)
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};

export const getAppointmentsReadyForPayout = async () => {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('status', 'completed')
    .not('outcome_submitted_at', 'is', null)
    .not('client_approved_at', 'is', null)
    .is('accountant_payout_amount', null)
    .lt('escrow_hold_until', now);

  if (error) throw error;
  return { data, error: null };
};

export const assignAccountant = async (
  appointmentId: number,
  accountantId: string
) => {
  const { data, error } = await supabase
    .from('appointments')
    .update({
      accountant_id: accountantId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', appointmentId)
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};

export const rateAppointment = async (
  appointmentId: number,
  rating: number,
  feedback?: string
) => {
  const { data, error } = await supabase
    .from('appointments')
    .update({
      client_rating: rating,
      client_feedback: feedback,
      updated_at: new Date().toISOString(),
    })
    .eq('id', appointmentId)
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};

export const createDispute = async (
  appointmentId: number,
  clientId: string,
  accountantId: string,
  reason: string
) => {
  const { data, error } = await supabase
    .from('disputes')
    .insert([{
      appointment_id: appointmentId,
      client_id: clientId,
      accountant_id: accountantId,
      reason,
      status: 'open',
    }])
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};

export const getDisputesByAppointment = async (appointmentId: number) => {
  const { data, error } = await supabase
    .from('disputes')
    .select('*')
    .eq('appointment_id', appointmentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return { data, error: null };
};

export const getAllDisputes = async () => {
  const { data, error } = await supabase
    .from('disputes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return { data, error: null };
};

export const resolveDispute = async (
  disputeId: number,
  status: Dispute['status'],
  resolutionNotes: string,
  refundAmount?: number,
  resolvedBy?: string
) => {
  const { data, error } = await supabase
    .from('disputes')
    .update({
      status,
      resolution_notes: resolutionNotes,
      refund_amount: refundAmount,
      resolved_by: resolvedBy,
      resolved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', disputeId)
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};
