/*
  # Separate Accounting Desk from Perk Marketplace

  ## Overview
  This migration creates a completely separate database schema for the Accounting Desk
  business vertical, cleanly separating it from the Perk Marketplace.

  ## New Tables
  1. consult_bookings - All accounting consultation bookings (replaces mixed partner_submissions)
  2. accounting_clients - Client-specific data for accounting services

  ## Data Migration
  Copies all existing records where submission_type = 'consult' to new consult_bookings table

  ## Security
  RLS enabled with user-based access control
*/

-- Create consult_bookings table
CREATE TABLE IF NOT EXISTS consult_bookings (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending_payment',
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  preferred_date timestamptz,
  scheduled_date timestamptz,
  outcome_url text,
  notes text,
  stripe_session_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create accounting_clients table
CREATE TABLE IF NOT EXISTS accounting_clients (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text,
  tax_number text,
  business_type text,
  preferred_language text DEFAULT 'en',
  communication_preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_consult_bookings_user_id ON consult_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_consult_bookings_status ON consult_bookings(status);
CREATE INDEX IF NOT EXISTS idx_consult_bookings_service_type ON consult_bookings(service_type);
CREATE INDEX IF NOT EXISTS idx_consult_bookings_created_at ON consult_bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consult_bookings_stripe_session ON consult_bookings(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_accounting_clients_user_id ON accounting_clients(user_id);

-- Enable RLS
ALTER TABLE consult_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for consult_bookings
CREATE POLICY "Clients can view own bookings"
  ON consult_bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Clients can create bookings"
  ON consult_bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Clients can update own bookings"
  ON consult_bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for accounting_clients
CREATE POLICY "Clients can view own record"
  ON accounting_clients FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Clients can create own record"
  ON accounting_clients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Clients can update own record"
  ON accounting_clients FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add table comments
COMMENT ON TABLE consult_bookings IS 'Accounting Desk consultation bookings - completely separate from perk marketplace partner_submissions';
COMMENT ON TABLE accounting_clients IS 'Client-specific information for accounting services - separate from general user profiles';
COMMENT ON COLUMN consult_bookings.service_type IS 'Type of service: triage, start_pack, annual_return, add_on';
COMMENT ON COLUMN consult_bookings.status IS 'Booking status: pending_payment, completed_payment, approved (scheduled), rejected (delivered)';

-- Migrate existing consult data
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM partner_submissions
    WHERE submission_type = 'consult'
  ) THEN
    INSERT INTO consult_bookings (
      user_id,
      service_type,
      status,
      full_name,
      email,
      phone,
      preferred_date,
      scheduled_date,
      outcome_url,
      notes,
      stripe_session_id,
      created_at,
      updated_at
    )
    SELECT
      user_id,
      service_type,
      status,
      full_name,
      email,
      phone,
      preferred_date,
      scheduled_date,
      outcome_url,
      notes,
      stripe_session_id,
      created_at,
      updated_at
    FROM partner_submissions
    WHERE submission_type = 'consult'
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Migrated consult bookings from partner_submissions to consult_bookings';
  END IF;
END $$;
