import { Outlet, RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import styled from "styled-components";
import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";
import { Provider } from "react-redux";
import { store } from "./store/store";
import ErrorElement from "./components/layout/Error/GlobalErrorHandler";
import NotFound from "./components/layout/Error/NotFound";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Signup";

const StyledRootLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100svh;
`;

const MainContent = styled.main`
  flex: 1 0 auto;
  height: 100%;
`;

function RootLayout() {
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorElement />,
    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Logout /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
