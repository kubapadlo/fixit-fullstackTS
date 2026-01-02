import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { Button } from "@mui/material";
import { useLoggedUserState } from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/logoutUser";

const LoginToogle = () => {
  const isAuthenicated = useLoggedUserState((state) => state.isAuthenticated);
  const logout = useLoggedUserState((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
    logout();
  };

  if (isAuthenicated) {
    return (
      <Button
        sx={{ ":hover": { transition: "0.2s", transform: "scale(1.03)" } }}
        variant="contained"
        onClick={handleLogout}
        startIcon={<LogoutIcon />}
      >
        Wyloguj
      </Button>
    );
  } else {
    return (
      <Button
        variant="contained"
        onClick={() => navigate("/login")}
        startIcon={<LoginIcon />}
        sx={{
          transition: "0.2s",
          ":hover": { transform: "scale(1.03)" },
          ":active": { transform: "scale(0.97)" },
        }}
      >
        Logowanie
      </Button>
    );
  }
};

export default LoginToogle;
