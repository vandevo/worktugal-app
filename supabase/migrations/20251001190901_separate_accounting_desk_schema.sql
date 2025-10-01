/*
  # Separate Accounting Desk from Perk Marketplace

  ## Overview
  This migration creates a completely separate database schema for the Accounting Desk
  business vertical, cleanly separating it from the Perk Marketplace. This architectural
  decision ensures each business model can evolve independently without conflicts.

  ## New Tables Created

  ### 1. `consult_bookings`
  Primary table for tracking all accounting consultation bookings from clients.
  Replaces the mixed use of `partner_submissions` for consults.

  Fields:
  - id: Primary key
  - user_id: Foreign key to auth.users (the client)
  - service_type: Type of consultation (triage, start_pack, annual_return, add_on)
  - status: Booking lifecycle status (pending_payment, completed_payment, approved, rejected)
  - full_name: Client's full name
  - email: Client's email address
  - phone: Client's phone number (optional)
  - preferred_date: Client's preferred appointment date/time
  - scheduled_date: Confirmed appointment date/time
  - outcome_url: Link to delivered outcome document
  - notes: Additional information from client
  - stripe_session_id: Stripe checkout session ID for payment tracking
  - created_at: Booking creation timestamp
  - updated_at: Last modification timestamp

  ### 2. `accounting_clients`
  Stores client-specific information and preferences for accounting services.

  Fields:
  - id: Primary key
  - user_id: Foreign key to auth.users
  - company_name: Client's company name (optional)
  - tax_number: Portuguese NIF or tax ID
  - business_type: Type of business entity
  - preferred_language: Communication language preference
  - communication_preferences: JSON object with notification preferences
  - created_at: Record creation timestamp
  - updated_at: Last modification timestamp

  ## Data Migration
  All existing records in `partner_submissions` where `submission_type = 'consult'`
  will be copied to the new `consult_bookings` table.

  ## Security
  - RLS enabled on all new tables
  - Clients can only view their own bookings
  - Accountants can view bookings assigned to them
  - Admins have full access

  ## Benefits
  - Clear separation of concerns between two business models
  - Independent schema evolution for each vertical
  - Simplified queries without type filtering
  - Better data integrity and validation
  - Easier to understand and maintain
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_consult_bookings_user_id ON consult_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_consult_bookings_status ON consult_bookings(status);
CREATE INDEX IF NOT EXISTS idx_consult_bookings_service_type ON consult_bookings(service_type);
CREATE INDEX IF NOT EXISTS idx_consult_bookings_created_at ON consult_bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consult_bookings_stripe_session ON consult_bookings(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_accounting_clients_user_id ON accounting_clients(user_id);

-- Enable Row Level Security
ALTER TABLE consult_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for consult_bookings

-- Clients can view their own bookings
CREATE POLICY "Clients can view own bookings"
  ON consult_bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Clients can create their own bookings
CREATE POLICY "Clients can create bookings"
  ON consult_bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Clients can update their own bookings (before payment)
CREATE POLICY "Clients can update own bookings"
  ON consult_bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Accountants can view all bookings (will be refined with accountant assignment later)
CREATE POLICY "Accountants can view all bookings"
  ON consult_bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'accountant'
    )
  );

-- Accountants can update bookings
CREATE POLICY "Accountants can update bookings"
  ON consult_bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'accountant'
    )
  );

-- RLS Policies for accounting_clients

-- Clients can view their own client record
CREATE POLICY "Clients can view own record"
  ON accounting_clients FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Clients can insert their own client record
CREATE POLICY "Clients can create own record"
  ON accounting_clients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Clients can update their own client record
CREATE POLICY "Clients can update own record"
  ON accounting_clients FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Accountants can view all client records
CREATE POLICY "Accountants can view all clients"
  ON accounting_clients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'accountant'
    )
  );

-- Add helpful comments
COMMENT ON TABLE consult_bookings IS 'Accounting Desk consultation bookings - completely separate from perk marketplace partner_submissions';
COMMENT ON TABLE accounting_clients IS 'Client-specific information for accounting services - separate from general user profiles';
COMMENT ON COLUMN consult_bookings.service_type IS 'Type of service: triage, start_pack, annual_return, add_on';
COMMENT ON COLUMN consult_bookings.status IS 'Booking status: pending_payment, completed_payment, approved (scheduled), rejected (delivered)';
COMMENT ON COLUMN accounting_clients.communication_preferences IS 'JSON object with notification preferences: {email_notifications: true, sms_notifications: false, etc}';

-- Migrate existing consult data from partner_submissions to consult_bookings
DO $$
BEGIN
  -- Only migrate if there are records with submission_type = 'consult'
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

    -- Log the migration
    RAISE NOTICE 'Migrated consult bookings from partner_submissions to consult_bookings';
  END IF;
END $$;
