-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('google', 'github');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "dateOfBirth" DROP NOT NULL;

-- CreateTable
CREATE TABLE "OAuthAccount" (
    "id" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OAuthAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OAuthAccount_user_id_provider_key" ON "OAuthAccount"("user_id", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthAccount_id_providerAccountId_key" ON "OAuthAccount"("id", "providerAccountId");

-- CreateIndex
CREATE INDEX "Session_token_hash_idx" ON "Session"("token_hash");

-- AddForeignKey
ALTER TABLE "OAuthAccount" ADD CONSTRAINT "OAuthAccount_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
