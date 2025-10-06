# Signup Webhook Integration

**Last Updated:** 2025-10-04

## Overview

Unified signup notification system that sends new user data to Make.com for automated CRM capture, welcome emails, and team notifications.

### Purpose

Every signup (Accounting Desk, Partner Pass, future tools) triggers a single webhook that:

1. Adds contact to FluentCRM (Worktugal Members list)
2. Sends Telegram notification to team
3. Delivers welcome email via Amazon SES

### Architecture

```
User Signup (Supabase Auth)
    ↓
auth.ts calls notify-signup Edge Function (non-blocking)
    ↓
Edge Function forwards to Make.com webhook
    ↓
Make.com Scenario:
    ├─→ FluentCRM (Add/Update Contact)
    ├─→ Telegram Bot (Team Notification)
    └─→ Amazon SES (Welcome Email)
```

## Implementation

### 1. Edge Function

**File:** `supabase/functions/notify-signup/index.ts`

**Purpose:** Receives signup data from auth.ts and forwards to Make.com webhook.

**Key Features:**
- Non-blocking: Returns success even if webhook fails
- Logs errors but doesn't throw
- Includes user_id, email, display_name, timestamp, source, role

**Payload Sent to Make.com:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "source": "site_signup",
  "role": "user",
  "timestamp": "2025-10-04T23:41:51.000Z",
  "user_id": "uuid-here"
}
```

### 2. Auth Integration

**File:** `src/lib/auth.ts`

**Changes:**
- Added `notifySignup()` helper function (private)
- Calls Edge Function after successful signup
- Fire-and-forget: Errors logged, signup not blocked
- Uses existing VITE_SUPABASE_URL from .env

**Code:**
```typescript
// In signUp() function, after successful auth:
if (data.user) {
  notifySignup(data.user.id, email).catch((err) => {
    console.warn('Signup notification failed (non-critical):', err);
  });
}
```

### 3. Make.com Webhook

**URL:** `https://hook.eu2.make.com/pueq1sw659ym23cr3fwe7huvhxk4nx9v`

**Scenario Modules:**

1. **FluentCRM - Add/Update Contact**
   - List: Worktugal Members
   - Tag: Registered via Worktugal Site
   - Email: `{{1.email}}`
   - Name: `{{1.name}}`

2. **Telegram Bot - Send Message**
   - Message: `👤 New signup: {{1.name}} ({{1.email}})`
   - Chat: Your team chat ID

3. **Amazon SES - Send Email**
   - From: Worktugal <hello@worktugal.com>
   - To: `{{1.email}}`
   - Subject: Welcome to Worktugal
   - Body: Welcome message with login instructions

## Deployment

### Deploy Edge Function

Use Supabase MCP tool:

```typescript
// In Claude Code interface:
Deploy Edge Function:
  name: notify-signup
  slug: notify-signup
  verify_jwt: false (public endpoint)
  entrypoint_path: index.ts
  files: [{ name: "index.ts", content: "<content>" }]
```

Or via Supabase CLI (if available):

```bash
supabase functions deploy notify-signup
```

### Environment Variables

**Already configured:**
- `VITE_SUPABASE_URL` - Used by auth.ts to call Edge Function

**No new variables needed** - Make.com webhook URL is hardcoded in Edge Function.

### Verification Steps

1. **Test Signup Flow:**
   - Create new account via signup form
   - Check browser console for "Signup notification" logs
   - Verify no errors thrown

2. **Check Make.com:**
   - Open Make.com scenario
   - View execution history
   - Confirm payload received

3. **Verify Deliverables:**
   - Check FluentCRM → Worktugal Members list for new contact
   - Check Telegram for team notification
   - Check user's inbox for welcome email

## Testing

### Manual Test

```bash
# Test Edge Function directly
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/notify-signup \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user-id",
    "email": "test@example.com",
    "display_name": "Test User",
    "created_at": "2025-10-04T23:41:51.000Z"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Signup notification sent"
}
```

### Test in App

1. Open app in browser
2. Go to signup form
3. Create account with test email
4. Open browser DevTools → Console
5. Look for: `Sending signup notification to Make.com:`
6. Verify no error messages

### Failure Modes

**Scenario 1: Make.com webhook fails**
- Edge Function logs error but returns success
- User signup completes normally
- Team receives no notification
- Fix: Check Make.com scenario is active

**Scenario 2: Edge Function unreachable**
- auth.ts catches error and logs warning
- User signup completes normally
- Console shows: `Signup notification failed (non-critical)`
- Fix: Verify Edge Function deployed

**Scenario 3: Network timeout**
- Promise rejected but caught
- User signup completes normally
- No impact on user experience

## Security

### Non-Blocking Design

Critical principle: **Signup must never fail due to webhook issues.**

Implementation:
- Edge Function wrapped in try/catch
- auth.ts uses `.catch()` on notifySignup promise
- All errors logged, none thrown
- User sees success message regardless

### Data Privacy

**Data Sent:**
- Email (required for CRM)
- Display name (derived from email if not provided)
- User ID (Supabase UUID)
- Timestamp (signup time)
- Source (always "site_signup")
- Role (always "user")

**Data NOT Sent:**
- Password
- Payment info
- Subscription status
- Any PII beyond email

### CORS Headers

Edge Function includes proper CORS headers:
```typescript
"Access-Control-Allow-Origin": "*"
"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
"Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey"
```

### Rate Limiting

