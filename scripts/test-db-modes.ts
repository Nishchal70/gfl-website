/**
 * Local sanity checks for the new db.ts factory:
 * 1. Plain mode (no Turso env) — native SQLite engine still works
 * 2. Adapter mode (TURSO_DATABASE_URL=file:...) — libSQL adapter works
 *    (run scripts/init-turso.ts against db/adapter-test.db first)
 */
import { spawnSync } from "node:child_process";

const CODE_PLAIN = `
import { db } from "/home/z/my-project/src/lib/db";
async function main() {
  const rows = await db.staffMember.findMany({ select: { email: true, role: true } });
  console.log("READ OK:", JSON.stringify(rows));
  await db.$disconnect();
}
main().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
`;

const CODE_ADAPTER = `
import { db } from "/home/z/my-project/src/lib/db";
async function main() {
  const rows = await db.staffMember.findMany({ select: { email: true, role: true, name: true, createdAt: true } });
  console.log("ADAPTER READ OK:", JSON.stringify(rows.map(r => ({ e: r.email, r: r.role, d: r.createdAt instanceof Date }))));
  const first = await db.staffMember.findFirstOrThrow();
  const s = await db.staffSession.create({ data: { token: "test-token-123", staffId: first.id, expiresAt: new Date(Date.now() + 60000) } });
  console.log("ADAPTER WRITE OK: session", s.id.slice(0, 6));
  await db.staffSession.delete({ where: { id: s.id } });
  console.log("CLEANUP OK");
  await db.$disconnect();
}
main().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
`;

function run(label: string, env: Record<string, string>, code: string): number {
  const res = spawnSync("npx", ["tsx", "-e", code], {
    cwd: "/home/z/my-project",
    env: { ...process.env, ...env },
    encoding: "utf8",
  });
  const out = (res.stdout + res.stderr).trim().split("\n").filter(Boolean);
  console.log(`\n=== ${label} ===`);
  for (const line of out) {
    if (!line.startsWith("prisma:query")) console.log(line);
  }
  return res.status ?? 1;
}

const t1 = run(
  "1. PLAIN MODE (DATABASE_URL file sqlite)",
  {},
  CODE_PLAIN
);
const t2 = run(
  "2. ADAPTER MODE (TURSO_DATABASE_URL=file:...adapter-test.db)",
  { TURSO_DATABASE_URL: "file:/home/z/my-project/db/adapter-test.db" },
  CODE_ADAPTER
);

console.log(`\nRESULT: plain=${t1 === 0 ? "PASS" : "FAIL"} adapter=${t2 === 0 ? "PASS" : "FAIL"}`);
process.exit(t1 === 0 && t2 === 0 ? 0 : 1);
