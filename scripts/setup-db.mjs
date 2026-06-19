// Resilient database setup for deployment.
// Pushes the Prisma schema and seeds the admin user.
// Never fails the build — if the DB isn't configured yet, it warns and exits 0
// so the site still deploys. Set DATABASE_URL in Vercel and redeploy to finish setup.
import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.warn(
    "⚠️  DATABASE_URL is not set — skipping database setup.\n" +
      "   Add DATABASE_URL, NEXTAUTH_SECRET, and NEXTAUTH_URL in your Vercel\n" +
      "   project's Environment Variables, then redeploy to create the tables."
  );
  process.exit(0);
}

try {
  console.log("→ Applying database schema (prisma db push)...");
  execSync("prisma db push --accept-data-loss --skip-generate", { stdio: "inherit" });

  console.log("→ Seeding admin account...");
  execSync("tsx prisma/seed.ts", { stdio: "inherit" });

  console.log("✓ Database is ready.");
} catch (err) {
  console.warn(
    "⚠️  Database setup did not complete: " +
      (err && err.message ? err.message : String(err))
  );
  console.warn(
    "   The site will still deploy. Double-check that DATABASE_URL points to a\n" +
      "   reachable PostgreSQL database, then redeploy."
  );
  // Do not fail the build.
  process.exit(0);
}
