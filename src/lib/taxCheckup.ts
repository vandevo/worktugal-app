import { supabase } from './supabase';

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
  const redFlags: string[] = [];
  const yellowWarnings: string[] = [];
  const greenConfirmations: string[] = [];

  const isTaxResident = data.months_in_portugal >= 6;
  const isNonResident = data.residency_status === 'tourist' || data.residency_status === 'digital_nomad_visa';
  const hasHighIncome = ['25k_50k', 'over_50k'].includes(data.estimated_annual_income);
  const approachingVATThreshold = data.estimated_annual_income === '10k_25k';
  const overVATThreshold = hasHighIncome;

  // RED FLAGS - Critical Issues
  if (isTaxResident && data.has_nif === false) {
    redFlags.push('No NIF after 6+ months in Portugal - AT penalties start at €375');
  }

  if (data.activity_opened === false && data.estimated_annual_income !== 'under_10k') {
    redFlags.push('Earning income without opened activity (abertura de atividade) - Required before issuing invoices');
  }

  if (overVATThreshold && data.has_vat_number === false) {
    redFlags.push('Annual income over €15,000 without VAT registration - Mandatory compliance requirement');
  }

  if (isTaxResident && data.has_niss === false) {
    redFlags.push('Tax resident without NISS registration - AIMA can reject residence renewal');
  }

  if (isNonResident && data.has_fiscal_representative === false && data.estimated_annual_income !== 'under_10k') {
    redFlags.push('Non-resident earning Portuguese income without fiscal representative - Legal requirement');
  }

  // YELLOW WARNINGS - Areas to Review
  if (data.has_nif === null) {
    yellowWarnings.push('Not sure about NIF status - This is your Portuguese tax ID number');
  }

  if (data.activity_opened === null) {
    yellowWarnings.push('Not sure if activity is opened - Check your Financas portal to confirm');
  }

  if (approachingVATThreshold && data.has_vat_number !== true) {
    yellowWarnings.push('Income approaching €15,000 VAT threshold - Consider registering soon');
  }

  if (data.has_vat_number === null) {
    yellowWarnings.push('Not sure about VAT registration status - This affects quarterly filing requirements');
  }

  if (data.has_niss === null) {
    yellowWarnings.push('Not sure about NISS status - Social Security registration is required for self-employed work');
  }

  if (data.months_in_portugal >= 6 && data.has_fiscal_representative === null) {
    yellowWarnings.push('Spending 6+ months in Portugal - Verify your tax residency status');
  }

  if (data.residency_status === 'digital_nomad_visa' && data.activity_opened === false) {
    yellowWarnings.push('Digital Nomad visa holders may need activity registration depending on income source');
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

  // Step 2: If resubmitting, mark previous submissions as not latest
  if (isResubmission) {
    await supabase
      .from('tax_checkup_leads')
      .update({ is_latest_submission: false })
      .eq('email_hash', emailHash);
  }

  // Step 3: Submit via Edge Function (handles DB insert + webhook)
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const edgeFunctionUrl = `${supabaseUrl}/functions/v1/submit-tax-checkup`;

  console.log('Submitting tax checkup via Edge Function...');

  const response = await fetch(edgeFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
