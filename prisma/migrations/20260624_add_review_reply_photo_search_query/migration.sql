-- AlterTable: reviews - Add business reply, photo, and metadata fields (PostgreSQL)
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "photoUrl" VARCHAR(191);
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "businessReply" TEXT;
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "repliedAt" TIMESTAMP(3);
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "metadata" JSONB;
