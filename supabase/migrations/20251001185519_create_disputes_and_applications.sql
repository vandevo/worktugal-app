/*
  # Create Disputes and Accountant Applications Tables

  1. New Tables
    
    A) `disputes`
      - `id` (bigint, primary key)
      - `appointment_id` (bigint) - References appointments
      - `client_id` (uuid) - Client who raised dispute
      - `accountant_id` (uuid) - Accountant involved
      - `reason` (text) - Dispute reason from client
      - `status` (enum) - open, investigating, resolved_refund, resolved_no_refund, closed
      - `resolution_notes` (text) - Admin notes on resolution
      - `refund_amount` (decimal) - Amount refunded if applicable
      - `resolved_by` (uuid) - Admin who resolved
      - `resolved_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    B) `accountant_applications`
      - `id` (bigint, primary key)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `bio` (text) - Why they want to join
      - `experience_years` (integer)
      - `specializations` (text[])
      - `certifications` (jsonb)
      - `resume_url` (text) - Link to uploaded resume
      - `linkedin_url` (text)
      - `status` (enum) - pending, reviewing, interview_scheduled, accepted, rejected
      - `admin_notes` (text) - Internal notes
      - `reviewed_by` (uuid) - Admin who reviewed
      - `reviewed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Enums
    - dispute_status: open, investigating, resolved_refund, resolved_no_refund, closed
    - application_status: pending, reviewing, interview_scheduled, accepted, rejected

  3. Security
    - Enable RLS on both tables
    - Clients can view their own disputes
    - Accountants can view disputes about them
    - Admins can view and manage all disputes
    - Anyone can submit accountant application (unauthenticated)
    - Only admins can view applications

  4. Indexes
    - Disputes: appointment_id, status, created_at
    - Applications: status, email, created_at
*/

-- Create enums
DO $$ BEGIN
  CREATE TYPE dispute_status AS ENUM (
    'open',
    'investigating',
    'resolved_refund',
    'resolved_no_refund',
    'closed'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM (
    'pending',
    'reviewing',
    'interview_scheduled',
    'accepted',
    'rejected'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create disputes table
CREATE TABLE IF NOT EXISTS disputes (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  appointment_id bigint NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  accountant_id uuid REFERENCES accountant_profiles(id) ON DELETE SET NULL,
  reason text NOT NULL,
  status dispute_status DEFAULT 'open' NOT NULL,
  resolution_notes text,
  refund_amount decimal(10,2),
  resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create accountant_applications table
CREATE TABLE IF NOT EXISTS accountant_applications (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  bio text,
  experience_years integer,
  specializations text[] DEFAULT '{}',
  certifications jsonb DEFAULT '[]'::jsonb,
  resume_url text,
  linkedin_url text,
  status application_status DEFAULT 'pending' NOT NULL,
  admin_notes text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on disputes
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- Policies for disputes
CREATE POLICY "Clients can view their own disputes"
  ON disputes FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Clients can create disputes for their appointments"
  ON disputes FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = client_id
    AND EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_id
      AND appointments.client_id = auth.uid()
    )
  );

CREATE POLICY "Accountants can view disputes about them"
  ON disputes FOR SELECT
  TO authenticated
  USING (auth.uid() = accountant_id);

CREATE POLICY "Admins can view all disputes"
  ON disputes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update disputes"
  ON disputes FOR UPDATE
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

-- Enable RLS on accountant_applications
ALTER TABLE accountant_applications ENABLE ROW LEVEL SECURITY;

-- Policies for accountant_applications
-- Allow anyone (even unauthenticated) to submit an application
CREATE POLICY "Anyone can submit accountant application"
  ON accountant_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can view applications
CREATE POLICY "Admins can view all applications"
  ON accountant_applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update applications"
  ON accountant_applications FOR UPDATE
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

-- Create indexes for disputes
CREATE INDEX IF NOT EXISTS idx_disputes_appointment_id ON disputes(appointment_id);
CREATE INDEX IF NOT EXISTS idx_disputes_client_id ON disputes(client_id);
CREATE INDEX IF NOT EXISTS idx_disputes_accountant_id ON disputes(accountant_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_created_at ON disputes(created_at DESC);

-- Create indexes for accountant_applications
CREATE INDEX IF NOT EXISTS idx_applications_status ON accountant_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_email ON accountant_applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON accountant_applications(created_at DESC);

-- Add comments
COMMENT ON TABLE disputes IS 'Tracks client disputes during 48-hour escrow period';
COMMENT ON TABLE accountant_applications IS 'Stores applications from accountants wanting to join the platform';
COMMENT ON COLUMN disputes.reason IS 'Client explanation of why they are disputing the consultation outcome';
COMMENT ON COLUMN accountant_applications.certifications IS 'JSONB array of certifications with name, number, and expiry dates';