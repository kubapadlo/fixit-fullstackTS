import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardMedia,
  CardActions,
  Button,
  CardActionArea,
} from "@mui/material";

interface FaultCardProps {
  reportedAt?: string;
  category: string;
  description: string;
  state?: string;
  imageURL?: string;
  onDelete?: (id: string) => void; // Zmieniamy typ, aby przekazywać ID
  onEdit?: (id: string) => void; // Zmieniamy typ, aby przekazywać ID
  onCardClick?: (id: string) => void; // Nowy prop: co ma się stać po kliknięciu karty
  id: string; // Zakładamy, że karta zawsze ma ID
}

const FaultCard = (props: FaultCardProps) => {
  const formattedDate = props.reportedAt
    ? new Date(props.reportedAt).toLocaleDateString()
    : "Brak daty";

  return (
    <Card sx={{ minWidth: 275, maxWidth: 345, margin: 2, boxShadow: 3 }}>
      <CardActionArea
        onClick={
          props.onCardClick ? () => props.onCardClick!(props.id) : undefined
        }
      >
        {props.imageURL && (
          <CardMedia
            component="img"
            height="140"
            image={props.imageURL}
            alt={`Zdjęcie dla usterki w kategorii ${props.category}`}
            sx={{ objectFit: "cover" }}
          />
        )}

        <CardContent>
          {/* Kategoria jako tytuł */}
          <Typography gutterBottom variant="h6" component="div">
            {props.category}
          </Typography>
          {/* Opis */}
          <Typography variant="body2" color="text.secondary">
            {props.description}
          </Typography>

          {/* Data zgłoszenia */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Zgłoszono: {formattedDate}
            </Typography>
          </Box>

          {/* Status - z pillem/chipem dla lepszego wyglądu */}
          {props.state && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Status:
              </Typography>
              <Typography
                variant="body2"
                component="span" // Ważne, aby Typography nie tworzyła bloku
                sx={{
                  ml: 0.5,
                  p: "2px 8px", // padding
                  borderRadius: "4px", // zaokrąglenie
                  fontWeight: "bold",
                  backgroundColor:
                    props.state === "fixed"
                      ? "success.light"
                      : props.state === "pending"
                      ? "warning.light"
                      : "error.light",
                  color:
                    props.state === "fixed"
                      ? "success.contrastText"
                      : props.state === "pending"
                      ? "warning.contrastText"
                      : "error.contrastText",
                }}
              >
                {props.state}
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>

      {/* Akcje karty: Przyciski poza CardActionArea */}
      {(props.onEdit || props.onDelete) && (
        <CardActions
          sx={{ justifyContent: "flex-end", borderTop: "1px solid #eee" }}
        >
          {props.onEdit && (
            <Button size="small" onClick={() => props.onEdit!(props.id)}>
              Edytuj
            </Button>
          )}
          {props.onDelete && (
            <Button
              size="small"
              color="error"
              onClick={() => props.onDelete!(props.id)}
            >
              Usuń
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default FaultCard;
