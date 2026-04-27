# Thread Handover — 2026-04-27-vanbrain-build-v4.2

## 1. Thread Overview

**Session**: 2026-04-27-vanbrain-build-v4.2
**Agent**: Claude Sonnet 4.6
**Duration**: Full build sprint — continuation of 2026-04-26 audit session (context compacted mid-session)

### Scope
Built VanBrain from zero to production: shared agent memory system across all 6 agents. Also: Supabase CLI upgrade, DB security audit + fixes, Ollama install on van-cloud, n8n workflow, Cloudflare Worker, command updates, SHARED_MEMORY.md migration.

### Drivers
Six agents (Claude, Qwen, GLM, DeepSeek, Gemini, MiniMax) operating with no shared state — each session starts cold. SHARED_MEMORY.md was stale static markdown with no write path. Van wanted a real brain all agents could read and write.

### Outcome
VanBrain is fully live. 34 memories in Supabase with pgvector embeddings. Write path: any agent → `brain.worktugal.com/memory` (POST) → n8n → Ollama embed → Supabase. Read path: GET `brain.worktugal.com/memory` → Supabase direct. `/qwen`, `/glm`, `/wrap` (Claude + OpenCode) updated to pull on start and write on end. SHARED_MEMORY.md replaced with 1K pointer. All secrets in GCP Secret Manager (project: `worktugal`).

### Prior Context Loaded
- `/home/vandevo/.claude/projects/.../memory/stack-agents.md`
- `/home/vandevo/.claude/commands/wrap.md`
- `/home/vandevo/projects/prompt-secret-vault/CLAUDE.md`
- Compacted summary of prior session (audit, GLM/Qwen fixes, VanBrain design)

---

## 2. Files Changed

```
supabase/migrations/20260426233153_vanbrain_agent_memory.sql — created — full agent_memory table schema with pgvector, HNSW, FTS, RLS
workers/brain/index.ts — created — Cloudflare Worker source for brain.worktugal.com
workers/brain/wrangler.toml — created — Cloudflare Worker config with route brain.worktugal.com/*
~/.zshrc — modified — added mise activate zsh for PATH (supabase 2.90.0 now managed by mise)
~/.config/opencode/commands/qwen.md — modified — added Step 0: pull VanBrain at session start
~/.config/opencode/commands/glm.md — modified — added Step 0: pull VanBrain at session start
~/.claude/commands/wrap.md — modified — added Step 6.5: write session decisions to VanBrain
~/.config/opencode/commands/wrap.md — modified — added Step 6.5: write session decisions to VanBrain
/home/vandevo/projects/prompt-secret-vault/SHARED_MEMORY.md — modified — replaced 253 lines with 26-line pointer to VanBrain API
~/.claude/projects/.../memory/stack-agents.md — modified — added GCP project rule (always worktugal), Secret Manager index, VanBrain entries
```

---

## 3. Commands Run

```
supabase migration new vanbrain_agent_memory — created migration file
MCP execute_sql — created agent_memory table, HNSW index, GIN FTS index, RLS policies, updated_at trigger
MCP get_advisors (security + performance) — found 1 ERROR (resend_email_events no RLS), 2 WARNs on agent_memory policies, 3 functions missing search_path
MCP execute_sql (x4) — fixed resend_email_events RLS, fixed agent_memory RLS policies perf, restored handle_new_user_welcome, fixed notify_telegram_changelog + update_updated_at_column search_path
sudo rm /usr/local/bin/supabase — removed old manual binary
mise use -g supabase@latest — installed supabase 2.90.0 via mise
ssh vandevo@34.62.136.208 "curl ollama install.sh | sh" — installed Ollama on van-cloud
ssh ... "ollama pull nomic-embed-text" — pulled 768-dim embedding model
ssh ... systemd override OLLAMA_HOST=0.0.0.0:11434 — exposed Ollama to Docker network
n8n import:workflow — imported VanBrain intake workflow (f70a27b9)
n8n PUT /api/v1/workflows — updated workflow with correct specifyBody:json format (fixed 404 from Ollama)
bun install -g wrangler — installed wrangler 4.85.0 natively in WSL (Windows wrangler was broken)
wrangler secret put BRAIN_API_KEY + SUPABASE_SERVICE_KEY — set Cloudflare Worker secrets
wrangler deploy — deployed vanbrain worker to brain.worktugal.com
gcloud secrets create N8N_API_KEY --project=worktugal — saved n8n API key
gcloud secrets create BRAIN_API_KEY --project=worktugal — saved brain key
gcloud secrets create CF_WORKERS_API_TOKEN --project=worktugal — saved Cloudflare Workers token
python3 /tmp/seed-vanbrain.py — seeded 22 structured memories from SHARED_MEMORY.md content
curl POST brain.worktugal.com/memory (x10) — seeded 10 additional stack/identity memories
git commit "feat: vanbrain cloudflare worker" — committed workers/ to worktugal-app
git commit "feat: migrate SHARED_MEMORY to VanBrain pointer" — committed vault
```

