# Make.com Contact Form Automation Setup Guide

## Overview
This guide documents the complete Make.com scenario setup for the Worktugal contact form automation, focusing initially on Partnership inquiries.

**Webhook URL:** `https://hook.eu2.make.com/fkdvvlsh9bc2k7fbi5ikfzysdizckt3e`

**Environment Variable:** `VITE_MAKECOM_WEBHOOK_URL`

---

## Airtable Setup

### 1. Create Airtable Base

**Base Name:** Worktugal Contacts
**Table Name:** Partnership Inquiries

### 2. Column Structure

Import the CSV template from `docs/CONTACT_FORM_AIRTABLE_STRUCTURE.csv` or create these columns manually:

| Column Name | Field Type | Options/Format | Notes |
|-------------|------------|----------------|-------|
| id | Single line text | - | Primary field, UUID from Supabase |
| created_at | Date | Include time, GMT | Submission timestamp |
| purpose | Single select | accounting, partnership, job, info, other | Contact purpose |
| full_name | Single line text | - | Contact's full name |
| email | Email | - | Contact's email address |
| company_name | Single line text | - | Optional, for partnerships/accounting |
| website_url | URL | - | Optional, company or LinkedIn URL |
| message | Long text | - | Main inquiry message |
| budget_range | Single select | 200-499, 500-999, 1000+, not_yet, exploring | Partnership only |
| timeline | Single select | this_month, 3_months, later, flexible | Partnership only |
| status | Single select | new, reviewed, replied, converted, archived | Default: new |
| priority | Single select | high, normal, low | Auto-calculated by webhook |
| notes | Long text | - | Internal admin notes |
| webhook_sent | Checkbox | - | Always true from webhook |
| webhook_sent_at | Date | Include time, GMT | When webhook sent |
| replied_at | Date | Include time, GMT | When admin replied |

### 3. Views to Create

- **All Partnerships** - Filter: purpose = "partnership"
- **High Priority** - Filter: priority = "high" AND status = "new"
- **This Month** - Filter: created_at is within "this month"
- **Need Reply** - Filter: status = "new" OR status = "reviewed", replied_at is empty

---

## Make.com Scenario Configuration

### Module 1: Webhook Trigger

**Module:** Webhooks > Custom webhook
**Webhook Name:** [bolt.new] app contact form
**Webhook URL:** `https://hook.eu2.make.com/fkdvvlsh9bc2k7fbi5ikfzysdizckt3e`

**Action:** Click "Run once" then submit a test form to initialize data structure

**Expected Data Structure:**
```json
{
  "id": "uuid",
  "purpose": "partnership",
  "full_name": "John Doe",
  "email": "john@example.com",
  "company_name": "Example Co",
  "website_url": "https://example.com",
  "message": "Partnership inquiry message",
  "budget_range": "1000+",
  "timeline": "this_month",
  "priority": "high",
  "created_at": "2025-11-01T15:30:00.000Z"
}
```

---

### Module 2: Router

**Module:** Flow control > Router

**Routes:**

#### Route 1: Partnership Inquiries
- **Label:** Partnership
- **Filter:** `purpose` equals `partnership`
- **Continue processing:** Yes

#### Route 2: Accounting Inquiries (Future)
- **Label:** Accounting
- **Filter:** `purpose` equals `accounting`
- **Status:** Disabled for now

#### Route 3: Other Inquiries (Future)
- **Label:** Other
- **Filter:** `purpose` NOT equals `partnership` AND NOT equals `accounting`
- **Status:** Disabled for now

---

### Module 3: Airtable - Create Record

**Module:** Airtable > Create a Record
**Connection:** Your Airtable account
**Base:** Worktugal Contacts
**Table:** Partnership Inquiries

**Field Mappings:**

| Airtable Field | Make.com Value | Notes |
|----------------|----------------|-------|
| id | `{{1.id}}` | UUID from webhook |
| created_at | `{{1.created_at}}` | ISO timestamp |
| purpose | `{{1.purpose}}` | Should be "partnership" |
| full_name | `{{1.full_name}}` | - |
| email | `{{1.email}}` | - |
| company_name | `{{1.company_name}}` | May be empty |
| website_url | `{{1.website_url}}` | May be empty |
| message | `{{1.message}}` | - |
| budget_range | `{{1.budget_range}}` | - |
| timeline | `{{1.timeline}}` | - |
| status | `new` | Hardcoded default |
| priority | `{{1.priority}}` | Calculated by frontend |
| notes | - | Leave empty |
| webhook_sent | `true` | Hardcoded |
| webhook_sent_at | `{{now}}` | Current timestamp |
| replied_at | - | Leave empty |

