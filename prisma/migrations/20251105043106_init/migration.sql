/*
  Warnings:

  - You are about to drop the column `status` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "status";

-- DropEnum
DROP TYPE "public"."Status";
