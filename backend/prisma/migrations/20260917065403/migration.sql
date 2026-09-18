-- CreateTable
CREATE TABLE "UserReview" (
    "id" TEXT NOT NULL,
    "movieExtId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "fileName" TEXT,

    CONSTRAINT "UserReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserReview_movieExtId_idx" ON "UserReview"("movieExtId");

-- CreateIndex
CREATE INDEX "UserReview_userId_idx" ON "UserReview"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserReview_userId_movieExtId_key" ON "UserReview"("userId", "movieExtId");

-- AddForeignKey
ALTER TABLE "UserReview" ADD CONSTRAINT "UserReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
