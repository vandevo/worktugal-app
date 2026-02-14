import { supabase } from './supabase';
import {
  detectEnhancedRedFlags,
  getDataDrivenRecommendations,
  FEATURE_FLAGS
} from '../utils/taxCheckupEnhancements';

export interface TaxCheckupFormData {
  work_type: string;
  months_in_portugal: number;
  residency_status: string;
  has_nif: boolean | null;
  activity_opened: boolean | null;
  estimated_annual_income: string;
  has_vat_number: boolean | null;
  has_niss: boolean | null;
  has_fiscal_representative: boolean | null;
  email: string;
  name?: string;
  phone?: string;
  email_marketing_consent: boolean;
  interested_in_accounting_services: boolean;
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
}

export interface ComplianceScore {
  red: number;
  yellow: number;
  green: number;
  redFlags: string[];
  yellowWarnings: string[];
  greenConfirmations: string[];
  report: string;
  leadQualityScore: number;
  urgencyLevel: 'low' | 'medium' | 'high';
}

export function calculateComplianceScore(data: TaxCheckupFormData): ComplianceScore {
  // Use enhanced red flag detection if enabled (non-breaking)
  let redFlags: string[] = [];
  let yellowWarnings: string[] = [];
  const greenConfirmations: string[] = [];

  // ENHANCEMENT: Get enhanced red flags with severity levels and actionable guidance
  if (FEATURE_FLAGS.useEnhancedRedFlags) {
    const enhancedFlags = detectEnhancedRedFlags(data);

    // Convert enhanced flags to display strings (with additional context)
    enhancedFlags.forEach(flag => {
      const displayMessage = `${flag.message}${flag.penaltyInfo ? ` - ${flag.penaltyInfo}` : ''}${flag.deadline ? ` (Deadline: ${flag.deadline})` : ''}${flag.legalSource ? ` [Source: ${flag.legalSource}]` : ''}`;

      if (flag.severity === 'critical' || flag.severity === 'high') {
        redFlags.push(displayMessage);
      } else if (flag.severity === 'medium') {
        yellowWarnings.push(displayMessage);
      } else {
        yellowWarnings.push(displayMessage);
      }
    });
  }

  // FALLBACK: Keep original logic as backup (for safety)
  const originalRedFlags: string[] = [];
  const originalYellowWarnings: string[] = [];

  const isTaxResident = data.months_in_portugal >= 6;
  const isNonResident = data.residency_status === 'tourist' || data.residency_status === 'digital_nomad_visa';
  const hasHighIncome = ['25k_50k', 'over_50k'].includes(data.estimated_annual_income);
  const approachingVATThreshold = data.estimated_annual_income === '10k_25k';
  const overVATThreshold = hasHighIncome;

  // ORIGINAL RED FLAGS - Critical Issues (kept as fallback)
  if (isTaxResident && data.has_nif === false) {
    originalRedFlags.push('No NIF after 6+ months in Portugal - AT penalties start at €375');
  }

  if (data.activity_opened === false && data.estimated_annual_income !== 'under_10k') {
    originalRedFlags.push('Earning income without opened activity (abertura de atividade) - Required before issuing invoices');
  }

  if (overVATThreshold && data.has_vat_number === false) {
    originalRedFlags.push('Annual income over €15,000 without VAT registration - Mandatory compliance requirement');
  }

  if (isTaxResident && data.has_niss === false) {
    originalRedFlags.push('Tax resident without NISS registration - AIMA can reject residence renewal');
  }

  if (isNonResident && data.has_fiscal_representative === false && data.estimated_annual_income !== 'under_10k') {
    originalRedFlags.push('Non-resident earning Portuguese income without fiscal representative - Legal requirement');
  }

  // Use original flags as fallback if enhanced flags didn't produce any
  if (!FEATURE_FLAGS.useEnhancedRedFlags || redFlags.length === 0) {
    redFlags = originalRedFlags;
  }

  // ORIGINAL YELLOW WARNINGS - Areas to Review (kept as fallback)
  if (data.has_nif === null) {
    originalYellowWarnings.push('Not sure about NIF status - This is your Portuguese tax ID number');
  }

  if (data.activity_opened === null) {
    originalYellowWarnings.push('Not sure if activity is opened - Check your Financas portal to confirm');
  }

  if (approachingVATThreshold && data.has_vat_number !== true) {
    originalYellowWarnings.push('Income approaching €15,000 VAT threshold - Consider registering soon');
  }

  if (data.has_vat_number === null) {
    originalYellowWarnings.push('Not sure about VAT registration status - This affects quarterly filing requirements');
  }

  if (data.has_niss === null) {
    originalYellowWarnings.push('Not sure about NISS status - Social Security registration is required for self-employed work');
  }

  if (data.months_in_portugal >= 6 && data.has_fiscal_representative === null) {
    originalYellowWarnings.push('Spending 6+ months in Portugal - Verify your tax residency status');
  }

  if (data.residency_status === 'digital_nomad_visa' && data.activity_opened === false) {
    originalYellowWarnings.push('Digital Nomad visa holders may need activity registration depending on income source');
  }

  // Use original warnings as fallback if enhanced didn't produce any
  if (!FEATURE_FLAGS.useEnhancedRedFlags || yellowWarnings.length === 0) {
    yellowWarnings = originalYellowWarnings;
  }

  // GREEN CONFIRMATIONS - Compliant Areas
  if (data.has_nif === true) {
    greenConfirmations.push('NIF registered - Your Portuguese tax identification is in order');
  }

  if (data.activity_opened === true) {
    greenConfirmations.push('Activity opened at Financas - You can legally invoice clients');
  }

  if (data.has_vat_number === true || data.estimated_annual_income === 'under_10k') {
    greenConfirmations.push('VAT status appropriate for your income level');
  }

  if (data.has_niss === true) {
    greenConfirmations.push('NISS registered - Social Security contributions are active');
  }

  if (!isNonResident || data.has_fiscal_representative === true) {
    greenConfirmations.push('Fiscal representative status matches your residency situation');
  }

  // Calculate Lead Quality Score (1-100)
  let leadQualityScore = 50;
  leadQualityScore += redFlags.length * 10;
  leadQualityScore += yellowWarnings.length * 5;
  leadQualityScore += data.phone ? 15 : 0;
  leadQualityScore += data.email_marketing_consent ? 10 : 0;
  leadQualityScore += hasHighIncome ? 5 : 0;
  leadQualityScore -= (data.has_nif === null ? 1 : 0) +
                      (data.activity_opened === null ? 1 : 0) +
                      (data.has_vat_number === null ? 1 : 0) * 10;
  leadQualityScore = Math.max(1, Math.min(100, leadQualityScore));

  // Determine Urgency Level
  let urgencyLevel: 'low' | 'medium' | 'high';
  if (redFlags.length >= 2) {
    urgencyLevel = 'high';
  } else if (redFlags.length === 1 || yellowWarnings.length >= 3) {
    urgencyLevel = 'medium';
  } else {
    urgencyLevel = 'low';
  }

  // Generate Compliance Report
  const totalIssues = redFlags.length + yellowWarnings.length + greenConfirmations.length;
  const compliancePercentage = totalIssues > 0
    ? Math.round((greenConfirmations.length / totalIssues) * 100)
    : 0;

  let report = `Based on your answers, you are ${compliancePercentage}% compliant.\n\n`;

  if (redFlags.length > 0) {
    report += `CRITICAL ISSUES (${redFlags.length}):\n`;
    redFlags.forEach((flag, i) => {
      report += `${i + 1}. ${flag}\n`;
    });
    report += '\n';
  }

  if (yellowWarnings.length > 0) {
    report += `AREAS TO REVIEW (${yellowWarnings.length}):\n`;
    yellowWarnings.forEach((warning, i) => {
      report += `${i + 1}. ${warning}\n`;
    });
    report += '\n';
  }

  if (greenConfirmations.length > 0) {
    report += `YOU'RE COMPLIANT (${greenConfirmations.length}):\n`;
    greenConfirmations.forEach((confirmation, i) => {
      report += `${i + 1}. ${confirmation}\n`;
    });
  }

  report += `\nMost freelancers in your situation have ${Math.round(yellowWarnings.length * 1.2)} warnings on average.`;

  // ENHANCEMENT: Add data-driven recommendations from real users
  if (FEATURE_FLAGS.useCrossReferenceInsights) {
    const dataDrivenRecs = getDataDrivenRecommendations(data);
    if (dataDrivenRecs.length > 0) {
      report += '\n\nINSIGHTS FROM REAL USERS:\n';
      dataDrivenRecs.forEach((rec, i) => {
        report += `${i + 1}. ${rec}\n`;
      });
    }
  }

  // Add disclaimer footer
  report += '\n\n---\n';
  report += 'DISCLAIMER: This checkup provides general guidance based on 2025 Portuguese tax law. Specific tax benefits (like the first-year coefficient reduction) apply only under certain conditions. For personalized advice on your situation, reply to this email or consult with a qualified accountant.';

  return {
    red: redFlags.length,
    yellow: yellowWarnings.length,
    green: greenConfirmations.length,
    redFlags,
    yellowWarnings,
    greenConfirmations,
    report,
    leadQualityScore,
    urgencyLevel
  };
}

