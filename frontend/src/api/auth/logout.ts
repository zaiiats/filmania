import { axiosInstance } from "@/lib/axios";

export const logout = async () => {
  await axiosInstance.post("/auth/logout");

  localStorage.removeItem("accessToken");
};
