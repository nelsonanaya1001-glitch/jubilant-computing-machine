import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ProjectStatus } from "@prisma/client";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status, note } = await req.json();

    if (!Object.values(ProjectStatus).includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id: params.id } });
    if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });

    const [updated] = await prisma.$transaction([
      prisma.project.update({
        where: { id: params.id },
        data: { status },
      }),
      prisma.projectStatusUpdate.create({
        data: {
          projectId: params.id,
          oldStatus: project.status,
          newStatus: status,
          note,
        },
      }),
    ]);

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
