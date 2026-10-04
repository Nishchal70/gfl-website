import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSessionStaff } from "@/lib/auth";
import { isStaffRole } from "@/lib/staff-roles";

/**
 * Edit / remove a staff profile — Creator only.
 * Guards: the Creator cannot delete themselves, cannot change their own
 * role, and cannot remove or demote the last remaining Creator.
 */

const updateSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  email: z.email().optional(),
  role: z.string().optional(),
  clanName: z.string().max(80).nullish(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

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

async function countCreators() {
  return db.staffMember.count({ where: { role: "Creator" } });
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const gate = await requireCreator();
  if (gate.error) return gate.error;

  const { id } = await ctx.params;
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }
  const input = parsed.data;

  if (input.role !== undefined && !isStaffRole(input.role)) {
    return NextResponse.json(
      { error: "Role must be Creator or Admin." },
      { status: 400 }
    );
  }

  const target = await db.staffMember.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "Staff member not found." }, { status: 404 });
  }

  // Self-protection: your own role stays Creator.
  if (target.id === gate.staff.id && input.role !== undefined && input.role !== target.role) {
    return NextResponse.json(
      { error: "You cannot change your own role." },
      { status: 400 }
    );
  }

  // Keep at least one Creator alive.
  if (
    target.role === "Creator" &&
    input.role !== undefined &&
    input.role !== "Creator" &&
    (await countCreators()) <= 1
  ) {
    return NextResponse.json(
      { error: "At least one Creator must remain. Promote another Creator first." },
      { status: 400 }
    );
  }

  // Email uniqueness.
  if (input.email !== undefined) {
    const email = input.email.toLowerCase().trim();
    const clash = await db.staffMember.findFirst({
      where: { email, id: { not: target.id } },
    });
    if (clash) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }
  }

  const updated = await db.staffMember.update({
    where: { id: target.id },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.email !== undefined ? { email: input.email.toLowerCase().trim() } : {}),
      ...(input.role !== undefined ? { role: input.role } : {}),
      ...(input.clanName !== undefined
        ? { clanName: input.clanName?.trim() || null }
        : {}),
      ...(input.password !== undefined
        ? { passwordHash: await bcrypt.hash(input.password, 10) }
        : {}),
    },
    select: { id: true, email: true, name: true, role: true, clanName: true },
  });

  return NextResponse.json({ member: updated });
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  const gate = await requireCreator();
  if (gate.error) return gate.error;

  const { id } = await ctx.params;
  const target = await db.staffMember.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "Staff member not found." }, { status: 404 });
  }

  if (target.id === gate.staff.id) {
    return NextResponse.json(
      { error: "You cannot delete your own account." },
      { status: 400 }
    );
  }

  if (target.role === "Creator" && (await countCreators()) <= 1) {
    return NextResponse.json(
      { error: "At least one Creator must remain." },
      { status: 400 }
    );
  }

  // Sessions cascade-delete with the member (schema onDelete: Cascade).
  await db.staffMember.delete({ where: { id: target.id } });
  return NextResponse.json({ ok: true });
}
