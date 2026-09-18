import { Request, Response } from "express";
import { asyncCatcher } from "../../utils/asyncCatcher";
import { prismaInstance } from "../../lib/prisma";
import { generateOTP } from "../../utils/crypto";
import { AppError } from "../../lib/AppError";
import fs from "fs/promises";
import path from "node:path";

const ALLOWED_EXTS = [".mp4", ".jpg", ".png", ".webp"];

export const createReviewController = asyncCatcher(
  async (req: Request, res: Response) => {
    const { review, rating, movieExtId } = res.locals.validatedData;
    const user = req.user;
    const file = req.file as Express.Multer.File;

    let fileName: string | null = null;
    if (file) {
      const fileExt = path.extname(file.originalname).toLowerCase();

      if (!ALLOWED_EXTS.includes(fileExt) || !fileExt) {
        throw new AppError("invalid_file_type", 400);
      }

      fileName = `${Date.now()}_${generateOTP(6)}_${user?.id}${fileExt}`;
    }

    const existingReview = await prismaInstance.userReview.findFirst({
      where: {
        userId: user?.id,
        movieExtId: movieExtId,
      },
    });

    if (existingReview !== null) {
      throw new AppError("review_already_exists", 409);
    }

    const data = await prismaInstance.userReview.create({
      data: {
        review: review,
        rating: rating,
        movieExtId: movieExtId,
        userId: user!.id,
        ...(fileName && { fileName: fileName }),
      },
    });

    if (fileName) {
      const userReviewDir = path.resolve(process.cwd(), "review", user!.id);
      await fs.mkdir(userReviewDir, { recursive: true });

      const filePath = path.join(userReviewDir, fileName);
      await fs.writeFile(filePath, file.buffer);
    }
  },
);
