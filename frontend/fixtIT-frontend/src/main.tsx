import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { LoginPage } from "./pages/LoginPage.tsx";
import Homepage from "./pages/HomePage.tsx";
import { WelcomePage } from "./pages/WelcomePage.tsx";

import { useThemeStore } from "./store/themeStore.ts";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme, darkTheme } from "./theme.ts";

import CheckAuth from "./components/CheckAuth.tsx";

import { SnackbarProvider } from "notistack";

// react-router
import Layout from "./layouts/layout.tsx";
import { FaultsPage } from "./pages/FaultsPage.tsx";
import ReportFaultPage from "./pages/ReportFaultPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CheckAuth>
        <Layout />
      </CheckAuth>
    ),
    children: [
      {
        path: "/",
        element: <WelcomePage />,
      },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/home", element: <Homepage /> },
      { path: "/showFaults", element: <FaultsPage /> },
      { path: "/report", element: <ReportFaultPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

//react-query
const queryClient = new QueryClient();

//
function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  const muiTheme = theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        autoHideDuration={4000}
      >
        <AppThemeProvider>
          <RouterProvider router={router} />
        </AppThemeProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  </StrictMode>
);
