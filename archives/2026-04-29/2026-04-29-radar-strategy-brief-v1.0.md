# Thread Handover — 2026-04-29-radar-strategy-brief-v1.0

## 1. Thread Overview

**Session**: v1.0-radar-strategy-brief-2026-04-29
**Agent**: Claude Sonnet 4.6
**Duration**: Single session — strategy + context organization + naming decision

### Scope
Daily brief + full vault context load for worktugal-app. Strategic review of `/radar` MVP — landing page audit, pricing, positioning, personalization gap. Product naming discussion: "Portugal Radar" → "Worktugal Brief". Brand architecture established. Vault session index created. CLAUDE.md updated.

### Drivers
Van wanted to work exclusively on worktugal-app and needed full vault context loaded. Session surfaced that Phase 0 (first digest) hasn't been sent despite being planned since April 25. Multiple strategic and naming decisions needed before delegating work to DeepSeek while Claude usage limit resets.

### Outcome
No code shipped. Four strategic decisions made (see Section 4). One new file created (`worktugal-session-index.md`). One file updated (`CLAUDE.md`). Four bugs identified in `RadarLanding.tsx` — none fixed yet, queued for DeepSeek. The session established naming direction (Brief), brand architecture (Brief + Letter + ReadyFile + Scan), and confirmed the single most important action: send the first digest.

### Prior Context Loaded
- `prompt-secret-vault/prompts/knowledge/worktugal-platform-strategy.md`
- `prompt-secret-vault/prompts/knowledge/worktugal-strategy-2026.md`
- `prompt-secret-vault/prompts/knowledge/worktugal-focus-rails.md`
- `prompt-secret-vault/prompts/knowledge/worktugal-phase0-plan.md`
- `prompt-secret-vault/prompts/knowledge/emerald-zenith-theme.md`
- `prompt-secret-vault/resources/feature-lab/worktugal-app-features.md`
- `prompt-secret-vault/resources/research/2026-04-28-worktugal-ai-newsletter-business-models-parallel.md`
- `prompt-secret-vault/resources/research/2026-04-25-worktugal-portugal-immigration-saas-competitors-qwen.md`
- `worktugal-app/CLAUDE.md`
- VanBrain (50 entries via brain.worktugal.com)

---

## 2. Files Changed

```
prompt-secret-vault/prompts/knowledge/worktugal-session-index.md — created — single entry point for all worktugal sessions; lists all strategy/research/feature/design files with load guide by task, known bugs, upcoming research queue, Supabase tables, app key files
worktugal-app/worktugal-app/CLAUDE.md — modified — added "Vault Context" section pointing to session index as first load; updated prompts-by-task table to be complete
src/components/radar/RadarLanding.tsx — read only — 4 bugs identified, none fixed yet (see Known Issues)
prompt-secret-vault/resources/research/INDEX.md — read only
prompt-secret-vault/resources/archives/* — read only (3 archive files)
```

---

## 3. Commands Run

```
gcloud secrets versions access latest --secret=BRAIN_API_KEY --project=worktugal — fetched VanBrain API key
curl brain.worktugal.com/memory?limit=50 — loaded 50 VanBrain entries
rtk gain — RTK stats: 985.5K tokens saved (43.5%), 829 commands
Google Calendar MCP — fetched today's events (gym 15:00-16:00)
Gmail MCP — fetched unread threads (2 new Radar signups, DHL confirmation, Stripe resolved)
find src/ -name "*adar*" — located RadarLanding.tsx
```

---

## 4. Key Decisions

### Strategic / Business

| Decision | Rationale | Impact | Proof/Metric |
|---|---|---|---|
| Rename "Portugal Radar" → "Worktugal Brief" | "Portugal" is geo-locked; "Brief" travels across countries, has legal/intelligence metaphor, extends cleanly (Brief Pro, Brief Business, Brief API), no trademark conflicts | Don't rename until after first digest ships + Stripe wired. Then update copy, URL, component | Newsletter research: niche products need strong metaphor; Brief > Radar for authority positioning |
| Brand architecture: Brief + Letter + ReadyFile + Scan | Worktugal Letter (Ghost, editorial, free) + Worktugal Brief (Listmonk, paid digest) + Worktugal ReadyFile (future doc hub) + Worktugal Scan (diagnostic rename, TBD) | Each product name implies function, no geo-lock, extensible. Letter and Brief are complementary not competing. | Van confirmed "Brief" direction in session |
| Fix pricing €12/mo → €5/mo on /radar before sending digest | €12 is Premium tier price (Layer 3). €5 is Radar tier (Layer 2). Cold list needs lowest friction. | Must fix in RadarLanding.tsx before digest goes out | Platform strategy doc, phase0-plan both specify €5/mo |
| Phase 0 first, rebrand second | Zero paying subscribers. Validation data trumps naming. Rename after first paid conversion. | Send digest under current "Radar" name. Fix bugs. Wire Stripe. Then rebrand to Brief. | Pattern from strategy: stop planning loops, ship the email |

### Technical / Stack

| Decision | Rationale | Impact | Files/IDs |
|---|---|---|---|
| Email signup in RadarLanding doesn't reach Listmonk | Bug: handleEmailSubmit only inserts to radar_subscribers table. Google OAuth path correctly calls auto-subscribe-radar edge fn. Email path skips it. | Users who sign up via email are NOT on Listmonk. Two today (wade.hescht@lonestar.edu, office@qtdog.com) may be affected. | `src/components/radar/RadarLanding.tsx` L184-230 |
| Stack audit: no changes needed | No new tools, MCPs, or infra this session. Purely strategy + docs. | Skip stack-audit update | — |

### Deferred / Pending

