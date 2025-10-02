# Stripe Setup for Accounting Desk Services

## Overview

This guide provides step-by-step instructions for creating Stripe products and prices for the Worktugal Accounting Desk consultation services.

## Required Products

You need to create 3 products in your Stripe Dashboard:

### 1. Tax Triage Consult
- **Name**: Tax Triage Consult
- **Price**: €59
- **Type**: One-time payment
- **Description**: 30-minute tax clarity consultation with written outcome note

### 2. Freelancer Start Pack
- **Name**: Freelancer Start Pack
- **Price**: €349
- **Type**: One-time payment
- **Description**: Complete 90-minute freelancer setup: activity opening, VAT decision, eFatura configuration

### 3. Annual Return Consult
- **Name**: Annual Return Consult
- **Price**: €149
- **Type**: One-time payment
- **Description**: 60-minute annual tax review with €149 credit toward filing

## Step-by-Step Instructions

### Step 1: Access Stripe Dashboard

1. Log in to your Stripe Dashboard: https://dashboard.stripe.com
2. Navigate to **Products** in the left sidebar
3. Click **+ Add Product**

### Step 2: Create Tax Triage Consult Product

1. **Product Information:**
   - Name: `Tax Triage Consult`
   - Description: `30-minute video or phone consultation to get quick clarity on your immediate tax question. Written outcome note delivered within 48 hours. Includes activity code guidance, VAT decision clarity, and next steps checklist.`
   - Upload an image (optional but recommended)

2. **Pricing:**
   - Click **+ Add another price**
   - Model: One time
   - Price: `59.00`
   - Currency: `EUR`
   - Leave Tax Code as default
   - Click **Add price**

3. **Save** the product

4. **Copy the Price ID:**
   - Click on the price you just created
   - Copy the Price ID (starts with `price_`)
   - Save this as `VITE_STRIPE_PRICE_TRIAGE` in your `.env` file

### Step 3: Create Freelancer Start Pack Product

1. **Product Information:**
   - Name: `Freelancer Start Pack`
   - Description: `Complete 90-minute setup consultation for freelancers in Portugal. Includes activity opening guidance, VAT regime decision support, eFatura setup walkthrough, quarterly filing calendar, written setup report, and 60 days email support.`
   - Upload an image (optional)

2. **Pricing:**
   - Click **+ Add another price**
   - Model: One time
   - Price: `349.00`
   - Currency: `EUR`
   - Click **Add price**

3. **Save** the product

4. **Copy the Price ID:**
   - Click on the price
   - Copy the Price ID (starts with `price_`)
   - Save this as `VITE_STRIPE_PRICE_START_PACK` in your `.env` file

### Step 4: Create Annual Return Consult Product

1. **Product Information:**
   - Name: `Annual Return Consult`
   - Description: `60-minute annual tax situation review with deduction optimization and filing deadline guidance. Includes €149 credit toward filing if you book with us, written recommendations, IRS Form 3 overview, and social security guidance.`
   - Upload an image (optional)

2. **Pricing:**
   - Click **+ Add another price**
   - Model: One time
   - Price: `149.00`
   - Currency: `EUR`
   - Click **Add price**

3. **Save** the product

4. **Copy the Price ID:**
   - Click on the price
   - Copy the Price ID (starts with `price_`)
   - Save this as `VITE_STRIPE_PRICE_ANNUAL_RETURN` in your `.env` file

### Step 5: Update Environment Variables

Add all three price IDs to your `.env` file:

```bash
# Stripe Price IDs (Accounting Desk Services)
VITE_STRIPE_PRICE_TRIAGE=price_1234567890abc
VITE_STRIPE_PRICE_START_PACK=price_1234567890def
VITE_STRIPE_PRICE_ANNUAL_RETURN=price_1234567890ghi
```

### Step 6: Verify Webhook Configuration

Ensure your Stripe webhook endpoint is configured to receive events for these products:

1. Go to **Developers > Webhooks** in Stripe Dashboard
2. Find your webhook endpoint (should be: `https://your-project.supabase.co/functions/v1/stripe-webhook`)
3. Ensure these events are enabled:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.expired`

### Step 7: Test the Integration

Use Stripe's test mode to verify:

1. Switch to **Test mode** in Stripe Dashboard
2. Create test price IDs following the same process above
3. Update `.env` with test price IDs
4. Book a consultation on your site
5. Use test card: `4242 4242 4242 4242`
6. Verify the payment completes and booking status updates

## Test Cards

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0027 6000 3184

Any future date for expiry, any 3 digits for CVC, any postal code.

## Production Deployment

When moving to production:

1. Switch Stripe Dashboard to **Live mode**
2. Create the same 3 products in Live mode
3. Copy the **Live** price IDs
4. Update your production `.env` file (or Netlify environment variables)
5. Restart your application
6. Test with a small real payment first

## Troubleshooting

### Price ID not found error
- Verify the price ID is copied correctly (starts with `price_`)
- Ensure you're using test price IDs in test mode and live price IDs in live mode
- Check that the environment variables are set correctly in your hosting platform

### Webhook not firing
- Verify webhook URL is correct in Stripe Dashboard
- Check webhook signing secret matches `STRIPE_WEBHOOK_SECRET` in `.env`
- Review webhook logs in Stripe Dashboard > Developers > Webhooks > [Your Endpoint]

### Payment succeeds but booking not updating
- Check Supabase Edge Function logs for the `stripe-webhook` function
- Verify RLS policies on `partner_submissions` table allow updates
- Ensure `submission_type='consult'` filter is working correctly

## Support

For issues with Stripe setup:
- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com

For issues with the integration:
- Check Supabase function logs
- Review browser console errors
- Contact support@worktugal.com
