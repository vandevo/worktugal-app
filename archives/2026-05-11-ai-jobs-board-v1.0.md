---
title: "Thread Handover"
session: "2026-05-11-ai-jobs-board-v1.0"
agent: "opencode-deepseek-v4-flash"
date: "2026-05-11"
---

## 1. Thread Overview

**Session**: v1.0-ai-jobs-board-2026-05-11
**Agent**: DeepSeek V4 Flash (OpenCode)
**Duration**: 2-day session (2026-05-09 through 2026-05-11). Strategy pivot + full MVP build.

### Scope
- Major strategy pivot: AI Jobs board becomes primary revenue engine. Portugal compliance becomes secondary content authority.
- Created direction override file, war room business plan, tickable MVP plan, company spotlight template v2.0.
- 3 Parallel AI deep researches completed (AI jobs platform, EU AI market, US-EU policy/talent war).
- Built Supabase schema for ai_jobs + ai_companies tables. Migration applied.
- Built 17-node n8n ATS aggregation workflow fetching from Anthropic, GitLab, Databricks, Mistral AI.
- Built /jobs page with premium JobCards: company avatars, D8 badges, seniority badges, multi-location, salary, Apply bar.
- Ghost CMS simplified: paid tier removed, free tier description rewritten, Stripe→Ghost sync deleted.
- n8n Weekly Digest Compiler fixed: broken Listmonk email replaced with Telegram ops bot.
- Apify + Airtable added to stack.
- Gemini API key rotated.

### Drivers
- Phase 0 compliance newsletter had EUR 0 MRR after months of infrastructure. Job board had EUR 520 historical revenue from manual effort before AI tools. Pivot was data-driven.
- Need to build revenue before building features. Jobs board is the simplest path to EUR 49 per transaction.

### Outcome
- 1,248 jobs in database (445 EU-eligible). n8n pipeline live, daily at 06:00. /jobs page live at app.worktugal.com/jobs with search, company/dept filters, pagination, D8 Visa badges.

### Prior Context Loaded
- AGENTS.md, CLAUDE.md, DEEPSEEK.md, deepseek-operator.md
- SHARED_MEMORY.md, stack-audit-2026.md (v4.6)
- worktugal-daily-compass.md, worktugal-focus-rails.md, worktugal-phase0-plan.md
- worktugal-platform-strategy.md, worktugal-strategy-2026.md
- voice-baseline.md, editorial-architecture.md, editorial-os.md, blog-engine.md
- sales-engine.md, prompt-engineer.md
- n8n-agent-manual.md, content-seo-auditor.md
- 3 Parallel AI deep research outputs
- VanBrain live query (50+ entries)

---

## 2. Files Changed

### Created (vault)
```
prompts/content/worktugal-company-spotlight-os.md — company spotlight template v2.0
prompts/knowledge/worktugal-direction-2026-05-10.md — direction override file
prompts/knowledge/worktugal-business-plan-2026.md — war room business plan
prompts/knowledge/worktugal-mvp-plan.md — tickable MVP execution plan
resources/research/ai-jobs-platform-opportunity-2026-05-10.md — research 1
resources/research/eu-ai-job-market-2026-05-10.md — research 2
resources/research/us-eu-ai-policy-talent-war-2026-05-10.md — research 3
```

### Created (app)
```
src/pages/JobsPage.tsx — /jobs page with filters, search, pagination
src/components/jobs/JobCard.tsx — premium job card component
supabase/migrations/20260510000000_create_ai_jobs.sql — ai_jobs + ai_companies tables
supabase/migrations/20260510000001_add_ai_jobs_eu_eligible.sql — is_eu_eligible + is_remote columns
resources/worktugal-jobs/ — 39 files (Van's existing research)
```

### Modified (vault)
```
SHARED_MEMORY.md — May 10 updates added
prompts/knowledge/stack-audit-2026.md — v4.5 → v4.6 (Apify, Airtable, Gemini key)
prompts/knowledge/worktugal-daily-compass.md — v1.1 → v2.0 (rewrite for AI jobs direction)
prompts/knowledge/worktugal-session-index.md — v1.1 → v1.2 (new section, new loading guide)
resources/research/INDEX.md — 3 new research entries
```

