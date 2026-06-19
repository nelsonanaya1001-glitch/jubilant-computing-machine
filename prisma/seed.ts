import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@launchboard.co" },
    update: {},
    create: {
      email: "admin@launchboard.co",
      name: "Admin User",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log("Seeded admin user:", admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
