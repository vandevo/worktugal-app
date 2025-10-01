/*
  # Create Appointments Table

  1. New Tables
    - `appointments`
      - `id` (bigint, primary key)
      - `client_id` (uuid) - References auth.users
      - `accountant_id` (uuid) - References accountant_profiles, nullable until assigned
      - `submission_id` (bigint) - References partner_submissions (links to consult booking)
      - `service_type` (text) - triage, start_pack, annual_return, add_on
      - `cal_event_id` (text) - Cal.com event ID from webhook
      - `cal_event_uid` (text) - Cal.com unique event identifier
      - `scheduled_date` (timestamptz) - Appointment date/time from Cal.com
      - `duration_minutes` (integer) - Consultation duration
      - `status` (enum) - scheduled, completed, cancelled, no_show, rescheduled
      - `consultation_started_at` (timestamptz) - When consultation began
      - `consultation_completed_at` (timestamptz) - When consultation ended
      - `outcome_document_url` (text) - Link to delivered outcome document
      - `outcome_submitted_at` (timestamptz) - When accountant uploaded outcome
      - `client_approved_at` (timestamptz) - When 48-hour escrow ended (auto or manual)
      - `escrow_hold_until` (timestamptz) - 48 hours after outcome submission
      - `meeting_url` (text) - Video call link (Zoom, Google Meet, etc.)
      - `meeting_notes` (text) - Accountant's private notes
      - `client_rating` (integer) - 1-5 star rating from client
      - `client_feedback` (text) - Client's written feedback
      - `accountant_payout_amount` (decimal) - Amount owed to accountant
      - `platform_fee_amount` (decimal) - Amount kept by platform
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Enum
    - appointment_status: scheduled, completed, cancelled, no_show, rescheduled

  3. Security
    - Enable RLS
    - Clients can view their own appointments
    - Accountants can view their assigned appointments
    - Admins can view all appointments

  4. Indexes
    - Index on client_id, accountant_id, status, scheduled_date
    - Index on cal_event_id for webhook lookups
*/

-- Create enum for appointment status
DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM (
    'scheduled',
    'completed',
    'cancelled',
    'no_show',
    'rescheduled'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  accountant_id uuid REFERENCES accountant_profiles(id) ON DELETE SET NULL,
  submission_id bigint REFERENCES partner_submissions(id) ON DELETE SET NULL,
  service_type text NOT NULL,
  cal_event_id text,
  cal_event_uid text,
  scheduled_date timestamptz,
  duration_minutes integer DEFAULT 30,
  status appointment_status DEFAULT 'scheduled' NOT NULL,
  consultation_started_at timestamptz,
  consultation_completed_at timestamptz,
  outcome_document_url text,
  outcome_submitted_at timestamptz,
  client_approved_at timestamptz,
  escrow_hold_until timestamptz,
  meeting_url text,
  meeting_notes text,
  client_rating integer CHECK (client_rating >= 1 AND client_rating <= 5),
  client_feedback text,
  accountant_payout_amount decimal(10,2),
  platform_fee_amount decimal(10,2),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policy for clients to view their own appointments
CREATE POLICY "Clients can view their own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Clients can update their own appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

-- Policy for accountants to view their assigned appointments
CREATE POLICY "Accountants can view their assigned appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    auth.uid() = accountant_id
    OR EXISTS (
      SELECT 1 FROM accountant_profiles
      WHERE accountant_profiles.id = auth.uid()
    )
  );

CREATE POLICY "Accountants can update their assigned appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (auth.uid() = accountant_id)
  WITH CHECK (auth.uid() = accountant_id);

-- Policy for admins to view and manage all appointments
CREATE POLICY "Admins can view all appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all appointments"
  ON appointments FOR UPDATE
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

CREATE POLICY "Admins can insert appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_accountant_id ON appointments(accountant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_date ON appointments(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_appointments_cal_event_id ON appointments(cal_event_id);
CREATE INDEX IF NOT EXISTS idx_appointments_escrow_hold_until ON appointments(escrow_hold_until);
CREATE INDEX IF NOT EXISTS idx_appointments_submission_id ON appointments(submission_id);

-- Add comments
COMMENT ON TABLE appointments IS 'Tracks scheduled and completed consultations between clients and accountants';
COMMENT ON COLUMN appointments.cal_event_id IS 'Cal.com event ID received from webhook for integration';
COMMENT ON COLUMN appointments.escrow_hold_until IS '48 hours after outcome submission - payment released to accountant after this time';
COMMENT ON COLUMN appointments.accountant_payout_amount IS 'Amount to be paid to accountant based on commission rate';
COMMENT ON COLUMN appointments.platform_fee_amount IS 'Platform fee kept from consultation price';