### Modified (app)
```
src/App.tsx — added /jobs route
src/components/Layout.tsx — Jobs nav link
src/pages/JobsPage.tsx — premium filters, EU-only, pagination, D8 badges
src/components/jobs/JobCard.tsx — premium design
```

### Deleted
```
supabase/functions/stripe-webhook-live/index.ts — Ghost sync functions removed (~120 lines)
```

### n8n Workflows
```
AI Jobs ATS Aggregation (eiMMIWC50FaoLfkQ) — created, active, 17 nodes
Weekly Digest Compiler (1t4tZaHWFTnf7snB) — modified, Listmonk→Telegram
```

---

## 3. Commands Run

| Command | What it did |
|---|---|
| 3 Parallel AI deep researches | Market analysis for AI jobs, EOR, ATS, EU compliance |
| supabase db push | Deployed ai_jobs + ai_companies tables |
| supabase functions deploy stripe-webhook-live | Removed Ghost sync from webhook |
| n8n workflow create/update | Built ATS aggregation pipeline, fixed weekly digest |
| Apollo ATS feed testing | Validated Greenhouse + Lever API endpoints |
| Python enrichment scripts | Backfilled is_eu_eligible, seniority, d8_eligible for 445 jobs |
| Gemini API key rotation | Updated mcp-gemini.sh with new key |
| GCP secret store | Saved Apify PAT + Airtable PAT |

---

## 4. Key Decisions

### Technical / Stack
| Decision | Rationale | Impact | Files/IDs |
|---|---|---|---|
| Supabase for jobs DB, not Algolia | Postgres + full-text search enough for 1K jobs | No extra cost, no new service | ai_jobs table |
| n8n ATS aggregation over Apify primary | ATS feeds are free, structured JSON. Apify as fallback. | 1000 jobs/day free | eiMMIWC50FaoLfkQ |
| Greenhouse API v1 over v2 | v1 board API is public, no auth needed | Simpler pipeline | URLs with boards-api.greenhouse.io |
| Apify MCP disconnected | No key available — restored via GCP | Unblocked | stack-audit |
| 4 parallel fetch→norm→upsert pipelines | n8n Merge node has bugs. Independent pipelines are reliable. | 17 nodes instead of 8 | Workflow ID |

### Strategic / Business
| Decision | Rationale | Impact | Proof/Metric |
|---|---|---|---|
| AI Jobs board = primary revenue | Compliance had 0 paid users after months. Jobs made EUR 520 manually. | Entire product direction shift | VanBrain + research |
| EUR 49 single price at launch | One price. Prove demand. Tier later. | Simpler checkout, less friction | MVP plan |
| EU-only job display | US-only jobs dilute value prop for EU-based ICP | 445 shown instead of 1248 | /jobs page |
| D8 Eligible badge from seniority heuristic | No salary data available yet. Senior roles are de facto D8 qualified. | 253 jobs badged immediately | ai_jobs.d8_eligible |
| Ghost free-only, monetize via app | Stripe→Ghost sync was fragile. Simplify. | Deleted 120 lines of dead code | stripe-webhook-live |

### Deferred / Pending
| Item | Blocker | Owner | Next action |
|---|---|---|---|
| Stripe EUR 49 checkout | Not built yet | DeepSeek | Phase 0.3 per MVP plan |
| First company spotlight | Not written yet | DeepSeek | Write Anthropic spotlight |
| More ATS feeds (Stripe, ElevenLabs, DeepL, etc.) | Need correct Greenhouse board URLs | DeepSeek | Add to n8n feed list |
| Salary enrichment from ATS content | HTML-encoded, need better parser | DeepSeek | Future enhancement |
| Remote policy enrichment | ATS feeds don't expose it directly | DeepSeek | Future enhancement |
| Win-back email sequence | Compliance pivot archived this | Van | Deferred to Phase 2 |

---

## 5. Assets Created

