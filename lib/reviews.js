import "server-only";

import { prisma } from "@/lib/db";

// Map a DesignReview DB row to the shape the UI components expect
// (same shape as MOCK_REVIEWS in lib/data.js).
export function serializeReview(row) {
  return {
    id: row.id,
    status: row.status,
    systemType: row.context?.systemType || "Custom",
    scaleTarget: row.context?.scaleTarget || "—",
    focusAreas: row.context?.focusAreas || [],
    creditsCost: row.creditsCost,
    createdAt: row.createdAt.toISOString().slice(0, 10),
    imageUrl: row.imageUrl,
    result: row.result,
  };
}

export async function getUserReviews(userId) {
  const rows = await prisma.designReview.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(serializeReview);
}

// Ownership-checked single fetch — returns null for missing OR foreign rows,
// so callers can't tell the difference (no data leak via 403 vs 404).
export async function getReviewForUser(id, userId) {
  const row = await prisma.designReview.findUnique({ where: { id } });
  if (!row || row.userId !== userId) return null;
  return serializeReview(row);
}
