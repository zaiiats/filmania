/*
  Warnings:

  - You are about to drop the column `email` on the `Auth` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `OAuthAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Auth_email_key";

-- DropIndex
DROP INDEX "OAuthAccount_id_providerAccountId_key";

-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "email";

-- CreateIndex
CREATE UNIQUE INDEX "OAuthAccount_provider_providerAccountId_key" ON "OAuthAccount"("provider", "providerAccountId");
