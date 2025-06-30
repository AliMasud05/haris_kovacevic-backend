/*
  Warnings:

  - You are about to drop the column `name` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Resource` table. All the data in the column will be lost.
  - Added the required column `file` to the `Resource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Resource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Resource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResourceStatus" AS ENUM ('FREE', 'PAID');

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "name",
DROP COLUMN "url",
ADD COLUMN     "file" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "status" "ResourceStatus" NOT NULL,
ADD COLUMN     "thumbnail" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "topic" TEXT NOT NULL;
