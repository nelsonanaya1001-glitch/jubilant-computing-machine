import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { content } = await req.json();
    if (!content?.trim()) return NextResponse.json({ message: "Message cannot be empty" }, { status: 400 });

    const project = await prisma.project.findUnique({ where: { id: params.id } });
    if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });

    if (session.user.role !== "ADMIN" && project.clientId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        projectId: params.id,
        senderId: session.user.id,
        content: content.trim(),
        isAdminMessage: session.user.role === "ADMIN",
      },
      include: { sender: { select: { id: true, name: true, role: true } } },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
