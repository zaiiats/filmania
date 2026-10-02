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
  getMovie: (movieId: string | null) => [...queryKeys.imdb, "get", movieId],

  getReviews: (userId: string | null) => [...queryKeys.review, "user", userId],
};