| Name | Location | Version | Purpose |
|---|---|---|---|
| Direction file | vault/knowledge/worktugal-direction-2026-05-10.md | v1.0 | Overrides all prior phase plans |
| Business plan | vault/knowledge/worktugal-business-plan-2026.md | v1.0 | War room strategy document |
| MVP plan | vault/knowledge/worktugal-mvp-plan.md | v1.0 | Tickable execution checklist |
| Company spotlight template | vault/content/worktugal-company-spotlight-os.md | v2.0 | Article format merged from old Notion prompt |
| Research 1 | vault/research/ai-jobs-platform-opportunity-2026-05-10.md | — | Market sizing, competitors, roadmap |
| Research 2 | vault/research/eu-ai-job-market-2026-05-10.md | — | EOR, ATS, ICP, monetization |
| Research 3 | vault/research/us-eu-ai-policy-talent-war-2026-05-10.md | — | Geopolitics, AI talent war, 5-10yr outlook |
| Daily compass | vault/knowledge/worktugal-daily-compass.md | v2.0 | Rewritten for AI jobs direction |
| /jobs page | app/src/pages/JobsPage.tsx | v1.0 | Job board frontend |
| JobCard component | app/src/components/jobs/JobCard.tsx | v1.0 | Premium card with badges |
| n8n ATS workflow | n8n.worktugal.com (eiMMIWC50FaoLfkQ) | v1.0 | 17-node aggregation pipeline |

---

## 6. Context Preserved

- **What was learned**: Portugal compliance alone does not convert to paid subscribers (55 diagnostic completions, 0 paid members). AI jobs market is growing 7.5% while rest contracts. 79% of recruiters are drowning in AI-generated CVs. EOR affiliate revenue ($1,500/Deel referral) is 30x more valuable than a EUR 49 job listing. Greenhouse/Lever/Ashby ATS feeds are free and public. D8 visa + IFICI 20% tax makes Portugal the gateway for US AI companies hiring in EU.
- **What was ruled out**: Portugal compliance as primary revenue engine. Ghost paid tier. Listmonk v6 Basic auth for email sends (dead). Build own job board UI instead of using Job Boardly for jobs. Airtable MCP (REST API enough).
- **What needs follow-up**: Stripe EUR 49 checkout edge function. First company spotlight article written and published. More ATS feeds added to pipeline. Salary enrichment from job descriptions.

---

## 7. Cross-References

- **Prior session**: archives/2026-05-09-daily-brief-v4.5.md — Context-loading session that identified Stripe smoke test as highest-leverage action
- **Direction file**: prompts/knowledge/worktugal-direction-2026-05-10.md
- **MVP plan**: prompts/knowledge/worktugal-mvp-plan.md
- **Business plan**: prompts/knowledge/worktugal-business-plan-2026.md
- **Company spotlight template**: prompts/content/worktugal-company-spotlight-os.md
- **Research 1**: resources/research/ai-jobs-platform-opportunity-2026-05-10.md
- **Research 2**: resources/research/eu-ai-job-market-2026-05-10.md
- **Research 3**: resources/research/us-eu-ai-policy-talent-war-2026-05-10.md

---

## 8. Next Session

### Immediate Next Actions (max 3, ordered by leverage)
1. **Phase 0.3 — Stripe EUR 49 checkout edge function** — The /jobs page exists, 445 jobs are live, but nobody can pay to post a job yet. Build `create-job-posting-checkout` edge function copying the existing stripe-checkout pattern. Create Stripe product "AI Job Posting" at EUR 49.
2. **Write first company spotlight** (Anthropic) — Use the company spotlight template. Parallel AI refresh → DeepSeek draft → edit → SEO audit → publish. Drives traffic to /jobs.
3. **Add 5 more ATS feeds** — Stripe, ElevenLabs, DeepL, Hugging Face, Cohere. Discover correct Greenhouse board tokens and add to n8n feed list.

### What the Next Agent Needs to Read
- `prompts/knowledge/worktugal-direction-2026-05-10.md` — Current direction
- `prompts/knowledge/worktugal-mvp-plan.md` — Tickable steps
- `prompts/knowledge/worktugal-daily-compass.md` — Daily metrics and broken items
- VanBrain live query for latest state

---

## 9. Operator Notes

Massive session. 8 new documents created, 3 deep researches completed, Supabase schema built, n8n pipeline built, /jobs page launched with 445 live jobs and D8 Visa badges. The pivot from compliance to AI jobs was the right call — compliance had 0 paying users, jobs already had EUR 520 in manual revenue. The stack is complete enough to ship revenue. Next session: Stripe checkout + first company spotlight.

## Operator Take

The compliance newsletter had 0 members and 0 users after months of infrastructure. The job board made EUR 520 manually before any AI tools. The pivot is validated by 3 deep researches and 1,248 live jobs in the database. Ship the Stripe checkout, write the first company spotlight, and start proving revenue this week.
