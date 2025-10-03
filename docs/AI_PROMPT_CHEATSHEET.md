# AI Assistant Prompt Cheatsheet
**Quick reference for giving instructions to AI assistants**

---

## 🚀 FOR ADDING FORMS WITH DATABASE INTEGRATION

```
Add a [form name] that saves to Supabase and triggers Make.com webhook.

MANDATORY REQUIREMENTS:

✅ Architecture:
- Create Edge Function to handle submission (NOT direct Supabase from browser)
- Frontend calls Edge Function endpoint
- Edge Function uses service role key for database access

✅ Edge Function Settings:
- Set verify_jwt: false (this is a public form)
- Include CORS headers in ALL responses including errors
- Handle OPTIONS requests for preflight
- Add comprehensive console.log statements

✅ Error Handling:
- Validate all required fields
- Return proper error responses with CORS headers
- Wrap webhook calls in try-catch (don't fail on webhook errors)
- Only trigger webhook AFTER successful database insert

✅ Testing:
- Test database access via MCP tools first
- Deploy Edge Function and verify ACTIVE status
- Rebuild project: npm run build
- Submit form and check browser console
- Verify database populated via MCP query
- Check Make.com execution logs

✅ Reference:
Follow pattern in: /docs/AI_INTEGRATION_MASTER_GUIDE.md
Use template: /supabase/functions/submit-lead/index.ts
```

---

## ⚠️ NEGATIVE PROMPTS - NEVER DO THIS

```
DO NOT:
❌ Use direct Supabase client calls from browser for data mutations
❌ Set verify_jwt: true on public forms
❌ Forget CORS headers
❌ Skip OPTIONS request handling
❌ Hardcode service role keys in frontend
❌ Fail form submission if webhook fails
❌ Deploy without testing in browser first
❌ Skip rebuilding project after code changes
❌ Assume database access works without testing via MCP
```

---

## 🔧 FOR DEBUGGING ISSUES

```
The form isn't working. Debug this:

1. Check browser console - paste the full error
2. List Edge Functions via MCP - is it deployed and active?
3. Check verify_jwt setting - should be false for public forms
4. Test database directly via MCP: SELECT * FROM [table] LIMIT 5;
5. Check Edge Function logs in Supabase dashboard
6. Verify Make.com scenario is active
7. Test webhook URL manually with curl

Read: /docs/AI_INTEGRATION_MASTER_GUIDE.md section "Quick Troubleshooting"
```

---

## 📋 QUICK COPY/PASTE TEMPLATES

### For Edge Function Deployment
```
Deploy Edge Function:
- Name: [function-name]
- Slug: [function-name]
- verify_jwt: false
- Include CORS headers
- Use service role key for database
- Add console.log at: receive, validate, insert, webhook, return
- Handle OPTIONS requests
- Wrap webhooks in try-catch
```

### For Frontend Integration
```
Update frontend to call Edge Function:
- URL: ${import.meta.env.VITE_SUPABASE_URL}/functions/v1/[function-name]
- Method: POST
- Headers: Content-Type: application/json
- Body: JSON.stringify(formData)
- Handle response errors properly
- Show success page on result.success === true
```

### For Database Testing
```
Test database before integration:
1. SELECT * FROM [table] LIMIT 1;
2. INSERT INTO [table] (field1, field2) VALUES ('test', 'data') RETURNING *;
3. DELETE FROM [table] WHERE field1 = 'test';
```

---

## 🎯 ONE-LINER FOR COMMON TASKS

**Add waitlist form:**
```
Add waitlist form following /docs/AI_INTEGRATION_MASTER_GUIDE.md - Edge Function with verify_jwt: false, full CORS, webhook to Make.com after DB insert
```

**Add contact form:**
```
Add contact form following Edge Function pattern in /docs/AI_INTEGRATION_MASTER_GUIDE.md - public access, CORS headers, Make.com integration
```

**Debug broken form:**
```
Form not working - follow troubleshooting in /docs/AI_INTEGRATION_MASTER_GUIDE.md - check browser console, Edge Function status, database access, webhook logs
```

**Add authentication-required form:**
```
Add [form] following Edge Function pattern but with verify_jwt: true - requires user login, passes JWT token in Authorization header
```

---

## 📱 ALWAYS MENTION THESE FILES

When asking AI to work on integrations, reference:

- `/docs/AI_INTEGRATION_MASTER_GUIDE.md` - Complete guide
- `/supabase/functions/submit-lead/index.ts` - Working example
- `/src/lib/leads.ts` - Frontend integration example

---

## 🎓 TEACHING AI ASSISTANTS

If AI makes a mistake, correct with:

```
This won't work in our environment because [reason].

Instead, follow the pattern in /docs/AI_INTEGRATION_MASTER_GUIDE.md:
1. [Correct step 1]
2. [Correct step 2]
3. [Correct step 3]

Reference working example: /supabase/functions/submit-lead/index.ts
```

---

## 💡 SUCCESS PATTERNS

**What works well:**
- Edge Functions for all database mutations from public forms
- Service role keys in Edge Functions only
- Comprehensive logging
- Webhook AFTER database insert
- Testing via MCP before frontend integration
- Always rebuilding after changes

**What doesn't work:**
- Direct Supabase from browser in dev environment
- JWT verification on public forms
- Missing CORS headers
- Webhooks that block form submission
- Skipping rebuild step
- Assuming things work without testing

---

## 🚨 EMERGENCY QUICK FIX

Form suddenly broken? Try this sequence:

```bash
1. Check if Edge Function is deployed:
   mcp__supabase__list_edge_functions

2. Redeploy with correct settings:
   verify_jwt: false for public forms

3. Rebuild frontend:
   npm run build

4. Test in browser and check console

5. Verify database:
   SELECT * FROM [table] ORDER BY created_at DESC LIMIT 5;
```

---

**Keep this file handy when working with AI on integrations!**
