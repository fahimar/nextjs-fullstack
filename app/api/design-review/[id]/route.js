import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
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
