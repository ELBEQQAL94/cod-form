/*
  Warnings:

  - You are about to drop the column `name` on the `Field` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type]` on the table `Field` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[label]` on the table `Field` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[placeholder]` on the table `Field` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ErrorMessage` to the `Field` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `Field` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placeholder` to the `Field` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requiredMessage` to the `Field` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Field_name_key";

-- AlterTable
ALTER TABLE "Field" DROP COLUMN "name",
ADD COLUMN     "ErrorMessage" TEXT NOT NULL,
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "placeholder" TEXT NOT NULL,
ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiredMessage" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'text';

-- CreateIndex
CREATE UNIQUE INDEX "Field_type_key" ON "Field"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Field_label_key" ON "Field"("label");

-- CreateIndex
CREATE UNIQUE INDEX "Field_placeholder_key" ON "Field"("placeholder");
