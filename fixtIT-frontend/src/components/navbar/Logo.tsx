import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Logo() {
  const navigate = useNavigate();

  return (
    <Typography
      onClick={() => navigate("/")}
      variant="h4"
      sx={{
        transition: "0.2s",
        ":hover": { transform: "scale(1.05)" },
        "&:active": { transform: "scale(0.95)" },
        cursor: "pointer",
        fontWeight: 300,
      }}
    >
      FixIT
    </Typography>
  );
}
