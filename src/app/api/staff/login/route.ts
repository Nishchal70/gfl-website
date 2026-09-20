import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please enter a valid email and password." },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase().trim();
    const staff = await db.staffMember.findUnique({ where: { email } });

    // Same generic message for unknown email / wrong password (no account enumeration).
    if (!staff || !(await bcrypt.compare(parsed.data.password, staff.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid credentials. Contact GFL leadership if you lost access." },
        { status: 401 }
      );
    }

    await createSession(staff.id);

    return NextResponse.json({
      staff: {
        email: staff.email,
        name: staff.name,
        role: staff.role,
        clanName: staff.clanName,
      },
    });
  } catch (err) {
    console.error("[staff/login] unexpected error:", err);
    return NextResponse.json(
      { error: "Login failed due to a server error. Please try again." },
      { status: 500 }
    );
  }
}
