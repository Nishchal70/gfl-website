import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSessionStaff } from "@/lib/auth";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "New password must be different from the current one",
    path: ["newPassword"],
  });

/** Any signed-in staff member can change their OWN password. */
export async function POST(req: NextRequest) {
  const staff = await getSessionStaff();
  if (!staff) {
    return NextResponse.json(
      { error: "Not authenticated. Please sign in again." },
      { status: 401 }
    );
  }

  const parsed = passwordSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const account = await db.staffMember.findUnique({
    where: { id: staff.id },
  });
  if (!account) {
    return NextResponse.json(
      { error: "Account not found. Please sign in again." },
      { status: 404 }
    );
  }

  const currentOk = await bcrypt.compare(
    parsed.data.currentPassword,
    account.passwordHash
  );
  if (!currentOk) {
    return NextResponse.json(
      { error: "Your current password is incorrect." },
      { status: 400 }
    );
  }

  await db.staffMember.update({
    where: { id: account.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.newPassword, 10) },
  });

  return NextResponse.json({ ok: true });
}
