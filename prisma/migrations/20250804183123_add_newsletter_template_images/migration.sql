-- CreateEnum
CREATE TYPE "public"."NewsletterStatus" AS ENUM ('draft', 'scheduled', 'sent', 'cancelled');

-- CreateTable
CREATE TABLE "public"."newsletter_templates" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "body" TEXT NOT NULL,
    "images" JSONB,
    "status" "public"."NewsletterStatus" NOT NULL DEFAULT 'draft',
    "sentAt" TIMESTAMP(3),
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "newsletter_templates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."newsletter_templates" ADD CONSTRAINT "newsletter_templates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
