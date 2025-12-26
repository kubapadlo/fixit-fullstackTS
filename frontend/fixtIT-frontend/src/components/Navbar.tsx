import { AppBar, Toolbar, Box, useTheme, alpha } from "@mui/material";
import Logo from "./layout/Logo";
import { ThemeToogle } from "./layout/ThemeToogle";
import LoginToogle from "./layout/LoginToogle";

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
        <Logo />
        <Box sx={{ display: "flex", gap: 2 }}>
          <ThemeToogle />
          <LoginToogle />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
