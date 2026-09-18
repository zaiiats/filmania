import { axiosInstance, tmdbClient } from "@/lib/axios";
import { token } from "./findMovie";

interface MovieDetailsInterface {
  imdb: {
    id: number;
    poster_path: string | null;
    backdrop_path: string | null;
    title: string;
    original_title: string;
    overview: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    runtime: number;
    genres: { id: number; name: string }[];
    tagline: string;
  };
  review: {
    rating: number;
    review: string;
    fileName: string;
  };
}

export const getMovie = async (
  id: string | number | null,
): Promise<MovieDetailsInterface | null> => {
  if (!id) {
    return null;
  }

  const imdbData = await tmdbClient.get(`/movie/${id}`, {
    params: {
      language: "uk-UA",
    },
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    withCredentials: false,
  });

  const reviewData = await axiosInstance.get(`/review/movie/${id}`);

  console.log(reviewData.data.data);

  return {
    imdb: imdbData.data,
    review:
      Object.keys(reviewData.data.data).length > 0
        ? reviewData.data.data
        : null,
  };
};
