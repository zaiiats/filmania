/*
  Warnings:

  - A unique constraint covering the columns `[token_hash]` on the table `EmailVerify` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `PasswordReset` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token_hash]` on the table `PasswordReset` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EmailVerify_token_hash_key" ON "EmailVerify"("token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_user_id_key" ON "PasswordReset"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_token_hash_key" ON "PasswordReset"("token_hash");
