# Compliance Monitor Pipeline — Status

Last updated: 2026-05-01

## Pipeline Flow

Parallel AI Monitors (2x daily) → n8n Webhook → Fetch Details → Format Alerts → Supabase → Telegram + Email

## n8n Workflows

| Workflow | ID | Status | Notes |
|---|---|---|---|
| Parallel Monitor → Compliance Alerts | `32omcS4yZzGNMCLB` | ✅ Active, 9 nodes | Saves to Supabase + sends Telegram + email |
| Weekly Digest Compiler | `1t4tZaHWFTnf7snB` | ✅ Active, 5 nodes | Cron Fri 4pm, fetches unsent alerts → Listmonk |

## Parallel AI Monitors

| Monitor ID | Query | Frequency |
|---|---|---|
| `monitor_ec6567ee3c984f6595d65f47be4c5356` | Expat legislation | Daily |
| `monitor_aea21ffea4954a62a3520520a6568ec1` | Immigration/tax policy | Daily |

Webhook endpoint: `https://n8n.worktugal.com/webhook/parallel-monitor`

## Supabase

- `compliance_alerts` — all parsed alerts with raw_event JSONB + source_urls TEXT[]
- `radar_subscribers` — email + Google OAuth signups

## Notifications

- **Telegram**: @WorktugalPassBot → chat `2099132460`. Bot token in workflow.
- **Email**: Resend `re_LZXkyiED_9pdjWy9KWXWxxB7pzRm8ixZt` → `hello@worktugal.com`

## Known Issues

- No Listmonk subscriber sync for `/radar` signups (v6 API auth broken)
- Weekly Digest Compiler ran today but had no data (now has 4 alerts for next run)
