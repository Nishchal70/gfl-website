import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

/**
 * Database client factory.
 *
 * - Local / sandbox: no special env needed beyond DATABASE_URL (SQLite file),
 *   Prisma uses its native engine — exactly as before.
 * - Vercel / production: set TURSO_DATABASE_URL (libsql://...) and
 *   TURSO_AUTH_TOKEN; Prisma talks to Turso through the libSQL driver adapter
 *   (serverless-safe, no local file).
 *
 * DATABASE_URL may also be a libsql:// URL directly — adapter is used then too.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function isRemoteUrl(url: string | undefined): boolean {
  return !!url && (url.startsWith("libsql://") || url.startsWith("libsql:"));
}

function remoteClient(url: string): PrismaClient {
  const adapter = new PrismaLibSQL({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return new PrismaClient({ adapter, log: ["error"] });
}

function makeClient(): PrismaClient {
  // TURSO_DATABASE_URL always forces the adapter path (deterministic override).
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  if (tursoUrl) return remoteClient(tursoUrl);

  // DATABASE_URL may itself be a remote libsql URL in some setups.
  if (isRemoteUrl(process.env.DATABASE_URL)) {
    return remoteClient(process.env.DATABASE_URL);
  }

  // Default: plain Prisma engine over the SQLite file (local development).
  return new PrismaClient(
    process.env.NODE_ENV === "production"
      ? { log: ["error"] }
      : { log: ["query"] }
  );
}

export const db = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
