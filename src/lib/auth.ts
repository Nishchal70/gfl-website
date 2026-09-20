import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const COOKIE_NAME = "gfl_staff_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type SessionStaff = {
  id: string;
  email: string;
  name: string;
  role: string;
  clanName: string | null;
};

/**
 * Creates a DB-backed session (so it can be revoked server-side) and
 * stores the opaque token in an httpOnly cookie.
 */
export async function createSession(staffId: string): Promise<void> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.staffSession.create({
    data: { token, staffId, expiresAt },
  });

  // Housekeeping: drop expired sessions for everyone.
  await db.staffSession.deleteMany({ where: { expiresAt: { lt: new Date() } } });

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getSessionStaff(): Promise<SessionStaff | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await db.staffSession.findUnique({
    where: { token },
    include: { staff: true },
  });

  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    await db.staffSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return {
    id: session.staff.id,
    email: session.staff.email,
    name: session.staff.name,
    role: session.staff.role,
    clanName: session.staff.clanName,
  };
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) {
    await db.staffSession.deleteMany({ where: { token } }).catch(() => {});
  }
  store.delete(COOKIE_NAME);
}
