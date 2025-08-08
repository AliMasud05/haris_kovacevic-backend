/*
  Warnings:

  - You are about to drop the `daily_stats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `statistics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "daily_stats" DROP CONSTRAINT "daily_stats_statisticsId_fkey";

-- DropForeignKey
ALTER TABLE "statistics" DROP CONSTRAINT "statistics_topEnrolledCourseId_fkey";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otp" INTEGER;

-- DropTable
DROP TABLE "daily_stats";

-- DropTable
DROP TABLE "statistics";
