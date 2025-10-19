/*
  Warnings:

  - You are about to drop the column `imageURL` on the `Plant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plant" DROP COLUMN "imageURL",
ALTER COLUMN "isRare" SET DEFAULT false,
ALTER COLUMN "description" DROP NOT NULL;
