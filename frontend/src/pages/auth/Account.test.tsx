import { cleanup, render, screen } from "@testing-library/react";
import { it, expect, vi, afterEach, beforeEach } from "vitest";
import Account, { IMDB_IMAGE_SRC } from "./Account";
import "@testing-library/jest-dom/vitest";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { UserInterface } from "@/store/store";
import userEvent from "@testing-library/user-event";

const {
  useGetReviewsByUserMock,
  useNavigateMock,
  useLogoutMutationMock,
  mutateMock,
} = vi.hoisted(() => {
  return {
    useGetReviewsByUserMock: vi.fn(),
    useNavigateMock: vi.fn(),
    useLogoutMutationMock: vi.fn(),
    mutateMock: vi.fn(),
  };
});

const clientInstance = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

beforeEach(() => {
  useLogoutMutationMock.mockReturnValue({
    mutate: mutateMock,
    isPending: false,
  });
});

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

vi.mock("../../workeks/calculateAverageRating?worker", () => {
  class CalculateAverageWorker {
    postMessage = vi.fn();
    onmessage = vi.fn();
  }
  return { default: CalculateAverageWorker };
});

vi.mock("@/hooks/movies/useGetReviewsByUserQuery", async () => {
  return {
    useGetReviewsByUser: useGetReviewsByUserMock,
  };
});

vi.mock("@/hooks/auth/useLogoutMutation", () => {
  return {
    useLogoutMutation: useLogoutMutationMock,
  };
});

vi.mock("react-router-dom", async () => {
  const actualLib = await vi.importActual("react-router-dom");
  return {
    ...actualLib,
    useNavigate: useNavigateMock,
  };
});

function renderStore(user?: Partial<UserInterface>) {
  const store = configureStore({
    reducer: {
      user: createSlice({
        name: "user",
        initialState: {
          id: "333",
          username: "User",
          email: "email@mail.com",
          ...user,
        },
        reducers: {},
      }).reducer,
    },
  });

  return render(
    <QueryClientProvider client={clientInstance}>
      <Provider store={store}>
        <Account />
      </Provider>
    </QueryClientProvider>,
  );
}

it("renders loading state while user reviews are fetching", () => {
  useGetReviewsByUserMock.mockReturnValue({ movies: [], isLoading: true });

  renderStore();

  const loadingStatus = screen.getByRole("status");

  expect(loadingStatus).toBeInTheDocument();
});

it("renders empty state message when user has no reviews", () => {
  useGetReviewsByUserMock.mockReturnValue({ movies: [], isLoading: false });

  renderStore();

  const emptyState = screen.getByText("Ви ще не залишили жодного відгуку.");

  expect(emptyState).toBeInTheDocument();
});

it("renders user information, movie review details, and fallback poster when path is missing", () => {
  useGetReviewsByUserMock.mockReturnValue({
    movies: [
      {
        imdb: { id: 1, title: "Test title" },
        review: { rating: 10, review: "Test review" },
      },
    ],
    isLoading: false,
  });

  renderStore();

  const userUsername = screen.getByTestId("username");
  const userEmail = screen.getByTestId("email");
  const noPoster = screen.getByText("Немає постера");

  expect(userUsername).toBeInTheDocument();
  expect(userEmail).toBeInTheDocument();
  expect(noPoster).toBeInTheDocument();
});

it("render correct poster", () => {
  useGetReviewsByUserMock.mockReturnValue({
    movies: [
      {
        imdb: { id: 1, title: "Test title", poster_path: "/poster_path" },
        review: { rating: 10, review: "Test review" },
      },
    ],
    isLoading: false,
  });

  renderStore();

  const moviePoster = screen.getByRole<HTMLImageElement>("img", {
    name: "Test title",
  });

  expect(moviePoster).toBeInTheDocument();
  expect(moviePoster.src).toBe(`${IMDB_IMAGE_SRC}/poster_path`);
});

it("renders correct media attachment based on file extension", () => {
  useGetReviewsByUserMock.mockReturnValue({
    movies: [
      {
        imdb: { id: 1, title: "Test title", poster_path: "/poster_path" },
        review: { rating: 10, review: "Test review", fileName: "image.png" },
      },
    ],
    isLoading: false,
  });

  renderStore();

  const imgReview = screen.getByRole("img", { name: "Review attachment" });

  expect(imgReview).toBeInTheDocument();
});

it("handles logout action on button click", async () => {
  const user = userEvent.setup();
  useGetReviewsByUserMock.mockReturnValue({ movies: [], isLoading: false });
  useLogoutMutationMock.mockReturnValue({
    mutate: mutateMock,
    isPending: false,
  });

  renderStore();

  const logoutButton = screen.getByRole("button", { name: /logout/i });
  await user.click(logoutButton);

  expect(mutateMock).toHaveBeenCalledTimes(1);
});

it("disables logout button when mutation is pending", () => {
  useGetReviewsByUserMock.mockReturnValue({ movies: [], isLoading: false });
  useLogoutMutationMock.mockReturnValue({
    mutate: mutateMock,
    isPending: true,
  });

  renderStore();

  const logoutButton = screen.getByRole("button", { name: /logout/i });
  expect(logoutButton).toBeDisabled();
});
