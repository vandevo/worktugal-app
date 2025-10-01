/*
  # Create Accountant Profiles Table

  1. New Tables
    - `accountant_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text) - Accountant's full legal name
      - `email` (text) - Contact email
      - `phone` (text) - Contact phone number
      - `bio` (text) - Professional biography
      - `specializations` (text[]) - Areas of expertise (freelancer tax, NHR, crypto, etc.)
      - `certifications` (jsonb) - Array of certification objects with name, number, expiry
      - `commission_rate` (decimal) - Percentage accountant receives (e.g., 0.65 for 65%)
      - `status` (enum) - active, inactive, pending_approval, suspended
      - `cal_link` (text) - Cal.com booking link URL
      - `cal_api_key` (text) - Cal.com API key for integration (encrypted)
      - `bank_account_name` (text) - Name on bank account
      - `bank_iban` (text) - IBAN for payouts
      - `bank_bic` (text) - BIC/SWIFT code
      - `tax_id` (text) - Portuguese NIF or tax ID for 1099/invoicing
      - `preferred_payout_method` (enum) - wise, revolut, stripe, sepa
      - `minimum_monthly_guarantee` (decimal) - Minimum payout if maintaining availability
      - `total_consultations` (integer) - Count of completed consultations
      - `total_earnings` (decimal) - Lifetime earnings
      - `average_rating` (decimal) - Average client rating
      - `profile_picture_url` (text) - Avatar/photo URL
      - `languages` (text[]) - Languages spoken
      - `timezone` (text) - Accountant's timezone for scheduling
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Enums
    - accountant_status: active, inactive, pending_approval, suspended
    - payout_method: wise, revolut, stripe, sepa

  3. Security
    - Enable RLS on accountant_profiles
    - Accountants can view and update their own profile
    - Admins can view and update all profiles
    - Clients can view active accountant profiles (public info only)

  4. Indexes
    - Index on status for filtering active accountants
    - Index on email for lookups
*/

-- Create enums
DO $$ BEGIN
  CREATE TYPE accountant_status AS ENUM ('active', 'inactive', 'pending_approval', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payout_method AS ENUM ('wise', 'revolut', 'stripe', 'sepa');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create accountant_profiles table
CREATE TABLE IF NOT EXISTS accountant_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  bio text,
  specializations text[] DEFAULT '{}',
  certifications jsonb DEFAULT '[]'::jsonb,
  commission_rate decimal(5,4) DEFAULT 0.6500 NOT NULL,
  status accountant_status DEFAULT 'pending_approval' NOT NULL,
  cal_link text,
  cal_api_key text,
  bank_account_name text,
  bank_iban text,
  bank_bic text,
  tax_id text,
  preferred_payout_method payout_method,
  minimum_monthly_guarantee decimal(10,2) DEFAULT 0,
  total_consultations integer DEFAULT 0,
  total_earnings decimal(10,2) DEFAULT 0,
  average_rating decimal(3,2) DEFAULT 0,
  profile_picture_url text,
  languages text[] DEFAULT '{}',
  timezone text DEFAULT 'Europe/Lisbon',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE accountant_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for accountants to manage their own profile
CREATE POLICY "Accountants can view their own profile"
  ON accountant_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Accountants can update their own profile"
  ON accountant_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy for admins to view all profiles
CREATE POLICY "Admins can view all accountant profiles"
  ON accountant_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all accountant profiles"
  ON accountant_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert accountant profiles"
  ON accountant_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policy for clients to view active accountants (public info)
CREATE POLICY "Users can view active accountant profiles"
  ON accountant_profiles FOR SELECT
  TO authenticated
  USING (status = 'active');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_accountant_profiles_status ON accountant_profiles(status);
CREATE INDEX IF NOT EXISTS idx_accountant_profiles_email ON accountant_profiles(email);
CREATE INDEX IF NOT EXISTS idx_accountant_profiles_created_at ON accountant_profiles(created_at);

-- Add comments
COMMENT ON TABLE accountant_profiles IS 'Stores profiles for accountants providing consultation services';
COMMENT ON COLUMN accountant_profiles.commission_rate IS 'Decimal percentage accountant receives (0.65 = 65%)';
COMMENT ON COLUMN accountant_profiles.certifications IS 'JSONB array of certification objects: [{"name": "OCC", "number": "12345", "expiry": "2025-12-31"}]';
COMMENT ON COLUMN accountant_profiles.cal_link IS 'Cal.com booking link URL for this accountant';
COMMENT ON COLUMN accountant_profiles.minimum_monthly_guarantee IS 'Minimum monthly payout if accountant maintains availability';