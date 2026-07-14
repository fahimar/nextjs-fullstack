-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PROCESSING',
    "imageUrl" TEXT,
    "inputMermaid" TEXT,
    "context" JSONB NOT NULL,
    "result" JSONB,
    "summaryPreview" TEXT,
    "mermaidAccurate" BOOLEAN,
    "creditsCost" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewMetric" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "zodParseRetries" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "DesignReview_userId_createdAt_idx" ON "DesignReview"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ReviewMetric_createdAt_idx" ON "ReviewMetric"("createdAt");

