import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "node:path";

import authRouter from "./src/routes/auth.route.ts";
import reviewRouter from "./src/routes/review.route.ts";
import errorController from "./src/controllers/error.controller.ts";

const app = express();

dotenv.config();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  "/api",
  rateLimit({
    limit: 100,
    windowMs: 1000 * 60 * 5,
    message: "too_many_requests",
  }),
);

app.use(express.json({ limit: "30kb" }));

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use("/uploads", express.static(path.resolve(process.cwd(), "review")));

const port = process.env.PORT || 3001;

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/review", reviewRouter);

app.use(errorController);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

/*

model User {
  id            String    @id @default(cuid())
  username     String @unique
  email         String    @unique
  }*/
