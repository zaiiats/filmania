import { axiosInstance } from "@/lib/axios";

export const signup = async ({
  username,
  email,
  dateOfBirth,
  password,
}: {
  username: string;
  email: string;
  dateOfBirth: string;
  password: string;
}) => {
  await axiosInstance.post("/auth/signup", {
    username,
    email,
    dateOfBirth: new Date(dateOfBirth),
    password,
  });
};
