import { IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import { useThemeStore } from "../../store/themeStore";

export const ThemeToogle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Tooltip
      title={theme === "light" ? "Włącz tryb ciemny" : "Włącz tryb jasny"}
      arrow
    >
      <IconButton
        onClick={toggleTheme}
        sx={{ transition: "0.2s", ":hover": { transform: "rotate(20deg)" } }}
      >
        {theme === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Tooltip>
  );
};