**Error Handler:** Continue execution on error

---

### Module 4: Amazon SES - User Confirmation Email

**Module:** Amazon SES > Send Email
**Connection:** Your Amazon SES account
**Region:** Select your SES region

**Email Configuration:**

- **To:** `{{1.email}}`
- **From:** `hello@worktugal.com` (verify sender in SES)
- **Subject:** `Thanks for reaching out to Worktugal - Partnership Inquiry Received`
- **Body Type:** HTML
- **HTML Body:** See template below

**Error Handler:** Ignore error (non-critical)

---

### Module 5: Amazon SES - Admin Notification Email

**Module:** Amazon SES > Send Email
**Connection:** Your Amazon SES account
**Region:** Select your SES region

**Email Configuration:**

- **To:** `admin@worktugal.com` (your admin email)
- **From:** `noreply@worktugal.com` (verify sender in SES)
- **Subject:** `🔔 NEW Partnership Inquiry - {{1.priority}} Priority - {{1.company_name}}`
- **Body Type:** HTML
- **HTML Body:** See template below

**Error Handler:** Rollback (critical notification)

---

### Module 6: Telegram Bot - Send Notification

**Module:** Telegram Bot > Send a Text Message or a Reply
**Connection:** Your Worktugal Telegram Bot
**Chat ID:** Your Telegram chat ID

**Message Text:**
```
{{if(1.priority = "high"; "🔴"; if(1.priority = "normal"; "🟡"; "🟢"))}} NEW Partnership Inquiry

👤 Name: {{1.full_name}}
🏢 Company: {{1.company_name}}
💰 Budget: {{1.budget_range}}
📅 Timeline: {{1.timeline}}
⚡ Priority: {{upper(1.priority)}}

📝 Message: {{if(length(1.message) > 100; substring(1.message; 1; 100) + "..."; 1.message)}}

📧 Email: {{1.email}}
🌐 Website: {{1.website_url}}

🔗 View in Airtable: [Record ID: {{3.id}}]
```

**Parse Mode:** Markdown (optional)
**Error Handler:** Ignore error (non-critical)

---

### Module 7: FluentCRM - Create or Update Contact

**Module:** FluentCRM > Create or Update Contact
**Connection:** Your FluentCRM/WordPress connection

**Field Mappings:**

- **Email:** `{{1.email}}` (primary identifier)
- **First Name:** `{{first(split(1.full_name; " "))}}` (extract first word)
- **Last Name:** `{{last(split(1.full_name; " "))}}` (extract last word)
- **Status:** `subscribed`

**Tags to Add:**
- `Partnership Inquiry`
- `Contact Form 2025`
- `Budget: {{1.budget_range}}` (dynamic tag)
- `Timeline: {{1.timeline}}` (dynamic tag)
- `Priority: {{1.priority}}` (dynamic tag)

**Custom Fields:**
- `company` → `{{1.company_name}}`
- `website` → `{{1.website_url}}`
- `inquiry_date` → `{{1.created_at}}`
- `budget_range` → `{{1.budget_range}}`
- `timeline` → `{{1.timeline}}`
- `priority` → `{{1.priority}}`

**Lists to Add:** `Partnership Leads`

**Error Handler:** Ignore error (non-critical)

---

## Email Templates

