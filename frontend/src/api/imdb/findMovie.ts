import { tmdbClient } from "@/lib/axios";

export const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMGZhZmMxZGJkYjljYWRjMjJmNGI1YjA5MTg0NDgyOSIsIm5iZiI6MTc4OTQ2MzQ2Ny4yNDcsInN1YiI6IjZhYTkwYmFiNGZiZmFlYzZjMGJmOTgxMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-6XWVFaLXH_3IHjKN1RrpqBG7ox93FeNY7NNvOCy9Ls";

interface MovieInterface {
  id: string;
  poster_path: string;
  title: string;
  name: string;
  release_date: string;
  first_air_date: string;
  vote_average: number;
}

interface FindMovieResponse {
  totalPages: number;
  page: number;
  data: MovieInterface[];
}

export const findMovie = async (
  name: string | null,
  page: number,
): Promise<FindMovieResponse> => {
  if (!name || name.trim() === "") {
    return { page: page, data: [], totalPages: page };
  }

  const data = await tmdbClient.get("/search/movie", {
    params: {
      page: page,
      language: "uk-UA",
      query: name,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    withCredentials: false,
  });

  console.log(data);

  return {
    page: data.data.page,
    totalPages: data.data.total_pages,
    data: data.data.results,
  };
};
