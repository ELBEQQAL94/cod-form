/*
  Warnings:

  - The primary key for the `CurrentFieldsOnUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `CurrentFieldsOnUsers` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `storeId` to the `CurrentFieldsOnUsers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `Field` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CurrentFieldsOnUsers" DROP CONSTRAINT "CurrentFieldsOnUsers_userId_fkey";

-- DropForeignKey
ALTER TABLE "Field" DROP CONSTRAINT "Field_userId_fkey";

-- AlterTable
ALTER TABLE "CurrentFieldsOnUsers" DROP CONSTRAINT "CurrentFieldsOnUsers_pkey",
DROP COLUMN "userId",
ADD COLUMN     "storeId" TEXT NOT NULL,
ADD CONSTRAINT "CurrentFieldsOnUsers_pkey" PRIMARY KEY ("storeId", "fieldId");

-- AlterTable
ALTER TABLE "Field" DROP COLUMN "userId",
ADD COLUMN     "storeId" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT DEFAULT 'free shipping today',
    "subtitle" TEXT DEFAULT 'fill out the form to place your order',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "shop" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Store_shop_key" ON "Store"("shop");

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentFieldsOnUsers" ADD CONSTRAINT "CurrentFieldsOnUsers_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