### User Confirmation Email (HTML)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Partnership Inquiry Received</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Thanks for reaching out! 🤝</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi <strong>{{1.full_name}}</strong>,</p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      We've received your partnership inquiry and we're excited to explore collaboration opportunities with <strong>{{1.company_name}}</strong>!
    </p>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
      <h3 style="margin-top: 0; color: #1e3a8a;">What happens next?</h3>
      <ul style="padding-left: 20px;">
        <li>Our team will review your proposal within <strong>2-3 business days</strong></li>
        <li>We'll reach out via email to schedule a discovery call</li>
        <li>Together, we'll explore how we can create value for both communities</li>
      </ul>
    </div>

    <p style="font-size: 16px; margin-bottom: 20px;">
      At Worktugal, we collaborate with brands, communities, and content creators who share our mission of supporting expats and digital nomads in Portugal.
    </p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      <strong>Popular collaboration types:</strong><br>
      🎉 Events & Meetups<br>
      📝 Content Marketing & Guest Posts<br>
      💼 Sponsorships & Brand Partnerships<br>
      🎁 Community Perks & Exclusive Offers
    </p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      In the meantime, feel free to browse our <a href="https://worktugal.com" style="color: #3b82f6; text-decoration: none;">free guides</a> and <a href="https://worktugal.com/partners" style="color: #3b82f6; text-decoration: none;">current partners</a>.
    </p>

    <p style="font-size: 16px;">
      Looking forward to connecting!<br>
      <strong>The Worktugal Team</strong>
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

    <p style="font-size: 14px; color: #6b7280; text-align: center;">
      📧 <a href="mailto:hello@worktugal.com" style="color: #3b82f6; text-decoration: none;">hello@worktugal.com</a><br>
      🌐 <a href="https://worktugal.com" style="color: #3b82f6; text-decoration: none;">worktugal.com</a>
    </p>
  </div>

</body>
</html>
```

---

### Admin Notification Email (HTML)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Partnership Inquiry</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="background: {{if(1.priority = 'high'; '#dc2626'; if(1.priority = 'normal'; '#f59e0b'; '#10b981'))}}; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 22px;">
      {{if(1.priority = 'high'; '🔴 HIGH'; if(1.priority = 'normal'; '🟡 NORMAL'; '🟢 LOW'))}} PRIORITY
    </h1>
    <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">New Partnership Inquiry</p>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">

    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="margin-top: 0; color: #1e3a8a; font-size: 18px;">Contact Information</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
          <td style="padding: 8px 0;">{{1.full_name}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:{{1.email}}" style="color: #3b82f6;">{{1.email}}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Company:</td>
          <td style="padding: 8px 0;">{{1.company_name}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Website:</td>
          <td style="padding: 8px 0;"><a href="{{1.website_url}}" style="color: #3b82f6;" target="_blank">{{1.website_url}}</a></td>
        </tr>
      </table>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="margin-top: 0; color: #1e3a8a; font-size: 18px;">Partnership Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 120px;">Budget Range:</td>
          <td style="padding: 8px 0;">
            {{if(1.budget_range = '1000+'; '💰💰💰 €1,000+';
               if(1.budget_range = '500-999'; '💰💰 €500-€999';
               if(1.budget_range = '200-499'; '💰 €200-€499';
               if(1.budget_range = 'not_yet'; '🤔 Not yet decided';
               '🔍 Exploring options'))))}}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Timeline:</td>
          <td style="padding: 8px 0;">
            {{if(1.timeline = 'this_month'; '⚡ This month (URGENT)';
               if(1.timeline = '3_months'; '📅 Within 3 months';
               if(1.timeline = 'later'; '⏰ Later / Flexible';
               '🔄 Flexible')))}}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Priority:</td>
          <td style="padding: 8px 0;">
            <span style="padding: 4px 12px; border-radius: 4px; background: {{if(1.priority = 'high'; '#fee2e2'; if(1.priority = 'normal'; '#fef3c7'; '#d1fae5'))}}; color: {{if(1.priority = 'high'; '#991b1b'; if(1.priority = 'normal'; '#92400e'; '#065f46'))}}; font-weight: bold;">
              {{upper(1.priority)}}
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Submitted:</td>
          <td style="padding: 8px 0;">{{formatDate(1.created_at; "MMM DD, YYYY [at] HH:mm")}}</td>
        </tr>
      </table>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="margin-top: 0; color: #1e3a8a; font-size: 18px;">Their Message</h2>
      <p style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 3px solid #3b82f6;">{{1.message}}</p>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://airtable.com/YOUR_BASE_ID/YOUR_TABLE_ID" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">
        📊 View in Airtable
      </a>
      <a href="https://jbmfneyofhqlwnnfuqbd.supabase.co/project/jbmfneyofhqlwnnfuqbd/editor" style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        🗄️ View in Supabase
      </a>
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

    <p style="font-size: 13px; color: #6b7280; text-align: center;">
      🤖 This is an automated notification from the Worktugal Contact Form<br>
      Webhook ID: {{1.id}}
    </p>
  </div>

</body>
</html>
```

---

## Testing Procedure

### 1. Submit Test Partnership Form

