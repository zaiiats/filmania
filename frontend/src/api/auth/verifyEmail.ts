import { axiosInstance } from "@/lib/axios";

export const verifyEmail = async ({
  otp,
  email,
}: {
  otp: string;
  email: string;
}) => {
  await axiosInstance.post("/auth/verify-email", {
    token: otp,
    email,
  });

  return undefined;
};
