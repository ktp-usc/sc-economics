-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active';
