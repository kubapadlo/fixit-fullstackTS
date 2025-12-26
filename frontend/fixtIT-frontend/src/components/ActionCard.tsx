import {
  Box,
  Typography,
  Stack,
  ButtonBase,
  Paper,
  alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import type { JSX } from "react";
import { useLoggedUserState } from "../store/userStore";

// Definicja typu dla karty
export interface CardConfig {
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
  { id: 3, title: "Kontakt", icon: <ContactSupportIcon />, color: "#ed6c02" },
];

interface ActionCardProps {
  card: CardConfig;
  index: number;
}

export const ActionCard = ({ card, index }: ActionCardProps) => {
  const isDisabled = !useLoggedUserState((state) => state.isAuthenticated);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
    >
      <ButtonBase
        disabled={isDisabled}
        onClick={() => alert(`Wybrano: ${card.title}`)}
        sx={{
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
          display: "block",
        }}
      >
        <Paper
          elevation={isDisabled ? 0 : 2}
          sx={{
            p: 3,
            height: 110,
            display: "flex",
            alignItems: "center",
            gap: 3,
            position: "relative",
            overflow: "hidden",
            bgcolor: isDisabled ? "grey.100" : "background.paper",
            border: "1px solid",
            borderColor: isDisabled ? "grey.300" : alpha(card.color, 0.2),
            transition: "0.3s",
          }}
        >
          {/* Ikona w tle */}
          <Box
            sx={{
              position: "absolute",
              right: -10,
              bottom: -10,
              opacity: 0.08,
              fontSize: 100,
              color: card.color,
              pointerEvents: "none",
              display: "flex",
              "& svg": { fontSize: "inherit" }, // Upewnia się, że ikona się skaluje
            }}
          >
            {card.icon}
          </Box>

          {/* Główna Ikona */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: isDisabled ? "grey.400" : card.color,
              color: "white",
              flexShrink: 0,
              boxShadow: isDisabled
                ? "none"
                : `0 4px 12px ${alpha(card.color, 0.4)}`,
              "& svg": { fontSize: 32 },
            }}
          >
            {card.icon}
          </Box>

          {/* Treść */}
          <Box sx={{ textAlign: "left", zIndex: 1 }}>
            <Typography
              variant="h6"
              fontWeight="800"
              sx={{ color: isDisabled ? "text.disabled" : "grey.900" }}
            >
              {card.title}
            </Typography>

            {isDisabled ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.5}
                sx={{ color: "error.main" }}
              >
                <LockOutlinedIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" fontWeight="700">
                  Zaloguj się, aby odblokować
                </Typography>
              </Stack>
            ) : (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontWeight: 500 }}
              >
                Kliknij, aby przejść
              </Typography>
            )}
          </Box>
        </Paper>
      </ButtonBase>
    </motion.div>
  );
};
