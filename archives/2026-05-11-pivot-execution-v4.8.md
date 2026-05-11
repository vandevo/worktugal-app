---
title: "Thread Handover"
session: "2026-05-11-pivot-execution-v4.8"
agent: "opencode-deepseek-v4-flash"
date: "2026-05-11"
---

## 1. Thread Overview

**Session**: v4.8-pivot-execution-2026-05-11
**Agent**: DeepSeek V4 Flash (OpenCode)
**Duration**: Continuation of v1.0 AI jobs board session from 2026-05-11 morning. Full-day execution sprint.

### Scope
Full execution of strategic pivot from compliance-first to AI jobs board. Refactored ATS pipeline, built EUR 49 checkout, redesigned UI, recovered from Telegram bot hack, hardened security, rebranded Ghost CMS, reoriented all CTAs.

### Drivers
- Compliance products had zero paying users. Job board had pre-AI revenue history of EUR 520.
- MVP plan (Phase 0.3) required Stripe checkout to go from zero revenue to real transactions.
- Telegram bots were hacked mid-session (names changed to VPN spam) — forced security audit.
- Ghost CMS, nav, homepage, diagnostic results, and bottom nav still reflected compliance-first positioning.

### Outcome
545 EU-eligible AI jobs live at `/jobs` across 6 companies (Anthropic, GitLab, Databricks, Mistral AI, Stripe, Figma). EUR 49 self-serve checkout at `/jobs/post` with Google auth gate. Workflow refactored from 17 parallel nodes to 7 loop-based nodes. UI redesigned in Ashby/GH minimal style. Both Telegram bots recovered and tokens rotated. mcp-gemini.sh now pulls key from GCP at runtime. Emerald Zenith theme updated to v1.1 with Job Board Mode. Ghost CMS rebranded to "Worktugal AI Jobs" with updated nav, tiers, and benefits.

### Prior Context Loaded
- `prompts/knowledge/worktugal-direction-2026-05-10.md`
- `prompts/knowledge/worktugal-mvp-plan.md`
- `prompts/knowledge/worktugal-business-plan-2026.md`
- `prompts/knowledge/emerald-zenith-theme.md`
- `prompts/roles/sales-engine.md`
- `prompts/knowledge/n8n-agent-manual.md`

---

## 2. Files Changed

### worktugal-app (16 files)
```
src/App.tsx — modified — added route for /jobs/post
src/components/BottomNav.tsx — modified — RESULTS → JOBS
src/components/Footer.tsx — modified — tagline to jobs, platform links added Jobs + Post a Job
src/components/Layout.tsx — modified — header CTAs (Post a job + Sign in), user dropdown jobs-first, mobile menu updated, pendingPostJob sessionStorage redirect, Briefcase icon added
src/components/ModernHomePage.tsx — modified — complete rewrite: jobs-first hero, company logos, How It Works, employer CTA, compliance footnote
src/components/Seo.tsx — modified — default title "AI Jobs in Europe", description jobs-focused
src/components/jobs/JobCard.tsx — modified — complete redesign: no cards, thin dividers, text badges, hover apply
src/lib/auth.ts — modified — OAuth redirect default changed from /diagnostic to /jobs
src/pages/JobPostPage.tsx — created — 4-field form with Google auth gate
src/pages/JobsPage.tsx — modified — Ashby-style filters (3 dropdowns, no search), cleaner list, removed teaser counters duplication
src/pages/LoginPage.tsx — modified — onClose navigates to /jobs instead of /jobs/post (fixes redirect loop)
supabase/functions/stripe-webhook-live/index.ts — modified — added job_posting handler (inserts into ai_jobs on payment)
supabase/functions/create-job-posting-checkout/index.ts — created — EUR 49 Stripe checkout with job metadata
CLAUDE.md — modified — description, product status, source structure updated
memory/project_worktugal_state.md — modified — added second 2026-05-11 entry for pivot execution
memory/project_pending_actions.md — modified — updated priorities, Stripe checkout marked done
```
### prompt-secret-vault (5 files)
```
prompts/knowledge/emerald-zenith-theme.md — modified — v1.1, added Job Board Mode section
prompts/knowledge/stack-audit-2026.md — modified — v4.7 → v4.8, session log added
prompts/knowledge/n8n-agent-manual.md — modified — tokens updated, security protocol added
prompts/systems/commands/ship.md — modified — git add -A → git add -u, VanBrain sync uses GCP
SHARED_MEMORY.md — modified — Updated pointer note to reflect AI Jobs board pivot
```

