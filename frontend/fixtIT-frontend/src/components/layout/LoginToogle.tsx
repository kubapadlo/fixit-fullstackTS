import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { Button } from "@mui/material";
import { useLoggedUserState } from "../../store/userStore";
import { useNavigate } from "react-router-dom";

const LoginToogle = () => {
  const isAuthenicated = useLoggedUserState((state) => state.isAuthenticated);
  const logout = useLoggedUserState((state) => state.logout);
  const navigate = useNavigate();

  if (isAuthenicated) {
    return (
      <Button variant="contained" onClick={logout} startIcon={<LogoutIcon />}>
        Wyloguj
      </Button>
    );
  } else {
    return (
      <Button
        variant="contained"
        onClick={() => navigate("/login")}
        startIcon={<LoginIcon />}
        sx={{ fontWeight: "70bobold" }}
      >
        Zaloguj
      </Button>
    );
  }
};

export default LoginToogle;
