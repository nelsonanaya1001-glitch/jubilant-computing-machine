import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const [totalProjects, activeProjects, completedProjects, newSubmissions, recentProjects] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({
        where: { status: { in: ["DISCOVERY", "DESIGN", "DEVELOPMENT", "REVIEW"] } },
      }),
      prisma.project.count({ where: { status: "COMPLETED" } }),
      prisma.project.count({ where: { status: "SUBMITTED" } }),
      prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          client: { select: { name: true, email: true } },
          submission: { select: { businessName: true, industry: true } },
        },
      }),
    ]);

    return NextResponse.json({
      totalProjects,
      activeProjects,
      completedProjects,
      newSubmissions,
      recentProjects,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
