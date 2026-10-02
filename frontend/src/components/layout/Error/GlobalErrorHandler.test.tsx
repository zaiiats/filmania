import { it, expect, vi, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { screen } from "@testing-library/react";
import ErrorElement from "./GlobalErrorHandler";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

const { mockIsRouteErrorResponse, mockUseRouteError } = vi.hoisted(() => ({
  mockIsRouteErrorResponse: vi.fn(),
  mockUseRouteError: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actualLib = await vi.importActual("react-router-dom");

  return {
    ...actualLib,
    isRouteErrorResponse: mockIsRouteErrorResponse,
    useRouteError: mockUseRouteError,
  };
});

it("renders status and custom error message when route error contains message", () => {
  mockIsRouteErrorResponse.mockReturnValue(true);
  mockUseRouteError.mockReturnValue({
    error: { message: "ERROR_MESSAGE" },
    status: 404,
  });

  render(<ErrorElement />);

  const title = screen.getByRole("heading", { name: /Ooops! 404/i });
  const message = screen.getByText(/ERROR_MESSAGE/i);

  expect(title).toBeInTheDocument();
  expect(message).toBeInTheDocument();
});

it("renders default fallback message when route error has no message", () => {
  mockIsRouteErrorResponse.mockReturnValue(true);
  mockUseRouteError.mockReturnValue({
    status: 404,
  });

  render(<ErrorElement />);

  const message = screen.getByText(/Something happened!/i);

  expect(message).toBeInTheDocument();
});

it("renders unexpected error title and message for standard Error instance", () => {
  mockIsRouteErrorResponse.mockReturnValue(false);
  mockUseRouteError.mockReturnValue(new Error("ERROR_MESSAGE"));

  render(<ErrorElement />);

  const title = screen.getByRole("heading", { name: /Unexpected Error!/i });
  const message = screen.getByText(/ERROR_MESSAGE/i);

  expect(title).toBeInTheDocument();
  expect(message).toBeInTheDocument();
});

it("renders unexpected error title gracefully when error is null or undefined", () => {
  mockIsRouteErrorResponse.mockReturnValue(false);
  mockUseRouteError.mockReturnValue(null);

  render(<ErrorElement />);

  const title = screen.getByRole("heading", { name: /Unexpected Error!/i });
  const message = screen.getByText(/Try doing this operation later/i);

  expect(title).toBeInTheDocument();
  expect(message).toBeInTheDocument();
});
