-- CreateEnum
CREATE TYPE "public"."ContactUsProjectType" AS ENUM ('ai_ml_development', 'web_development', 'full_stack_marketing', 'mobile_app_development', 'it_solutions', 'bootcamps_and_training', 'desktop_app_development', 'website_development', 'e_commerce_development', 'saas_development', 'blockchain_development', 'data_science_and_analytics', 'general_enquiry');

-- AlterTable
ALTER TABLE "public"."contact_us" ADD COLUMN     "projectType" "public"."ContactUsProjectType";
