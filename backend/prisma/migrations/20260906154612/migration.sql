/*
  Warnings:

  - You are about to drop the column `last_attempted_at` on the `EmailVerify` table. All the data in the column will be lost.
  - You are about to drop the column `last_attempted_at` on the `PasswordReset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmailVerify" DROP COLUMN "last_attempted_at",
ADD COLUMN     "attempts" INTEGER;

-- AlterTable
ALTER TABLE "PasswordReset" DROP COLUMN "last_attempted_at",
ADD COLUMN     "attempts" INTEGER;
