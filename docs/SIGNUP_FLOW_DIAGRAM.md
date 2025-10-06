# Signup Webhook Flow Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER SIGNS UP                                │
│                    (SignupForm Component)                            │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    auth.ts: signUp()                                 │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 1. Create user in Supabase Auth                              │   │
│  │ 2. If successful, call notifySignup() (non-blocking)         │   │
│  │ 3. Return user data to frontend                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
└────────────────┬───────────────────────────────┬────────────────────┘
                 │                               │
                 │                               │ (fire-and-forget)
                 │                               │
                 ▼                               ▼
┌────────────────────────────┐   ┌────────────────────────────────────┐
│   User sees success        │   │   notifySignup() helper            │
│   Can log in immediately   │   │   ┌────────────────────────────┐   │
└────────────────────────────┘   │   │ POST to Edge Function      │   │
                                 │   │ /functions/v1/notify-signup│   │
                                 │   └──────────┬─────────────────┘   │
                                 └──────────────┼─────────────────────┘
                                                │
                                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│         Supabase Edge Function: notify-signup                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 1. Receive payload: { user_id, email, display_name, ... }   │   │
│  │ 2. Format for Make.com: { email, name, source, role, ... }  │   │
│  │ 3. POST to Make.com webhook URL                              │   │
│  │ 4. Return success (even if webhook fails)                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  Make.com Webhook Scenario                           │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Receives: { email, name, source, role, timestamp, user_id } │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌───────────────────┐  ┌───────────────────┐  ┌─────────────────┐ │
│  │  1. FluentCRM     │  │  2. Telegram Bot  │  │  3. Amazon SES  │ │
│  │  Add/Update       │  │  Team Notification│  │  Welcome Email  │ │
│  │  Contact          │  │                   │  │                 │ │
│  └────────┬──────────┘  └─────────┬─────────┘  └────────┬────────┘ │
└───────────┼──────────────────────┼────────────────────┼─────────────┘
            │                      │                    │
            ▼                      ▼                    ▼
┌─────────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  FluentCRM          │  │  Telegram Chat   │  │  User's Email    │
│  Worktugal Members  │  │  Team sees:      │  │  Inbox           │
│  New contact added  │  │  "New signup:    │  │  Welcome message │
│  Tagged: Registered │  │  John Doe        │  │  Login link      │
│  via Worktugal Site │  │  (john@email)"   │  │                  │
└─────────────────────┘  └──────────────────┘  └──────────────────┘
```

## Detailed Flow with Timing

```
Time    Component           Action                          Result
────────────────────────────────────────────────────────────────────────
0ms     User                Clicks "Create Account"         Form submits

50ms    SignupForm          Calls signUp(email, password)   Loading state

100ms   auth.ts             Calls Supabase Auth             Creates user

150ms   Supabase Auth       User created successfully       Returns user data

160ms   auth.ts             Calls notifySignup()            Fire-and-forget

170ms   auth.ts             Returns to SignupForm           User data

180ms   SignupForm          Shows success message           User can proceed

        ════════════════════════════════════════════════════════════════
        USER EXPERIENCE COMPLETE - Everything below is async
        ════════════════════════════════════════════════════════════════

200ms   notifySignup()      POST to Edge Function           Request sent

300ms   Edge Function       Receives request                Validates payload

350ms   Edge Function       POST to Make.com webhook        Forwards data

500ms   Make.com            Receives webhook                Scenario starts

600ms   Make.com            Calls FluentCRM API             Contact created

700ms   Make.com            Calls Telegram Bot API          Message sent

800ms   Make.com            Calls Amazon SES API            Email queued

1000ms  FluentCRM           Contact saved                   Visible in CRM

1100ms  Telegram            Message delivered               Team notified

2000ms  Amazon SES          Email delivered                 User receives email
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Error Scenarios                                   │
└─────────────────────────────────────────────────────────────────────┘

Scenario A: Edge Function Fails
────────────────────────────────────
auth.ts → Edge Function (timeout/404)
   │
   └─→ .catch() → console.warn()
           │
           └─→ Signup completes normally
               User sees success message
               No notification sent


Scenario B: Make.com Webhook Fails
────────────────────────────────────
Edge Function → Make.com (500 error)
   │
   └─→ Logs error, returns success anyway
           │
           └─→ auth.ts receives success
               Signup completes normally
               No notification sent


Scenario C: FluentCRM API Fails
────────────────────────────────────
Make.com → FluentCRM (API error)
   │
   ├─→ FluentCRM: Failed
   ├─→ Telegram: Success ✓
   └─→ Amazon SES: Success ✓
       │
       └─→ Partial success
           Manual CRM entry needed


