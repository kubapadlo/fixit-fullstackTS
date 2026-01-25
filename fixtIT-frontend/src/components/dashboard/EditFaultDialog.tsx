import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ReportIcon,
  Construction as ConstructionIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; 
import { addReviewSchema, type AddReviewDTO, FaultWithUserObject } from "@fixit/shared/src/types/fault"; 

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AddReviewDTO) => void; 
  fault: FaultWithUserObject | null;
  isSaving: boolean;
}

const EditFaultDialog: React.FC<EditDialogProps> = ({
  open,
  onClose,
  onSave,
  fault,
  isSaving,
}) => {
  const { 
    control, 
    handleSubmit, 
    reset, 
    watch,
    formState: { errors } 
  } = useForm<AddReviewDTO>({
    resolver: zodResolver(addReviewSchema), 
    defaultValues: {
      state: "reported",
      review: "",
    },
  });

  const currentState = watch("state");

  useEffect(() => {
    if (fault && open) {
      reset({
        state: fault.state,
        review: fault.review || "",
      });
    }
  }, [fault, open, reset]);

  const onSubmit = (data: AddReviewDTO) => {
    onSave(data);
  };

  if (!fault) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "background.paper",
          }}
        >
          Zarządzanie usterką
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ bgcolor: "background.paper" }}>
          {/* Opis zgłoszenia */}
          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Opis zgłoszenia:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                bgcolor: "background.default",
                p: 2,
                borderRadius: 1,
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              {fault.description}
            </Typography>
          </Box>

          {/* Status Select */}
          <Box mb={3}>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.state}>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    <MenuItem value="reported">
                      <Box display="flex" alignItems="center" gap={1}>
                        <ReportIcon color="warning" fontSize="small" />
                        <Typography>Zgłoszone (Wolne)</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="assigned">
                      <Box display="flex" alignItems="center" gap={1}>
                        <ConstructionIcon color="info" fontSize="small" />
                        <Typography>W trakcie realizacji (Moje)</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="fixed">
                      <Box display="flex" alignItems="center" gap={1}>
                        <CheckCircleIcon color="success" fontSize="small" />
                        <Typography>Zakończone (Naprawione)</Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                  {errors.state && (
                    <Typography variant="caption" color="error">
                      {errors.state.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Box>

          {/* Review TextField */}
          <Box>
            <Controller
              name="review"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Notatka technika / Raport z naprawy"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  placeholder={
                    currentState === "fixed"
                      ? "Opisz co zostało naprawione..."
                      : "Opcjonalna notatka..."
                  }
                  error={!!errors.review}
                  helperText={
                    errors.review 
                      ? errors.review.message 
                      : currentState === "fixed" 
                        ? "Wymagane do zamknięcia" 
                        : "Opcjonalne (według schematu min. 1 znak)"
                  }
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: "background.paper" }}>
          <Button onClick={onClose} color="inherit" disabled={isSaving}>
            Anuluj
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSaving}
          >
            {isSaving ? "Zapisywanie..." : "Zapisz zmiany"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditFaultDialog;