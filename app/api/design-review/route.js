import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/db";
import { reviewDesign } from "@/lib/ai/design-reviewer";
import { serializeReview } from "@/lib/reviews";

// Node runtime (default) — the Anthropic SDK and Prisma need Node, not edge.

const REVIEW_COST = 1;

const BLOB_EXT = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

async function readBody(request) {
  const contentType = request.headers.get("content-type") || "";

  // multipart/form-data — image File + context fields
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("image");
    let imageBase64;

    if (file && typeof file.arrayBuffer === "function") {
      const buf = Buffer.from(await file.arrayBuffer());
      const mediaType = file.type || "image/png";
      imageBase64 = `data:${mediaType};base64,${buf.toString("base64")}`;
    }

    const focusRaw = form.get("focusAreas");
    let focusAreas = [];
    if (focusRaw) {
      try {
        focusAreas = JSON.parse(focusRaw);
      } catch {
        focusAreas = String(focusRaw)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    return {
      imageBase64,
      mermaidCode: form.get("mermaidCode") || undefined,
      context: {
        systemType: form.get("systemType") || undefined,
        scaleTarget: form.get("scaleTarget") || undefined,
        focusAreas,
      },
    };
  }

  // application/json — { imageBase64 (data URL), mermaidCode, context }
  const body = await request.json();
  return {
    imageBase64: body.imageBase64,
    mermaidCode: body.mermaidCode,
    context: body.context || {},
  };
}

// Upload the diagram image to Vercel Blob and return its public URL.
// Skipped (returns null) when BLOB_READ_WRITE_TOKEN isn't configured (local dev)
// — the AI still receives the image as base64 either way.
async function uploadImage(imageBase64) {
  if (!imageBase64 || !process.env.BLOB_READ_WRITE_TOKEN) return null;

  const match = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.*)$/s);
  if (!match) return null;

  const [, mediaType, data] = match;
  const ext = BLOB_EXT[mediaType] || "png";
  const blob = await put(
    `design-reviews/${nanoid()}.${ext}`,
    Buffer.from(data, "base64"),
    { access: "public", contentType: mediaType }
  );
  return blob.url;
}

export async function POST(request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in to run a review." }, { status: 401 });
  }

  let input;
  try {
    input = await readBody(request);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!input.imageBase64 && !input.mermaidCode?.trim()) {
    return NextResponse.json(
      { error: "Provide either a diagram image or Mermaid code." },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI is not configured. Set ANTHROPIC_API_KEY on the server." },
      { status: 500 }
    );
  }

  // Ensure the user row exists (new users start with the Free plan's 1 credit).
  await prisma.user.upsert({
    where: { clerkId: userId },
    create: { clerkId: userId },
    update: {},
  });

  const imageUrl = await uploadImage(input.imageBase64);

  // ── Deduct the credit and create the PROCESSING row in ONE transaction ──
  // The conditional updateMany (credits >= cost) makes the debit race-safe:
  // two concurrent requests can't both spend the last credit.
  let review;
  try {
    review = await prisma.$transaction(async (tx) => {
      const debit = await tx.user.updateMany({
        where: { clerkId: userId, credits: { gte: REVIEW_COST } },
        data: { credits: { decrement: REVIEW_COST } },
      });
      if (debit.count === 0) {
        const err = new Error("insufficient_credits");
        err.code = "INSUFFICIENT_CREDITS";
        throw err;
      }

      return tx.designReview.create({
        data: {
          userId,
          status: "PROCESSING",
          imageUrl,
          inputMermaid: input.mermaidCode || null,
          context: {
            systemType: input.context?.systemType || "Custom",
            scaleTarget: input.context?.scaleTarget || "unspecified",
            focusAreas: input.context?.focusAreas || [],
          },
          creditsCost: REVIEW_COST,
        },
      });
    });
  } catch (err) {
    if (err.code === "INSUFFICIENT_CREDITS") {
      return NextResponse.json({ error: "insufficient_credits" }, { status: 402 });
    }
    console.error("design-review: create transaction failed", err);
    return NextResponse.json(
      { error: "Could not start the review. Please try again." },
      { status: 500 }
    );
  }

  // ── Run the AI review (synchronous for now) ──
  try {
    const result = await reviewDesign(input);

    const updated = await prisma.designReview.update({
      where: { id: review.id },
      data: { status: "COMPLETED", result },
    });

    return NextResponse.json(
      { id: updated.id, result: serializeReview(updated).result },
      { status: 201 }
    );
  } catch (err) {
    // Compensating transaction: refund the credit + mark the row FAILED.
    try {
      await prisma.$transaction([
        prisma.user.update({
          where: { clerkId: userId },
          data: { credits: { increment: REVIEW_COST } },
        }),
        prisma.designReview.update({
          where: { id: review.id },
          data: { status: "FAILED" },
        }),
      ]);
    } catch (refundErr) {
      // Don't mask the original failure; flag for manual reconciliation.
      console.error("design-review: refund failed for", review.id, refundErr);
    }

    const status = err?.status && err.status < 500 ? err.status : 502;
    return NextResponse.json(
      {
        error: err?.message || "The AI review failed. Your credit was refunded.",
        id: review.id,
      },
      { status }
    );
  }
}
