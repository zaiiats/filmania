import { axiosInstance } from "@/lib/axios";

export const refresh = async () => {
  const data = await axiosInstance.get("/auth/refresh");

  return data.data;
};
