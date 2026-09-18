import { Request, Response } from "express";
import { asyncCatcher } from "../../utils/asyncCatcher";
import { prismaInstance } from "../../lib/prisma";

export const getReviewForUserController = asyncCatcher(
  async (req: Request, res: Response) => {
    const user = req.user!;

    const reviewData = await prismaInstance.userReview.findMany({
      where: {
        userId: user.id,
      },
      select: {
        review: true,
        rating: true,
        fileName: true,
      },
    });

    return {
      status: 200,
      data: reviewData,
    };
  },
);
