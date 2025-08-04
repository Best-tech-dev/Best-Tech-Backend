-- CreateEnum
CREATE TYPE "public"."ContactSubject" AS ENUM ('GENERAL_INQUIRY', 'SALES_AND_PARTNERSHIP', 'TECHNICAL_SUPPORT', 'CAREERS_AND_HR', 'MEDIA_AND_PRESS');

-- CreateEnum
CREATE TYPE "public"."ProposedBudget" AS ENUM ('FIVE_HUNDRED_THOUSAND', 'ONE_MILLION', 'THREE_MILLION', 'FIVE_MILLION', 'TEN_MILLION', 'TWENTY_FIVE_MILLION', 'FIFTY_MILLION', 'HUNDRED_MILLION');

-- CreateEnum
CREATE TYPE "public"."ProjectTimeline" AS ENUM ('ASAP', 'ONE_TO_THREE_MONTHS', 'THREE_TO_SIX_MONTHS', 'SIX_TO_TWELVE_MONTHS', 'FLEXIBLE');

-- CreateTable
CREATE TABLE "public"."contact_us" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "companyName" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "subject" "public"."ContactSubject" NOT NULL,
    "proposedBudget" "public"."ProposedBudget" NOT NULL,
    "projectTimeline" "public"."ProjectTimeline" NOT NULL,
    "projectDetails" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_us_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."newsletter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_email_key" ON "public"."newsletter"("email");