---

## 3. Commands Run

```
n8n_n8n_update_partial_workflow (6 calls) — updated Mistral Norm fix, department filter on 4 norm nodes, version checker url, workflow deactivation
n8n_n8n_deploy_template / n8n_n8n_create_workflow — created v2 loop-based workflow (TGAmy5caPzorrEmf), 7 nodes
n8n_n8n_test_workflow (3 calls) — tested v2 workflow via webhook, confirmed Anthropic pipeline
supabase_execute_sql (15+ calls) — DB queries: department counts, UPDATE/DELETE non-AI jobs (704 deleted), table drops
supabase_deploy_edge_function (2 calls) — create-job-posting-checkout + stripe-webhook-live
stripe_list_products / stripe_list_prices — audited existing EUR 49 product and price
curl Telegram Bot API (5 calls) — setMyName, sendMessage, getMe for both bots
gcp_secrets_create_or_update_secret (4 calls) — telegram-bot-token, worktugal-bot-token, gemini-media-key
n8n_n8n_manage_credentials (2 calls) — updated Worktugal Ops Bot credential with new token
n8n_n8n_get_workflow — read full workflow JSON (GlitchTip, Weekly Digest, Parallel Monitor) to fix hardcoded tokens
ssh van-cloud — MySQL updates to Ghost CMS (title, description, nav, tier benefits)
```

---

## 4. Key Decisions

### Technical / Stack
| Decision | Rationale | Impact | Files/IDs |
|---|---|---|---|
| ATS pipeline: loop architecture vs parallel nodes | 17 parallel pipelines don't scale. Loop processes 1 company per batch, unlimited companies | Add new feeds by editing 1 array. 7 nodes for any number of companies | Workflow TGAmy5caPzorrEmf |
| Department filter: drop Sales/Marketing/HR/Finance/Support/Business | Quality over quantity. 704 non-AI jobs deleted from DB | 545 curated roles vs 1,249 noisy ones | All 4 norm nodes |
| JobCard: text-only badges, no card backgrounds | Job Board Mode: Ashby/GH minimal style | Lighter, faster, more professional | JobCard.tsx, Emerald Zenith v1.1 |
| ShareCard removed from diagnostic results | Users found Download/Copy buttons ugly and unnecessary | Cleaner results page | DiagnosticResults.tsx, ShareCard.tsx |
| mcp-gemini.sh pulls from GCP at runtime | Hardcoded key caused multiple leak warnings | Keys are never in files, never committed | mcp-gemini.sh |

### Strategic / Business
| Decision | Rationale | Impact | Proof/Metric |
|---|---|---|---|
| AI Jobs board is primary revenue engine | Compliance had 0 paying users. Jobs had EUR 520 pre-AI revenue | All new development prioritizes jobs | Revenue: EUR 0 → target EUR 245/mo |
| EUR 49 single listing at launch | Proven demand from MVP plan. 4x cheaper than nearest competitor | Self-serve checkout live at /jobs/post | Price: EUR 49 vs ai-jobs.net EUR 197 |
| Radar/Pro: maintain, no further development | 235 subscribers, costs nothing to keep running | No more features for Radar | /radar still works, nav link removed |
| Diagnostic: free lead magnet, no change | 900+ completions, drives SEO traffic | Diagnostic stays as-is, CTA reoriented to jobs | /diagnostic still live |
| Talent pool (Airtable): keep dormant | 3 candidates, not enough for employer-facing product | Don't build supply before demand | Airtable base appPJFDELyUfuzXGi |

### Deferred / Pending
| Item | Blocker | Owner | Next action |
|---|---|---|---|
| Add 5+ more ATS feeds (OpenAI, Cohere, ElevenLabs, etc.) | Need correct Greenhouse board slugs/Ashby API endpoints | Next agent | Verify board URLs, add to Company List array |
| First company spotlight article (Anthropic) | Content pipeline — needs Parallel research + DeepSeek draft | Next agent | Use company-spotlight-os.md template |
| Employer dashboard for repeat posters | Not needed until 10+ listings sold | Van | Build when demand proves |
| n8n pipeline handles only 1 company per trigger | SplitInBatches processes 1 batch per manual/webhook trigger. Schedule trigger processes all. | Confirmed working | Schedule at 06:00 handles full loop |

---

## 5. Assets Created

