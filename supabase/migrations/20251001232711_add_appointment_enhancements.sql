/*
  # Add Appointment Enhancements

  ## Changes
  1. Add new appointment status 'pending_assignment' to appointment_status enum
  2. Add payment tracking columns:
     - payment_amount (total price paid by client)
     - stripe_payment_intent_id (Stripe payment reference)
     - consult_booking_id (link to consult_bookings table)
     - client_notes (transferred from consult booking)
     - preferred_date (client's preferred scheduling date)

  ## Purpose
  Enable automatic appointment creation from webhook after successful payment
  and proper tracking of payment flow from booking to appointment.
*/

-- Add new status to appointment_status enum
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'pending_assignment'
    AND enumtypid = 'appointment_status'::regtype
  ) THEN
    ALTER TYPE appointment_status ADD VALUE 'pending_assignment';
  END IF;
END $$;

-- Add new columns to appointments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'payment_amount'
  ) THEN
    ALTER TABLE appointments ADD COLUMN payment_amount decimal(10,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'stripe_payment_intent_id'
  ) THEN
    ALTER TABLE appointments ADD COLUMN stripe_payment_intent_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'consult_booking_id'
  ) THEN
    ALTER TABLE appointments ADD COLUMN consult_booking_id bigint REFERENCES consult_bookings(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'client_notes'
  ) THEN
    ALTER TABLE appointments ADD COLUMN client_notes text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'preferred_date'
  ) THEN
    ALTER TABLE appointments ADD COLUMN preferred_date timestamptz;
  END IF;
END $$;

-- Create index on consult_booking_id for lookups
CREATE INDEX IF NOT EXISTS idx_appointments_consult_booking_id ON appointments(consult_booking_id);

-- Create index on stripe_payment_intent_id for payment lookups
CREATE INDEX IF NOT EXISTS idx_appointments_stripe_payment_intent ON appointments(stripe_payment_intent_id);

-- Add comments
COMMENT ON COLUMN appointments.payment_amount IS 'Total amount paid by client for this consultation';
COMMENT ON COLUMN appointments.stripe_payment_intent_id IS 'Stripe payment intent ID for payment tracking';
COMMENT ON COLUMN appointments.consult_booking_id IS 'Reference to original consult booking record';
COMMENT ON COLUMN appointments.client_notes IS 'Notes provided by client when booking';
COMMENT ON COLUMN appointments.preferred_date IS 'Client preferred date/time for scheduling';
