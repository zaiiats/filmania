import { api } from "@/api/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateReviewMutation = () => {
  return useMutation({
    mutationFn: api.review.createReview,
    onSuccess: () => {
      toast.success("created");
    },
  });
};
