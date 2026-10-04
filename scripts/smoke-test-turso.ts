/**
 * Smoke-test the production DB path exactly as Vercel will use it:
 * db.ts factory -> PrismaLibSQL adapter -> remote Turso database.
 * Read-only checks + one write/delete roundtrip (self-cleaning).
 */
import { db } from "../src/lib/db";

async function main() {
  // 1. Read staff roster
  const staff = await db.staffMember.findMany({
    select: { email: true, name: true, role: true },
    orderBy: { createdAt: "asc" },
  });
  console.log("STAFF:", JSON.stringify(staff));

  // 2. Read content overrides (CMS)
  const content = await db.siteContent.findMany({ select: { key: true } });
  console.log("SITE CONTENT KEYS:", JSON.stringify(content.map((c) => c.key)));

  // 3. Write/read/delete roundtrip (session row, immediately removed)
  const first = await db.staffMember.findFirstOrThrow({
    where: { email: "nishchal708@gmail.com" },
  });
  const created = await db.staffSession.create({
    data: { token: "smoke-test-token", staffId: first.id, expiresAt: new Date(Date.now() + 60_000) },
  });
  const found = await db.staffSession.findUnique({ where: { token: "smoke-test-token" } });
  console.log("SESSION ROUNDTRIP:", found ? "OK" : "MISSING");
  await db.staffSession.delete({ where: { id: created.id } });
  console.log("CLEANUP: OK");

  await db.$disconnect();
  console.log("TURSO PRODUCTION PATH: ALL GOOD");
}

main().catch((e) => {
  console.error("SMOKE TEST FAILED:", e instanceof Error ? e.message : e);
  process.exit(1);
});
