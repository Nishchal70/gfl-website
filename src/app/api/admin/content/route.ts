import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSessionStaff } from "@/lib/auth";
import { isPageKey, pageSchemas } from "@/lib/site-content";

const bodySchema = z.object({
  page: z.string(),
  data: z.unknown(),
});

/** Authenticated write: upsert one page's content override. */
export async function PUT(req: NextRequest) {
  const staff = await getSessionStaff();
  if (!staff) {
    return NextResponse.json(
      { error: "Not authenticated. Please sign in again." },
      { status: 401 }
    );
  }

  const parsedBody = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsedBody.success || !isPageKey(parsedBody.data.page)) {
    return NextResponse.json(
      { error: "Unknown page key." },
      { status: 400 }
    );
  }

  const page = parsedBody.data.page;
  const parsedData = pageSchemas[page].safeParse(parsedBody.data.data);
  if (!parsedData.success) {
    return NextResponse.json(
      {
        error:
          "Invalid content for this page. Check that no fields were left empty.",
      },
      { status: 400 }
    );
  }

  try {
    const data = JSON.stringify(parsedData.data);
    await db.siteContent.upsert({
      where: { key: page },
      update: { data, updatedBy: staff.email },
      create: { key: page, data, updatedBy: staff.email },
    });
    return NextResponse.json({ ok: true, page, data: parsedData.data });
  } catch (err) {
    console.error("[admin/content PUT] error:", err);
    return NextResponse.json(
      { error: "Failed to save content. Please try again." },
      { status: 500 }
    );
  }
}
