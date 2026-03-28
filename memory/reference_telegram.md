---
name: Telegram posting credentials
description: Bot tokens and channel IDs for posting to Worktugal's public Telegram channel and Van's private ops channel
type: reference
---

Two bots, two destinations:

**Public @worktugal channel (content posts):**
- Bot: @worktugal_bot
- Token: `WORKTUGAL_BOT_TOKEN` in `/home/vandevo/projects/worktugal-app/worktugal-app/.env`
- Channel: `WORKTUGAL_CHANNEL_ID=@worktugal`
- Post via: `curl -X POST https://api.telegram.org/bot{WORKTUGAL_BOT_TOKEN}/sendMessage -d chat_id=@worktugal`

**Van's private ops chat (alerts):**
- Bot: @WorktugalPassBot
- Token: `TELEGRAM_BOT_TOKEN` in `/home/vandevo/projects/van-intel/.env`
- Chat ID: `2099132460`

Use the public bot for all article/content posts. Use the private bot only for system alerts.
