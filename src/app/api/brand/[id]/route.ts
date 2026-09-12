import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateBrandKit } from "@/lib/brand";

/** Admin, or the client who owns the submission. */
async function canAccess(submissionClientId: string | null) {
  const session = await auth();
  if (!session?.user) return false;
  if (session.user.role === "ADMIN") return true;
  return !!submissionClientId && session.user.id === submissionClientId;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const submission = await prisma.brandSubmission.findUnique({
    where: { id: params.id },
    include: { assets: { orderBy: { createdAt: "asc" } } },
  });
  if (!submission) return NextResponse.json({ message: "Not found" }, { status: 404 });

  if (!(await canAccess(submission.clientId))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(submission);
}

const patchSchema = z.object({
  status: z.enum(["SUBMITTED", "GENERATED", "IN_REVIEW", "DELIVERED"]).optional(),
  /** BrandAsset id of the logo concept the client/admin picked. */
  selectedAssetId: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const submission = await prisma.brandSubmission.findUnique({ where: { id: params.id } });
  if (!submission) return NextResponse.json({ message: "Not found" }, { status: 404 });
  if (!(await canAccess(submission.clientId))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status, selectedAssetId } = patchSchema.parse(await req.json());

    if (selectedAssetId) {
      // Exactly one logo concept may be selected at a time.
      await prisma.brandAsset.updateMany({
        where: { brandSubmissionId: params.id, kind: "logo" },
        data: { selected: false },
      });
      await prisma.brandAsset.update({
        where: { id: selectedAssetId },
        data: { selected: true },
      });
    }

    const updated = status
      ? await prisma.brandSubmission.update({ where: { id: params.id }, data: { status } })
      : submission;

    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0]?.message || "Invalid input" }, { status: 400 });
    }
    console.error("[brand] Patch failed:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

/**
 * Regenerate the kit from the stored intake answers (admin only).
 * Accepts optional overrides so we can nudge colour/style without asking the
 * client to resubmit. Replaces the existing generated assets.
 */
const regenSchema = z.object({
  seedColors: z.array(z.string()).optional(),
  stylePreferences: z.array(z.string()).optional(),
  logoTypePref: z.string().optional(),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const submission = await prisma.brandSubmission.findUnique({ where: { id: params.id } });
  if (!submission) return NextResponse.json({ message: "Not found" }, { status: 404 });

  try {
    const body = await req.json().catch(() => ({}));
    const overrides = regenSchema.parse(body || {});

    const seedColors = overrides.seedColors ?? (submission.seedColors as string[]);
    const stylePreferences = overrides.stylePreferences ?? (submission.stylePreferences as string[]);
    const logoTypePref = overrides.logoTypePref ?? submission.logoTypePref;

    const kit = generateBrandKit({
      businessName: submission.businessName,
      stylePreferences: Array.isArray(stylePreferences) ? stylePreferences : [],
      seedColors: Array.isArray(seedColors) ? seedColors : ["#7c3aed"],
      logoTypePref,
    });

    // Persist any overrides so the guide and a future regeneration stay in sync.
    await prisma.brandSubmission.update({
      where: { id: params.id },
      data: {
        seedColors: seedColors as unknown as object,
        stylePreferences: stylePreferences as unknown as object,
        logoTypePref: logoTypePref ?? null,
        status: "GENERATED",
      },
    });

    await prisma.brandAsset.deleteMany({ where: { brandSubmissionId: params.id } });
    await prisma.brandAsset.createMany({
      data: [
        ...kit.logos.map((logo) => ({
          brandSubmissionId: params.id,
          kind: "logo",
          label: logo.label,
          svg: logo.svg,
          data: { id: logo.id, kind: logo.kind, description: logo.description },
        })),
        {
          brandSubmissionId: params.id,
          kind: "palette",
          label: `${kit.palette.harmony} palette`,
          data: kit.palette as unknown as object,
        },
        {
          brandSubmissionId: params.id,
          kind: "fonts",
          label: `${kit.fonts.heading} / ${kit.fonts.body}`,
          data: kit.fonts as unknown as object,
        },
      ],
    });

    const assets = await prisma.brandAsset.findMany({
      where: { brandSubmissionId: params.id },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ message: "Regenerated", assets });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0]?.message || "Invalid input" }, { status: 400 });
    }
    console.error("[brand] Regeneration failed:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
