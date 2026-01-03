import { useQuery } from "@tanstack/react-query";
import { refresh } from "../services/refresh";
import { useNavigate } from "react-router-dom";
import { useLoggedUserState } from "../store/userStore";
import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function CheckAuth({ children }: { children: React.ReactNode }) {
  const setUser = useLoggedUserState((state) => state.setUser);
  const navigate = useNavigate();

  const { data, isLoading, error, isError, isSuccess } = useQuery({
    queryKey: ["auth"],
    queryFn: refresh,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Po udanym refresh — ustawiamy usera
  useEffect(() => {
    if (isSuccess && data) {
      //console.log(data);
      setUser(data.user, data.accessToken);
    }
  }, [isSuccess, data, setUser]);

  // Po błędzie — redirect
  useEffect(() => {
    if (isError) {
      console.log(error instanceof Error ? error.message : "Unknown error");
      //navigate("/");
    }
  }, [isError, error, navigate]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column", // Ułożenie elementów w kolumnie
          justifyContent: "center", // Wyśrodkowanie w pionie
          alignItems: "center", // Wyśrodkowanie w poziomie
          minHeight: "100vh", // Zajęcie całej wysokości widoku
          backgroundColor: "#f0f2f5", // Lekkie tło
          color: "#333",
        }}
      >
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6">Sprawdzanie autoryzacji...</Typography>{" "}
      </Box>
    );
  }
  return <>{children}</>;
}
