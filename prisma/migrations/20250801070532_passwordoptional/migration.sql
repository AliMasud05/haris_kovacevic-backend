-- CreateEnum
CREATE TYPE "public"."Provider" AS ENUM ('GOOGLE', 'CUSTOM');

-- AlterTable
ALTER TABLE "public"."Users" ADD COLUMN     "provider" "public"."Provider" NOT NULL DEFAULT 'CUSTOM';
