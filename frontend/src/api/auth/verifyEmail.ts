import { axiosInstance } from "@/lib/axios";

export const verifyEmail = async ({
  otp,
  email,
}: {
  otp: string;
  email: string;
}) => {
  const data = await axiosInstance.post("/verify-email", {
    otp,
    email,
  });

  console.log(data);
};
