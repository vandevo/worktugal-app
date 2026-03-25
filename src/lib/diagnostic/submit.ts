import { supabase } from '../supabase';
import type { DiagnosticAnswers, DiagnosticContactInfo, DiagnosticResult, DiagnosticSubmission } from './types';
import { DIAGNOSTIC_VERSION } from './questions';
import { getRulesetVersion } from './engine';

interface SubmitDiagnosticParams {
  email: string;
  answers: DiagnosticAnswers;
  result: DiagnosticResult;
  country: string;
  userId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  contact?: DiagnosticContactInfo;
}

interface SubmitDiagnosticResponse {
  id: string;
  email: string;
  setup_score: number;
  exposure_index: number;
  segment: string;
}

export async function submitDiagnostic(
  params: SubmitDiagnosticParams
): Promise<SubmitDiagnosticResponse> {
  const rawAnswers: DiagnosticSubmission['raw_answers'] = {
    ...params.answers,
    ...(params.contact ? { _contact: params.contact } : {}),
  };

  const submission: DiagnosticSubmission = {
    email: params.email,
    country_target: params.country,
    raw_answers: rawAnswers,
    setup_score: params.result.setupScore,
    exposure_index: params.result.exposureIndex,
    segment: params.result.segment,
    trap_flags: params.result.triggeredTraps,
    diagnostic_version: DIAGNOSTIC_VERSION,
    ruleset_version: getRulesetVersion(params.country),
    utm_source: params.utmSource,
    utm_medium: params.utmMedium,
    utm_campaign: params.utmCampaign,
    ...(params.userId ? { user_id: params.userId } : {}),
  };

  const { data, error } = await supabase
    .from('compliance_diagnostics')
    .insert(submission)
    .select('id, email, setup_score, exposure_index, segment')
    .single();

  if (error) {
    throw new Error(`Failed to save diagnostic: ${error.message}`);
  }

  if (data) {
    const contact = params.contact || {};
    supabase.functions.invoke('send-diagnostic-email', {
      body: {
        id: data.id,
        email: data.email,
        name: contact.name || '',
        setup_score: data.setup_score,
        exposure_index: data.exposure_index,
        segment: data.segment,
        traps: params.result.triggeredTraps,
        recommendations: params.result.recommendations,
        country_target: params.country,
        marketing_consent: contact.marketing_consent ?? false,
        is_authenticated: !!params.userId,
      },
    }).catch(err => console.error('Diagnostic email failed:', err));
  }

  return data;
}

export async function getDiagnosticResult(
  id: string
): Promise<{
  id: string;
  email: string;
  setup_score: number;
  exposure_index: number;
  segment: string;
  trap_flags: any;
  raw_answers: DiagnosticAnswers;
  payment_status: string;
  country_target: string;
  created_at: string;
} | null> {
  const { data, error } = await supabase
    .from('compliance_diagnostics')
    .select('id, email, setup_score, exposure_index, segment, trap_flags, raw_answers, payment_status, country_target, created_at')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch diagnostic: ${error.message}`);
  }

  return data;
}

export async function linkDiagnosticToUser(
  diagnosticId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('compliance_diagnostics')
    .update({ user_id: userId })
    .eq('id', diagnosticId);

  if (error) {
    throw new Error(`Failed to link diagnostic to user: ${error.message}`);
  }
}
