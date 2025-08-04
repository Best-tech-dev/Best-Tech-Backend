/*
  Warnings:

  - The values [GENERAL_INQUIRY,SALES_AND_PARTNERSHIP,TECHNICAL_SUPPORT,CAREERS_AND_HR,MEDIA_AND_PRESS] on the enum `ContactSubject` will be removed. If these variants are still used in the database, this will fail.
  - The values [ASAP,ONE_TO_THREE_MONTHS,THREE_TO_SIX_MONTHS,SIX_TO_TWELVE_MONTHS,FLEXIBLE] on the enum `ProjectTimeline` will be removed. If these variants are still used in the database, this will fail.
  - The values [FIVE_HUNDRED_THOUSAND,ONE_MILLION,THREE_MILLION,FIVE_MILLION,TEN_MILLION,TWENTY_FIVE_MILLION,FIFTY_MILLION,HUNDRED_MILLION] on the enum `ProposedBudget` will be removed. If these variants are still used in the database, this will fail.
  - The values [USER,ADMIN,STAFF] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ContactSubject_new" AS ENUM ('general_enquiry', 'sales_and_partnership', 'technical_support', 'careers_and_hr', 'media_and_press');
ALTER TABLE "public"."contact_us" ALTER COLUMN "subject" TYPE "public"."ContactSubject_new" USING ("subject"::text::"public"."ContactSubject_new");
ALTER TYPE "public"."ContactSubject" RENAME TO "ContactSubject_old";
ALTER TYPE "public"."ContactSubject_new" RENAME TO "ContactSubject";
DROP TYPE "public"."ContactSubject_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."ProjectTimeline_new" AS ENUM ('asap', 'one_to_three_months', 'three_to_six_months', 'six_to_twelve_months', 'flexible');
ALTER TABLE "public"."contact_us" ALTER COLUMN "projectTimeline" TYPE "public"."ProjectTimeline_new" USING ("projectTimeline"::text::"public"."ProjectTimeline_new");
ALTER TYPE "public"."ProjectTimeline" RENAME TO "ProjectTimeline_old";
ALTER TYPE "public"."ProjectTimeline_new" RENAME TO "ProjectTimeline";
DROP TYPE "public"."ProjectTimeline_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."ProposedBudget_new" AS ENUM ('five_hundred_thousand', 'one_million', 'three_million', 'five_million', 'ten_million', 'thwenty_five_million', 'fifty_million', 'hundred_million');
ALTER TABLE "public"."contact_us" ALTER COLUMN "proposedBudget" TYPE "public"."ProposedBudget_new" USING ("proposedBudget"::text::"public"."ProposedBudget_new");
ALTER TYPE "public"."ProposedBudget" RENAME TO "ProposedBudget_old";
ALTER TYPE "public"."ProposedBudget_new" RENAME TO "ProposedBudget";
DROP TYPE "public"."ProposedBudget_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Role_new" AS ENUM ('user', 'admin', 'staff');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."users" ALTER COLUMN "role" TYPE "public"."Role_new" USING ("role"::text::"public"."Role_new");
ALTER TYPE "public"."Role" RENAME TO "Role_old";
ALTER TYPE "public"."Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "public"."users" ALTER COLUMN "role" SET DEFAULT 'user';
COMMIT;

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "role" SET DEFAULT 'user';
