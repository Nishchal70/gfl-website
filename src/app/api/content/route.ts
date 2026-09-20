import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/** Public: returns stored content overrides (defaults are merged client-side). */
export async function GET() {
  try {
    const rows = await db.siteContent.findMany();
    const stored: Record<string, unknown> = {};
    for (const row of rows) {
      try {
        stored[row.key] = JSON.parse(row.data);
      } catch {
        // Skip malformed rows; defaults will cover them.
      }
    }
    return NextResponse.json({ content: stored });
  } catch (err) {
    console.error("[content GET] error:", err);
    return NextResponse.json(
      { error: "Failed to load content." },
      { status: 500 }
    );
  }
}
