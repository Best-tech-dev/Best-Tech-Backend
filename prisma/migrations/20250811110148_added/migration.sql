/*
  Warnings:

  - The values [sales_and_partnership,technical_support,careers_and_hr,media_and_press] on the enum `ContactSubject` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ContactSubject_new" AS ENUM ('ai_ml_development', 'web_development', 'full_stack_marketing', 'mobile_app_development', 'it_solutions', 'bootcamps_and_training', 'desktop_app_development', 'website_development', 'e_commerce_development', 'saas_development', 'blockchain_development', 'data_science_and_analytics', 'general_enquiry');
ALTER TABLE "public"."contact_us" ALTER COLUMN "subject" TYPE "public"."ContactSubject_new" USING ("subject"::text::"public"."ContactSubject_new");
ALTER TYPE "public"."ContactSubject" RENAME TO "ContactSubject_old";
ALTER TYPE "public"."ContactSubject_new" RENAME TO "ContactSubject";
DROP TYPE "public"."ContactSubject_old";
COMMIT;
