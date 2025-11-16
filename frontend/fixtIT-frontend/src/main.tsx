import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { LoginPage } from "./pages/loginpage.tsx";
import Homepage from "./pages/homepage.tsx";

// react-router
const router = createBrowserRouter([{ path: "/", element: <LoginPage /> },
  {path: "/home", element: <Homepage/>}
]);

//react-query
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
