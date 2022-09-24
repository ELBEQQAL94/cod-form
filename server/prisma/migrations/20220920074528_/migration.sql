-- DropIndex
DROP INDEX "Field_label_key";

-- DropIndex
DROP INDEX "Field_placeholder_key";

-- AlterTable
ALTER TABLE "Field" ALTER COLUMN "label" DROP NOT NULL,
ALTER COLUMN "placeholder" DROP NOT NULL,
ALTER COLUMN "requiredMessage" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subtitle" TEXT DEFAULT 'fill out the form to place your order',
ADD COLUMN     "title" TEXT DEFAULT 'free shipping today';