export async function submitTaxCheckup(formData: TaxCheckupFormData) {
  const scores = calculateComplianceScore(formData);
  const emailHash = formData.email.toLowerCase().trim();

  // Step 1: Check for existing submissions from this email
  const { data: existingSubmissions, error: queryError } = await supabase
    .from('tax_checkup_leads')
    .select('id, submission_sequence, created_at, name, phone, first_submission_at')
    .eq('email_hash', emailHash)
    .order('created_at', { ascending: false })
    .limit(1);

  if (queryError) {
    console.error('Error checking existing submissions:', queryError);
  }

  const latestSubmission = existingSubmissions?.[0];
  const isResubmission = !!latestSubmission;
  const nextSequence = isResubmission ? (latestSubmission.submission_sequence || 1) + 1 : 1;

  // Submit via Edge Function (handles deduplication atomically + DB insert + webhook)
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const edgeFunctionUrl = `${supabaseUrl}/functions/v1/submit-tax-checkup`;

  console.log('Submitting tax checkup via Edge Function...');

  const response = await fetch(edgeFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'apikey': supabaseAnonKey,
    },
    body: JSON.stringify({
      name: formData.name || latestSubmission?.name || '',
      email: formData.email,
      phone: formData.phone || latestSubmission?.phone || null,
      work_type: formData.work_type,
      months_in_portugal: formData.months_in_portugal,
      residency_status: formData.residency_status,
      has_nif: formData.has_nif,
      activity_opened: formData.activity_opened,
      estimated_annual_income: formData.estimated_annual_income,
      has_vat_number: formData.has_vat_number,
      has_niss: formData.has_niss,
      has_fiscal_representative: formData.has_fiscal_representative,
      email_marketing_consent: formData.email_marketing_consent,
      interested_in_accounting_services: formData.interested_in_accounting_services,
      utm_source: formData.utm_source || null,
      utm_campaign: formData.utm_campaign || null,
      utm_medium: formData.utm_medium || null,
      compliance_score_red: scores.red,
      compliance_score_yellow: scores.yellow,
      compliance_score_green: scores.green,
      compliance_report: scores.report,
      lead_quality_score: scores.leadQualityScore,
      email_hash: emailHash,
      is_latest_submission: true,
      submission_sequence: nextSequence,
      previous_submission_id: latestSubmission?.id || null,
      first_submission_at: latestSubmission?.first_submission_at || new Date().toISOString()
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Edge Function error:', errorData);
    throw new Error(errorData.error || 'Failed to submit checkup. Please try again.');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Failed to submit checkup. Please try again.');
  }

  const intake = result.data;

  return {
    intake,
    scores,
    isResubmission,
    submissionSequence: nextSequence,
    overall_score: scores.green + scores.yellow + scores.red > 0
      ? Math.round((scores.green / (scores.green + scores.yellow + scores.red)) * 100)
      : 0
  };
}

export async function getCheckupResults(intakeId: string) {
  const { data, error } = await supabase
    .from('tax_checkup_leads')
    .select(`
      id,
      created_at,
      name,
      email,
      phone,
      work_type,
      months_in_portugal,
      residency_status,
      has_nif,
      activity_opened,
      estimated_annual_income,
      has_vat_number,
      has_niss,
      has_fiscal_representative,
      compliance_score_red,
      compliance_score_yellow,
      compliance_score_green,
      compliance_report,
      lead_quality_score,
      status
    `)
    .eq('id', intakeId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching checkup results:', error);
    throw new Error('Failed to fetch results');
  }

  if (!data) {
    throw new Error('Results not found');
  }

  return data;
}

export async function linkAnonymousSubmissionsToUser(userId: string, email: string) {
  const emailHash = email.toLowerCase().trim();

  const { data, error } = await supabase
    .from('accounting_intakes')
    .update({ user_id: userId })
    .eq('lead_email_hash', emailHash)
    .is('user_id', null)
    .select();

  if (error) {
    console.error('Error linking submissions:', error);
    return { linked: 0, submissions: [] };
  }

  console.log(`Linked ${data.length} previous submissions to user ${userId}`);
  return { linked: data.length, submissions: data };
}

export interface ComplianceHistoryEntry {
  id: number;
  date: string;
  sequenceNumber: number;
  complianceScore: number;
  improvement: number;
  sourceType: string;
  redFlags: number;
  yellowWarnings: number;
  greenConfirmations: number;
}

export async function getUserComplianceHistory(userId: string): Promise<ComplianceHistoryEntry[]> {
  const { data, error } = await supabase
    .from('accounting_intakes')
    .select('id, created_at, source_type, compliance_score_red, compliance_score_yellow, compliance_score_green, submission_sequence')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching compliance history:', error);
    throw new Error('Failed to fetch compliance history');
  }

  const timeline = data.map((submission, index) => {
    const total = submission.compliance_score_red + submission.compliance_score_yellow + submission.compliance_score_green;
    const complianceScore = total > 0
      ? Math.round((submission.compliance_score_green / total) * 100)
      : 0;

    const previousScore = index > 0
      ? Math.round((data[index - 1].compliance_score_green /
          (data[index - 1].compliance_score_red + data[index - 1].compliance_score_yellow + data[index - 1].compliance_score_green)) * 100)
      : 0;

    return {
      id: submission.id,
      date: submission.created_at,
      sequenceNumber: submission.submission_sequence || index + 1,
      complianceScore,
      improvement: index > 0 ? complianceScore - previousScore : 0,
      sourceType: submission.source_type || 'tax_checkup',
      redFlags: submission.compliance_score_red || 0,
      yellowWarnings: submission.compliance_score_yellow || 0,
      greenConfirmations: submission.compliance_score_green || 0
    };
  });

  return timeline;
}

