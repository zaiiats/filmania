import { Router } from "express";
import multer from "multer";
import { createReviewController } from "../controllers/reviews/createReview.controller";
import { authMiddleware } from "../middlewares/auth";
import paramsValidator from "../middlewares/paramsValidator";
import { getReviewForMovieController } from "../controllers/reviews/getReviewForMovie.controller";
import { getReviewForUserController } from "../controllers/reviews/getReviewForUser.controller";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 },
});

const router = Router();

router.post(
  "/",
  authMiddleware(),
  upload.single("reviewFile"),
  paramsValidator([
    { name: "review", type: "string", source: "body" },
    { name: "rating", type: "number", source: "body" },
    { name: "movieExtId", type: "string", source: "body" },
  ]),
  createReviewController,
);

router.get("/movie/:movieExtId", authMiddleware(), getReviewForMovieController);
router.get("/user", authMiddleware(), getReviewForUserController);

export default router;
