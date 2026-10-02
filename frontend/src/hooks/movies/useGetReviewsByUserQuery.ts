import { api } from "@/api/api";
import { useTypedSelector } from "@/store/store";
import { queryKeys } from "@/utils/queryKeyFactory";
import { useQueries, useQuery } from "@tanstack/react-query";

export const useGetReviewsByUser = () => {
  const { id: userId } = useTypedSelector((state) => state.user);

  const reviewsQuery = useQuery({
    queryFn: api.review.getReviews,
    queryKey: queryKeys.getReviews(userId),
  });

  const movieExtIds = reviewsQuery.data?.map((d) => d.movieExtId) ?? [];

  const { movies, isLoading } = useQueries({
    queries: movieExtIds.map((id) => {
      return {
        queryFn: ({ signal }) => api.imdb.getMovie(id, signal),
        queryKey: queryKeys.getMovie(id),
        staleTime: 1000 * 60 * 60,
      };
    }),
    combine: (results) => {
      {
        return {
          movies: results
            .map((res) => res.data)
            .filter((movie) => Boolean(movie)),
          isLoading: results.some((res) => res.isLoading),
        };
      }
    },
  });

  return {
    movies: movies,
    isLoading: reviewsQuery.isLoading || isLoading,
  };
};
