import {
  AppBar,
  Toolbar,
  Box,
  useTheme,
  alpha,
  Typography,
} from "@mui/material";
import Logo from "./layout/Logo";
import { ThemeToogle } from "./layout/ThemeToogle";
import LoginToogle from "./layout/LoginToogle";
import Greeter from "./layout/Greeter";
import RegisterButton from "./layout/RegisterButton";

export default function Navbar() {
  const theme = useTheme();
  return (
    <AppBar
      position="static" // przykleja navbar do gory strony, zostaje tam po scrollu w dol
      elevation={0} // usuwa cien pod navbarem
      sx={{
        background: alpha(theme.palette.background.paper, 0.8),
        color: theme.palette.primary.light,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex" }}>
          <Logo />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <ThemeToogle />
          <Greeter />
          <LoginToogle />
          <RegisterButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