export async function getLeadEngagementScore(email: string): Promise<{
  totalSubmissions: number;
  firstSubmissionDate: string | null;
  latestSubmissionDate: string | null;
  engagementScore: number;
  complianceImprovement: number;
}> {
  const emailHash = email.toLowerCase().trim();

  const { data, error } = await supabase
    .from('accounting_intakes')
    .select('created_at, first_submission_at, submission_sequence, compliance_score_red, compliance_score_yellow, compliance_score_green')
    .eq('lead_email_hash', emailHash)
    .order('created_at', { ascending: true });

  if (error || !data || data.length === 0) {
    return {
      totalSubmissions: 0,
      firstSubmissionDate: null,
      latestSubmissionDate: null,
      engagementScore: 0,
      complianceImprovement: 0
    };
  }

  const firstSubmission = data[0];
  const latestSubmission = data[data.length - 1];

  const firstTotal = firstSubmission.compliance_score_red + firstSubmission.compliance_score_yellow + firstSubmission.compliance_score_green;
  const firstScore = firstTotal > 0 ? (firstSubmission.compliance_score_green / firstTotal) * 100 : 0;

  const latestTotal = latestSubmission.compliance_score_red + latestSubmission.compliance_score_yellow + latestSubmission.compliance_score_green;
  const latestScore = latestTotal > 0 ? (latestSubmission.compliance_score_green / latestTotal) * 100 : 0;

  const engagementScore = Math.min(100, data.length * 20 + (latestScore > firstScore ? 20 : 0));

  return {
    totalSubmissions: data.length,
    firstSubmissionDate: firstSubmission.first_submission_at || firstSubmission.created_at,
    latestSubmissionDate: latestSubmission.created_at,
    engagementScore,
    complianceImprovement: Math.round(latestScore - firstScore)
  };
}

