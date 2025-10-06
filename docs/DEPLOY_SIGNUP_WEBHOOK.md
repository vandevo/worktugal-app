# Deploy Signup Webhook - Quick Start

## What You're Deploying

Automatic signup notification system that sends new user info to your Make.com webhook for CRM capture, Telegram alerts, and welcome emails.

## Prerequisites

- [x] Make.com webhook URL created: `https://hook.eu2.make.com/pueq1sw659ym23cr3fwe7huvhxk4nx9v`
- [x] Make.com scenario configured (FluentCRM, Telegram, Amazon SES)
- [x] Code changes made and built successfully
- [ ] Edge Function deployed (see below)

## Deployment Steps

### Step 1: Deploy Edge Function

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to Supabase Dashboard → Edge Functions
2. Click "Deploy new function"
3. Name: `notify-signup`
4. Copy contents of `supabase/functions/notify-signup/index.ts`
5. Paste into editor
6. Click "Deploy"
7. Verify deployment successful

**Option B: Using MCP Tool (If Available)**

In Claude Code interface, use the Supabase MCP tool:

```
Deploy Edge Function:
  name: notify-signup
  slug: notify-signup
  verify_jwt: false
  entrypoint_path: index.ts
```

The tool will automatically read the file and deploy it.

### Step 2: Verify Edge Function

Test the deployed function:

```bash
# Replace YOUR_PROJECT with your Supabase project ref
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/notify-signup \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-123",
    "email": "test@worktugal.com",
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

### Step 3: Check Make.com

1. Open your Make.com scenario
2. Go to "History" tab
3. You should see a new execution from the test above
4. Verify all modules ran successfully:
   - FluentCRM contact created
   - Telegram message sent
   - Amazon SES email sent (if test@worktugal.com is verified)

### Step 4: Deploy Frontend Changes

**Via Netlify (Automatic):**

1. Commit and push changes:
   ```bash
   git add .
   git commit -m "Add signup webhook integration"
   git push origin main
   ```

2. Netlify auto-deploys
3. Wait for build to complete
4. Verify deployment successful

**Manual Build (If Needed):**

```bash
npm run build
# Upload dist/ folder to hosting
```

### Step 5: End-to-End Test

1. **Clear browser cache and cookies**
2. **Go to your live site**
3. **Create a new test account:**
   - Email: Use a real email you can check
   - Password: Meet requirements (8+ chars, letter + number)
4. **Open browser DevTools → Console**
5. **Look for logs:**
   - `Sending signup notification to Make.com:`
   - Should NOT see any error messages
6. **Check deliverables:**
   - [ ] FluentCRM: New contact in Worktugal Members list
   - [ ] Telegram: Team notification received
   - [ ] Email: Welcome email in inbox

### Step 6: Monitor for 24 Hours

1. **Check Make.com execution history** daily
2. **Monitor Supabase Edge Function logs** for errors
3. **Verify all signups captured** in FluentCRM
4. **Respond to any failed executions** immediately

## Rollback Plan

If something breaks:

### Rollback Edge Function

**Option 1: Disable calling the function**

Add this to `src/lib/auth.ts` at top of `notifySignup()`:

```typescript
async function notifySignup(userId: string, email: string): Promise<void> {
  // TEMPORARY DISABLE
  return;

  // ... rest of function
}
```

Rebuild and redeploy frontend.

**Option 2: Delete Edge Function**

1. Go to Supabase Dashboard → Edge Functions
2. Find `notify-signup`
3. Click "..." → Delete
4. Calls will fail silently (already handled)

### Rollback Frontend

```bash
git revert HEAD
git push origin main
```

Netlify will auto-deploy previous version.

## Troubleshooting

### Issue: "Signup notification failed (non-critical)" in console

**Likely causes:**
- Edge Function not deployed yet
- Wrong Supabase URL
- Network timeout

**Fix:**
1. Verify Edge Function deployed
2. Check `VITE_SUPABASE_URL` in .env
3. Test Edge Function directly (see Step 2)

### Issue: Make.com scenario not triggering

**Check:**
1. Scenario is active (not paused)
2. Webhook URL correct in Edge Function
3. Make.com operations not exceeded (free tier: 1,000/month)

**Fix:**
- Activate scenario in Make.com
- Verify webhook URL matches
- Upgrade Make.com plan if needed

### Issue: FluentCRM contact not created

**Check:**
1. FluentCRM module configured in Make.com?
2. API credentials correct?
3. WordPress site accessible?

**Fix:**
- Test FluentCRM module independently
- Re-authenticate API connection
- Check WordPress site not blocking Make.com IPs

### Issue: Emails not delivering

**Check:**
1. Amazon SES sender verified? (hello@worktugal.com)
2. Recipient in sandbox allowlist? (if SES in sandbox)
3. Email in spam folder?

**Fix:**
- Verify sender domain in AWS SES
- Move SES out of sandbox mode
- Check SES bounce/complaint reports

## Success Criteria

All boxes checked:

- [ ] Edge Function deployed and responding
- [ ] Make.com scenario receiving webhooks
- [ ] Test signup completed successfully
- [ ] FluentCRM contact created
- [ ] Telegram notification received
- [ ] Welcome email delivered
- [ ] No errors in browser console
- [ ] No errors in Edge Function logs
- [ ] No failed Make.com executions
- [ ] User experience unchanged (signup still fast)

## Next Steps After Deployment

1. **Monitor daily** for first week
2. **Set up alerts** in Make.com for failed executions
3. **Review FluentCRM** weekly to ensure all signups captured
4. **Consider adding** more automation flows (accounting bookings, partner signups)
5. **Document any issues** and resolutions for team

## Environment Variables Reference

**Already configured (no changes needed):**

```bash
# In .env and Netlify
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
```

**Hardcoded in Edge Function:**

```typescript
// supabase/functions/notify-signup/index.ts
const MAKECOM_WEBHOOK_URL = "https://hook.eu2.make.com/pueq1sw659ym23cr3fwe7huvhxk4nx9v";
```

If webhook URL changes, redeploy Edge Function with new URL.

## Cost Impact

**Additional costs: $0**

- Supabase Edge Functions: Free tier (500K invocations/month)
- Make.com: Already using (3 operations per signup)
- Amazon SES: Already using (1 email per signup)

**Estimated usage:**
- 100 signups/month = 100 Edge Function calls + 300 Make.com operations
- Well within all free tiers

## Support

**Issues with deployment?**

1. Check [SIGNUP_WEBHOOK_INTEGRATION.md](./SIGNUP_WEBHOOK_INTEGRATION.md) for detailed documentation
2. Review Supabase Edge Function logs
3. Review Make.com execution history
4. Check browser console for errors

**Need help?**

Contact: hello@worktugal.com

---

**Deployment Date:** _____________

**Deployed By:** _____________

**Verified By:** _____________

**Notes:**

_____________________________________________________________

_____________________________________________________________

_____________________________________________________________
