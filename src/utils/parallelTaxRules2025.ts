/**
 * Parallel Tax Rules 2025 - Verified Compliance Dataset
 *
 * This file contains tax compliance rules for Portugal freelancers,
 * verified and structured from Parallel.ai's comprehensive research.
 *
 * Source: "Portugal Freelancer Tax Survival Map 2020-2025"
 * Last Verified: November 2025
 * Research Method: Parallel.ai Task API (Core processor)
 *
 * DO NOT MODIFY without verifying against official sources:
 * - Portal das Finanças: info.portaldasfinancas.gov.pt
 * - Segurança Social: www2.gov.pt
 *
 * This replaces Perplexity-based research with evidence-backed rules.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TaxRule {
  rule_id: string;
  rule_name: string;
  category: 'residency' | 'registration' | 'income_tax' | 'vat' | 'social_security' | 'invoicing' | 'filing' | 'special_regimes' | 'crypto';
  legal_reference: string;
  last_verified: string;
  last_changed?: string;
}

export interface ResidencyRule extends TaxRule {
  threshold_days: number;
  alternative_criteria: string[];
  worldwide_income_trigger: boolean;
  penalties: string;
}

export interface RegistrationRule extends TaxRule {
  required_documents: string[];
  deadline: string;
  penalties: string;
  exemptions?: string[];
}

export interface VATRule extends TaxRule {
  thresholds: {
    year: number;
    amount: number;
  }[];
  immediate_loss_threshold_multiplier: number;
  mandatory_phrase: string;
  quarterly_filing_start_date: string;
  non_eu_exclusion_date: string;
  penalties: string;
}

export interface SocialSecurityRule extends TaxRule {
  standard_rate: number;
  relevant_income_coefficients: {
    services: number;
    goods: number;
  };
  payment_window: {
    start_day: number;
    end_day: number;
  };
  quarterly_declaration_deadlines: string[];
  first_year_exemption_months: number;
  economic_dependency_thresholds: {
    threshold_50_80: { min: number; max: number; client_contribution: number };
    threshold_over_80: { min: number; client_contribution: number };
  };
  penalties: string;
}

export interface IncomeTaxRule extends TaxRule {
  regime: string;
  income_ceiling: number;
  coefficients: {
    value: number;
    taxable_portion: number;
    applies_to: string;
    legal_reference: string;
  }[];
  expense_justification_percentage: number;
  expense_justification_deadline: string;
  fixed_deduction: number;
  new_activity_discounts: {
    year_1: number;
    year_2: number;
  };
  penalties: string;
}

export interface InvoicingRule extends TaxRule {
  certified_software_threshold: number;
  mandatory_elements: string[];
  atcud_required_since: string;
  qr_code_required_since: string;
  penalties: string;
}

export interface FilingRule extends TaxRule {
  form_name: string;
  frequency: 'annual' | 'quarterly' | 'monthly';
  deadline: string;
  who_files: string[];
  penalties: string;
}

export interface CryptoRule extends TaxRule {
  effective_date: string;
  business_income_coefficient: number;
  mining_coefficient: number;
  short_term_capital_gains_rate: number;
  long_term_exemption_days: number;
  non_taxable_events: string[];
}

export interface SpecialRegimeRule extends TaxRule {
  regime_name: string;
  status: 'active' | 'closed' | 'restricted';
  closure_date?: string;
  flat_tax_rate?: number;
  eligible_professions?: string[];
  restrictions?: string[];
}

// ============================================================================
// RULE 1: TAX RESIDENCY (REG-001)
// ============================================================================

export const RESIDENCY_RULE: ResidencyRule = {
  rule_id: 'REG-001',
  rule_name: 'Tax Residency Determination',
  category: 'residency',
  legal_reference: 'Article 16 CIRS',
  last_verified: '2025-11-15',

  threshold_days: 183,
  alternative_criteria: [
    'Physical presence > 183 days in any 12-month period',
    'Habitual abode available (e.g., long-term rental, property ownership)',
    'Utility bills in your name suggesting intent to stay'
  ],
  worldwide_income_trigger: true,
  penalties: '€200 - €2,500 for incorrect/late returns, plus interest on unpaid tax'
};

// ============================================================================
// RULE 2: OPENING ACTIVITY (REG-002)
// ============================================================================

export const OPENING_ACTIVITY_RULE: RegistrationRule = {
  rule_id: 'REG-002',
  rule_name: 'Declaration of Opening Activity (Início de Atividade)',
  category: 'registration',
  legal_reference: 'Portal das Finanças Registration Requirements',
  last_verified: '2025-11-15',

  required_documents: [
    'Portuguese Tax ID (NIF)',
    'Social Security ID (NISS)',
    'Portuguese bank account',
    'Activity code (CAE or Art. 151 CIRS)',
    'Estimated annual income and turnover'
  ],
  deadline: 'Before issuing first invoice',
  penalties: 'Fines start at €500 for undeclared economic activity, can be treated as tax evasion',
  exemptions: [
    '12-month Social Security exemption for new freelancers (if filed before starting)'
  ]
};

// ============================================================================
// RULE 3: INCOME TAX - REGIME SIMPLIFICADO (IRS-001)
// ============================================================================

export const INCOME_TAX_SIMPLIFIED_REGIME: IncomeTaxRule = {
  rule_id: 'IRS-001',
  rule_name: 'Simplified Tax Regime (Regime Simplificado)',
  category: 'income_tax',
  legal_reference: 'Article 31 CIRS',
  last_verified: '2025-11-15',
  last_changed: '2022-12-30',

  regime: 'Regime Simplificado',
  income_ceiling: 200000,

  coefficients: [
    {
      value: 0.75,
      taxable_portion: 75,
      applies_to: 'Most professional, scientific, and technical services listed in Article 151 CIRS',
      legal_reference: 'Art. 31(1)(b) CIRS'
    },
    {
      value: 0.35,
      taxable_portion: 35,
      applies_to: 'Other non-specified services not in Art. 151 table',
      legal_reference: 'Art. 31(1)(c) CIRS'
    },
    {
      value: 0.15,
      taxable_portion: 15,
      applies_to: 'Sales of goods and products; certain crypto-asset operations',
      legal_reference: 'Art. 31(1)(a) CIRS'
    },
    {
      value: 0.95,
      taxable_portion: 95,
      applies_to: 'Income from mining crypto-assets',
      legal_reference: 'Art. 31(1)(d) CIRS'
    },
    {
      value: 0.50,
      taxable_portion: 50,
      applies_to: 'Income from local accommodation (Airbnb) in designated containment areas',
      legal_reference: 'Art. 31(1)(h) CIRS'
    }
  ],

  expense_justification_percentage: 15,
  expense_justification_deadline: 'February 25th of following year',
  fixed_deduction: 4104,

  new_activity_discounts: {
    year_1: 0.50,  // 50% reduction in first year
    year_2: 0.25   // 25% reduction in second year
  },

  penalties: 'If expenses fall short of 15% requirement, difference is added back to taxable income (20-30% tax increase)'
};

// ============================================================================
// RULE 4: VAT EXEMPTION (IVA-001)
// ============================================================================

export const VAT_EXEMPTION_RULE: VATRule = {
  rule_id: 'IVA-001',
  rule_name: 'VAT Exemption Regime (Article 53 CIVA)',
  category: 'vat',
  legal_reference: 'Article 53 CIVA',
  last_verified: '2025-11-15',

  thresholds: [
    { year: 2021, amount: 12500 },
    { year: 2022, amount: 12500 },
    { year: 2023, amount: 13500 },
    { year: 2024, amount: 14500 },
    { year: 2025, amount: 15000 }
  ],

  immediate_loss_threshold_multiplier: 1.25,  // Lose exemption if exceed threshold by >25%
  mandatory_phrase: 'IVA – regime de isenção',
  quarterly_filing_start_date: '2025-07-01',
  non_eu_exclusion_date: '2025-07-01',

  penalties: 'Liable for all uncharged VAT, plus penalties and interest. Late registration penalties + 10% fine on unreported transactions'
};

// ============================================================================
// RULE 5: SOCIAL SECURITY (SS-001)
// ============================================================================

export const SOCIAL_SECURITY_RULE: SocialSecurityRule = {
  rule_id: 'SS-001',
  rule_name: 'Self-Employed Social Security Contributions',
  category: 'social_security',
  legal_reference: 'Segurança Social Self-Employment Rules',
  last_verified: '2025-11-15',

  standard_rate: 21.4,

  relevant_income_coefficients: {
    services: 0.70,  // 70% of service income
    goods: 0.20      // 20% of goods income
  },

  payment_window: {
    start_day: 10,
    end_day: 20
  },

  quarterly_declaration_deadlines: [
    'Last day of April',
    'Last day of July',
    'Last day of October',
    'Last day of January'
  ],

  first_year_exemption_months: 12,

  economic_dependency_thresholds: {
    threshold_50_80: {
      min: 50,
      max: 80,
      client_contribution: 7  // Client pays extra 7%
    },
    threshold_over_80: {
      min: 80,
      client_contribution: 10  // Client pays extra 10%
    }
  },

  penalties: 'Automatic interest on late payments; contributions may be calculated on higher default base. AIMA can reject residence renewal without valid NISS contributions'
};

// ============================================================================
// RULE 6: INVOICING REQUIREMENTS (INV-001)
// ============================================================================

export const INVOICING_RULE: InvoicingRule = {
  rule_id: 'INV-001',
  rule_name: 'Digital Invoicing Requirements',
  category: 'invoicing',
  legal_reference: 'Decree-Law 28/2019',
  last_verified: '2025-11-15',

  certified_software_threshold: 50000,

  mandatory_elements: [
    'QR Code (since Jan 1, 2023)',
    'ATCUD - Unique Document Code (since Jan 1, 2023)',
    'VAT exemption phrase (if applicable)',
    'Invoice series validation code from AT'
  ],

  atcud_required_since: '2023-01-01',
  qr_code_required_since: '2022-01-01',

  penalties: '€3,000 - €18,750 for using non-certified software when turnover > €50,000'
};

// ============================================================================
// RULE 7: ANNUAL IRS FILING (FILE-001)
// ============================================================================

export const ANNUAL_IRS_FILING: FilingRule = {
  rule_id: 'FILE-001',
  rule_name: 'Annual IRS Return (Modelo 3)',
  category: 'filing',
  legal_reference: 'IRS Filing Requirements',
  last_verified: '2025-11-15',

  form_name: 'Modelo 3',
  frequency: 'annual',
  deadline: 'April 1 - June 30 (for previous year income)',
  who_files: ['All self-employed tax residents'],

  penalties: '€200 - €2,500 for late filing. 10% to double the tax owed (capped at €55,000) for late payment, plus interest'
};

// ============================================================================
// RULE 8: CRYPTO TAXATION (SP-001)
// ============================================================================

export const CRYPTO_TAXATION_RULE: CryptoRule = {
  rule_id: 'SP-001',
  rule_name: 'Crypto-Asset Taxation',
  category: 'crypto',
  legal_reference: 'Law n.º 24-D/2022',
  last_verified: '2025-11-15',
  last_changed: '2022-12-30',

  effective_date: '2023-01-01',
  business_income_coefficient: 0.15,
  mining_coefficient: 0.95,
  short_term_capital_gains_rate: 28,  // 28% flat rate if held < 365 days
  long_term_exemption_days: 365,      // Tax-exempt if held > 365 days

  non_taxable_events: [
    'Crypto-to-crypto swaps',
    'Holding crypto (no disposal)',
    'Gifts and donations (up to certain limits)'
  ]
};

// ============================================================================
// RULE 9: NHR CLOSURE & IFICI (SP-002)
// ============================================================================

export const NHR_REGIME: SpecialRegimeRule = {
  rule_id: 'SP-002',
  rule_name: 'Non-Habitual Resident (NHR) Regime',
  category: 'special_regimes',
  legal_reference: 'NHR Legislative Framework',
  last_verified: '2025-11-15',

  regime_name: 'Non-Habitual Resident (NHR)',
  status: 'closed',
  closure_date: '2024-01-01',
  flat_tax_rate: 20,

  restrictions: [
    'Closed to new applicants since January 1, 2024',
    'Existing NHR holders retain benefits for remainder of 10-year term',
    'Transitional rule: Those with ties to Portugal by end of 2023 could apply until March 31, 2025'
  ]
};

export const IFICI_REGIME: SpecialRegimeRule = {
  rule_id: 'SP-003',
  rule_name: 'Tax Incentive for Scientific Research and Innovation (IFICI)',
  category: 'special_regimes',
  legal_reference: 'IFICI Legislative Framework',
  last_verified: '2025-11-15',

  regime_name: 'IFICI',
  status: 'active',
  flat_tax_rate: 20,

  eligible_professions: [
    'Higher education teaching',
    'Scientific research',
    'STEM roles in certified companies',
    'Specific tech roles in innovation sector'
  ],

  restrictions: [
    'Cannot have been tax resident in Portugal in last 5 years',
    'Must work in qualifying profession from restricted list',
    'Much narrower eligibility than previous NHR regime'
  ]
};

// ============================================================================
// PENALTY REFERENCE TABLE
// ============================================================================

export const PENALTY_MATRIX = {
  'incorrect_residency_status': '€200 - €2,500 for incorrect/late returns, plus interest',
  'late_irs_filing': '€200 - €2,500',
  'late_irs_payment': '10% to double tax owed (capped at €55,000), plus interest',
  'non_certified_software': '€3,000 - €18,750',
  'vat_threshold_exceeded': 'Full uncharged VAT + penalties + interest',
  'late_ss_payment': 'Automatic interest; higher default base calculation',
  'missing_nif': 'AT penalties start at €375, residence renewal may be blocked',
  'no_activity_opened': 'Fines start at €500, can be treated as tax evasion',
  'missing_niss': 'AIMA can reject residence renewal',
  'expense_justification_shortfall': '20-30% increase in tax bill'
} as const;

// ============================================================================
// DEADLINE REFERENCE CALENDAR
// ============================================================================

export const COMPLIANCE_CALENDAR = {
  annual: [
    {
      name: 'Modelo 3 IRS Return',
      window: 'April 1 - June 30',
      for_period: 'Previous calendar year',
      rule_id: 'FILE-001'
    },
    {
      name: 'IRS Tax Payment',
      deadline: 'August 31',
      rule_id: 'FILE-001'
    }
  ],
  quarterly: [
    {
      name: 'Social Security Declaration',
      deadlines: ['April 30', 'July 31', 'October 31', 'January 31'],
      rule_id: 'SS-001'
    },
    {
      name: 'VAT-Exempt Turnover Return',
      deadlines: ['End of month following each quarter'],
      effective_from: '2025-07-01',
      rule_id: 'IVA-001'
    }
  ],
  monthly: [
    {
      name: 'Social Security Payment',
      window: '10th - 20th of following month',
      rule_id: 'SS-001'
    }
  ],
  annual_once: [
    {
      name: 'Expense Categorization (e-fatura)',
      deadline: 'February 25',
      for_period: 'Previous year expenses',
      rule_id: 'IRS-001'
    },
    {
      name: 'ATCUD Series Registration',
      deadline: 'Before start of year',
      rule_id: 'INV-001'
    }
  ]
} as const;

// ============================================================================
// COMMON MISTAKE PATTERNS (From Parallel Research)
// ============================================================================

export const COMMON_MISTAKES = [
  {
    mistake: 'Starting work before filing Início de Atividade',
    impact: 'Can be treated as tax evasion, miss 12-month SS exemption',
    mitigation: 'File declaration day before first invoice',
    rule_id: 'REG-002'
  },
  {
    mistake: 'Forgetting to classify expenses on e-fatura by Feb 25',
    impact: '20-30% higher tax bill',
    mitigation: 'Set calendar alert for February 1st',
    rule_id: 'IRS-001'
  },
  {
    mistake: 'Continuing VAT exemption after crossing threshold',
    impact: 'Liable for all uncharged VAT + penalties',
    mitigation: 'Use software with rolling 12-month turnover dashboard',
    rule_id: 'IVA-001'
  },
  {
    mistake: 'Missing monthly Social Security payment window (10th-20th)',
    impact: 'Automatic interest, higher default contribution base',
    mitigation: 'Set up automatic payment or recurring reminder',
    rule_id: 'SS-001'
  },
  {
    mistake: 'Assuming crypto is still tax-free',
    impact: 'Unreported taxable income since 2023',
    mitigation: 'Track all transactions with acquisition/disposal dates',
    rule_id: 'SP-001'
  },
  {
    mistake: 'Exceeding VAT threshold by >25% unknowingly',
    impact: 'Immediate loss of exemption, retroactive VAT liability',
    mitigation: 'Monitor at 75% threshold and project forward',
    rule_id: 'IVA-001'
  },
  {
    mistake: 'Missing ATCUD series registration before year start',
    impact: 'All invoices non-compliant for entire year',
    mitigation: 'Set December reminder to register next year series',
    rule_id: 'INV-001'
  },
  {
    mistake: 'Not tracking single-client dependency (>50%)',
    impact: 'Surprise client SS surcharge (7-10%)',
    mitigation: 'Diversify client base or inform client proactively',
    rule_id: 'SS-001'
  }
] as const;

// ============================================================================
// VERSION & METADATA
// ============================================================================

export const PARALLEL_RULES_VERSION = {
  version: '2025.1',
  source: 'Parallel.ai Task API - Portugal Freelancer Tax Survival Map',
  research_date: '2025-11-15',
  verified_by: 'Parallel.ai Core Processor',
  next_update_scheduled: '2026-01-15',
  official_sources: [
    'info.portaldasfinancas.gov.pt',
    'www2.gov.pt (Segurança Social)',
    'Article 16 CIRS',
    'Article 31 CIRS',
    'Article 53 CIVA',
    'Law n.º 24-D/2022',
    'Decree-Law 28/2019'
  ],
  total_rules: 11,
  categories: [
    'residency',
    'registration',
    'income_tax',
    'vat',
    'social_security',
    'invoicing',
    'filing',
    'crypto',
    'special_regimes'
  ]
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get current VAT threshold for a given year
 */
