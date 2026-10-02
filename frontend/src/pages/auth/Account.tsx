import { useTypedSelector } from "@/store/store";
import styled from "styled-components";
import Button from "@/components/reusable/Button";
import { useLogoutMutation } from "@/hooks/auth/useLogoutMutation";
import AccountAvatar from "@/components/AccountAvatar";
import { useGetReviewsByUser } from "@/hooks/movies/useGetReviewsByUserQuery";
import CalculateAverageWorker from "../../workeks/calculateAverageRating?worker";
import { useEffect, useRef, useState } from "react";

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px 20px;
  max-width: 900px;
  margin: 0 auto;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const Username = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-h);
  margin: 0;
`;

const Email = styled.p`
  font-size: 1rem;
  color: #ccc;
  margin: 0;
`;

const ReviewsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 24px;
`;

const ReviewCard = styled.div`
  display: flex;
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const MoviePoster = styled.img`
  width: 150px;
  object-fit: cover;
  flex-shrink: 0;

  @media (max-width: 600px) {
    width: 100%;
    height: 250px;
  }
`;

const PlaceholderPoster = styled.div`
  width: 150px;
  background-color: #1e1e1e;
  border-right: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  text-align: center;
  padding: 10px;
  flex-shrink: 0;

  @media (max-width: 600px) {
    width: 100%;
    height: 250px;
    border-right: none;
    border-bottom: 1px solid #333;
  }
`;

const ReviewContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const MovieTitle = styled.h3`
  margin: 0;
  color: #fff;
  font-size: 20px;
`;

const ReviewRating = styled.div`
  background-color: #33cc99;
  color: #000;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  white-space: nowrap;
`;

const ReviewText = styled.p`
  margin: 0;
  color: #ccc;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const ReviewMediaWrapper = styled.div`
  margin-top: 8px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #333;
  display: flex;
  justify-content: flex-start;
  background-color: #0a0a0a;
  max-width: fit-content;

  img,
  video {
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
  }
`;

export const IMDB_IMAGE_SRC = "https://image.tmdb.org/t/p/w200"

export default function Account() {
  const {
    id: userId,
    username,
    email,
  } = useTypedSelector((store) => store.user);
  const { mutate, isPending } = useLogoutMutation();
  const calculateWorkerRef = useRef<Worker | null>(null);
  const [averateRating, setAverageRating] = useState<number | null>(null);

  const { movies, isLoading } = useGetReviewsByUser();

  const handleLogout = () => {
    mutate();
  };

  useEffect(() => {
    if (!calculateWorkerRef.current) {
      calculateWorkerRef.current = new CalculateAverageWorker();
    }
  }, []);

  useEffect(() => {
    if (calculateWorkerRef.current && !isLoading) {
      calculateWorkerRef.current.postMessage(movies.map((m) => m?.review));

      calculateWorkerRef.current.onmessage = (ev) => {
        setAverageRating(ev.data);
      };
    }
  }, [movies, isLoading]);

  return (
    <StyledWrapper>
      <AccountAvatar />

      <UserInfo>
        <Username data-testid="username">{username}</Username>
        <Email data-testid="email">{email}</Email>
      </UserInfo>

      <Button data-testid="logout" isDisabled={isPending} onClick={handleLogout}>
        Logout
      </Button>

      <ReviewsContainer>
        <h3 style={{ color: "#fff", margin: "16px 0 0", fontSize: "24px" }}>
          Мої відгуки, середня оцінка{" "}
          <em style={{ color: "#33cc99" }}>{averateRating?.toFixed(1)}/10</em>
        </h3>

        {isLoading ? (
          <p role="status" style={{ color: "#888" }}>
            Завантаження...
          </p>
        ) : movies?.length === 0 ? (
          <p data-testid="no-reviews" style={{ color: "#888" }}>Ви ще не залишили жодного відгуку.</p>
        ) : (
          movies?.map((movieData) => {
            if (!movieData) {
              return <div>Error loading a review</div>;
            }
            const { imdb, review } = movieData;

            if (!review) return null;

            return (
              <ReviewCard key={imdb.id}>
                {imdb.poster_path ? (
                  <MoviePoster
                    src={`${IMDB_IMAGE_SRC}${imdb.poster_path}`}
                    alt={imdb.title}
                  />
                ) : (
                  <PlaceholderPoster>Немає постера</PlaceholderPoster>
                )}

                <ReviewContent>
                  <ReviewHeader>
                    <MovieTitle>{imdb.title}</MovieTitle>
                    <ReviewRating>{review.rating} / 10</ReviewRating>
                  </ReviewHeader>

                  <ReviewText>{review.review}</ReviewText>

                  {review.fileName && (
                    <ReviewMediaWrapper>
                      {review.fileName.toLowerCase().match(/\.mp4$/) ? (
                        <video
                          src={`http://localhost:3001/uploads/${userId}/${review.fileName}`}
                          controls
                        />
                      ) : (
                        <img
                          src={`http://localhost:3001/uploads/${userId}/${review.fileName}`}
                          alt="Review attachment"
                        />
                      )}
                    </ReviewMediaWrapper>
                  )}
                </ReviewContent>
              </ReviewCard>
            );
          })
        )}
      </ReviewsContainer>
    </StyledWrapper>
  );
}
