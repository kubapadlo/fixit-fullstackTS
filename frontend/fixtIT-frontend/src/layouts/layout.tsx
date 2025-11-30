import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeStore } from "../store/themeStore";
import { Outlet } from "react-router-dom";
import { useLoggedUserState } from "../store/userStore";

import { useNavigate } from "react-router-dom";
import { logout } from "../services/logout";

export default function Layout() {
  const navigate = useNavigate();

  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isLoggedIn = useLoggedUserState((state) => state.isAuthenticated);
  const logoutState = useLoggedUserState((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
      logoutState();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppBar position="static" color="primary">
        <Toolbar className="flex justify-between">
          <Typography
            variant="h6"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer" }}
          >
            FixIT
          </Typography>
          <div style={{ flexGrow: 1 }} />

          <div className="ml-auto flex items-center gap-4">
            <IconButton onClick={toggleTheme} color="inherit">
              {theme === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>

            {isLoggedIn ? (
              <Button variant="outlined" color="inherit" onClick={handleLogout}>
                Wyloguj
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/login")}
              >
                Zaloguj
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>

      <main className="flex-1 p-4 bg-background-default text-primary-text">
        <Outlet />
      </main>
    </div>
  );
}
