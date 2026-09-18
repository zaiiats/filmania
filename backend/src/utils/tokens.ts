import dayjs from "dayjs";
import { generateToken, generateUUID, hashToken } from "./crypto";
import jwt from "jsonwebtoken";

export const REFRESH_TOKEN_MAX_AGE_DAYS = 5;

export const createRefresh = () => {
  const refreshToken = generateToken();
  const expiresAt = dayjs().add(REFRESH_TOKEN_MAX_AGE_DAYS, "day").toDate();

  const refreshHash = hashToken(refreshToken);

  return { refreshToken, expiresAt, refreshHash };
};

export const createAccessToken = (
  userId: string,
  sessionId: string,
  email: string,
) => {
  const accessToken = jwt.sign(
    { sub: userId, sessionId: sessionId, email: email },
    process.env.JWT_SECRET!,
    {
      expiresIn: "15m",
      jwtid: generateUUID(),
    },
  );

  return accessToken;
};
