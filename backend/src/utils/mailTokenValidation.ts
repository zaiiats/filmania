import { generateOTP, hashOTP } from "./crypto";
import dayjs from "dayjs";

const VERIFY_EMAIL_EXPIRES = 1000 * 60 * 60 * 1;

export const createVerifyEmailData = async () => {
  const emailVerifyCode = generateOTP();
  const emailVerifyCodeHash = await hashOTP(emailVerifyCode);

  const expiresAt = dayjs().add(VERIFY_EMAIL_EXPIRES, "millisecond").toDate();

  return {
    emailVerifyCode,
    emailVerifyCodeHash,
    expiresAt,
  };
};
