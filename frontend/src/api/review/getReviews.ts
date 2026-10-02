import { axiosInstance } from "@/lib/axios";

export interface ReviewInterface {
  review: string;
  rating: string | number;
  fileName: string;
  movieExtId: string;
}

export const getReviews = async () => {
  const data = await axiosInstance.get(`/review/user`);

  return data.data.data as ReviewInterface[];
};
