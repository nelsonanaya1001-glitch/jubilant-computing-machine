import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { notifyAdmin } from "@/lib/notify";

const contactSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name"),
  lastName: z.string().optional().or(z.literal("")),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  service: z.string().optional().or(z.literal("")),
  message: z.string().min(10, "Please tell us a little more (at least 10 characters)"),
  /** Honeypot — real people never fill this in. */
  website: z.string().optional().or(z.literal("")),
});

/** Escape user input before putting it in the notification email's HTML. */
function esc(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  try {
    const data = contactSchema.parse(await req.json());

    // Silently accept honeypot hits so bots don't learn they were caught.
    if (data.website) {
      return NextResponse.json({ message: "Message sent" }, { status: 200 });
    }

    const name = [data.firstName, data.lastName].filter(Boolean).join(" ");

    await notifyAdmin(
      `New enquiry from ${name}`,
      `<h2>New contact form message</h2>
       <p><strong>From:</strong> ${esc(name)} — ${esc(data.email)}${data.phone ? ` — ${esc(data.phone)}` : ""}</p>
       ${data.company ? `<p><strong>Company:</strong> ${esc(data.company)}</p>` : ""}
       ${data.service ? `<p><strong>Interested in:</strong> ${esc(data.service)}</p>` : ""}
       <p><strong>Message:</strong></p>
       <blockquote>${esc(data.message).replace(/\n/g, "<br>")}</blockquote>`
    );

    return NextResponse.json({ message: "Message sent" }, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0]?.message || "Invalid input" }, { status: 400 });
    }
    console.error("[contact] Failed to send:", err);
    return NextResponse.json({ message: "Something went wrong. Please email us directly." }, { status: 500 });
  }
}
