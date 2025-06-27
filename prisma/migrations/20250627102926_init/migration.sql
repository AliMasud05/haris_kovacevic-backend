/*
  Warnings:

  - You are about to drop the column `videoResources` on the `Video` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "paymentStatusEnum" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "paymentStatus" "paymentStatusEnum" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "videoResources";

-- CreateTable
CREATE TABLE "VideoResource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "videoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoResource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VideoResource" ADD CONSTRAINT "VideoResource_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
