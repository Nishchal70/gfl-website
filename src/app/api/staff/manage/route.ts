import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSessionStaff } from "@/lib/auth";
import { isStaffRole } from "@/lib/staff-roles";

/**
 * Team management — Creator only.
 * Admins edit website content; only the Creator manages staff accounts.
 */

const createSchema = z.object({
  email: z.email(),
  name: z.string().min(1).max(60),
  role: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  clanName: z.string().max(80).nullish(),
});

async function requireCreator() {
  const staff = await getSessionStaff();
  if (!staff) {
    return {
      error: NextResponse.json(
        { error: "Not authenticated. Please sign in again." },
        { status: 401 }
      ),
    } as const;
  }
  if (staff.role !== "Creator") {
    return {
      error: NextResponse.json(
        { error: "Only the Creator can manage staff accounts." },
        { status: 403 }
      ),
    } as const;
  }
  return { staff } as const;
}

/** List every staff profile (Creator only). */
export async function GET() {
  const gate = await requireCreator();
  if (gate.error) return gate.error;

  const members = await db.staffMember.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      clanName: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ members });
}

/** Register a new staff profile (Creator only). */
export async function POST(req: NextRequest) {
  const gate = await requireCreator();
  if (gate.error) return gate.error;

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  if (!isStaffRole(parsed.data.role)) {
    return NextResponse.json(
      { error: "Role must be Creator or Admin." },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase().trim();
  const existing = await db.staffMember.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const created = await db.staffMember.create({
    data: {
      email,
      name: parsed.data.name.trim(),
      role: parsed.data.role,
      clanName: parsed.data.clanName?.trim() || null,
      passwordHash: await bcrypt.hash(parsed.data.password, 10),
    },
    select: { id: true, email: true, name: true, role: true, clanName: true },
  });

  return NextResponse.json({ member: created }, { status: 201 });
}
