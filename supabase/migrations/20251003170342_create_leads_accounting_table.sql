/*
  # Create Early Birds Waitlist Table

  1. New Tables
    - `leads_accounting`
      - `id` (bigint, primary key) - Auto-incrementing lead ID
      - `created_at` (timestamptz) - When the lead was captured
      - `name` (text) - Lead's full name
      - `email` (text, required) - Lead's email address
      - `country` (text) - Country of residence
      - `main_need` (text) - Main tax/accounting question or need
      - `urgency` (text) - How urgent their need is
      - `consent` (boolean) - Whether they agreed to receive updates
      - `source` (text) - Where the lead came from (default: "accounting_page")
      - `status` (text) - Lead status (new, invited, booked, closed)

  2. Security
    - Enable RLS on `leads_accounting` table
    - Allow public (anonymous) INSERT - no authentication required for waitlist signup
    - Allow service role to SELECT all leads for admin/Make.com access
    - Allow users to SELECT their own leads by email match

  3. Performance
    - Index on email for lookups
    - Index on status for filtering
    - Index on created_at for sorting

  4. Purpose
    - Capture Early Birds waitlist leads with minimal friction
    - No user authentication required (anonymous submission)
    - Make.com webhook will send confirmation emails and add to Airtable
*/

-- Create leads_accounting table
CREATE TABLE IF NOT EXISTS leads_accounting (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  country text,
  main_need text,
  urgency text,
  consent boolean NOT NULL DEFAULT false,
  source text NOT NULL DEFAULT 'accounting_page',
  status text NOT NULL DEFAULT 'new'
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_accounting_email ON leads_accounting(email);
CREATE INDEX IF NOT EXISTS idx_leads_accounting_status ON leads_accounting(status);
CREATE INDEX IF NOT EXISTS idx_leads_accounting_created_at ON leads_accounting(created_at DESC);

-- Enable Row Level Security
ALTER TABLE leads_accounting ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public INSERT (anonymous submissions)
CREATE POLICY "Anyone can submit leads"
  ON leads_accounting FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policy: Service role can view all leads
CREATE POLICY "Service role can view all leads"
  ON leads_accounting FOR SELECT
  TO service_role
  USING (true);

-- RLS Policy: Authenticated users can view their own leads by email
CREATE POLICY "Users can view own leads by email"
  ON leads_accounting FOR SELECT
  TO authenticated
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Add helpful comments
COMMENT ON TABLE leads_accounting IS 'Early Birds waitlist leads for Accounting Desk - anonymous submission allowed';
COMMENT ON COLUMN leads_accounting.email IS 'Lead email address - used for Make.com confirmation emails';
COMMENT ON COLUMN leads_accounting.status IS 'Lead status: new (submitted), invited (booking link sent), booked (scheduled), closed (completed or lost)';
COMMENT ON COLUMN leads_accounting.source IS 'Where the lead came from: accounting_page, referral, social, etc.';
COMMENT ON COLUMN leads_accounting.consent IS 'Whether lead agreed to receive Early Access updates and emails';
