import { axiosInstance } from "@/lib/axios";

export async function updateAvatar(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);

  await axiosInstance.put("/auth/avatar", formData);
}
