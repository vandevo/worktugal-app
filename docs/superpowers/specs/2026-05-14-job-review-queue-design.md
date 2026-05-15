---
title: "Job Review Queue Design"
version: "1.0"
tags: ["jobs", "employer", "review", "admin", "workflow"]
description: "Design for managing employer job postings via a review queue using Supabase Dashboard."
last_updated: "2026-05-14"
---

# Job Review Queue Design

## Purpose
To ensure high-quality job postings on the Worktugal AI Jobs board by implementing a review queue for employer-submitted listings before they go live.

## Workflow
1. **Employer Submission**: Employer fills the 7-field form and pays EUR 49 via Stripe Checkout.
2. **Record Creation**: Stripe webhook triggers the creation of a row in the `ai_jobs` table in Supabase.
3. **Record State**: The row is initialized with `is_active: false` (hidden from the public `/jobs` page).
4. **Notification**: Telegram bot alerts the admin that a new job is pending review.
5. **Admin Review**:
   - Admin accesses Supabase Dashboard.
   - Filters for rows where `is_active = false`.
   - Admin reviews the job details (`title`, `description_plain`, `salary_min`, `salary_max`, `apply_url`, etc.).
   - Admin refines data if needed (e.g., fixes salary parsing, adjusts title for clarity).
6. **Publication**: Admin toggles `is_active` to `true`.
7. **Live**: The job instantly appears on the public `/jobs` board.

## Data Schema (Refined)
The `ai_jobs` table will require these fields (all currently nullable except `id`, `title`, `slug`, `location`, `apply_url`):
- `company_name` (text)
- `company_slug` (text)
- `title` (text)
- `location` (text)
- `remote_type` (text - remote/hybrid/on-site)
- `employment_type` (text - full-time/part-time/contract)
- `salary_min` (integer)
- `salary_max` (integer)
- `salary_currency` (text)
- `apply_url` (text)
- `is_active` (boolean - default false)

## Implementation Plan (Next Steps)
1. Update `create-job-posting-checkout` Edge Function to map these 7 fields from form to Supabase.
2. Update `/jobs/post` frontend form to collect these 7 fields.
3. Configure `is_active: false` by default in Edge Function.
4. Set up the admin review process in Supabase Dashboard.

## Self-Review
- [x] Scope defined (Supabase-based review).
- [x] Architecture clear.
- [x] No obvious contradictions.
- [x] Ready for implementation planning.
