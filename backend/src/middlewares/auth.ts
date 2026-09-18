import { NextFunction, Request, Response } from "express";
import { asyncCatcher } from "../utils/asyncCatcher";
import { AppError } from "../lib/AppError";
import jwt from "jsonwebtoken";
import { redisInstance } from "../lib/redis";

export const authMiddleware = () =>
  asyncCatcher(
    async (request: Request, response: Response, next: NextFunction) => {
      const authHeader = request.headers.authorization;
      const token = authHeader?.split(" ")[1];

      if (!token) {
        throw new AppError("unauthorized", 401);
      }

      try {
        const data = jwt.verify(token, process.env.JWT_SECRET!) as {
          sub: string;
          sessionId: string;
          email: string;
        };

        if (!data.sessionId || !data.sub) {
          throw new AppError("unauthorized", 401);
        }

        const isRevoked = await redisInstance.exists(
          `revoked:session:${data.sessionId}`,
        );

        if (isRevoked === 1) {
          throw new AppError("unauthorized", 401);
        }

        request.user = {
          id: data.sub,
          sessionId: data.sessionId,
          email: data.email,
        };
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        throw new AppError("invalid_token", 401);
      }

      return next;
    },
  );
