/*
  Warnings:

  - The values [COMPLETED] on the enum `paymentStatusEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "paymentStatusEnum_new" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');
ALTER TABLE "Enrollment" ALTER COLUMN "paymentStatus" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "paymentStatus" DROP DEFAULT;
ALTER TABLE "Enrollment" ALTER COLUMN "paymentStatus" TYPE "paymentStatusEnum_new" USING ("paymentStatus"::text::"paymentStatusEnum_new");
ALTER TABLE "Payment" ALTER COLUMN "paymentStatus" TYPE "paymentStatusEnum_new" USING ("paymentStatus"::text::"paymentStatusEnum_new");
ALTER TYPE "paymentStatusEnum" RENAME TO "paymentStatusEnum_old";
ALTER TYPE "paymentStatusEnum_new" RENAME TO "paymentStatusEnum";
DROP TYPE "paymentStatusEnum_old";
ALTER TABLE "Enrollment" ALTER COLUMN "paymentStatus" SET DEFAULT 'PENDING';
ALTER TABLE "Payment" ALTER COLUMN "paymentStatus" SET DEFAULT 'PENDING';
COMMIT;