export function getVATThreshold(year: number): number {
  const threshold = VAT_EXEMPTION_RULE.thresholds.find(t => t.year === year);
  return threshold?.amount || 15000; // Default to 2025 threshold
}

/**
 * Calculate immediate VAT loss threshold (125% rule)
 */
export function getVATImmediateLossThreshold(year: number): number {
  return getVATThreshold(year) * VAT_EXEMPTION_RULE.immediate_loss_threshold_multiplier;
}

/**
 * Check if someone is tax resident based on days
 */
export function isTaxResidentByDays(daysInPortugal: number): boolean {
  return daysInPortugal > RESIDENCY_RULE.threshold_days;
}

/**
 * Get applicable income tax coefficient based on work type
 */
export function getIncomeTaxCoefficient(workType: string): number {
  // Default to 0.75 for most professional services
  // This would need to be expanded based on CAE codes
  const professionalServices = ['developer', 'consultant', 'designer', 'marketing'];

  if (professionalServices.includes(workType)) {
    return 0.75;
  }

  return 0.35; // Default for other services
}

/**
 * Calculate Social Security economic dependency surcharge
 */
export function getEconomicDependencySurcharge(singleClientPercentage: number): number {
  if (singleClientPercentage > SOCIAL_SECURITY_RULE.economic_dependency_thresholds.threshold_over_80.min) {
    return SOCIAL_SECURITY_RULE.economic_dependency_thresholds.threshold_over_80.client_contribution;
  }

  const { min, max, client_contribution } = SOCIAL_SECURITY_RULE.economic_dependency_thresholds.threshold_50_80;
  if (singleClientPercentage >= min && singleClientPercentage <= max) {
    return client_contribution;
  }

  return 0; // No surcharge
}

/**
 * Check if certified invoicing software is required
 */
export function requiresCertifiedSoftware(annualTurnover: number): boolean {
  return annualTurnover > INVOICING_RULE.certified_software_threshold;
}

/**
 * Get all deadlines for a given frequency
 */
export function getDeadlinesByFrequency(frequency: 'annual' | 'quarterly' | 'monthly'): typeof COMPLIANCE_CALENDAR[keyof typeof COMPLIANCE_CALENDAR] {
  return COMPLIANCE_CALENDAR[frequency];
}
