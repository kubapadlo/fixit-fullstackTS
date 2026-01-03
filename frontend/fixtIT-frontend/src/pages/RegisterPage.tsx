import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import registerUser from "../services/register";
import { useNavigate } from "react-router-dom";

const RegisterFormSchema = z.object({
  firstName: z.string().min(1, "Imię jest wymagane"),
  lastName: z.string().min(1, "Nazwisko jest wymagane"),
  email: z.email("Proszę podać poprawny adres email"),
  password: z.string().min(4, "Hasło musi zawierać co najmniej 4 znaki"),
  location: z.object({
    dorm: z.string().min(1, "Akademik jest wymagany"),
    room: z
      .string()
      .min(1, "Pokój jest wymagany")
      .regex(/^\d{3}[A-Z]$/, "Błędny format pokoju"),
  }),
});

type formFields = z.infer<typeof RegisterFormSchema>;

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<formFields>({
    resolver: zodResolver(RegisterFormSchema),
  });

  const onSubmit = (data: formFields) => {
    mutation.mutate(data);
  };

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: registerUser,
    mutationKey: ["user"],
    onSuccess: () => {
      enqueueSnackbar("Udało się zarejestrować, teraz się zaloguj!", {
        variant: "success",
      });
      reset();
      navigate("/");
    },
  });

  return (
    <Paper
      elevation={6}
      sx={{ maxWidth: 420, padding: 2, mt: 3, borderRadius: 2, mx: "auto" }}
    >
      <Box
        component="form"
        display={"flex"}
        justifyContent={"center"}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Stack spacing={2} sx={{ width: "100%", padding: 2 }}>
          <Typography variant="h5" textAlign="center">
            Rejestracja
          </Typography>
          <TextField
            label="Imię"
            placeholder="Imię"
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          ></TextField>
          <TextField
            label="Nazwisko"
            placeholder="Nazwisko"
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          ></TextField>
          <TextField
            label="Email"
            placeholder="Email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          ></TextField>
          <TextField
            type="password"
            label="Hasło"
            placeholder="Hasło"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          ></TextField>
          {/* Graficzne wydzielenie lokalizacji*/}
          <Box
            sx={{
              border: "1px solid",
              borderColor: errors.location ? "error.main" : "divider",
              padding: 2,
              borderRadius: 1,
              position: "relative",
              marginTop: 10,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                position: "absolute",
                top: -12,
                left: 10,
                backgroundColor: "background.paper",
                px: 0.5,
              }}
            >
              Lokalizacja
            </Typography>
            <Stack spacing={2} sx={{ marginTop: 0.5 }}>
              <TextField
                label="Akademik"
                placeholder="Nazwa akademika"
                {...register("location.dorm")}
                error={!!errors.location?.dorm}
                helperText={errors.location?.dorm?.message}
                fullWidth
              ></TextField>
              <TextField
                label="Pokój"
                placeholder="Numer pokoju"
                {...register("location.room")}
                error={!!errors.location?.room}
                helperText={errors.location?.room?.message}
                fullWidth
              ></TextField>
            </Stack>
          </Box>
          <Button type="submit" variant="contained">
            {mutation.isPending ? "Czekaj..." : "Zarejestruj się"}
          </Button>
          {mutation.isError && (
            <Box>
              <Typography color="red"> {mutation.error.message} </Typography>{" "}
            </Box>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

export default RegisterPage;
