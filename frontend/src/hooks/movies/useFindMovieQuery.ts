import { api } from "@/api/api";
import { queryKeys } from "@/utils/queryKeyFactory";
import { useQuery } from "@tanstack/react-query";

export const useFindMovieQuery = (searchQuery: string | null, page: number) => {
  return useQuery({
    queryFn: async ({ signal }) =>
      await api.imdb.findMovie(searchQuery, page, signal),
    queryKey: queryKeys.searchMovie(searchQuery, page),
  });
};