**Supabase Edge Functions:**
- Default: 100 requests/minute per IP
- Sufficient for signup flow (typically 1-5 signups/minute)

**Make.com:**
- Free tier: 1,000 operations/month
- Pro tier: 10,000 operations/month
- Upgrade if hitting limits

## Monitoring

### Edge Function Logs

View in Supabase Dashboard:
1. Go to Edge Functions → notify-signup
2. Click "Logs" tab
3. Filter by date range
4. Look for errors or failed requests

### Make.com Execution History

View in Make.com:
1. Open scenario
2. Click "History" tab
3. See all webhook deliveries
4. Click individual executions for details

### FluentCRM Verification

Check contacts:
1. WordPress Admin → FluentCRM → Contacts
2. Filter by List: Worktugal Members
3. Filter by Tag: Registered via Worktugal Site
4. Sort by Date Added (newest first)

## Future Extensions

### Adding More Sources

To track different signup flows:

```typescript
// Example: Accounting Desk booking
const webhookPayload = {
  email: payload.email,
  name: displayName,
  source: "accounting_booking", // Changed
  role: "user",
  timestamp: payload.created_at,
  user_id: payload.user_id,
};
```

Make.com can then route based on `source` field:
- `site_signup` → General welcome flow
- `accounting_booking` → Accounting-specific email
- `partner_signup` → Partner onboarding flow

### Adding Custom Fields

Extend payload with additional data:

```typescript
const webhookPayload = {
  // ... existing fields
  interests: userData.interests, // Array
  company: userData.company_name, // String
  referral_source: userData.utm_source, // String
};
```

Update FluentCRM scenario to capture these fields.

### Multiple Webhooks

To notify different systems:

```typescript
// Call multiple webhooks in parallel
await Promise.allSettled([
  fetch(MAKECOM_WEBHOOK_URL, { ... }),
  fetch(ZAPIER_WEBHOOK_URL, { ... }),
  fetch(INTERNAL_API_URL, { ... }),
]);
```

All failures logged, none block signup.

## Troubleshooting

### Issue: No Telegram notification received

**Check:**
1. Make.com scenario active?
2. Telegram bot token valid?
3. Chat ID correct?
4. Bot added to chat?

**Fix:** Test Telegram module independently in Make.com.

### Issue: No welcome email delivered

**Check:**
1. Amazon SES verified sender (hello@worktugal.com)?
2. Recipient email in sandbox mode allowlist?
3. Email in spam folder?
4. SES sending limits not exceeded?

**Fix:** Check AWS SES dashboard for bounces/complaints.

### Issue: FluentCRM contact not created

**Check:**
1. FluentCRM API credentials correct in Make.com?
2. List "Worktugal Members" exists?
3. WordPress site accessible from Make.com?

**Fix:** Test FluentCRM module independently in Make.com.

### Issue: Edge Function not called

**Check:**
1. Edge Function deployed?
2. VITE_SUPABASE_URL configured in .env?
3. Browser console shows fetch call?

**Fix:**
```bash
# Redeploy Edge Function
supabase functions deploy notify-signup

# Or use MCP tool in Claude Code
```

### Issue: Duplicate notifications

**Cause:** Signup called multiple times (double-click, form re-submit)

**Prevention:**
- Button disabled during submission (already implemented)
- Debounce signup calls (already implemented in form)

**Acceptable:** FluentCRM updates existing contact (no duplicate)

## Cost Estimate

### Make.com Operations

Per signup: 3 operations
- FluentCRM: 1 operation
- Telegram: 1 operation
- Amazon SES: 1 operation

**Monthly estimates:**
- 100 signups/month = 300 operations (Free tier: 1,000)
- 500 signups/month = 1,500 operations (Pro tier: 10,000)

### Supabase Edge Functions

Free tier: 500,000 invocations/month

Per signup: 1 invocation

**Effectively free** for typical signup volumes.

### Amazon SES

Free tier: 2,000 emails/month

Per signup: 1 welcome email

**Cost after free tier:** $0.10 per 1,000 emails

## Success Metrics

### Key Indicators

1. **Signup Completion Rate**
   - Target: 100% (no failures due to webhook)
   - Monitor: Supabase Auth dashboard

2. **Webhook Delivery Rate**
   - Target: 99%+ (allowed to fail occasionally)
   - Monitor: Make.com execution history

3. **Email Delivery Rate**
   - Target: 95%+ (accounting for spam, bounces)
   - Monitor: Amazon SES dashboard

4. **CRM Capture Rate**
   - Target: 100% (all signups in FluentCRM)
   - Monitor: FluentCRM contact count vs. Supabase user count

### Alerts to Set Up

1. **Make.com scenario disabled** → Slack/email alert
2. **Webhook failure rate >5%** → Investigate
3. **SES bounce rate >5%** → Review email content
4. **Edge Function error rate >1%** → Check logs

## Summary

**What it does:**
- Captures every signup in FluentCRM automatically
- Notifies team via Telegram instantly
- Sends welcome email via Amazon SES
- Never blocks or breaks signup flow

**How it works:**
- auth.ts calls Edge Function after successful signup
- Edge Function forwards to Make.com webhook
- Make.com handles all downstream automation

**Why it's safe:**
- Completely non-blocking (fire-and-forget)
- Errors logged, never thrown
- User experience unchanged
- Can be disabled without breaking anything

**Next steps:**
1. Deploy notify-signup Edge Function
2. Test end-to-end with new signup
3. Monitor Make.com execution history
4. Verify FluentCRM contact created

---

**End of Documentation**
