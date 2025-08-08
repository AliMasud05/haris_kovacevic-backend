-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'SUCCESS', 'CANCELLED');

-- AlterTable
ALTER TABLE "Refund" ADD COLUMN     "refuntStatus" "RefundStatus" NOT NULL DEFAULT 'PENDING';
