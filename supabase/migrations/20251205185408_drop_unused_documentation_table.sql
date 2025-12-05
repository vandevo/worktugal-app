/*
  # Drop Unused Documentation Table

  ## Purpose
  Remove the unused `documentation` table that was created on 2025-09-30 but never integrated
  into the application. The project uses the `project_changelog` table instead for tracking
  changes and documentation updates.

  ## Changes
  1. Drop the `documentation` table
     - Created 2025-09-30, never used in application code
     - Only contains 1 test record
     - Superseded by `project_changelog` table
  
  2. Clean up
     - All associated indexes will be automatically dropped
     - All associated RLS policies will be automatically dropped
     - Foreign key reference to auth.users will be cleaned up

  ## Rationale
  - Zero application code references this table
  - The `generate-readme.js` script uses `project_changelog` instead
  - No admin interface or user-facing features use it
  - Removing technical debt and potential confusion
  - Table has been dormant for 66+ days with no usage

  ## Impact
  - Low risk: No application code depends on this table
  - Data loss: Only 1 test record will be deleted
  - No migration rollback needed (table was never productively used)
*/

-- Drop the documentation table
-- This will automatically drop all associated indexes, policies, and constraints
DROP TABLE IF EXISTS documentation CASCADE;
