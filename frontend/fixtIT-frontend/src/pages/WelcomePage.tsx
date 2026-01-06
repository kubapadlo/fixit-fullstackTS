import { Grid, Box, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { ActionCard, WELCOME_CARDS } from "../components/ActionCard";
import { useLoggedUserState } from "../store/userStore";

export function WelcomePage() {
  const user = useLoggedUserState((state) => state.user);

  const visibleCards =
    user?.role === "student"
      ? WELCOME_CARDS.slice(0, 2)
      : WELCOME_CARDS.slice(2);

  return (
    <Grid
      container
      spacing={6}
      sx={{
        py: 8,
        px: 3,
        minHeight: "80vh",
        alignItems: "center",
      }}
    >
      {/* Lewa strona: Powitanie */}
      <Grid size={{ xs: 12, md: 7 }}>
        <Box
          component={motion.div}
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            fontWeight="900"
            sx={{ color: "grey.900", mb: 2, lineHeight: 1.1 }}
          >
            Witaj w{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              FixIT
            </Box>
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: "text.secondary", maxWidth: 480, fontWeight: 400 }}
          >
            Profesjonalny system zarządzania usterkami w akademiku. Zgłaszaj,
            śledź i naprawiaj w jednym miejscu.
          </Typography>
        </Box>
      </Grid>

      {/* Prawa strona: Lista kart */}
      <Grid size={{ xs: 12, md: 5 }}>
        <Stack spacing={2.5}>
          {visibleCards.map((card, index) => (
            <ActionCard key={card.id} card={card} index={index} />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
}
