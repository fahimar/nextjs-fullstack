import "server-only";

import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 (`prisma-client` generator) runs on a driver adapter — pooled
// Supabase URL (pgBouncer, port 6543) for runtime queries; migrations use
// DIRECT_URL via prisma.config.ts.
// globalThis-backed singleton so dev hot-reloads don't exhaust connections.
function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = (globalThis.__prisma ??= createClient());
