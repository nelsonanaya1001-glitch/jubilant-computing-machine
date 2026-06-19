// Sends an email alert to the agency admin when something needs attention
// (a new project submission or a new client message).
//
// Uses Resend (https://resend.com) when configured. To enable, set these env vars:
//   RESEND_API_KEY  — your Resend API key
//   ADMIN_EMAIL     — where alerts should be delivered (e.g. you@youremail.com)
//   NOTIFY_FROM     — optional verified sender, defaults to Resend's test sender
//
// If those aren't set, it simply logs to the server console and never throws,
// so it can never break a submission or message.
export async function notifyAdmin(subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_EMAIL;

  if (!apiKey || !to) {
    console.log(`[notify] ${subject} (email not configured — set RESEND_API_KEY + ADMIN_EMAIL)`);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM || "Launchboard <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      console.error("[notify] Resend responded", res.status, await res.text());
    }
  } catch (err) {
    console.error("[notify] failed to send", err);
  }
}
