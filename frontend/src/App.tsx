import { Navigate, Outlet, RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import styled from "styled-components";
import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";
import { Provider } from "react-redux";
import { store } from "./store/store";
import ErrorElement from "./components/layout/Error/GlobalErrorHandler";
import NotFound from "./components/layout/Error/NotFound";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Signup";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClientInstance } from "./lib/queryClient";
import { useRefreshQuery } from "./hooks/auth/useRefreshQuery";
import Spinner from "./components/reusable/Spinner";
import Account from "./pages/auth/Account";
import type { ReactNode } from "react";
import VerifyEmail from "./pages/auth/VerifyEmail";
import { Toaster } from "sonner";
import Movie from "./pages/movie/Movie";
import Review from "./pages/movie/Review";

const StyledRootLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100svh;
`;

const MainContent = styled.main`
  flex: 1 0 auto;
  height: 100%;
`;

const StyledLoadingLayout = styled.div`
  width: 100%;
  height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2rem;
`;

function RootLayout() {
  const { isLoading } = useRefreshQuery();

  if (isLoading) {
    return (
      <StyledLoadingLayout>
        <Spinner />
      </StyledLoadingLayout>
    );
  }

  return (
    <StyledRootLayout>
      <Nav />
      <MainContent>
        <Outlet />
      </MainContent>
      <Footer />
    </StyledRootLayout>
  );
}

function ProtectedFromAuth({ children }: { children: ReactNode }) {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function Protected({ children }: { children: ReactNode }) {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorElement />,
    children: [
      { index: true, element: <Home /> },
      { path: "/movie/:movieId", element: <Movie /> },
      {
        path: "/login",
        element: (
          <ProtectedFromAuth>
            <Login />
          </ProtectedFromAuth>
        ),
      },
      {
        path: "/signup",
        element: (
          <ProtectedFromAuth>
            <Logout />
          </ProtectedFromAuth>
        ),
      },
      {
        path: "/account",
        element: (
          <Protected>
            <Account />
          </Protected>
        ),
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "/review/:movieId",
        element: (
          <Protected>
            <Review />
          </Protected>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClientInstance}>
        <Toaster position="top-right" richColors theme="dark" />
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
