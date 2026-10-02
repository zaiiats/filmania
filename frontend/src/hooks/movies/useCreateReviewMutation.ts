import { api } from "@/api/api";
import { useTypedSelector } from "@/store/store";
import { queryKeys } from "@/utils/queryKeyFactory";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  const { id: userId } = useTypedSelector((state) => state.user);

  const navigate = useNavigate();
  const { movieId } = useParams();

  return useMutation({
    mutationFn: api.review.createReview,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.getMovie(movieId || null),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.getReviews(userId),
        }),
      ]);

      toast.success("created");
      navigate(-1);
    },
  });
};
