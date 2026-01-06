import {
  Box,
  Typography,
  Stack,
  ButtonBase,
  Paper,
  alpha,
  Icon,
} from "@mui/material";
import { motion } from "framer-motion";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import type { JSX } from "react";
import { useLoggedUserState } from "../store/userStore";
import { useNavigate } from "react-router-dom";

interface CardConfig {
  id: number;
  title: string;
  icon: JSX.Element;
  color: string;
}

// Stała z danymi kart
export const WELCOME_CARDS: CardConfig[] = [
  {
    id: 1,
    title: "Zgłoś Usterkę",
    icon: <BuildCircleIcon />,
    color: "#1976d2",
  },
  { id: 2, title: "Moje Usterki", icon: <ListAltIcon />, color: "#2e7d32" },
  {
    id: 3,
    title: "Zarządzaj Usterkami",
    icon: <SettingsSuggestIcon />,
    color: "#ed6c02",
  },
];

interface CardProps {
  card: CardConfig;
  index: number;
}

export const ActionCard = ({ card, index }: CardProps) => {
  const isAuthenticated = useLoggedUserState((state) => state.isAuthenticated);
  const isLocked = !isAuthenticated;
  const navigate = useNavigate();

  const handleCardClick = () => {
    switch (card.id) {
      case 1:
        navigate("/report"); // Zgłoś usterkę
        break;
      case 2:
        navigate("/showFaults"); // Zgłoś usterkę
        break;
      case 3:
        navigate("/dashboard"); // Zgłoś usterkę
        break;
      default:
        console.warn("Nieznana karta:", card.id);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={!isLocked ? { scale: 1.02 } : {}}
    >
      <ButtonBase
        disabled={isLocked}
        onClick={!isLocked ? handleCardClick : undefined}
        sx={{
          backgroundColor: "red",
          height: 150,
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          px: 3,
          bgcolor: isLocked ? "grey.100" : "background.paper",
          borderRadius: 10,
          overflow: "hidden", // wszystko poza boxem zostaje ucinane, nic nie wystaje
          transition: "0.3s",
        }}
      >
        {/* ikonka tło */}
        <Box
          sx={{
            position: "absolute",
            bottom: 3,
            right: 3,
            opacity: 0.2,
            "& svg": { fontSize: 80 },
            zIndex: 1, // dajemy ikonka na spód, zeby byla pod tekstem
          }}
        >
          {card.icon}
        </Box>

        {/* ikonka glowna */}
        <Box
          sx={{
            width: 45,
            height: 45,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: !isAuthenticated ? "grey.400" : card.color,
            borderRadius: 3,
            "& svg": { fontSize: 28 }, // rozmiar ikonki
            marginRight: 1,
          }}
        >
          {card.icon}
        </Box>

        {/* tekst */}
        <Box sx={{ textAlign: "left" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: isLocked ? "grey.500" : "text.primary",
            }}
          >
            {card.title}
          </Typography>

          {isLocked && (
            <Stack alignItems="center" direction={"row"} spacing={0.5}>
              <LockOutlinedIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">Najpierw się zaloguj</Typography>
            </Stack>
          )}
        </Box>
      </ButtonBase>
    </motion.div>
  );
};
