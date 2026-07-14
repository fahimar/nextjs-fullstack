import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// GET /api/admin/review-metrics — aggregate observability for the design reviewer.
// Role-gated: the Clerk user needs { "role": "admin" } in publicMetadata
// (surfaced on the session token as sessionClaims.metadata — configure the
// session token to include publicMetadata in the Clerk dashboard).
function isAdmin(sessionClaims) {
  return (
    sessionClaims?.metadata?.role === "admin" ||
    sessionClaims?.publicMetadata?.role === "admin"
  );
}

function percentile(sortedValues, p) {
  if (sortedValues.length === 0) return 0;
  const idx = Math.min(
    sortedValues.length - 1,
    Math.ceil((p / 100) * sortedValues.length) - 1
  );
  return sortedValues[Math.max(0, idx)];
}

export async function GET() {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!isAdmin(sessionClaims)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const metrics = await prisma.reviewMetric.findMany({
    orderBy: { createdAt: "desc" },
    take: 1000, // last 1000 reviews is plenty for p50/p95 at this stage
  });

  const latencies = metrics
    .map((m) => m.latencyMs)
    .sort((a, b) => a - b);
  const failed = metrics.filter((m) => m.status === "FAILED").length;
  const totalCost = metrics.reduce((sum, m) => sum + (m.costEstimate || 0), 0);
  const totalRetries = metrics.reduce((sum, m) => sum + m.zodParseRetries, 0);

  return NextResponse.json({
    count: metrics.length,
    p50_latency_ms: percentile(latencies, 50),
    p95_latency_ms: percentile(latencies, 95),
    failure_rate: metrics.length ? failed / metrics.length : 0,
    zod_parse_retry_rate: metrics.length ? totalRetries / metrics.length : 0,
    avg_cost_usd: metrics.length ? totalCost / metrics.length : 0,
    total_cost_usd: totalCost,
  });
}
