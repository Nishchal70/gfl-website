/**
 * GFL staff roles, shared by server routes and client UI.
 *
 * Permission model:
 * - Creator: everything an Admin can do, plus managing staff accounts
 *   (register new profiles, edit other members' profiles/roles, remove
 *   members, reset their passwords).
 * - Admin: edit website content and change their own password.
 */
export const ROLES = ["Creator", "Admin"] as const;

export type StaffRole = (typeof ROLES)[number];

export const CREATOR_ROLE: StaffRole = "Creator";

export function isStaffRole(value: string): value is StaffRole {
  return (ROLES as readonly string[]).includes(value);
}

export function isCreator(role: string): boolean {
  return role === CREATOR_ROLE;
}
