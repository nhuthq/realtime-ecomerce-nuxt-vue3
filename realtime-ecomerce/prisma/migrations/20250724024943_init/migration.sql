/*
  Warnings:

  - The `isEmailVerified` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isEmailVerified",
ADD COLUMN     "isEmailVerified" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';
