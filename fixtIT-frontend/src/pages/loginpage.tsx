import { login } from "../services/login";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLoggedUserState } from "../store/userStore";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Stack,
  Alert,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";

import { loginFieldSchema, type LoginDTO } from "@fixit/shared/src/types/user";
import { mapUserFromApi } from "../mappers/faultMapper";

export function LoginPage() {
  // zustand
  const setUser = useLoggedUserState((state) => state.setUser);

  // react-router
  const navigate = useNavigate();

  // React-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDTO>({
    resolver: zodResolver(loginFieldSchema),
  });

  // React-query
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      enqueueSnackbar(`Udało się zalogować jako ${data.user.role}`, {
        variant: "success",
      });
      setUser(mapUserFromApi(data.user));
      if (data.user.role === "technician") navigate("/dashboard");
      else navigate("/");
    },
  });

  // tutaj co ma sie stac po przeslaniu formsa => żądanie na backend
  const onSubmit = (data: LoginDTO) => {
    mutation.mutate(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: "100%",
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h5" textAlign="center">
          Logowanie
        </Typography>
        {/* Email */}
        <TextField
          label="Email"
          type="text"
          placeholder="Email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
        />

        {/* Password */}
        <TextField
          label="Hasło"
          type="password"
          placeholder="Hasło"
          {...register("password")}
          error={!!errors.password} // pokazuje czerwone obramowanie przy błędzie
          helperText={errors.password?.message} // pod polem wyświetla komunikat błędu validacji ZODA
          fullWidth
        />

        {/* Submit button */}
        <Button
          variant="contained"
          type="submit"
          fullWidth
          disabled={mutation.isPending}
          sx={{ py: 1.3, borderRadius: 2 }}
        >
          Zaloguj się
        </Button>

        {mutation.isError && (
          <Alert severity="error">{(mutation.error as Error).message}</Alert>
        )}
      </Stack>
    </Box>
  );
}
