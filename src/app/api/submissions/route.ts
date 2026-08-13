import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { put } from "@vercel/blob";
import { notifyAdmin } from "@/lib/notify";

// Use Vercel Blob in production (persistent storage), local filesystem in dev.
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const session = await auth();

    // Extract text fields
    const businessName = formData.get("businessName") as string;
    const industry = formData.get("industry") as string;
    const contactName = formData.get("contactName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const website = formData.get("website") as string | undefined;
    const servicesOffered = formData.get("servicesOffered") as string;
    const serviceArea = formData.get("serviceArea") as string;
    const targetAudience = formData.get("targetAudience") as string;
    const businessDescription = formData.get("businessDescription") as string;
    const preferredColors = formData.get("preferredColors") as string;
    const preferredStyle = formData.get("preferredStyle") as string;
    const competitorWebsites = formData.get("competitorWebsites") as string | undefined;
    const websitesTheyLike = formData.get("websitesTheyLike") as string | undefined;
    const hasLogo = formData.get("hasLogo") as string | undefined;
    const logoText = formData.get("logoText") as string | undefined;
    const logoStyle = formData.get("logoStyle") as string | undefined;
    const logoColorNotes = formData.get("logoColorNotes") as string | undefined;
    const logoIdeas = formData.get("logoIdeas") as string | undefined;
    const logoInspiration = formData.get("logoInspiration") as string | undefined;
    const featuresNeededRaw = formData.get("featuresNeeded") as string;
    const featuresNeeded = JSON.parse(featuresNeededRaw || "[]");

    if (!businessName || !email || !contactName) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Find or create user
    let userId = session?.user?.id;
    let accountCreated = false;
    if (!userId) {
      // Guest submission — create user account
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: { email, name: contactName, role: "CLIENT" },
        });
        accountCreated = true;
      }
      userId = user.id;
    }

    // Create project and submission in a transaction
    const project = await prisma.project.create({
      data: {
        clientId: userId,
        title: `${businessName} — Website Project`,
        status: "SUBMITTED",
        submission: {
          create: {
            businessName,
            industry,
            contactName,
            email,
            phone,
            website: website || undefined,
            servicesOffered,
            serviceArea,
            targetAudience,
            businessDescription,
            preferredColors,
            preferredStyle,
            competitorWebsites: competitorWebsites || undefined,
            websitesTheyLike: websitesTheyLike || undefined,
            hasLogo: hasLogo || undefined,
            logoText: logoText || undefined,
            logoStyle: logoStyle || undefined,
            logoColorNotes: logoColorNotes || undefined,
            logoIdeas: logoIdeas || undefined,
            logoInspiration: logoInspiration || undefined,
            featuresNeeded,
          },
        },
      },
    });

    // Handle file uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads", project.id);
    if (!useBlob) {
      await mkdir(uploadDir, { recursive: true });
    }

    const categoriesMap: { [key: string]: string } = {
      file_logo: "logo",
      file_brand: "brand",
      file_images: "images",
      file_docs: "docs",
    };

    for (const [key, value] of Array.from(formData.entries())) {
      if (key.startsWith("file_") && value instanceof File && value.size > 0) {
        const category = categoriesMap[key] || "other";
        const ext = path.extname(value.name);
        const fileName = `${uuidv4()}${ext}`;
        const buffer = Buffer.from(await value.arrayBuffer());

        let storedPath: string;
        if (useBlob) {
          // Persistent cloud storage (Vercel Blob)
          const blob = await put(`${project.id}/${fileName}`, buffer, {
            access: "public",
            contentType: value.type || "application/octet-stream",
          });
          storedPath = blob.url;
        } else {
          // Local filesystem (development)
          await writeFile(path.join(uploadDir, fileName), buffer);
          storedPath = `/uploads/${project.id}/${fileName}`;
        }

        await prisma.uploadedFile.create({
          data: {
            projectId: project.id,
            fileName,
            originalName: value.name,
            fileType: value.type,
            fileSize: value.size,
            filePath: storedPath,
            category,
          },
        });
      }
    }

    // Alert the agency immediately about the new submission.
    await notifyAdmin(
      `New project submission — ${businessName}`,
      `<h2>New website project submitted</h2>
       <p><strong>Business:</strong> ${businessName} (${industry})</p>
       <p><strong>Contact:</strong> ${contactName} — ${email} — ${phone}</p>
       <p><strong>Services:</strong> ${servicesOffered}</p>
       <p><strong>Style:</strong> ${preferredStyle} · <strong>Colors:</strong> ${preferredColors}</p>
       <p><strong>Logo:</strong> ${hasLogo || "—"}${logoText ? ` · Text: ${logoText}` : ""}${logoStyle ? ` · Type: ${logoStyle}` : ""}</p>
       ${logoIdeas ? `<p><strong>Logo details:</strong> ${logoIdeas}</p>` : ""}
       <p><strong>Features:</strong> ${(featuresNeeded || []).join(", ")}</p>
       <p>Open the admin dashboard to review the full brief and files.</p>`
    );

    return NextResponse.json(
      { message: "Project submitted successfully", projectId: project.id, email, accountCreated },
      { status: 201 }
    );
  } catch (err) {
    console.error("Submission error:", err);
    const detail = err instanceof Error ? err.message : String(err);
    // Surface the real reason so misconfiguration (e.g. missing DATABASE_URL or
    // un-migrated tables) is actionable instead of a generic 500.
    return NextResponse.json(
      { message: detail || "Internal server error" },
      { status: 500 }
    );
  }
}
