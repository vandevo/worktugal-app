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

  const { data: intake, error } = await supabase
    .from('accounting_intakes')
    .insert([{
      name: formData.name || '',
      email: formData.email,
      phone: formData.phone || null,
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
      source_type: 'tax_checkup',
      compliance_score_red: scores.red,
      compliance_score_yellow: scores.yellow,
      compliance_score_green: scores.green,
      compliance_report: scores.report,
      lead_quality_score: scores.leadQualityScore,
      urgency_level: scores.urgencyLevel,
      status: 'new',
      income_sources: ['freelance']
    }])
    .select()
    .single();

  if (error) {
    console.error('Error submitting tax checkup:', error);
    throw new Error('Failed to submit checkup. Please try again.');
  }

  // Trigger Make.com webhook for confirmation email (non-blocking)
  try {
    const makeWebhookUrl = import.meta.env.VITE_MAKE_INTAKE_WEBHOOK_URL;
    if (makeWebhookUrl) {
      fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'tax_checkup_submitted',
          intake_id: intake.id,
          name: formData.name || 'there',
          email: formData.email,
          work_type: formData.work_type,
          compliance_score_red: scores.red,
          compliance_score_yellow: scores.yellow,
          compliance_score_green: scores.green,
          urgency_level: scores.urgencyLevel,
          lead_quality_score: scores.leadQualityScore,
          created_at: intake.created_at
        })
      }).catch(err => {
        console.error('Webhook notification failed:', err);
      });
    }
  } catch (err) {
    console.error('Error calling Make.com webhook:', err);
  }

  return { intake, scores };
}

export async function getCheckupResults(intakeId: string) {
  const { data, error } = await supabase
    .from('accounting_intakes')
    .select('*')
    .eq('id', intakeId)
    .eq('source_type', 'tax_checkup')
    .single();

  if (error) {
    console.error('Error fetching checkup results:', error);
    throw new Error('Failed to fetch results');
  }

  return data;
}