---

## 4. Key Decisions

### Technical / Stack
| Decision | Rationale | Impact |
|---|---|---|
| Cloudflare Worker as API gateway | Single URL for all agents, handles auth, routes writes to n8n and reads to Supabase | All agents use `brain.worktugal.com` — no agent knows about n8n or Supabase internals |
| n8n as write pipeline (not direct Supabase) | n8n handles embedding call to Ollama before upsert — keeps embedding logic centralised | Every written memory gets a vector embedding automatically |
| Ollama nomic-embed-text on van-cloud | Zero cost, 768 dims, self-hosted — no external embedding API needed | Embeddings are free and private |
| GCP project `worktugal` for all secrets | `melodic-rig-472613-s5` (HireSignal EU) has no Secret Manager enabled | Always use `--project=worktugal` for gcloud secrets |
| SHARED_MEMORY.md → pointer file | 34 memories now live in Supabase with semantic search — markdown was read-only and stale | All content migrated; MD file now just explains how to use VanBrain |
| wrangler via bun (not npx) | Windows wrangler was on PATH in WSL, breaking Linux deploys | `~/.bun/bin/wrangler` is the WSL-native binary |
| CF_WORKERS_API_TOKEN separate from existing token | Existing Cloudflare token was read-only, no Workers write scope | New token: Edit Cloudflare Workers template, stored in GCP Secret Manager |

### Product / Ops
| Decision | Rationale | Impact |
|---|---|---|
| 34 memories seeded from SHARED_MEMORY.md | Agents need real context on first pull, not an empty brain | identity (9), project (10), stack (14), routing (1) |
| BRAIN_API_KEY shared across all agents | Simplicity — one key, all 6 agents, stored in GCP | Key: c04d84... stored in GCP Secret Manager BRAIN_API_KEY |

---

## 5. Open Items / Follow-Up

| Item | Priority | Notes |
|---|---|---|
| Update `/gemini`, `/daily`, `/ship` commands to pull VanBrain | High | `/qwen`, `/glm`, `/wrap` done — gemini/daily/ship still read SHARED_MEMORY.md only |
| Update vault role files (qwen-operator.md, gemini-operator.md) to reference VanBrain | Medium | They still say "read SHARED_MEMORY.md" — should say "pull VanBrain first" |
| Add semantic search (vector similarity) to brain.worktugal.com | Low | Currently: filter + FTS only. Semantic search needs Ollama callable from Worker or n8n search workflow |
| Ollama always-on check | Low | If van-cloud VM restarts, Ollama systemd service should auto-start — verify with `systemctl is-enabled ollama` |
| Add more project memories as Worktugal B2B progresses | Ongoing | Write key decisions to VanBrain via `/wrap` each session |

---

## 6. VanBrain Quick Reference

```
# Read all memories
curl -s "https://brain.worktugal.com/memory?limit=50" \
  -H "Authorization: Bearer c04d84728ad748522f0ae3d48280c7f521c37bb8b96968cc0a4efeebd5211b7f"

# Write a memory
curl -s -X POST https://brain.worktugal.com/memory \
  -H "Authorization: Bearer c04d84728ad748522f0ae3d48280c7f521c37bb8b96968cc0a4efeebd5211b7f" \
  -H "Content-Type: application/json" \
  -d '{"category":"decision","key":"my-key","value":"...","agent":"claude"}'

# Filter by category
curl -s "https://brain.worktugal.com/memory?category=project" \
  -H "Authorization: Bearer c04d84728ad748522f0ae3d48280c7f521c37bb8b96968cc0a4efeebd5211b7f"
```

Secrets: `gcloud secrets versions access latest --secret=BRAIN_API_KEY --project=worktugal`

---

## 7. Operator Take

VanBrain is live. Six agents now share one brain — 34 memories with vector embeddings, one API endpoint, three-layer architecture (Cloudflare → n8n → Ollama → Supabase). The SHARED_MEMORY.md markdown era is over. Every `/qwen` and `/glm` session now starts with a live brain pull. Every `/wrap` writes back. The system grows with every session.

Immediate next task: update `/gemini`, `/daily`, `/ship` and the two operator role files to pull VanBrain — 30 minutes of work, high value.

Supabase CLI is now on 2.90.0 via mise. DB has been security-audited and hardened.