| Item | Blocker | Owner | Next action |
|---|---|---|---|
| Fix 4 bugs in RadarLanding.tsx | Not started — Claude hit usage limit | DeepSeek (this session) | See bug list in Section 6 |
| Write + send first compliance digest | Not started — Phase 0 action pending since April 25 | Van + DeepSeek | Pull regulatory_alerts table, format 3-5 items, draft in Listmonk |
| Wire Stripe for €5/mo Radar paywall | Digest not sent yet — validate demand first | Claude (next session) | After 20+ signups from first digest |
| Rename /radar → /brief across codebase | Decision made, implementation deferred | Claude (next session) | After first digest sent + validated |
| Personalisation gap: page promises "only what affects you", form collects email only | Phase 0 is generic digest — mismatch with copy | DeepSeek or Claude | Soften copy OR add visa-type dropdown to signup form |

---

## 5. Assets Created

### Code / Scripts
None shipped.

### Prompts / Docs

| Name | Location | Version | Purpose |
|---|---|---|---|
| worktugal-session-index | `prompt-secret-vault/prompts/knowledge/worktugal-session-index.md` | v1.0 | Single entry point for all worktugal sessions — lists every relevant file, load guide by task, known bugs, research queue, app key files |

### Skills Installed
None.

### Content / Automations
None.

---

## 6. Context Preserved

**What was learned:**
- Phase 0 (first digest) has not been sent. Plan was written April 25, updated April 28. The gap is execution, not strategy.
- RadarLanding.tsx has 4 bugs (listed below). None are blocking the digest send — they're blocking paid conversion.
- Two new Radar signups today (19:55 and 18:53) — email path, may not be on Listmonk.
- "Portugal Radar" is not extensible. "Worktugal Brief" is the decided replacement.
- The Worktugal Letter (Ghost/blog) and Worktugal Brief (Listmonk/digest) are complementary, not competing.
- The 15k list is cold — realistic first-send Radar signups: 100-300, not 200+. Calibrate expectations.

**Known bugs in RadarLanding.tsx (unfixed, queued for DeepSeek):**
1. Pricing: €12/mo everywhere → must be €5/mo (hero badge, SEO meta L237-243, CTA section)
2. Email signup doesn't call Listmonk — only inserts to `radar_subscribers` table. Google OAuth path calls `auto-subscribe-radar` edge fn correctly. Email path needs to call the same edge fn OR subscribe via Listmonk API directly.
3. Dead import: `LogIn` imported from lucide-react on L6, never used.
4. "How it works" section bg clips — `bg-slate-50` on inner container, not full-width wrapper. Needs outer div wrapping the section.

**What was ruled out:**
- Rebuilding the landing page — it's 80% right, just needs bug fixes
- Renaming before digest ships — premature
- B2B cold outreach before consumer validates — wrong sequence
- €12/mo pricing — kills cold-list conversion

**What needs follow-up:**
- Check if today's 2 email signups (wade.hescht@lonestar.edu, office@qtdog.com) are on Listmonk — query `radar_subscribers` and cross-check Listmonk list
- Decide: soften personalization copy OR add visa-type dropdown to email signup form
- Wire Stripe €5/mo paywall after first digest validates demand

---

## 7. Cross-References

- **Prior session**: `2026-04-27-mcp-server-fixes-v0.1`
- **Related archives**: `2026-04-27-vanbrain-build-v4.2`, `2026-04-26-compliance-cta-replace-v0.1.0`
- **Related config files**: `worktugal-app/CLAUDE.md` (updated), `prompt-secret-vault/prompts/knowledge/worktugal-session-index.md` (created)
- **Supabase project**: `jbmfneyofhqlwnnfuqbd`
- **Session exports**: None

---

## 8. Next Session

### Proposed Name
`2026-04-29-brief-bugs-digest-v0.1` (DeepSeek — same day, 2hr gap)
`2026-04-29-brief-stripe-rename-v0.2` (Claude — after limit resets)

### Immediate Next Actions (max 3, ordered by leverage)

1. **Fix 4 RadarLanding bugs** — pricing, Listmonk path, dead import, bg clip — unblocks paid conversion path — DeepSeek now
2. **Write and send first digest** — pull regulatory_alerts, format 3-5 items, send via Listmonk to 15k list — starts the revenue validation clock — Van + DeepSeek today
3. **Check 2 new signups are on Listmonk** — query radar_subscribers + Listmonk API — confirms email path works before sending digest — DeepSeek now

### What the Next Agent Needs to Read
```
Load: prompt-secret-vault/prompts/knowledge/worktugal-session-index.md  ← START HERE
Then: prompt-secret-vault/prompts/knowledge/worktugal-phase0-plan.md
Then: prompt-secret-vault/prompts/knowledge/emerald-zenith-theme.md  ← if touching UI
Supabase project: jbmfneyofhqlwnnfuqbd
Key file: worktugal-app/src/components/radar/RadarLanding.tsx
```

---

## 9. Operator Notes

The strategy is sound. The infrastructure is built. The landing page is 80% right. The only thing between Worktugal and its first revenue signal is one email. The digest hasn't shipped because every session has produced strategy and planning instead of execution. DeepSeek can fix the 4 known bugs in RadarLanding while Claude's limit resets — those are well-scoped, no judgment calls required. The digest content itself needs Van: pull from regulatory_alerts, pick 3-5 that matter, write in plain English. That's 2 hours of work. When Claude is back, the task is Stripe wiring and the /brief rename. Do not start a new strategic discussion in the next session — the strategy is set.

## Operator Take

The session index is built and the naming is decided — now DeepSeek fixes the bugs, Van writes the digest, and the first email ships before Claude's limit resets.
