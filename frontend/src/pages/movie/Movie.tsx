import Spinner from "@/components/reusable/Spinner";
import { useGetMovieQuery } from "@/hooks/movies/useGetMovieQuery";
import { useTypedSelector } from "@/store/store";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const StyledWrapper = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  color: #fff;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const ActionButton = styled.button`
  padding: 10px 24px;
  background-color: #1a1a1a;
  color: #fff;
  border: 1px solid #444;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #33cc99;
    color: #33cc99;
  }
`;

const ContentFlex = styled.div`
  display: flex;
  gap: 32px;
  align-items: flex-start;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Poster = styled.img`
  width: 300px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
`;

const PlaceholderPoster = styled.div`
  width: 300px;
  height: 450px;
  border-radius: 8px;
  background-color: #1e1e1e;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  flex-shrink: 0;
`;

const InfoBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 36px;
  line-height: 1.2;
`;

const Tagline = styled.p`
  margin: 0;
  font-style: italic;
  color: #888;
  font-size: 18px;
`;

const Genres = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const GenreTag = styled.span`
  background-color: #1e1e1e;
  border: 1px solid #33cc99;
  color: #33cc99;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
`;

const TextBlock = styled.div`
  line-height: 1.6;
  color: #ccc;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 24px;
  border-top: 1px solid #333;
`;

const ReviewContainer = styled.div`
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 24px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
  padding-bottom: 16px;
`;

const ReviewTitle = styled.h3`
  margin: 0;
  color: #33cc99;
  font-size: 22px;
`;

const ReviewRating = styled.div`
  background-color: #33cc99;
  color: #000;
  font-weight: bold;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 16px;
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
  justify-content: center;
  background-color: #0a0a0a;

  img,
  video {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
  }
`;

export default function Movie() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const user = useTypedSelector((store) => store.user);

  const { data, isLoading } = useGetMovieQuery(movieId || null);
  const reviewData = data?.review;
  const imdbData = data?.imdb;

  const handleReviewClick = () => {
    if (!user.username) {
      navigate("/login");
    } else {
      navigate(`/review/${movieId}`);
    }
  };

  if (isLoading) {
    return (
      <StyledWrapper style={{ alignItems: "center", minHeight: "50vh" }}>
        <Spinner />
      </StyledWrapper>
    );
  }

  if (!imdbData) {
    return (
      <StyledWrapper style={{ alignItems: "center", minHeight: "50vh" }}>
        <h2>Фільм не знайдено</h2>
        <ActionButton onClick={() => navigate("/")}>На головну</ActionButton>
      </StyledWrapper>
    );
  }

  return (
    <StyledWrapper>
      <TopBar>
        <ActionButton onClick={() => navigate("/")}>Назад</ActionButton>
      </TopBar>

      <ContentFlex>
        {imdbData?.poster_path ? (
          <Poster
            src={`https://image.tmdb.org/t/p/w500${imdbData.poster_path}`}
            alt={imdbData?.title}
          />
        ) : (
          <PlaceholderPoster>Немає постера</PlaceholderPoster>
        )}

        <InfoBox>
          <Title>{imdbData?.title}</Title>
          {imdbData?.tagline && <Tagline>"{imdbData.tagline}"</Tagline>}

          <Genres>
            {imdbData?.genres?.map((genre) => (
              <GenreTag key={genre.id}>{genre.name}</GenreTag>
            ))}
          </Genres>

          <TextBlock>
            <div>
              <strong>Оцінка:</strong> {imdbData?.vote_average.toFixed(1)} / 10
              ({imdbData?.vote_count} голосів)
            </div>
            <div>
              <strong>Реліз:</strong>{" "}
              {imdbData.release_date
                ? imdbData.release_date.replaceAll("-", ".")
                : "Невідомо"}
            </div>
            <div>
              <strong>Тривалість:</strong>{" "}
              {imdbData.runtime ? `${imdbData.runtime} хв` : "Невідомо"}
            </div>
          </TextBlock>

          <TextBlock>
            <h3 style={{ color: "#fff", margin: "8px 0 0" }}>Опис</h3>
            <p style={{ margin: 0 }}>
              {imdbData.overview || "Опис відсутній."}
            </p>
          </TextBlock>
        </InfoBox>
      </ContentFlex>

      {reviewData ? (
        <ReviewContainer>
          <ReviewHeader>
            <ReviewTitle>Моє рев'ю</ReviewTitle>
            <ReviewRating>{reviewData.rating} / 10</ReviewRating>
          </ReviewHeader>

          <ReviewText>{reviewData.review}</ReviewText>

          {reviewData.fileName && (
            <ReviewMediaWrapper>
              {reviewData.fileName.toLowerCase().match(/\.mp4$/) ? (
                <video
                  src={`http://localhost:3001/uploads/${user.id}/${reviewData.fileName}`}
                  controls
                />
              ) : (
                <img
                  src={`http://localhost:3001/uploads/${user.id}/${reviewData.fileName}`}
                  alt="Review attachment"
                />
              )}
            </ReviewMediaWrapper>
          )}
        </ReviewContainer>
      ) : (
        <BottomBar>
          <ActionButton onClick={handleReviewClick}>
            Залишити рев'ю
          </ActionButton>
        </BottomBar>
      )}
    </StyledWrapper>
  );
}
