/*
  Warnings:

  - You are about to drop the column `location` on the `PersonalDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PersonalDetails" DROP COLUMN "location",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT DEFAULT 'India',
ADD COLUMN     "district" TEXT,
ADD COLUMN     "state" TEXT;
