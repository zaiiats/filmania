import { axiosInstance } from "@/lib/axios";

export async function oauthLogin(provider: string) {
  const data = await axiosInstance.get(`/auth/oauth/${provider}`);

  console.log(data);
}
