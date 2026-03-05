---
name: Diagnostic Engine v2 Migration
overview: Migrate the legacy Portugal Setup Check into a modular, risk-intelligent Diagnostic Engine v2 inside the worktugal-app, transitioning from a checklist to a predictive exposure model with full Supabase Auth integration.
todos:
  - id: db-migration-v2-auth
    content: Create compliance_diagnostics Supabase migration with user_id, typed columns, and strict RLS
    status: pending
  - id: logic-layer-v2-synergy
    content: Implement modular logic layer wrapping legacy scoring in src/lib/diagnostic/
    status: pending
  - id: attribution-layer-auth
    content: Implement first-touch UTM capture in localStorage (persisting until post-auth submission)
    status: pending
  - id: ui-auth-flow
    content: Build auth-guarded multi-step UI with direct user_id persistence
    status: pending
  - id: results-auth-secure
    content: Secure results page using Supabase RLS (user_id = auth.uid())
    status: pending
  - id: copy-pivot-v2
    content: Update landing page copy to plain-language risk narrative
    status: pending
isProject: false
---

# Diagnostic Engine v2 Detailed Specification (Auth-Based)

## 1. Phase 1: Database (Identity & Security)

**Goal:** Create a secure, queryable table tied to Supabase Auth.

- **Table Name:** `public.compliance_diagnostics`
- **Schema:**
  - `id`: uuid (primary key)
  - `user_id`: uuid (REFERENCES auth.users NOT NULL)
  - `country_target`: text (default 'portugal')
  - `created_at`: timestamptz (default now)
  - **Typed Columns (Core):** `visa_status`, `tax_residence`, `business_structure`, `time_lived_in_portugal`, `aima_appointment`, `monthly_income`.
  - **Typed Columns (v2):** `foreign_tax_deregistration`, `eu_clients`, `first_irs_filing`, `accountant_status`, `schengen_day_tracking`, `permit_expiry_tracking`.
  - **Scoring:** `setup_score` (int), `exposure_index` (int).
  - **JSONB Blobs:** `raw_answers`, `trap_flags`.
  - **Attribution:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `referrer`, `landing_path`.
- **RLS Policies:**
  - `ENABLE ROW LEVEL SECURITY;`
  - **SELECT:** `user_id = auth.uid()`
  - **INSERT:** `auth.uid() IS NOT NULL` (ensure authenticated)
  - **UPDATE:** `user_id = auth.uid()`

---

## 2. Phase 2: Logic Layer (Legacy Synergy)

**Goal:** Reuse verified scoring and make the system extensible.

- **Scoring Synergy:** 
  - Import `calculateComplianceScore` from `src/lib/taxCheckup.ts`.
  - Wrap it to output the `setup_score`.
- **VAT Trap Logic:**
  - Map `monthly_income` categories (`under_10k`, `10k_25k`, `25k_50k`, `over_50k`) to thresholds.
  - Risk triggers: `10k_25k` (Yellow), `25k_50k+` (Critical Red).
- **Modular Rule Module:** `src/lib/diagnostic/rules/portugal_v1.ts`
  - Export `questions`: Driven by an array to make UI country-agnostic.
  - Export `traps`: Logic for Exposure Index.

---

## 3. Phase 3: Attribution Utility

**Goal:** Capture UTMs on first landing and hold until the authenticated submission.

- **Utility:** `src/utils/attribution.ts`
- **Logic:** 
  - On application load (App.tsx), check URL for UTMs.
  - If found, store in `localStorage.wt_attribution` with timestamp.
  - The Diagnostic Wizard reads this on final save.

---

## 4. Phase 4: Auth-Guarded Flow

**Goal:** Streamline the conversion loop using existing Auth system.

- **Flow:**
  1. User hits `/checkup`.
  2. If `!user`, redirect to Sign Up / Login (with return URL).
  3. Authenticated user runs the module-driven wizard.
  4. On Finish:
    - Calculate scores.
    - `INSERT INTO compliance_diagnostics` with `auth.uid()`.
    - Redirect to `/checkup/results?id=[UUID]`.
- **Security:** The Results page will *only* load the record if the DB query succeeds (which it only will if RLS `user_id = auth.uid()` passes).

---

## 5. Phase 5: Copy Pivot

**Goal:** Plain language, anxiety-focused narrative.

- **Narrative:** "Most Portugal residency traps take 2 years to surface. Get your Exposure Index today."
- **Terms:** "Setup Check", "Hidden Risk Score".

---

## Acceptance Criteria

- No `anonymous_id` or identity bridge logic.
- Record created only if `auth.uid()` exists.
- `compliance_diagnostics` table has typed columns for all v2 fields.
- Results page blocked for unauthorized users via RLS.
- Setup score matches legacy logic 1:1.
- UTMs captured from first-touch persist to the database record.

