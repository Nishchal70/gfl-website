/**
 * One-off migration: restrict staff roles to Creator + Admin.
 * - Nishchal (nishchal708@gmail.com) becomes the Creator.
 * - Any member whose role is not Creator/Admin (e.g. the demo
 *   "Clan Representative") is removed, along with their sessions.
 * Run: bun scripts/update-staff-roles.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const VALID_ROLES = ["Creator", "Admin"];

async function main() {
  // 1. Nishchal is THE creator.
  const nishchal = await db.staffMember.updateMany({
    where: { email: { contains: "nishchal" } },
    data: { role: "Creator" },
  });
  console.log(`creator set: ${nishchal.count} account(s)`);

  // 2. Remove everyone whose role is outside Creator/Admin.
  const removed = await db.staffMember.deleteMany({
    where: { role: { notIn: VALID_ROLES } },
  });
  console.log(`removed non-creator/admin accounts: ${removed.count}`);

  // 3. Report the final roster.
  const roster = await db.staffMember.findMany({
    select: { email: true, name: true, role: true },
    orderBy: { createdAt: "asc" },
  });
  console.log("roster:", roster);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
