import { axiosInstance } from "@/lib/axios";

export const resendVerifyEmail = async (email: string) => {
  await axiosInstance.get(`/auth/resend-verify-email?email=${email}`);
};
