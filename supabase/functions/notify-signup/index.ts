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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: SignupPayload = await req.json();

    const displayName = payload.display_name || payload.email.split("@")[0];
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const sendEmail = async () => {
      if (!resendApiKey) {
        console.warn("RESEND_API_KEY not configured — signup notification skipped");
        return;
      }
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Worktugal <noreply@worktugal.com>",
            to: ["hello@worktugal.com"],
            subject: `New signup: ${displayName} (${payload.email})`,
            html: `<p><strong>${displayName}</strong> just signed up on Worktugal.</p>
<ul>
  <li><strong>Email:</strong> ${payload.email}</li>
  <li><strong>User ID:</strong> ${payload.user_id}</li>
  <li><strong>Time:</strong> ${payload.created_at || new Date().toISOString()}</li>
</ul>`,
          }),
        });
        if (res.ok) {
          console.log("Resend notification delivered successfully");
        } else {
          console.error("Resend notification failed:", res.status, await res.text());
        }
      } catch (err) {
        console.error("Resend notification error:", err);
      }
    };

    // @ts-ignore: EdgeRuntime is available in Supabase environment
    if (typeof EdgeRuntime !== "undefined") {
      // @ts-ignore
      EdgeRuntime.waitUntil(sendEmail());
    } else {
      sendEmail().catch(err => console.error("Resend notification error (fallback):", err));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Signup notification queued",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in notify-signup function:", error);

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