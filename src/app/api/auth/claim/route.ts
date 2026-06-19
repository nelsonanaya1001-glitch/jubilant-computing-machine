import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Lets a client who just submitted the intake form set a password on the
// account that was auto-created for them, so they can log in and message us.
// Only works for accounts that don't yet have a password (i.e. created by a
// guest submission) — it can never overwrite an existing account's password.
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const { email, password } = schema.parse(await req.json());

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "No submission found for this email." }, { status: 404 });
    }
    if (user.role === "ADMIN") {
      return NextResponse.json({ message: "This account cannot be claimed here." }, { status: 403 });
    }
    if (user.password) {
      return NextResponse.json(
        { message: "An account already exists for this email. Please sign in instead." },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    return NextResponse.json({ message: "Portal access created" }, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0]?.message || "Invalid input" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
