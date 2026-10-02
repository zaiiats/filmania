import { cleanup, render, screen } from "@testing-library/react";
import { it, expect, vi, afterEach, beforeEach } from "vitest";
import AccountAvatar, { DEFAULT_IMAGE_SRC } from "./AccountAvatar";
import { Provider } from "react-redux";
import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import type { UserInterface } from "@/store/store";
import { userEvent } from "@testing-library/user-event";

let queryClientInstance = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function createTestStore(initialUser: Partial<UserInterface> = {}) {
  return configureStore({
    reducer: {
      user: createSlice({
        name: "user",
        initialState: {
          username: null,
          email: null,
          profilePicture: "http",
          id: null,
          ...initialUser,
        },
        reducers: {},
      }).reducer,
    },
  });
}

function renderWithProviders(
  ui: React.ReactElement,
  initialUser: Partial<UserInterface> = {},
) {
  const store = createTestStore(initialUser);
  return render(
    <QueryClientProvider client={queryClientInstance}>
      <Provider store={store}>{ui}</Provider>
    </QueryClientProvider>,
  );
}

const mutationMock = vi.fn();

vi.mock("@/hooks/auth/useUpdateAvatarMutation", () => ({
  useUpdateAvatarMutation: () => ({
    mutate: mutationMock,
  }),
}));

beforeEach(() => {
  queryClientInstance = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

it("returns the avatar image with the right src", () => {
  const { container } = renderWithProviders(<AccountAvatar />);

  const inputFile = container.querySelector("#avatar");
  const avatarImage = container.querySelector("img");

  expect(avatarImage).toBeInTheDocument();
  expect(avatarImage).toHaveAttribute("src", "http");
  expect(inputFile).toBeInTheDocument();
});

it("returns the avatar image with the fallback image", () => {
  renderWithProviders(<AccountAvatar />, {
    username: null,
    email: null,
    profilePicture: null,
    id: null,
  });

  const avatarImage = screen.getByRole("img");

  expect(avatarImage).toBeInTheDocument();
  expect(avatarImage).toHaveAttribute("src", DEFAULT_IMAGE_SRC);
});

it("handleChangeAvatar press results in clicking on hiddent input", async () => {
  const user = userEvent.setup();

  const { container } = renderWithProviders(<AccountAvatar />);

  const editContainer = screen.getByTestId("avatar-edit-container")!;
  const hiddenInput = container.querySelector("#avatar") as HTMLInputElement;

  const clickSpy = vi.spyOn(hiddenInput, "click");

  await user.click(editContainer);

  expect(clickSpy).toHaveBeenCalledTimes(1);
});

it("mutates the file picked by the user", async () => {
  const user = userEvent.setup();

  const file = new File(["file"], "avatar.png", { type: "image/png" });

  const { container } = renderWithProviders(<AccountAvatar />);

  const hiddenInput = container.querySelector("#avatar") as HTMLInputElement;

  await user.upload(hiddenInput, file);

  expect(mutationMock).toHaveBeenCalledWith(file);
});
