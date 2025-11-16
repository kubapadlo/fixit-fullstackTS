import { login } from "../services/login";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLoggedUserState } from "../store/userStore";
import { useNavigate } from "react-router-dom";

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
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* handleSubmit nie pusci formsa dopki nie przejdzie walidacji(zod) */}
        <label>
          Email
          <input {...register("email")} type="text" placeholder="Email"></input>
        </label>
        <label>
          Password
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
          ></input>
        </label>
        <button type="submit" disabled={mutation.isPending}>
          Click me
        </button>
        {mutation.isError && (
          <div color="red.500">{(mutation.error as Error).message}</div>
        )}
        <br />
        {errors.root && <div>{errors.root.message}</div>}
      </form>
    </>
  );
}
