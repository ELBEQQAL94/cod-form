/*
  Warnings:

  - The primary key for the `CurrentFieldsOnUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Field` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "CurrentFieldsOnUsers" DROP CONSTRAINT "CurrentFieldsOnUsers_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "CurrentFieldsOnUsers" DROP CONSTRAINT "CurrentFieldsOnUsers_userId_fkey";

-- DropForeignKey
ALTER TABLE "Field" DROP CONSTRAINT "Field_userId_fkey";

-- AlterTable
ALTER TABLE "CurrentFieldsOnUsers" DROP CONSTRAINT "CurrentFieldsOnUsers_pkey",
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "fieldId" SET DATA TYPE TEXT,
ADD CONSTRAINT "CurrentFieldsOnUsers_pkey" PRIMARY KEY ("userId", "fieldId");

-- AlterTable
ALTER TABLE "Field" DROP CONSTRAINT "Field_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Field_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Field_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentFieldsOnUsers" ADD CONSTRAINT "CurrentFieldsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentFieldsOnUsers" ADD CONSTRAINT "CurrentFieldsOnUsers_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
