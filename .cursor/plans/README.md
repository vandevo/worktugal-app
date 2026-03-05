# Worktugal Plans Index

Last updated: 2026-03-05
Maintained by: Van + AI Cofounder (Opus 4.6)

## How to read this

- `active/` -- Plans being executed now. AI agents should follow these.
- `completed/` -- Finished plans. Kept for reference and context continuity.
- `archived/` -- Killed or superseded. File prefix explains why. Do not execute.

---

## Active Plans

### diagnostic_engine_v2_rebuild.plan.md
- **Version**: 2.3
- **Created**: 2026-03-05
- **Status**: Phase 1 complete, Phase 2 complete, Phase 2.5 complete (route consolidation, homepage reposition, governance layer), Phase 4 homepage-reposition complete. Phases 3, 5-7 pending.
- **Scope**: Master plan for the Compliance Intelligence Engine. Covers engine architecture, trap rules, Supabase schema, UI, Stripe monetization (29 EUR scan, 99-149 EUR clarity call, B2B licensing), Parallel.ai monitoring, and homepage repositioning.
- **Dependencies**: None (root plan)
- **Revenue target**: First paid 29 EUR scan within 21 days of production deploy
- **Next**: Deploy to production, collect 5-10 real submissions, then unblock Phase 3 (Stripe)

### phase_2.5_launch_readiness.plan.md
- **Version**: 1.0
- **Created**: 2026-03-05
- **Status**: COMPLETE (E2E tested, homepage repositioned, routes consolidated, 49 EUR archived, governance layer built)
- **Scope**: Sprint plan bridging Phase 2 (UI built) and Phase 3 (Stripe). Covers E2E testing, homepage repositioning to risk-detection narrative, archiving the dead 49 EUR product CTA, and deferring Stripe until email submissions prove funnel.
- **Dependencies**: Executes within diagnostic_engine_v2_rebuild Phase 2-3 gap
- **Gate**: Phase 3 Stripe wiring blocked until 5-10 diagnostic submissions in Supabase

---

## Completed Plans

### v1.2_pre-launch_refresh.plan.md
- **Version**: 1.2
- **Completed**: 2026-02 (approx)
- **Scope**: Pre-email-campaign refresh of all user-facing pages. Fixed broken upsell funnel, updated copy with disclaimers, created ComplianceDisclaimer component, integrated Perplexity API for AI draft reports.
- **Outcome**: All todos completed. Produced the homepage and results page that Phase 2.5 now repositions.

---

## Archived Plans

### [archived-gemini-broke-codebase] diagnostic_engine_v2_migration.plan.md
- **Killed**: 2026-03-05
- **Reason**: Gemini attempted this plan and destroyed the codebase (v1.3.5 revert). Replaced by `diagnostic_engine_v2_rebuild.plan.md` built with Opus 4.6 from scratch. All todos were pending when killed.

### [archived-superseded-by-v2-engine] readyfile_reframe.plan.md
- **Killed**: 2026-03-05
- **Reason**: "Readyfile" concept (Ready/Blocked/Escalate status UI for the 49 EUR paid flow) is dead because the 49 EUR product has zero conversions. The v2 engine replaces it with a 29 EUR risk scan model. All todos were pending when killed.

### [archived-phase1-done-phase2-3-merged-into-v2] parallel_ai_integration.plan.md
- **Killed**: 2026-03-05
- **Reason**: Phase 1 (research-compliance Edge Function, AI draft reports) was completed and is live. Phases 2-3 (regulatory_rules table, scheduled updates, PDF output) overlap with the v2 master plan Phase 5 (Parallel.ai monitoring). Remaining work is now tracked in the v2 plan.

---

## Plan Relationships

```
diagnostic_engine_v2_rebuild (master)
  |
  |-- Phase 1: Engine + Schema ............ COMPLETE
  |-- Phase 2: UI (Form + Results) ........ COMPLETE
  |     |
  |     +-- phase_2.5_launch_readiness .... COMPLETE
  |
  |-- Phase 3: Monetization (Stripe) ...... BLOCKED (waiting on 5-10 real submissions post-deploy)
  |-- Phase 4: Positioning + Launch ....... COMPLETE (homepage, nav, footer, FAQ, SEO updated)
  |-- Phase 5: Parallel.ai Monitoring ..... PENDING (absorbs archived parallel_ai Phase 2-3)
  |-- Phase 6: Clarity Call Pipeline ...... PENDING
  |-- Phase 7: B2B Infrastructure ......... PENDING
```
