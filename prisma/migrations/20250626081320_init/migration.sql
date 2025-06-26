/*
  Warnings:

  - You are about to drop the column `address` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Contact` table. All the data in the column will be lost.
  - Added the required column `description` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoResources` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "phone",
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "videoResources" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);
