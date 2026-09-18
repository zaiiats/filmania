import { axiosInstance } from "@/lib/axios";

interface ReviewInterface {
  review: string;
  rating: number;
  userId: string;
  movieExtId: string;
  reviewFile: File | null;
}

export const createReview = async (passedData: ReviewInterface) => {
  const form = new FormData();

  Object.entries(passedData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      form.append(key, value);
    }
  });

  const data = await axiosInstance.post("/review", form);

  return data;
};
