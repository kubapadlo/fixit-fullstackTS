import { useQuery } from "@tanstack/react-query";
import { refresh } from "../services/refresh";
import { useLoggedUserState } from "../store/userStore";
import { useEffect, useRef } from "react"; // Dodaj useState
import { Box, CircularProgress, Typography } from "@mui/material";

export default function CheckAuth({ children }: { children: React.ReactNode }) {
  const { user, setUser, logout } = useLoggedUserState();

  const authCheckAttempted = useRef(false);

  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["auth"],
    queryFn: refresh,
    retry: false,
    refetchOnWindowFocus: false,
    // Uruchom refresh TYLKO jeśli:
    // 1. Nie mamy jeszcze użytkownika w stanie globalnym (`!user`)
    // 2. I jeszcze nie próbowaliśmy autoryzacji (`!authCheckAttempted.current`)
    //    (to zapobiegnie wielokrotnym próbom, jeśli np. refresh raz zawiódł)
    enabled: !user && !authCheckAttempted.current,
  });

  // Ustawienie flagi, że próbowaliśmy zmienic stan globalny
  useEffect(() => {
    if (!isLoading) {
      authCheckAttempted.current = true;
    }
  }, [isLoading]);

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data.user, data.accessToken);
    }
  }, [isSuccess, data, setUser]);

  // Obsługa błędów i czyszczenie stanu
  useEffect(() => {
    if (isError) {
      console.error(
        "CheckAuth: Błąd refresh tokena:",
        error instanceof Error ? error.message : "Nieznany błąd"
      );
      logout();
    }
  }, [isError, error, logout]);

  if (isLoading || !authCheckAttempted.current) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f0f2f5",
          color: "#333",
        }}
      >
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6">Sprawdzanie autoryzacji...</Typography>
      </Box>
    );
  }

  return <>{children}</>;
}

/*
1. pobranie danych z api => zmiana stanu isLoading=False => Rerender CheckAuth
2. Ocenka warunku renderowania if (isLoading || !authCheckAttempted.current) // authCheckAttempted dalej defaultowo false => wychodzi true => dalej renderuje kolko ladowania
3. WYWOLANIE USEEFECTÓW - /ustawienie stanu globalnego + zmiana flagi authCheckAttempted na True/
4. Zmiana globalnego setUser(), z ktorego korzysta ChechAuth (useLoggedUserState) => drugi rerender CheckAuth
5. Ocenka warunku renderowania if (isLoading || !authCheckAttempted.current) => wychodzi false => renderowane są dzieci (RequireRole)
6. Globalny stan user jest już aktualny => RequireRole działa poprawnie
*/
