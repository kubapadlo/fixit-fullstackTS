import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { addFault } from "../services/addFault";
import { useSnackbar } from "notistack";

import { FAULT_CATEGORIES } from "@fixit/shared/src/types/fault";

import  { ReportFaultFormSchema, type ReportFaultDTO } from "../types/fault.type";

export default function ReportFaultPage() {
  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ReportFaultDTO>({
    resolver: zodResolver(ReportFaultFormSchema),
    defaultValues: {
      description: "",
      category: "" as any, // Pusty string zapobiega ostrzeżeniom MUI
      image: undefined,
    },
  });

  // Obserwujemy zdjęcie, żeby móc wyświetlić nazwę lub podgląd
  const selectedImage = watch("image");

  const mutation = useMutation({
    mutationFn: addFault,
    onSuccess: () => {
      enqueueSnackbar("Usterka została dodana", { variant: "success" });
      reset();
    },
    onError: (error: Error) => {
      // TUTAJ POPRAWKA: Używamy error.message, bo addFault rzuca Error
      enqueueSnackbar(error.message, { variant: "error" });
    },
  });

  const onSubmit = (data: ReportFaultDTO) => {
    mutation.mutate(data);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
      <Paper elevation={6} sx={{ width: { xs: "100%", sm: 450 }, p: 3, borderRadius: 2 }}>
        <Typography variant="h5" align="center" mb={3}>Zgłoś Usterkę</Typography>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Opis usterki"
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <FormControl fullWidth error={!!errors.category}>
              <InputLabel id="category-label">Kategoria</InputLabel>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select labelId="category-label" label="Kategoria" {...field}>
                    {FAULT_CATEGORIES.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.category && (
                <Typography color="error" variant="caption" sx={{ ml: 1.5, mt: 0.5 }}>
                  {errors.category.message}
                </Typography>
              )}
            </FormControl>

            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setValue("image", file, { shouldValidate: true });
                }}
              />
              <label htmlFor="image-upload">
                <Button variant="outlined" component="span" fullWidth>
                  {selectedImage ? "Zmień zdjęcie" : "Dodaj zdjęcie (opcjonalnie)"}
                </Button>
              </label>
              
              {selectedImage && (
                <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center' }}>
                  Wybrano: {selectedImage.name} 
                  <Button size="small" color="error" onClick={() => setValue("image", undefined)}>Usuń</Button>
                </Typography>
              )}
              {errors.image && (
                <Typography color="error" variant="caption">{errors.image.message}</Typography>
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={mutation.isPending}
              size="large"
              fullWidth
            >
              {mutation.isPending ? "Wysyłanie..." : "Zgłoś usterkę"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};