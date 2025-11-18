/*
  Warnings:

  - You are about to drop the column `customerId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[addressId]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Address" DROP CONSTRAINT "Address_customerId_fkey";

-- DropIndex
DROP INDEX "public"."Address_customerId_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "customerId";

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "addressId" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Customer";

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_addressId_key" ON "Purchase"("addressId");

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
