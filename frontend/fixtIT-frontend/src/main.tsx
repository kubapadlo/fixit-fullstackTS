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

// react-router
import Layout from "./layouts/layout.tsx";
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
      { path: "/home", element: <Homepage /> },
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
      <AppThemeProvider>
        <RouterProvider router={router} />
      </AppThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
