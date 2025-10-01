import { supabase } from './supabase';
import type { Payout, PayoutWithDetails, PayoutMethod } from '../types/accountant';

export const createPayout = async (
  accountantId: string,
  appointmentId: number,
  amount: number,
  payoutMethod: PayoutMethod,
  bankDetailsSnapshot: Record<string, unknown>,
  initiatedBy: string
) => {
  const { data, error } = await supabase
    .from('payouts')
    .insert([{
      accountant_id: accountantId,
      appointment_id: appointmentId,
      amount,
      currency: 'EUR',
      status: 'pending',
      payout_method: payoutMethod,
      bank_details_snapshot: bankDetailsSnapshot,
      initiated_by: initiatedBy,
      initiated_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};

export const getAccountantPayouts = async (accountantId: string) => {
  const { data, error } = await supabase
    .from('payouts')
    .select('*')
    .eq('accountant_id', accountantId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return { data, error: null };
};

export const getAllPayouts = async () => {
  const { data, error } = await supabase
    .from('payouts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return { data, error: null };
};

export const getPendingPayouts = async () => {
  const { data, error } = await supabase
    .from('payouts')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return { data, error: null };
};

export const updatePayoutStatus = async (
  payoutId: number,
  status: Payout['status'],
  payoutReference?: string,
  failureReason?: string
) => {
  const updates: Partial<Payout> = {
    status,
    payout_reference: payoutReference,
    failure_reason: failureReason,
    updated_at: new Date().toISOString(),
  };

  if (status === 'completed') {
    updates.completed_at = new Date().toISOString();
  } else if (status === 'failed') {
    updates.failed_at = new Date().toISOString();
  } else if (status === 'processing') {
    updates.initiated_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('payouts')
    .update(updates)
    .eq('id', payoutId)
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};

export const markPayoutCompleted = async (
  payoutId: number,
  payoutReference: string
) => {
  return updatePayoutStatus(payoutId, 'completed', payoutReference);
};

export const markPayoutFailed = async (
  payoutId: number,
  failureReason: string
) => {
  return updatePayoutStatus(payoutId, 'failed', undefined, failureReason);
};

export const getAccountantPendingEarnings = async (accountantId: string) => {
  const { data: payouts, error } = await supabase
    .from('payouts')
    .select('amount, status')
    .eq('accountant_id', accountantId)
    .in('status', ['pending', 'processing']);

  if (error) throw error;

  const totalPending = payouts?.reduce((sum, p) => sum + p.amount, 0) || 0;

  return { data: totalPending, error: null };
};

export const getAccountantCompletedEarnings = async (accountantId: string) => {
  const { data: payouts, error } = await supabase
    .from('payouts')
    .select('amount')
    .eq('accountant_id', accountantId)
    .eq('status', 'completed');

  if (error) throw error;

  const totalCompleted = payouts?.reduce((sum, p) => sum + p.amount, 0) || 0;

  return { data: totalCompleted, error: null };
};

export const calculatePayoutSplit = (
  totalAmount: number,
  commissionRate: number
): { accountantAmount: number; platformAmount: number } => {
  const accountantAmount = Math.round(totalAmount * commissionRate * 100) / 100;
  const platformAmount = Math.round((totalAmount - accountantAmount) * 100) / 100;

  return { accountantAmount, platformAmount };
};

export const getPayoutsByDateRange = async (
  startDate: string,
  endDate: string
) => {
  const { data, error } = await supabase
    .from('payouts')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return { data, error: null };
};

export const getTotalPayoutsByStatus = async () => {
  const { data, error } = await supabase
    .from('payouts')
    .select('status, amount');

  if (error) throw error;

  const totals = {
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
  };

  data?.forEach(payout => {
    totals[payout.status] += payout.amount;
  });

  return { data: totals, error: null };
};

export const addPayoutNotes = async (
  payoutId: number,
  notes: string
) => {
  const { data, error } = await supabase
    .from('payouts')
    .update({
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', payoutId)
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
};
