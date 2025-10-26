export interface AccountingIntakeData {
  // Personal Information
  name: string;
  email: string;
  phone?: string;
  country?: string;

  // Residency & Location
  residency_status?: string;
  days_in_portugal?: number;
  city?: string;

  // Income Sources
  income_sources: string[];

  // Tax Registration
  has_nif?: boolean;
  nif_number?: string;
  has_niss?: boolean;
  niss_number?: string;
  has_iban?: boolean;
  iban_number?: string;
  has_vat_number?: boolean;
  vat_regime?: string;
  has_fiscal_representative?: boolean;
  has_electronic_notifications?: boolean;

  // Activity & Business
  activity_opened?: boolean;
  activity_code?: string;
  activity_date?: string;
  previous_accountant?: boolean;
  accounting_software?: string;

  // Urgency & Notes
  urgency_level: string;
  biggest_worry?: string;
  special_notes?: string;

  // Document Storage
  files?: {
    passport_url?: string;
    nif_doc_url?: string;
    iban_screenshot_url?: string;
    lease_url?: string;
    niss_certificate_url?: string;
  };

  // Status & Tagging
  status?: string;
  tags?: string[];
}

export interface AccountingIntake extends AccountingIntakeData {
  id: number;
  created_at: string;
  updated_at: string;
  claimed_by?: string;
  claimed_at?: string;
}