Navigate to: `https://worktugal.com/contact`

**Test Data:**
- Purpose: Partnership or Collaboration
- Full Name: Test Partner
- Email: your-test-email@gmail.com
- Company: Test Company Inc
- Website: https://example.com
- Message: "We want to collaborate on content marketing and events in Lisbon. We have a strong community of digital nomads."
- Budget: €1,000+
- Timeline: This month

### 2. Verify Webhook Receipt

- Go to Make.com scenario
- Check execution history
- Verify all webhook data was received correctly
- Confirm all fields populated

### 3. Check Airtable

- Open Airtable base "Worktugal Contacts"
- Open table "Partnership Inquiries"
- Verify new record created with:
  - All contact fields populated
  - Priority set to "high" (due to budget 1000+ and timeline this_month)
  - Status set to "new"
  - webhook_sent checked
  - webhook_sent_at timestamp present

### 4. Check User Email

- Check test email inbox
- Verify confirmation email received
- Check subject line, personalization, formatting
- Test all links work
- Verify mobile rendering

### 5. Check Admin Email

- Check admin email inbox
- Verify notification email received
- Confirm priority indicator shows "HIGH PRIORITY"
- Verify all contact details present
- Test Airtable and Supabase links work

### 6. Check Telegram

- Open Telegram app
- Check Worktugal bot chat
- Verify mobile notification received
- Confirm emoji priority indicator (🔴 for high)
- Check all key details visible

### 7. Check FluentCRM

- Log into WordPress/FluentCRM
- Go to Contacts
- Search for test email
- Verify contact created/updated with:
  - Correct name split (first/last)
  - All tags applied correctly
  - Custom fields populated
  - Added to "Partnership Leads" list
  - Status = subscribed

### 8. Test Different Scenarios

Repeat tests with:
- Budget: €200-€499 (should be normal priority)
- Budget: Not yet decided (should be low priority)
- Timeline: Later/Flexible (affects priority)
- Missing optional fields (company, website)

---

## Troubleshooting

### Webhook Not Receiving Data

1. Check `.env` file has correct webhook URL
2. Verify environment variable name: `VITE_MAKECOM_WEBHOOK_URL`
3. Restart dev server after changing .env
4. Check browser console for fetch errors
5. Verify webhook URL in Make.com hasn't changed

### Airtable Record Not Created

1. Check Airtable connection in Make.com
2. Verify base and table names are correct
3. Check field mappings match column names exactly
4. Review Make.com execution history for errors
5. Check Airtable field types match data types

### Emails Not Sending

1. Verify Amazon SES connection active
2. Check sender email addresses are verified in SES
3. Check SES region matches your account
4. Review SES sending limits (sandbox vs production)
5. Check Make.com execution history for SES errors
6. Verify email templates don't have HTML errors

### Telegram Not Sending

1. Verify Telegram bot token is correct
2. Check chat ID is correct (use @userinfobot to get ID)
3. Ensure bot has permission to message the chat
4. Check message length isn't exceeding Telegram limits
5. Review Make.com execution for Telegram module errors

### FluentCRM Not Creating Contact

1. Verify FluentCRM API connection
2. Check WordPress site is accessible
3. Verify custom field names match FluentCRM setup
4. Check list "Partnership Leads" exists
5. Review Make.com execution for FluentCRM errors

---

## Future Enhancements

### Phase 2: Other Contact Types

1. Clone this scenario
2. Update Router filters for "accounting", "info", "other"
3. Create separate Airtable tables or use filtering
4. Customize email templates for each type
5. Adjust FluentCRM tags per inquiry type
6. Update Telegram messages for context

### Phase 3: Advanced Features

- Add SMS notifications for high-priority leads
- Implement auto-reply sequences in FluentCRM
- Create Slack integration for team notifications
- Build dashboard showing conversion rates
- Add AI sentiment analysis on messages
- Implement lead scoring based on engagement

---

## Support & Resources

- **Make.com Documentation:** https://www.make.com/en/help
- **Airtable API Docs:** https://airtable.com/developers/web/api/introduction
- **Amazon SES Guide:** https://docs.aws.amazon.com/ses/
- **Telegram Bot API:** https://core.telegram.org/bots/api
- **FluentCRM Docs:** https://fluentcrm.com/docs/

---

**Document Version:** 1.0
**Last Updated:** November 1, 2025
**Author:** Worktugal Dev Team
