/*
  # Create Payouts Table

  1. New Tables
    - `payouts`
      - `id` (bigint, primary key)
      - `accountant_id` (uuid) - References accountant_profiles
      - `appointment_id` (bigint) - References appointments, nullable for batch payouts
      - `amount` (decimal) - Payout amount
      - `currency` (text) - EUR by default
      - `status` (enum) - pending, processing, completed, failed
      - `payout_method` (payout_method enum) - wise, revolut, stripe, sepa
      - `payout_reference` (text) - Transaction ID or reference number
      - `bank_details_snapshot` (jsonb) - Copy of bank details at time of payout
      - `initiated_by` (uuid) - Admin user who initiated payout
      - `initiated_at` (timestamptz) - When payout was started
      - `completed_at` (timestamptz) - When payout was confirmed
      - `failed_at` (timestamptz) - If payout failed
      - `failure_reason` (text) - Error message if failed
      - `notes` (text) - Internal admin notes
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Enum
    - payout_status: pending, processing, completed, failed

  3. Security
    - Enable RLS
    - Accountants can view their own payouts
    - Admins can view and manage all payouts

  4. Indexes
    - Index on accountant_id, status, created_at
*/

-- Create enum for payout status
DO $$ BEGIN
  CREATE TYPE payout_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create payouts table
CREATE TABLE IF NOT EXISTS payouts (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  accountant_id uuid NOT NULL REFERENCES accountant_profiles(id) ON DELETE CASCADE,
  appointment_id bigint REFERENCES appointments(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  currency text DEFAULT 'EUR' NOT NULL,
  status payout_status DEFAULT 'pending' NOT NULL,
  payout_method payout_method NOT NULL,
  payout_reference text,
  bank_details_snapshot jsonb,
  initiated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  initiated_at timestamptz,
  completed_at timestamptz,
  failed_at timestamptz,
  failure_reason text,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Policy for accountants to view their own payouts
CREATE POLICY "Accountants can view their own payouts"
  ON payouts FOR SELECT
  TO authenticated
  USING (auth.uid() = accountant_id);

-- Policy for admins to view all payouts
CREATE POLICY "Admins can view all payouts"
  ON payouts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert payouts"
  ON payouts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update payouts"
  ON payouts FOR UPDATE
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

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_payouts_accountant_id ON payouts(accountant_id);
CREATE INDEX IF NOT EXISTS idx_payouts_appointment_id ON payouts(appointment_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_created_at ON payouts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payouts_completed_at ON payouts(completed_at DESC);

-- Add comments
COMMENT ON TABLE payouts IS 'Tracks payments made to accountants for completed consultations';
COMMENT ON COLUMN payouts.bank_details_snapshot IS 'Snapshot of accountant bank details at time of payout for audit trail';
COMMENT ON COLUMN payouts.payout_reference IS 'Transaction ID from payment provider (Wise, Revolut, Stripe, etc.)';
COMMENT ON COLUMN payouts.appointment_id IS 'Links to specific appointment, nullable for batch payouts covering multiple appointments';