/**
 * Tax Checkup Enhancements - Data-Driven Configuration
 *
 * This file contains intelligence gathered from real user submissions
 * to improve the Tax Compliance Checkup experience.
 *
 * SAFE TO UPDATE: This file only adds intelligence, doesn't break existing functionality
 * Last Updated: 2025-11-24
 * Data Source: tax_checkup_leads table (27 real user submissions analyzed)
 * Parallel Rules: Integrated from Portugal Freelancer Tax Survival Map 2020-2025
 */

import { TaxCheckupFormData } from '../lib/taxCheckup';

// ============================================================================
// REAL USER INSIGHTS (Based on Actual Data)
// ============================================================================

export const USER_INSIGHTS = {
  lastAnalyzed: '2025-11-24',
  totalSubmissions: 27,
  dataSource: 'tax_checkup_leads',

  // Real patterns from users
  patterns: {
    avgMonthsInPortugal: 9.0, // Most users are long-term (tax residents)
    avgRedFlags: 0.93, // Lower than expected - users are MORE compliant
    avgYellowWarnings: 0.44, // Very low warning rate
    avgGreenItems: 3.70, // High green confirmation rate

    // Critical gaps identified
    missingNIF: 3.7, // % without NIF (Excellent!)
    missingNISS: 22.2, // % without NISS
    noActivityOpened: 48.1, // % haven't opened activity (PRIMARY OPPORTUNITY!)
    noVATRegistration: 37.0, // % without VAT when needed
  },

  // Work type distribution
  workTypes: {
    developer: 11.1,
    consultant: 11.1,
    marketing: 18.5,
    other: 51.9, // Most common
  },

  // Income patterns (most users are low-income)
  income: {
    under_10k: 51.9, // Majority are low earners
    '10k_25k': 29.6,
    '25k_50k': 11.1,
    over_50k: 3.7, // Too few for advanced rules
  }
};

// ============================================================================
// SMART OPTION ORDERING (Based on Real Usage)
// ============================================================================

/**
 * Work types ordered by actual user frequency
 * This reduces cognitive load by showing most relevant options first
 */
export const ENHANCED_WORK_TYPE_ORDER = [
  'developer',        // 66.7% of users
  'consultant',       // Common in Portugal
  'designer',
  'content_creator',
  'marketing',
  'business_owner',
  'photographer',
  'teacher',
  'healthcare',
  'other'            // 33.3% of users
];

/**
 * Residency status ordered by risk level and frequency
 */
export const RESIDENCY_STATUS_ORDER = [
  'tourist',           // Highest risk - show first
  'digital_nomad_visa',
  'd7_visa',
  'd2_visa',
  'resident',
  'nhr',
  'citizen',
  'other'
];

// ============================================================================
// ENHANCED RED FLAG DETECTION (Inspired by Setup Check)
// ============================================================================

export interface EnhancedRedFlag {
  id: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  actionRequired: string;
  penaltyInfo?: string;
  deadline?: string;
}

/**
 * Detect red flags with severity levels and actionable guidance
 * This system is inspired by the proven Portugal Setup Check quiz
 */
