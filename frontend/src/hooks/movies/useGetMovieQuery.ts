import { api } from "@/api/api";
import { queryKeys } from "@/utils/queryKeyFactory";
import { useQuery } from "@tanstack/react-query";

export function useGetMovieQuery(movieName: string | null) {
  return useQuery({
    queryFn: ({ signal }) => api.imdb.getMovie(movieName, signal),
    queryKey: queryKeys.getMovie(movieName),
  });
}
