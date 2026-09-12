import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notifyAdmin } from "@/lib/notify";
import { generateBrandKit } from "@/lib/brand";

const hex = z
  .string()
  .regex(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Please choose a valid colour");

const brandSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  tagline: z.string().max(120).optional().or(z.literal("")),
  industry: z.string().min(1, "Please select an industry"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional().or(z.literal("")),

  targetAudience: z.string().min(10, "Please describe who your customers are"),
  businessDescription: z
    .string()
    .min(40, "Please give us a bit more detail about the business (at least 40 characters)"),

  stylePreferences: z.array(z.string()).min(1, "Pick at least one style direction"),
  seedColors: z.array(hex).min(1, "Choose at least one colour"),
  colorNotes: z.string().optional().or(z.literal("")),
  avoidColors: z.string().optional().or(z.literal("")),

  logoTypePref: z.string().optional().or(z.literal("")),
  inspirationRefs: z.string().optional().or(z.literal("")),
  competitorNotes: z.string().optional().or(z.literal("")),
  tier: z.enum(["standard", "pro"]).default("standard"),
  projectId: z.string().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = brandSchema.parse(body);
    const session = await auth();

    // Resolve the client: use the signed-in user, otherwise find-or-create by email
    // so a guest can order branding without making an account first.
    let clientId = session?.user?.id ?? null;
    let accountCreated = false;
    if (!clientId) {
      let user = await prisma.user.findUnique({ where: { email: data.email } });
      if (!user) {
        user = await prisma.user.create({
          data: { email: data.email, name: data.contactName, role: "CLIENT" },
        });
        accountCreated = true;
      }
      clientId = user.id;
    }

    const submission = await prisma.brandSubmission.create({
      data: {
        clientId,
        projectId: data.projectId || null,
        businessName: data.businessName,
        tagline: data.tagline || null,
        industry: data.industry,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone || null,
        targetAudience: data.targetAudience,
        businessDescription: data.businessDescription,
        stylePreferences: data.stylePreferences,
        seedColors: data.seedColors,
        colorNotes: data.colorNotes || null,
        avoidColors: data.avoidColors || null,
        logoTypePref: data.logoTypePref || null,
        inspirationRefs: data.inspirationRefs || null,
        competitorNotes: data.competitorNotes || null,
        tier: data.tier,
        status: "SUBMITTED",
      },
    });

    // Auto-generate draft concepts immediately so the client sees something the
    // moment they submit. Generation is pure/deterministic and cannot fail on
    // network, but we still guard it so a bad edge case never loses the order.
    try {
      const kit = generateBrandKit({
        businessName: data.businessName,
        stylePreferences: data.stylePreferences,
        seedColors: data.seedColors,
        logoTypePref: data.logoTypePref,
      });

      await prisma.brandAsset.createMany({
        data: [
          ...kit.logos.map((logo) => ({
            brandSubmissionId: submission.id,
            kind: "logo",
            label: logo.label,
            svg: logo.svg,
            data: { id: logo.id, kind: logo.kind, description: logo.description },
          })),
          {
            brandSubmissionId: submission.id,
            kind: "palette",
            label: `${kit.palette.harmony} palette`,
            data: kit.palette as unknown as object,
          },
          {
            brandSubmissionId: submission.id,
            kind: "fonts",
            label: `${kit.fonts.heading} / ${kit.fonts.body}`,
            data: kit.fonts as unknown as object,
          },
        ],
      });

      await prisma.brandSubmission.update({
        where: { id: submission.id },
        data: { status: "GENERATED" },
      });
    } catch (genErr) {
      // Order is saved either way — we can regenerate from the admin panel.
      console.error("[brand] Kit generation failed, submission kept:", genErr);
    }

    await notifyAdmin(
      `New Brand & Identity order — ${data.businessName}`,
      `<h2>New brand package ordered</h2>
       <p><strong>Business:</strong> ${data.businessName} (${data.industry})</p>
       <p><strong>Contact:</strong> ${data.contactName} — ${data.email}${data.phone ? ` — ${data.phone}` : ""}</p>
       <p><strong>Tier:</strong> ${data.tier}</p>
       <p><strong>Style:</strong> ${data.stylePreferences.join(", ")}</p>
       <p><strong>Colours:</strong> ${data.seedColors.join(", ")}${data.colorNotes ? ` — ${data.colorNotes}` : ""}</p>
       <p><strong>Logo preference:</strong> ${data.logoTypePref || "no preference"}</p>
       <p><strong>Audience:</strong> ${data.targetAudience}</p>
       ${data.inspirationRefs ? `<p><strong>Inspiration:</strong> ${data.inspirationRefs}</p>` : ""}
       <p>Draft concepts have been generated automatically — open the admin dashboard to review and refine.</p>`
    );

    return NextResponse.json(
      {
        message: "Brand package submitted",
        brandSubmissionId: submission.id,
        email: data.email,
        accountCreated,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0]?.message || "Invalid input" }, { status: 400 });
    }
    console.error("[brand] Submission error:", err);
    const detail = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ message: detail || "Internal server error" }, { status: 500 });
  }
}