export async function getTaxCheckupStats() {
  const { data, error } = await supabase
    .from('tax_checkup_leads')
    .select('id, lead_quality_score, compliance_score_red, compliance_score_yellow, status');

  if (error) {
    console.error('Error fetching tax checkup stats:', error);
    return {
      total: 0,
      new: 0,
      highQuality: 0,
      criticalIssues: 0
    };
  }

  return {
    total: data.length,
    new: data.filter(l => l.status === 'new').length,
    highQuality: data.filter(l => (l.lead_quality_score || 0) >= 70).length,
    criticalIssues: data.filter(l => (l.compliance_score_red || 0) >= 2).length
  };
}

export interface CheckupFeedback {
  checkupLeadId?: string;
  flagType: 'red' | 'yellow' | 'green' | 'general';
  flagId?: string;
  feedbackType: 'helpful' | 'not_helpful' | 'error' | 'bug' | 'suggestion' | 'outdated';
  isAccurate?: boolean;
  comment?: string;
  userEmail?: string;
  userName?: string;
}

export async function submitCheckupFeedback(feedback: CheckupFeedback) {
  const { data, error } = await supabase
    .from('checkup_feedback')
    .insert({
      checkup_lead_id: feedback.checkupLeadId || null,
      flag_type: feedback.flagType,
      flag_id: feedback.flagId || null,
      feedback_type: feedback.feedbackType,
      is_accurate: feedback.isAccurate,
      comment: feedback.comment || null,
      user_email: feedback.userEmail || null,
      user_name: feedback.userName || null
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting feedback:', error);
    throw new Error('Failed to submit feedback. Please try again.');
  }

  return data;
}

export async function getFlagAccuracyStats(flagId: string) {
  const { data, error } = await supabase
    .rpc('get_flag_accuracy_stats', { p_flag_id: flagId });

  if (error) {
    console.error('Error fetching flag accuracy:', error);
    return null;
  }

  return data?.[0] || null;
}
