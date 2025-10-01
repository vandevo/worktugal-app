/*
  # Add Cal.com Webhook Fields
  
  ## Changes
  1. Add webhook tracking fields to appointments:
     - cal_booking_uid (Cal.com unique booking identifier)
     - cal_attendees (JSON data of all attendees)
     - cal_metadata (JSON for additional Cal.com metadata)
     - cal_webhook_received_at (timestamp when webhook was received)
     - cal_reschedule_uid (tracks rescheduled bookings)
     
  2. Create index on cal_booking_uid for fast webhook lookups
  
  ## Purpose
  Track Cal.com webhook events and store full booking data for reconciliation
*/

-- Add Cal.com webhook tracking columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'cal_booking_uid'
  ) THEN
    ALTER TABLE appointments ADD COLUMN cal_booking_uid text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'cal_attendees'
  ) THEN
    ALTER TABLE appointments ADD COLUMN cal_attendees jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'cal_metadata'
  ) THEN
    ALTER TABLE appointments ADD COLUMN cal_metadata jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'cal_webhook_received_at'
  ) THEN
    ALTER TABLE appointments ADD COLUMN cal_webhook_received_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'cal_reschedule_uid'
  ) THEN
    ALTER TABLE appointments ADD COLUMN cal_reschedule_uid text;
  END IF;
END $$;

-- Create indexes for Cal.com lookups
CREATE INDEX IF NOT EXISTS idx_appointments_cal_booking_uid ON appointments(cal_booking_uid);
CREATE INDEX IF NOT EXISTS idx_appointments_cal_reschedule_uid ON appointments(cal_reschedule_uid);

-- Add comments
COMMENT ON COLUMN appointments.cal_booking_uid IS 'Cal.com unique booking identifier from webhook';
COMMENT ON COLUMN appointments.cal_attendees IS 'JSON data of all booking attendees from Cal.com';
COMMENT ON COLUMN appointments.cal_metadata IS 'Additional Cal.com metadata and custom fields';
COMMENT ON COLUMN appointments.cal_webhook_received_at IS 'Timestamp when Cal.com webhook was processed';
COMMENT ON COLUMN appointments.cal_reschedule_uid IS 'Original booking UID if this is a rescheduled booking';
