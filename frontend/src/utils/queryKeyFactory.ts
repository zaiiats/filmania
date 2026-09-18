export const queryKeys = {
  auth: ["auth"],
  imdb: ["imdb"],
  review: ["review"],

  refresh: () => [...queryKeys.auth, "refresh"],

  searchMovie: (searchQuery: string | null, page: number) => [
    ...queryKeys.imdb,
    "search",
    `${searchQuery}-${page}`,
  ],
  getMovie: (movieName: string | null) => [
    ...queryKeys.imdb,
    "get",
    movieName,
  ],
};
