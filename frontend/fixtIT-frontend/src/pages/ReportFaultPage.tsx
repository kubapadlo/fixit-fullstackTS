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
import z from "zod";
import { addFault } from "../services/addFault";
import { useSnackbar } from "notistack";

const categories = [
  "Elektryk",
  "Hydraulik",
  "Murarz",
  "Malarz",
  "Stolarz",
  "Ślusarz",
];

const formSchema = z.object({
  description: z.string().min(1, "Opis jest wymagany"),
  category: z.enum(categories, "Musisz wybrać kategorię"),
  image: z.instanceof(File).optional(),
});

type formFields = z.infer<typeof formSchema>;

const ReportFaultPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const mutation = useMutation({
    mutationFn: addFault,
    onSuccess: () => {
      enqueueSnackbar("Usterka została dodana", {
        variant: "success",
      });
      reset(); // resetuje pola po sukcesie
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response.data.message ||
          "Wystąpił błąd podczas dodawania usterki",
        { variant: "error" }
      );
    },
  });

  const onSubmit = (data: formFields) => {
    mutation.mutate(data);
  };

  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors },
    reset,
  } = useForm<formFields>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Paper
        elevation={6} // Większy cień dla lepszego wyglądu
        sx={{
          width: { xs: "100%", sm: 400, md: 500 }, // Responsywna szerokość
          maxWidth: "100%",
          padding: 3, // Większy padding
          borderRadius: 2, // Zaokrąglone rogi
        }}
      >
        {" "}
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          align="center"
          mb={3}
        >
          Zgłoś Usterkę
        </Typography>
        <Box
          component="form"
          encType="multipart/form-data"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack spacing={2}>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Opis usterki..."
              id="description"
              label="Opis usterki..."
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description ? errors.description.message : ""}
            ></TextField>

            <FormControl fullWidth error={!!errors.category}>
              <InputLabel id="category-label">Kategoria</InputLabel>{" "}
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    labelId="category-label"
                    id="category"
                    label="Kategoria"
                    {...field}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.category && (
                <Typography color="error" variant="caption">
                  {errors.category.message}
                </Typography>
              )}
            </FormControl>

            <Controller
              name="image"
              control={control}
              render={({ field: { onChange, value, ...field } }) => {
                return (
                  <Box>
                    <Input
                      type="file"
                      sx={{ display: "none" }}
                      id="file-upload-button"
                      {...field}
                      onChange={(e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          setValue("image", file);
                        }
                      }}
                    ></Input>
                    <label htmlFor="file-upload-button">
                      <Button variant="contained" component="span" fullWidth>
                        {value ? "Zmień zdjęcie" : "Wybierz zdjęcie"}
                      </Button>
                    </label>

                    {value && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1, ml: 1 }}
                      >
                        Wybrany plik: {value.name}
                      </Typography>
                    )}
                    {errors.image && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 1, ml: 1.4 }}
                      >
                        {errors.image.message}
                      </Typography>
                    )}
                  </Box>
                );
              }}
            ></Controller>

            <Button
              type="submit"
              variant="contained"
              disabled={mutation.isPending}
              size="large"
            >
              {mutation.isPending ? "Czekaj..." : "Zgłoś"}
            </Button>
          </Stack>

          {mutation.isError && (
            <Typography color="error" variant="body1" sx={{ mt: 2 }}>
              Błąd: {mutation.error?.message || "Wystąpił nieznany błąd."}
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ReportFaultPage;
