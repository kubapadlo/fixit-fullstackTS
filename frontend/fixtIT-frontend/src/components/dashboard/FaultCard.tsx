import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  CardHeader,
  Avatar,
  Chip,
  CardMedia,
  Button,
  useTheme,
} from "@mui/material";
import {
  Build as BuildIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import type { FaultWithUserObject } from "../../types/fault.type";
import { getCategoryDetails } from "../../utils/categoryHelpers";

interface FaultCardProps {
  fault: FaultWithUserObject;
  onManage: () => void;
}

const FaultCard: React.FC<FaultCardProps> = ({ fault, onManage }) => {
  const { icon, color } = getCategoryDetails(fault.category);
  const theme = useTheme();

  const isFixed = fault.state === "fixed";

  // Bezpieczny dostęp do location (zakładając że backend może zwrócić populated lub nie)
  const locationText = fault.reportedBy?.location
    ? `Akademik ${fault.reportedBy.location.dorm}, Pokój ${fault.reportedBy.location.room}`
    : "Brak danych o lokalizacji";

  return (
    <Card
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box
        sx={{
          height: 6,
          bgcolor: isFixed
            ? theme.palette.success.main
            : theme.palette.error.main,
        }}
      />

      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: color }} aria-label="category">
            {icon}
          </Avatar>
        }
        title={
          <Typography variant="subtitle1" fontWeight="bold">
            {fault.category}
          </Typography>
        }
        subheader={new Date(fault.reportedAt).toLocaleString()}
        action={
          <Chip
            label={isFixed ? "Naprawione" : "Oczekujące"}
            color={isFixed ? "success" : "warning"}
            size="small"
            variant="outlined"
          />
        }
      />

      {fault.imageURL && (
        <CardMedia
          component="img"
          height="160"
          image={fault.imageURL}
          alt="Zdjęcie usterki"
          sx={{ objectFit: "cover" }}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          display="flex"
          alignItems="center"
          mb={1}
          sx={{ bgcolor: "#f0f4f8", p: 1, borderRadius: 1 }}
        >
          <LocationIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
          <Typography variant="body2" fontWeight="bold">
            {locationText}
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mt: 2, fontWeight: 500 }}>
          {fault.description}
        </Typography>

        {fault.review && (
          <Box
            sx={{
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              pl: 2,
              mt: 2,
              py: 0.5,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Opinia technika:
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              {fault.review}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", p: 2, pt: 0 }}>
        <Button
          variant="contained"
          startIcon={<BuildIcon />}
          onClick={onManage}
          fullWidth
        >
          Zarządzaj
        </Button>
      </CardActions>
    </Card>
  );
};

export default FaultCard;
