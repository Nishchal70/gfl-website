/**
 * One-shot CMS round-trip test for the new "opponents" page:
 * PUT defaults as override (validates schema + API path),
 * GET to confirm serving, DELETE the override to keep DB pristine.
 * Usage: npx tsx scripts/test-opponents-cms.ts
 */
import { db } from "../src/lib/db";
import { DEFAULT_CONTENT } from "../src/lib/site-content";

async function main() {
  const page = "opponents" as const;
  const data = DEFAULT_CONTENT[page];

  // 1. PUT (auth required) -> login first
  const loginRes = await fetch("http://localhost:3000/api/staff/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "nishchal708@gmail.com",
      password: "discodeewane",
    }),
  });
  if (!loginRes.ok) throw new Error("login failed: " + loginRes.status);
  const cookie = loginRes.headers.get("set-cookie")?.split(";")[0] ?? "";

  const putRes = await fetch("http://localhost:3000/api/admin/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({ page, data }),
  });
  const putBody = await putRes.json();
  console.log("PUT /api/admin/content:", putRes.status, putBody.page ?? putBody);

  // 2. Public GET serves stored overrides (defaults merged client-side);
  //    the opponents override we just PUT must be present under content.
  const getRes = await fetch("http://localhost:3000/api/content");
  const payload = (await getRes.json()) as {
    content?: Record<string, unknown>;
  };
  const stored = payload.content ?? {};
  const hasOpponents = "opponents" in stored;
  const overrideTitle = (stored.opponents as { title?: string } | undefined)
    ?.title;
  console.log(
    "GET /api/content:",
    getRes.status,
    "opponents override present:",
    hasOpponents,
    "| title:",
    overrideTitle,
  );

  // 3. Clean up the override row so the table stays pristine
  const deleted = await db.siteContent.deleteMany({ where: { key: page } });
  console.log("override rows deleted:", deleted.count);
  if (putRes.status !== 200 || !hasOpponents) {
    throw new Error("opponents CMS round-trip FAILED");
  }
  console.log("OPPONENTS CMS ROUND-TRIP: PASS");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("FAIL:", err);
    process.exit(1);
  });
