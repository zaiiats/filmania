import { axiosInstance } from "@/lib/axios";

export const logout = async () => {
  await axiosInstance.post("/logout");

  localStorage.removeItem("accessToken");
};
