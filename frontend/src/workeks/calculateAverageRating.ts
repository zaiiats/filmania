self.onmessage = (event) => {
  const reviews = event.data;

  const result =
    reviews.reduce(
      (acc: number, review: { rating: number }) => acc + review.rating,
      0,
    ) / reviews.length;

  self.postMessage(result);
};
