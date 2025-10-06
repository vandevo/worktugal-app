import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SignupPayload {
  user_id: string;
  email: string;
  display_name?: string;
  created_at: string;
}

const MAKECOM_WEBHOOK_URL = "https://hook.eu2.make.com/pueq1sw659ym23cr3fwe7huvhxk4nx9v";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: SignupPayload = await req.json();

    // Extract display name from email if not provided
    const displayName = payload.display_name || payload.email.split("@")[0];

    // Prepare webhook payload for Make.com
    const webhookPayload = {
      email: payload.email,
      name: displayName,
      source: "site_signup",
      role: "user",
      timestamp: payload.created_at || new Date().toISOString(),
      user_id: payload.user_id,
    };

    console.log("Sending signup notification to Make.com:", webhookPayload);

    // Send to Make.com webhook
    const response = await fetch(MAKECOM_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Make.com webhook failed:", response.status, errorText);

      // Don't throw - just log and return success
      // We don't want to block signup if webhook fails
      return new Response(
        JSON.stringify({
          success: true,
          warning: "Webhook delivery failed but user was created successfully",
          status: response.status,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Make.com webhook delivered successfully");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Signup notification sent",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in notify-signup function:", error);

    // Return success even on error - we don't want to break signup
    return new Response(
      JSON.stringify({
        success: true,
        warning: "Notification failed but signup completed",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
