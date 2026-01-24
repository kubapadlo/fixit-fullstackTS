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
  Construction as ConstructionIcon, // Dodano ikonę dla statusu "assigned"
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import type { FaultWithUserObject } from "../../types/fault.type";

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: EditFormData) => void;
  fault: FaultWithUserObject | null;
  isSaving: boolean;
}

export interface EditFormData {
  state: "reported" | "assigned" | "fixed";
  review: string;
}

const EditFaultDialog: React.FC<EditDialogProps> = ({
  open,
  onClose,
  onSave,
  fault,
  isSaving,
}) => {
  const { control, handleSubmit, reset, watch } = useForm<EditFormData>({
    defaultValues: {
      state: "reported",
      review: "",
    },
  });

  // Obserwujemy zmianę stanu, aby walidować review
  const currentState = watch("state");

  useEffect(() => {
    if (fault && open) {
      reset({
        state: fault.state as "reported" | "assigned" | "fixed",
        review: fault.review || "",
      });
    }
  }, [fault, open, reset]);

  const onSubmit = (data: EditFormData) => {
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
            color: "text.primary",
          }}
        >
          Zarządzanie usterką
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: "background.paper" }}>
          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Opis zgłoszenia:
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{
                bgcolor: "background.default",
                p: 2,
                borderRadius: 1,
                color: "text.primary",
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              {fault.description}
            </Typography>
          </Box>

          <Box mb={3}>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth variant="outlined">
                  <InputLabel sx={{ color: "text.secondary" }}>
                    Status
                  </InputLabel>
                  <Select
                    {...field}
                    label="Status"
                    sx={{ color: "text.primary" }}
                  >
                    <MenuItem value="reported">
                      <Box display="flex" alignItems="center" gap={1}>
                        <ReportIcon color="warning" fontSize="small" />
                        <Typography color="text.primary">
                          Zgłoszone (Wolne)
                        </Typography>
                      </Box>
                    </MenuItem>

                    <MenuItem value="assigned">
                      <Box display="flex" alignItems="center" gap={1}>
                        <ConstructionIcon color="info" fontSize="small" />
                        <Typography color="text.primary">
                          W trakcie realizacji (Moje)
                        </Typography>
                      </Box>
                    </MenuItem>

                    <MenuItem value="fixed">
                      <Box display="flex" alignItems="center" gap={1}>
                        <CheckCircleIcon color="success" fontSize="small" />
                        <Typography color="text.primary">
                          Zakończone (Naprawione)
                        </Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Box>

          <Box>
            <Controller
              name="review"
              control={control}
              rules={{
                validate: (value) => {
                  if (
                    currentState === "fixed" &&
                    (!value || value.trim().length < 5)
                  ) {
                    return "Przy oznaczaniu jako 'Naprawione' wymagana jest krótka notatka (min. 5 znaków).";
                  }
                  return true;
                },
              }}
              render={({ field, fieldState: { error } }) => (
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
                  error={!!error}
                  helperText={
                    error
                      ? error.message
                      : currentState === "fixed"
                      ? "Wymagane do zamknięcia zgłoszenia"
                      : "Opcjonalne"
                  }
                  sx={{
                    "& .MuiInputBase-input": { color: "text.primary" },
                    "& .MuiInputLabel-root": { color: "text.secondary" },
                  }}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: "background.paper" }}>
          <Button
            onClick={onClose}
            color="inherit"
            disabled={isSaving}
            sx={{ color: "text.secondary" }}
          >
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
