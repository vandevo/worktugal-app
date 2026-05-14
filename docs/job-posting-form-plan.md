---
title: "Job Posting Form Plan"
version: "1.0"
tags: ["jobs", "employer", "pricing", "form", "checkout"]
description: "Planned fields, pricing tiers, and Stripe integration for employer job posting. Not shipped yet."
last_updated: "2026-05-14"
---

# Job Posting Form Plan

Not shipped. Prepared for when daily traffic justifies employer monetization.

## Current state

- EUR 49 self-serve checkout via Stripe (live, working)
- 4 fields: company name, job title, location, apply URL
- Fake pricing tiers shown in UI (EUR 99/249/279) — remove these

## Planned form (EUR 49 tier)

7 fields. Matches what LinkedIn, Indeed, Ashby, JOIN require as minimum:

1. Company name (text)
2. Job title (text)
3. Location (text)
4. Remote/hybrid/on-site (select)
5. Employment type: full-time / part-time / contract (select)
6. Salary range: min, max, currency (EUR/USD/GBP)
7. Apply URL (URL)

Optional: job description (textarea), department, D8 eligibility toggle.

## Pricing tiers (future)

| Tier | Price | What they get |
|---|---|---|
| Single listing | EUR 49 | Basic listing on the board, 30 days |
| Featured | EUR 199 | Top of category, social mention, D8 badge, 30 days |
| Claim + boost | EUR 0 → EUR 49 | Jobs already fetched via ATS. Free to claim, paid to feature |

## Stripe integration

Edge function `create-job-posting-checkout` already exists. Currently EUR 49 flat. Expand by passing `price_id` from the form.

Price IDs to create in Stripe when launching:
- `price_job_listing_single` — EUR 49 one-time
- `price_job_listing_featured` — EUR 199 one-time

## Trigger to build

When daily job seeker traffic exceeds 5,000 visits OR an employer emails asking to post. Not before.

## Form data flow

Employer submits form → Edge function creates Stripe session → Employer pays via Checkout → Webhook inserts into `ai_jobs` table → Job appears on /jobs within 5 minutes.