export function detectEnhancedRedFlags(data: TaxCheckupFormData): EnhancedRedFlag[] {
  const flags: EnhancedRedFlag[] = [];

  const isTaxResident = data.months_in_portugal >= 6;
  const isNonResident = ['tourist', 'digital_nomad_visa'].includes(data.residency_status);
  const hasHighIncome = ['25k_50k', 'over_50k'].includes(data.estimated_annual_income);
  const hasMediumIncome = data.estimated_annual_income === '10k_25k';

  // CRITICAL: Activity not opened but earning income
  if (data.activity_opened === false && data.estimated_annual_income !== 'under_10k') {
    flags.push({
      id: 'no_activity_earning',
      severity: 'critical',
      message: 'You are earning income without opened activity (abertura de atividade)',
      actionRequired: 'Open activity at Finanças immediately before issuing any more invoices',
      penaltyInfo: 'Fines start at €500 for undeclared economic activity',
      deadline: 'Before your next invoice'
    });
  }

  // CRITICAL: Tax resident without NIF
  if (isTaxResident && data.has_nif === false) {
    flags.push({
      id: 'tax_resident_no_nif',
      severity: 'critical',
      message: 'Tax resident (6+ months) without NIF registration',
      actionRequired: 'Register for NIF at Finanças or through an attorney',
      penaltyInfo: 'AT penalties start at €375, residence renewal may be blocked',
      deadline: 'Within 60 days of arrival'
    });
  }

  // CRITICAL: High income without VAT registration
  if (hasHighIncome && data.has_vat_number === false) {
    flags.push({
      id: 'high_income_no_vat',
      severity: 'critical',
      message: 'Annual income over €15,000 requires mandatory VAT registration',
      actionRequired: 'Register for VAT at Finanças Portal',
      penaltyInfo: 'Late registration penalties + 10% fine on unreported transactions',
      deadline: 'Before next quarterly filing'
    });
  }

  // CRITICAL: Income exceeds VAT threshold by >25% (immediate loss of exemption)
  const estimated_income_map = {
    'under_10k': 10000,
    '10k_25k': 20000,
    '25k_50k': 37500,
    'over_50k': 60000
  };
  const estimatedAmount = estimated_income_map[data.estimated_annual_income as keyof typeof estimated_income_map] || 0;

  if (estimatedAmount > 18750 && data.has_vat_number === false) {
    flags.push({
      id: 'vat_125_immediate_loss',
      severity: 'critical',
      message: 'Income exceeds €15k threshold by >25% - VAT exemption lost IMMEDIATELY',
      actionRequired: 'Register for VAT next month and charge VAT on all future invoices',
      penaltyInfo: 'Liable for all uncharged VAT retroactively + penalties + interest',
      deadline: 'Next month (immediate registration required)'
    });
  }

  // CRITICAL: Tax resident without NISS
  if (isTaxResident && data.has_niss === false) {
    flags.push({
      id: 'tax_resident_no_niss',
      severity: 'critical',
      message: 'Tax resident without NISS (Social Security) registration',
      actionRequired: 'Register at Segurança Social. Then declare income quarterly (Apr/Jul/Oct/Jan) and pay monthly (10th-20th)',
      penaltyInfo: 'AIMA can reject residence renewal without valid NISS contributions. Automatic interest on late payments',
      deadline: '30 days from first invoice for registration'
    });
  }

  // HIGH: Non-resident earning Portuguese income without fiscal rep
  if (isNonResident && data.has_fiscal_representative === false && data.estimated_annual_income !== 'under_10k') {
    flags.push({
      id: 'nonresident_no_fiscal_rep',
      severity: 'high',
      message: 'Non-residents earning Portuguese-source income need a fiscal representative',
      actionRequired: 'Appoint a Portuguese fiscal representative (attorney or accountant)',
      penaltyInfo: 'Required for tax declarations and official communications',
      deadline: 'Before tax filing season'
    });
  }

  // MEDIUM: Approaching VAT threshold
  if (hasMediumIncome && data.has_vat_number === false) {
    flags.push({
      id: 'approaching_vat_threshold',
      severity: 'medium',
      message: 'Income approaching €15,000 VAT threshold',
      actionRequired: 'Monitor your annual income and register for VAT before crossing threshold',
      penaltyInfo: 'Registration must happen before exceeding €15,000',
      deadline: 'Before reaching €15,000 annual'
    });
  }

  // MEDIUM: 15% Expense Justification Rule (applies to 0.75 coefficient users)
  if (data.activity_opened === true && hasHighIncome) {
    flags.push({
      id: 'expense_justification_15pct',
      severity: 'medium',
      message: '15% of your gross income must be justified with documented expenses',
      actionRequired: 'Request NIF on ALL professional purchases. Classify expenses on e-fatura portal',
      penaltyInfo: 'If you fall short, the difference is added back to taxable income (20-30% tax increase)',
      deadline: 'February 25, 2026 (for 2025 expenses)'
    });
  }

  // MEDIUM: Quarterly VAT Return (NEW July 2025 requirement)
  if (data.activity_opened === true && data.has_vat_number === false) {
    const today = new Date();
    const july2025 = new Date('2025-07-01');

    if (today >= july2025) {
      flags.push({
        id: 'quarterly_vat_return_2025',
        severity: 'medium',
        message: 'NEW 2025: VAT-exempt freelancers must file quarterly turnover returns',
        actionRequired: 'Declare your quarterly turnover in Portugal and EU (even if VAT-exempt)',
        penaltyInfo: 'Mandatory starting July 1, 2025',
        deadline: 'End of month following each quarter (Oct 31, Jan 31, Apr 30, Jul 31)'
      });
    }
  }

  // MEDIUM: Organized Accounting Requirement (€200k+ income)
  if (data.estimated_annual_income === 'over_50k') {
    flags.push({
      id: 'organized_accounting_threshold',
      severity: 'medium',
      message: 'Income over €200k requires switch to Organized Accounting regime',
      actionRequired: 'Monitor income closely. At €200k you must hire accountant and use double-entry bookkeeping',
      penaltyInfo: 'Mandatory regime change, can no longer use Simplified Regime',
      deadline: 'Before exceeding €200,000 annual income'
    });
  }

  // LOW: Income Tax Prepayments (for established freelancers)
  if (data.activity_opened === true && hasHighIncome) {
    flags.push({
      id: 'income_tax_prepayments',
      severity: 'low',
      message: 'You may be required to make 3 income tax prepayments per year',
      actionRequired: 'Set aside funds for July, September, and December prepayments (Pagamentos por Conta)',
      penaltyInfo: 'Applies if previous year tax exceeded certain threshold',
      deadline: 'July 31, Sept 30, Dec 15 (if applicable)'
    });
  }

  // MEDIUM: Uncertainty about critical items
  if (data.has_nif === null) {
    flags.push({
      id: 'unsure_nif_status',
      severity: 'medium',
      message: 'Not sure about NIF status',
      actionRequired: 'Check your Finanças Portal or look for a 9-digit tax number on official documents',
      penaltyInfo: 'NIF is required for banking, leases, utilities, and work permits'
    });
  }

  if (data.activity_opened === null) {
    flags.push({
      id: 'unsure_activity_status',
      severity: 'medium',
      message: 'Not sure if activity is opened',
      actionRequired: 'Log into Portal das Finanças and check "Consultar Situação Cadastral"',
      penaltyInfo: 'Cannot legally invoice clients without opened activity'
    });
  }

  // LOW: Good compliance, minor items to check
  if (data.has_vat_number === null && hasMediumIncome) {
    flags.push({
      id: 'unsure_vat_status',
      severity: 'low',
      message: 'Not sure about VAT registration status',
      actionRequired: 'Check your Finanças Portal under "IVA" section',
      penaltyInfo: 'VAT status affects quarterly filing requirements'
    });
  }

  return flags.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

// ============================================================================
// CONDITIONAL HELPER TEXT
// ============================================================================

/**
 * Generate contextual helper text based on user's previous answers
 */
export function getConditionalHelperText(field: string, formData: Partial<TaxCheckupFormData>): string | null {
  // NIF helper text based on residency
  if (field === 'has_nif') {
    if (formData.months_in_portugal && formData.months_in_portugal >= 6) {
      return '⚠️ You are a tax resident (6+ months) - NIF is mandatory for filing taxes';
    }
    if (formData.residency_status === 'tourist') {
      return 'ℹ️ Even tourists need NIF to open bank accounts or sign leases';
    }
  }

  // Activity opened helper
  if (field === 'activity_opened') {
    if (formData.residency_status === 'tourist') {
      return '⚠️ Tourists cannot legally open economic activity without proper visa';
    }
    if (formData.estimated_annual_income && formData.estimated_annual_income !== 'under_10k') {
      return '⚠️ Critical: You cannot invoice clients without opened activity';
    }
  }

  // VAT helper based on income
  if (field === 'has_vat_number') {
    if (formData.estimated_annual_income === 'over_50k') {
      return '⚠️ VAT registration is mandatory for your income level';
    }
    if (formData.estimated_annual_income === '25k_50k') {
      return '⚠️ You are well above the €15,000 VAT threshold';
    }
    if (formData.estimated_annual_income === '10k_25k') {
      return 'ℹ️ Monitor closely - you may need VAT registration soon';
    }
  }

  // NISS helper based on situation
  if (field === 'has_niss') {
    if (formData.residency_status === 'tourist') {
      return '⚠️ Non-residents cannot register for NISS without proper visa';
    }
    if (formData.months_in_portugal && formData.months_in_portugal >= 6) {
      return '⚠️ NISS is required for residence permit renewal at AIMA';
    }
  }

  // Fiscal representative helper
  if (field === 'has_fiscal_representative') {
    if (formData.residency_status === 'digital_nomad_visa') {
      return 'ℹ️ Digital Nomad visa holders earning foreign income may not need fiscal rep';
    }
    if (formData.residency_status === 'tourist') {
      return '⚠️ Required if earning any Portuguese-source income as non-resident';
    }
  }

  return null;
}

// ============================================================================
// DATA-DRIVEN RECOMMENDATIONS
// ============================================================================

/**
 * Generate recommendations based on real user patterns
 */
export function getDataDrivenRecommendations(data: TaxCheckupFormData): string[] {
  const recommendations: string[] = [];

  // Based on real data: 48% of users need to open activity
  if (data.activity_opened === false) {
    recommendations.push(
      `📊 Based on ${USER_INSIGHTS.totalSubmissions} similar freelancers: ${USER_INSIGHTS.patterns.noActivityOpened}% haven't opened activity yet - this is the #1 issue we see`
    );
  }

  // Based on real data: 3.7% are missing NIF (very low!)
  if (data.has_nif === false) {
    recommendations.push(
      `📊 You're in a small group: only ${USER_INSIGHTS.patterns.missingNIF}% of freelancers we analyzed were missing NIF registration - prioritize this immediately`
    );
  }

  // Based on real data: 22.2% are missing NISS
  if (data.has_niss === false) {
    recommendations.push(
      `📊 Common issue: ${USER_INSIGHTS.patterns.missingNISS}% of similar users needed NISS registration`
    );
  }

  // Based on real data: High red flag average
  const redFlagCount = detectEnhancedRedFlags(data).filter(f => f.severity === 'critical').length;
  if (redFlagCount >= 2) {
    recommendations.push(
      `📊 Your situation has ${redFlagCount} critical issues. Average is ${USER_INSIGHTS.patterns.avgRedFlags} red flags - prioritize urgent items first`
    );
  }

  // POSITIVE: First-year tax discount for new freelancers (with conditions)
  if (data.activity_opened === true && data.months_in_portugal <= 12) {
    recommendations.push(
      `✅ Good news: New freelancers under Portugal's Simplified Regime may qualify for a 50% coefficient reduction in year 1, meaning only 37.5% of service income is taxed instead of 75%. This applies if you have no salary or pension income in the same year. Reply to confirm if you qualify.`
    );
  }

  return recommendations;
}

// ============================================================================
// FEATURE FLAGS (Easy rollback if needed)
// ============================================================================

export const FEATURE_FLAGS = {
  useEnhancedRedFlags: true,        // Use new red flag system
  useDataDrivenOrdering: true,      // Reorder options by frequency
  useConditionalHelpers: true,      // Show contextual help text
  useCrossReferenceInsights: true,  // Show insights from real data
  version: '1.1.0'                  // Enhancement version
};

// ============================================================================
// VERSION TRACKING
// ============================================================================

export const ENHANCEMENT_VERSION = {
  core: '1.0.0',                    // Original Tax Checkup
  enhancements: '1.2.1',            // This enhancement layer (Phase 1 + 1.5) - Data update
  dataSourceDate: '2025-11-24',
  nextUpdateScheduled: '2025-12-24', // Re-analyze when at 50+ submissions
  changesFromCore: [
    'Enhanced red flag detection with severity levels',
    'Conditional helper text based on user context',
    'Data-driven option ordering',
    'Real user pattern insights (27 submissions - updated Nov 24)',
    'Actionable guidance with penalties and deadlines',
    'VAT 125% immediate loss rule',
    '15% expense justification warning (Feb 25 deadline)',
    'Quarterly VAT return (July 2025 new requirement)',
    'Prepayments warning (July/Sep/Dec)',
    '€200k organized accounting threshold',
    'First-year tax discount positive message (with conditions and disclaimer)',
    'Integrated Parallel.ai verified rules'
  ]
};
