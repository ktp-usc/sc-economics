-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "image" SET DEFAULT 'https://media.licdn.com/dms/image/C4D0BAQHtbhjNR_mP_A/company-logo_200_200/0/1630567346569/sc_economics_logo?e=2147483647&v=beta&t=tOe_QxJ6BhwZ3-dxGehJ-dC5IXtjRtHqdvVH1y0bgvk';

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);
