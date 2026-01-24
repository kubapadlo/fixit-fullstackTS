import { Box, Button, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      sx={{
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <ErrorOutlineIcon
        sx={{
          fontSize: 80,
          color: "text.secondary",
          mb: 2,
        }}
      />

      <Typography variant="h1" fontWeight={700}>
        404
      </Typography>

      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        The page you’re looking for doesn’t exist.
      </Typography>

      <Button variant="contained" size="large" onClick={() => navigate("/")}>
        Back to home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
