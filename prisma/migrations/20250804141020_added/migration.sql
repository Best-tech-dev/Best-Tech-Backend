-- CreateEnum
CREATE TYPE "public"."ContactStatus" AS ENUM ('initiated', 'awaiting_payment', 'awaiting_document_agreement', 'mvp_in_progress', 'mvp_completed', 'project_in_progress', 'project_completed', 'on_hold', 'cancelled', 'rejected');

-- AlterTable
ALTER TABLE "public"."contact_us" ADD COLUMN     "status" "public"."ContactStatus" NOT NULL DEFAULT 'initiated';
