export interface DiagnosticQuestion {
  id: string;
  text: string;
  description?: string;
  type: 'multiple-choice' | 'yes-no' | 'select';
  options?: { value: string; label: string }[];
  weight: number;
  skipConditions?: (answers: DiagnosticAnswers) => boolean;
}

export type DiagnosticAnswers = Record<string, string>;

export type TrapSeverity = 'high' | 'medium' | 'low';

export interface TrapRule {
  id: string;
  conditions: Record<string, string | string[]>;
  exposureScore: number;
  severity: TrapSeverity;
  fix: string;
  legal_basis: string;
  source_url: string;
  penalty_range: string | null;
  last_verified: string;
}

export interface TriggeredTrap {
  id: string;
  severity: TrapSeverity;
  fix: string;
  legal_basis: string;
  source_url: string;
  penalty_range: string | null;
  exposureScore: number;
}

export type DiagnosticSegment =
  | 'low_setup_low_exposure'
  | 'low_setup_high_exposure'
  | 'high_setup_high_exposure'
  | 'high_setup_low_exposure';

export interface DiagnosticResult {
  setupScore: number;
  exposureIndex: number;
  segment: DiagnosticSegment;
  triggeredTraps: TriggeredTrap[];
  recommendations: string[];
}

export interface DiagnosticContactInfo {
  name?: string;
  phone?: string;
  marketing_consent?: boolean;
  accounting_interest?: boolean;
}

export interface DiagnosticSubmission {
  email: string;
  country_target: string;
  raw_answers: DiagnosticAnswers & { _contact?: DiagnosticContactInfo };
  setup_score: number;
  exposure_index: number;
  segment: DiagnosticSegment;
  trap_flags: TriggeredTrap[];
  diagnostic_version: string;
  ruleset_version: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}
