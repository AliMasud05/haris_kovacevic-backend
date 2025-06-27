/*
  Warnings:

  - Added the required column `Amount` to the `Enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "Amount" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" "paymentStatusEnum" NOT NULL DEFAULT 'PENDING',
    "paymentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "payableAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