### Code / Scripts
| File | Stack | What it does |
|---|---|---|
| `src/pages/JobPostPage.tsx` | React/TypeScript | 4-field form with Google auth gate, Stripe checkout redirect |
| `supabase/functions/create-job-posting-checkout/index.ts` | Deno/Stripe | EUR 49 checkout with metadata for job posting |

### Prompts / Docs
| Name | Location | Version | Purpose |
|---|---|---|---|
| Emerald Zenith Design System | `prompts/knowledge/emerald-zenith-theme.md` | v1.1 | Added Job Board Mode, Ashby-style filters, anti-patterns |
| n8n Agent Manual | `prompts/knowledge/n8n-agent-manual.md` | v1.1 | Security protocol, new tokens, session log |
| stack-audit | `prompts/knowledge/stack-audit-2026.md` | v4.8 | Session log for pivot execution |

### Content / Automations
| Name | Tool/Platform | ID/URL | Status |
|---|---|---|---|
| AI Jobs Daily Pipeline | n8n | TGAmy5caPzorrEmf | Active, 7 nodes, daily 06:00 |
| EUR 49 checkout edge function | Supabase/Stripe | create-job-posting-checkout | Deployed |
| Job posting webhook handler | Supabase/Stripe | stripe-webhook-live | Updated |
| Ghost CMS rebrand | Ghost (van-cloud) | blog.worktugal.com | Done — title, nav, tier, benefits |

---

## 6. Context Preserved

- **What was learned**: SplitInBatches processes 1 batch per non-schedule trigger. Full 6-company loop only completes under schedule trigger (06:00). For testing, must add webhook trigger.
- **What was ruled out**: Separating employer/candidate sign-in flows. Too complex for current stage. Single auth gate with smart redirect (sessionStorage pendingPostJob) is sufficient.
- **What needs follow-up**: n8n v2.17.8 → latest stable update script is on van-cloud but the version checker workflow now has page_size=50 to find stable tags. LogoKit CORS errors on localhost — production domain works fine.

---

## 7. Cross-References

- **Prior session**: `2026-05-11-ai-jobs-board-v1.0.md` (morning session — strategy pivot initiated)
- **Related archives**: `2026-05-09-wrap-fixes-v4.6.md` (previous Ghost work)
- **Related config files**: `prompts/knowledge/emerald-zenith-theme.md` (v1.1), `prompts/knowledge/stack-audit-2026.md` (v4.8), `prompts/knowledge/n8n-agent-manual.md` (v1.1)
- **Session exports**: None

---

## 8. Next Session

### Proposed Name
`2026-05-12-content-expand-v4.9`

### Immediate Next Actions (max 3, ordered by leverage)
1. **Add 5+ ATS feeds** — OpenAI, Cohere, ElevenLabs, DeepL, Helsing. Find correct board slugs/API endpoints. Add to Company List array in v2 workflow. Run immediately after adding. — Next agent
2. **Write first company spotlight (Anthropic)** — Parallel AI deep research → DeepSeek draft → editorial pass → publish on Ghost. Drives traffic to /jobs. — DeepSeek (V4 Pro for draft, Flash for edit)
3. **Verify Stripe checkout end-to-end** — Post a test job with EUR 49, confirm it lands in ai_jobs with source=stripe_post and is_active=false. Confirm Telegram alert fires. — Next agent with Van approval for real payment

### What the Next Agent Needs to Read
- `prompts/knowledge/worktugal-direction-2026-05-10.md` — direction override
- `prompts/knowledge/worktugal-mvp-plan.md` — tickable execution plan
- `prompts/knowledge/emerald-zenith-theme.md` — design system v1.1 with Job Board Mode
- `prompts/knowledge/n8n-agent-manual.md` — workflow inventory, security protocol, new tokens
- `prompts/content/worktugal-company-spotlight-os.md` — article template for spotlight content
- `archives/2026-05-11-ai-jobs-board-v1.0.md` — prior session for strategy pivot context

---

## 9. Operator Notes

The pivot from compliance to jobs is now structurally complete — the app reads as jobs-first, compliance is a footnote. What remains is supply-side: more ATS feeds and content distribution. The EUR 49 checkout is live but untested end-to-end. The single highest-leverage action is verifying the checkout works with a real payment, because until that happens, the product has zero revenue pipeline. Content (company spotlights) drives traffic to the checkout. ATS feeds increase inventory which makes the board credible. All three form a loop: more jobs → more traffic → more checkouts → more revenue.

## Operator Take

The jobs board is built. The checkout is wired. The next agent should test the payment flow with a real EUR 49 charge, then add 5+ ATS feeds and write the first company spotlight — in that order.
