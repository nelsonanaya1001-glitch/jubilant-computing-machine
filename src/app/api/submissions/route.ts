import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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
    const featuresNeededRaw = formData.get("featuresNeeded") as string;
    const featuresNeeded = JSON.parse(featuresNeededRaw || "[]");

    if (!businessName || !email || !contactName) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Find or create user
    let userId = session?.user?.id;
    if (!userId) {
      // Guest submission — create user account
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: { email, name: contactName, role: "CLIENT" },
        });
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
            featuresNeeded,
          },
        },
      },
    });

    // Handle file uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads", project.id);
    await mkdir(uploadDir, { recursive: true });

    const fileEntries = formData.getAll("file_logo")
      .concat(formData.getAll("file_brand"))
      .concat(formData.getAll("file_images"))
      .concat(formData.getAll("file_docs"));

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
        const filePath = path.join(uploadDir, fileName);
        const buffer = Buffer.from(await value.arrayBuffer());
        await writeFile(filePath, buffer);

        await prisma.uploadedFile.create({
          data: {
            projectId: project.id,
            fileName,
            originalName: value.name,
            fileType: value.type,
            fileSize: value.size,
            filePath: `/uploads/${project.id}/${fileName}`,
            category,
          },
        });
      }
    }

    return NextResponse.json({ message: "Project submitted successfully", projectId: project.id }, { status: 201 });
  } catch (err) {
    console.error("Submission error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
