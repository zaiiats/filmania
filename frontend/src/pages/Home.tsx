import { FormGroup } from "@/components/auth/AuthCard";
import Spinner from "@/components/reusable/Spinner";
import { useFindMovieQuery } from "@/hooks/movies/useFindMovieQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { useState, type ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  background-color: #1a1a1a;
  border: 1px solid #444;
  border-radius: 6px;
  color: #fff;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #33cc99;
  }
`;

const ResultsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ResultItem = styled.li`
  display: flex;
  gap: 12px;
  background-color: #1e1e1e;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: #363636;
  }
`;

const ImagePlaceholder = styled.div`
  width: 46px;
  height: 69px;
  border-radius: 4px;
  background-color: #2a2a2a;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #333;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 8px;
`;

const PageButton = styled.button`
  flex: 1;
  padding: 10px;
  background-color: #1a1a1a;
  color: #fff;
  border: 1px solid #444;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: #33cc99;
    color: #33cc99;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function Home() {
  const [searchQuery, setSearchQuery] = useState(() => {
    return window.location.search.split("=")[1] || "";
  });

  const [debouncedValue, setDebouncedValue] = useState(() => {
    return window.location.search.split("=")[1] || "";
  });

  const [page, setPage] = useState(1);

  const [, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const { data, isLoading } = useFindMovieQuery(debouncedValue, page);

  function onTextChange(e: ChangeEvent<HTMLInputElement>) {
    const searchText = e.target.value.trim();
    setSearchQuery(searchText);
    setSearchParams({ s: searchText }, { replace: true });
    debouncedTextChange(searchText);
    setPage(1);
  }

  const debouncedTextChange = useDebounce(setDebouncedValue);

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => p + 1);

  return (
    <StyledWrapper>
      <ContentContainer>
        <FormGroup>
          <StyledInput
            value={searchQuery}
            onChange={onTextChange}
            placeholder="Search movies..."
            name="movieName"
            id="movieName"
          />
        </FormGroup>

        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <ResultsList>
              {data?.data && data.data.length > 0 ? (
                data.data.map((item) => (
                  <ResultItem
                    key={item.id}
                    onClick={() => navigate(`/movie/${item.id}`)}
                  >
                    {item.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                        alt={item.title || item.name}
                        style={{
                          width: 46,
                          height: 69,
                          borderRadius: 4,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <ImagePlaceholder>
                        <span style={{ fontSize: "10px", color: "#666" }}>
                          No img
                        </span>
                      </ImagePlaceholder>
                    )}
                    <div>
                      <h4 style={{ margin: 0, color: "#fff" }}>
                        {item.title || item.name}
                      </h4>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "14px",
                          color: "#888",
                        }}
                      >
                        {(item.release_date || item.first_air_date || "").slice(
                          0,
                          4,
                        )}
                        {item.vote_average
                          ? ` · ★ ${item.vote_average.toFixed(1)}`
                          : ""}
                      </p>
                    </div>
                  </ResultItem>
                ))
              ) : (
                <li
                  style={{
                    color: "#888",
                    textAlign: "center",
                    padding: "20px 0",
                  }}
                >
                  Cannot find this query
                </li>
              )}
            </ResultsList>

            {data?.data && data.data.length > 0 && (
              <PaginationContainer>
                <PageButton onClick={handlePrevPage} disabled={page === 1}>
                  Prev
                </PageButton>
                <PageButton
                  onClick={handleNextPage}
                  disabled={data.totalPages >= page}
                >
                  Next
                </PageButton>
              </PaginationContainer>
            )}
          </>
        )}
      </ContentContainer>
    </StyledWrapper>
  );
}
