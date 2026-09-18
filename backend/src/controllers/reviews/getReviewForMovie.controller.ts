import { Request, Response } from "express";
import { asyncCatcher } from "../../utils/asyncCatcher";
import { prismaInstance } from "../../lib/prisma";
import { AppError } from "../../lib/AppError";

export const getReviewForMovieController = asyncCatcher(
  async (req: Request, res: Response) => {
    const { movieExtId } = req.params;
    const user = req.user!;

    if (!movieExtId) {
      throw new AppError("no_movie_id", 400);
    }

    if (Array.isArray(movieExtId)) {
      throw new AppError("invalid_argument", 400);
    }

    const reviewData = await prismaInstance.userReview.findUnique({
      where: {
        userId_movieExtId: {
          userId: user.id,
          movieExtId: movieExtId,
        },
      },
      select: {
        review: true,
        rating: true,
        fileName: true,
      },
    });

    return {
      status: 200,
      data: {
        review: reviewData?.review,
        rating: reviewData?.rating,
        fileName: reviewData?.fileName,
      },
    };
  },
);
