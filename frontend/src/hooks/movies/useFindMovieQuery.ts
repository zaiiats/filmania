import { api } from "@/api/api";
import { queryKeys } from "@/utils/queryKeyFactory";
import { useQuery } from "@tanstack/react-query";

export const useFindMovieQuery = (searchQuery: string | null, page: number) => {
  return useQuery({
    queryFn: async () => await api.imdb.findMovie(searchQuery, page),
    queryKey: queryKeys.searchMovie(searchQuery, page),
  });
};
