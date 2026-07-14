import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getReviewForUser } from "@/lib/reviews";

// GET /api/design-review/[id] — return the caller's review (Next 16: params is a Promise).
export async function GET(request, { params }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in to view reviews." }, { status: 401 });
  }

  const { id } = await params;
  const review = await getReviewForUser(id, userId);

  if (!review) {
    return NextResponse.json({ error: "Review not found." }, { status: 404 });
  }

  return NextResponse.json(review);
}

// PATCH /api/design-review/[id] — accuracy feedback on the reconstruction.
// Body: { mermaidAccurate: boolean }. Builds the eval dataset over time (brain §7).
export async function PATCH(request, { params }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  const { id } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  if (typeof body?.mermaidAccurate !== "boolean") {
    return NextResponse.json(
      { error: "mermaidAccurate must be a boolean." },
      { status: 400 }
    );
  }

  // Ownership-checked update — updateMany so a foreign id is a no-op, not a leak.
  const updated = await prisma.designReview.updateMany({
    where: { id, userId },
    data: { mermaidAccurate: body.mermaidAccurate },
  });

  if (updated.count === 0) {
    return NextResponse.json({ error: "Review not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, mermaidAccurate: body.mermaidAccurate });
}
