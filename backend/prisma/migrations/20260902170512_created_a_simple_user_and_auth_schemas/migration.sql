-- AlterTable
ALTER TABLE "EmailVerify" ALTER COLUMN "last_attempted_at" DROP NOT NULL,
ALTER COLUMN "blocked_until" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PasswordReset" ALTER COLUMN "last_attempted_at" DROP NOT NULL,
ALTER COLUMN "blocked_until" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "revoked_at" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailVerify" ADD CONSTRAINT "EmailVerify_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
