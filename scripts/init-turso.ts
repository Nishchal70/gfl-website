/**
 * One-shot initializer for a REMOTE Turso/libSQL database.
 *
 * Creates the tables (same shape as prisma/schema.prisma) and seeds the two
 * staff accounts. Run once after creating your Turso database:
 *
 *   TURSO_DATABASE_URL=libsql://your-db.turso.io \
 *   TURSO_AUTH_TOKEN=your-token \
 *   npx tsx scripts/init-turso.ts
 *
 * Safe to re-run (IF NOT EXISTS + upserts).
 */
import { createClient, type Client } from "@libsql/client";
import bcrypt from "bcryptjs";

const url = process.env.TURSO_DATABASE_URL ?? process.env.INIT_DATABASE_URL;
const token = process.env.TURSO_AUTH_TOKEN ?? process.env.INIT_AUTH_TOKEN;

if (!url || !(url.startsWith("libsql") || url.startsWith("file:"))) {
  console.error(
    "Missing remote database URL.\n" +
      "Usage:\n" +
      "  TURSO_DATABASE_URL=libsql://your-db.turso.io TURSO_AUTH_TOKEN=... npx tsx scripts/init-turso.ts\n" +
      "(libsql:// or file: URL required)"
  );
  process.exit(1);
}

const client: Client = createClient({ url, authToken: token });

const DDL: string[] = [
  `CREATE TABLE IF NOT EXISTS "StaffMember" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Staff',
    "clanName" TEXT,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "StaffMember_email_key" ON "StaffMember"("email")`,
  `CREATE TABLE IF NOT EXISTS "StaffSession" (
    "id" TEXT PRIMARY KEY,
    "token" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL,
    CONSTRAINT "StaffSession_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "StaffMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "StaffSession_token_key" ON "StaffSession"("token")`,
  `CREATE TABLE IF NOT EXISTS "SiteContent" (
    "key" TEXT PRIMARY KEY,
    "data" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedAt" DATETIME NOT NULL
  )`,
];

const STAFF_SEED = [
  {
    email: "nishchal708@gmail.com",
    password: "discodeewane",
    name: "Nishchal",
    role: "Creator",
    clanName: "Global Farming League",
  },
  {
    email: "admin@gfl.gg",
    password: "GFLstaff2026!",
    name: "GFL Admin",
    role: "Admin",
    clanName: "Global Farming League",
  },
];

async function main() {
  console.log(`Connecting to ${url}`);
  await client.execute("PRAGMA foreign_keys = ON");

  for (const stmt of DDL) {
    await client.execute(stmt);
  }
  console.log("Tables ready: StaffMember, StaffSession, SiteContent");

  const now = new Date().toISOString();
  for (const s of STAFF_SEED) {
    const passwordHash = await bcrypt.hash(s.password, 10);
    await client.execute({
      sql: `INSERT INTO "StaffMember" ("id","email","passwordHash","name","role","clanName","createdAt","updatedAt")
            VALUES (? ,?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT("email") DO UPDATE SET
              "passwordHash" = excluded."passwordHash",
              "name" = excluded."name",
              "role" = excluded."role",
              "clanName" = excluded."clanName",
              "updatedAt" = excluded."updatedAt"`,
      args: [
        crypto.randomUUID(),
        s.email,
        passwordHash,
        s.name,
        s.role,
        s.clanName,
        now,
        now,
      ],
    });
    console.log(`seeded staff: ${s.email} (${s.role})`);
  }

  const check = await client.execute(
    `SELECT "email","role","name" FROM "StaffMember" ORDER BY "createdAt" ASC`
  );
  console.log("Verification query ->");
  for (const row of check.rows) {
    console.log(`  ${row.email} · ${row.role} · ${row.name}`);
  }

  client.close();
  console.log("Done. This database is ready for Vercel.");
}

main().catch((e) => {
  console.error("init-turso failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
