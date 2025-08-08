/*
  Warnings:

  - You are about to drop the column `googleId` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Users" DROP COLUMN "googleId",
DROP COLUMN "provider";

-- DropEnum
DROP TYPE "public"."Provider";
