import { Button } from "@mui/material";
import { useLoggedUserState } from "../../store/userStore";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";

const RegisterButton = () => {
  const isAuthenicated = useLoggedUserState((state) => state.isAuthenticated);
  const navigate = useNavigate();

  if (!isAuthenicated) {
    return (
      <Button
        sx={{
          transition: "0.2s",
          ":hover": { transform: "scale(1.03)" },
          ":active": { transform: "scale(0.97)" },
        }}
        startIcon={<PersonAddIcon />}
        variant="contained"
        onClick={() => navigate("/register")}
      >
        Rejestracja
      </Button>
    );
  }
};

export default RegisterButton;
