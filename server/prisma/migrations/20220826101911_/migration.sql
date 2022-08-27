/*
  Warnings:

  - You are about to drop the `RestFieldsOnUsers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Field` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RestFieldsOnUsers" DROP CONSTRAINT "RestFieldsOnUsers_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "RestFieldsOnUsers" DROP CONSTRAINT "RestFieldsOnUsers_userId_fkey";

-- AlterTable
ALTER TABLE "Field" ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "RestFieldsOnUsers";

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