Scenario D: All Services Fail
────────────────────────────────────
Multiple failures in chain
   │
   └─→ Signup still completes
       User can log in
       Team manually captures lead
```

## Data Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│  Stage 1: Frontend                                                   │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ Input:                                                          │  │
│  │   email: "john@example.com"                                     │  │
│  │   password: "SecurePass123"                                     │  │
│  │                                                                 │  │
│  │ Output (from Supabase Auth):                                    │  │
│  │   user: {                                                       │  │
│  │     id: "uuid-abc-123",                                         │  │
│  │     email: "john@example.com",                                  │  │
│  │     created_at: "2025-10-04T23:41:51.000Z"                      │  │
│  │   }                                                             │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│  Stage 2: Edge Function Input                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ POST /functions/v1/notify-signup                                │  │
│  │ {                                                               │  │
│  │   "user_id": "uuid-abc-123",                                    │  │
│  │   "email": "john@example.com",                                  │  │
│  │   "display_name": "john",                                       │  │
│  │   "created_at": "2025-10-04T23:41:51.000Z"                      │  │
│  │ }                                                               │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│  Stage 3: Make.com Webhook Input                                     │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ POST https://hook.eu2.make.com/pueq1sw659ym23cr3fwe7huvhxk4nx9v│  │
│  │ {                                                               │  │
│  │   "email": "john@example.com",                                  │  │
│  │   "name": "john",                                               │  │
│  │   "source": "site_signup",                                      │  │
│  │   "role": "user",                                               │  │
│  │   "timestamp": "2025-10-04T23:41:51.000Z",                      │  │
│  │   "user_id": "uuid-abc-123"                                     │  │
│  │ }                                                               │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
                    ▼           ▼           ▼
        ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
        │ FluentCRM   │ │ Telegram    │ │ Amazon SES  │
        ├─────────────┤ ├─────────────┤ ├─────────────┤
        │ email: {{}} │ │ chat_id     │ │ to: {{email}}│
        │ name: {{}}  │ │ message: {} │ │ from: hello@ │
        │ list: WM    │ │             │ │ subject: {} │
        │ tag: Reg    │ │             │ │ body: {}    │
        └─────────────┘ └─────────────┘ └─────────────┘
```

## Security & Privacy

```
┌─────────────────────────────────────────────────────────────────────┐
│  What Data is Sent                                                   │
│  ───────────────────                                                 │
│                                                                      │
│  ✓ Email address (required for CRM)                                 │
│  ✓ Display name (derived from email)                                │
│  ✓ User ID (Supabase UUID)                                          │
│  ✓ Timestamp (signup time)                                          │
│  ✓ Source ("site_signup")                                           │
│  ✓ Role ("user")                                                    │
│                                                                      │
│  ✗ Password (NEVER sent)                                            │
│  ✗ Payment info (NEVER sent)                                        │
│  ✗ Subscription data (NEVER sent)                                   │
│  ✗ Profile details (NEVER sent)                                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Data Storage Locations                                              │
│  ──────────────────────                                              │
│                                                                      │
│  1. Supabase Auth (auth.users)                                      │
│     └─ Email, encrypted password, metadata                          │
│                                                                      │
│  2. Supabase Database (user_profiles)                               │
│     └─ User ID, email, profile data                                 │
│                                                                      │
│  3. FluentCRM (WordPress)                                           │
│     └─ Email, name, tags, custom fields                             │
│                                                                      │
│  4. Make.com Logs (30 days)                                         │
│     └─ Execution history with payload data                          │
│                                                                      │
│  5. Supabase Edge Function Logs (7 days)                            │
│     └─ Request/response logs                                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Performance Impact

```
┌─────────────────────────────────────────────────────────────────────┐
│  Signup Time Comparison                                              │
└─────────────────────────────────────────────────────────────────────┘

WITHOUT Webhook Integration:
────────────────────────────
User clicks submit  →  Auth creates user  →  Success shown
0ms                    150ms                 180ms

Total: 180ms


WITH Webhook Integration:
─────────────────────────
User clicks submit  →  Auth creates user  →  notifySignup()  →  Success shown
0ms                    150ms                 160ms              180ms
                                                │
                                                └─→ (async, non-blocking)

Total: 180ms (same!)

Background processes continue:
180ms → Edge Function called
300ms → Make.com webhook triggered
1000ms → FluentCRM contact created
2000ms → Email delivered

Impact on user: ZERO
User sees success immediately at 180ms
All automation happens in background
```

---

**Legend:**

- `→` : Synchronous flow (blocks)
- `┐` : Asynchronous fork (non-blocking)
- `✓` : Success
- `✗` : Not included
- `════` : User-facing boundary
