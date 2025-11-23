import { login } from "../services/login";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLoggedUserState } from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Stack, Alert } from "@mui/material";

const formSchema = z.object({
  email: z.email(),
  password: z.string(),
});

type formFields = z.infer<typeof formSchema>;

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
  } = useForm<formFields>({
    resolver: zodResolver(formSchema),
  });

  // React-query
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data.user, data.accessToken);

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    },
  });

  // tutaj co ma sie stac po przeslaniu formsa => żądanie na backend
  const onSubmit = (data: formFields) => {
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
          label="Password"
          type="password"
          placeholder="Password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
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
          Click me
        </Button>

        {/* Backend errors */}
        {mutation.isError && (
          <Alert severity="error">{(mutation.error as Error).message}</Alert>
        )}

        {/* Zod root error */}
        {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
      </Stack>
    </Box>
  );
}
