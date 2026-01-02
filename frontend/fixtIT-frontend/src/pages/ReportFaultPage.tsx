import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Input, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { addFault } from "../services/addFault";
import { useSnackbar } from "notistack";

const formSchema = z.object({
  image: z.instanceof(File),
});

type formFields = z.infer<typeof formSchema>;

const ReportFaultPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const mutation = useMutation({
    mutationFn: addFault,
    onSuccess: () => {
      enqueueSnackbar("Usterka została dodana ✅", {
        variant: "success",
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(
        error.response.data.message ||
          "Wystąpił błąd podczas dodawania usterki ❌", // error.response.data.message
        { variant: "error" }
      );
    },
  });

  const onSubmit = (data: formFields) => {
    mutation.mutate(data);
  };

  const { control, handleSubmit, setValue } = useForm<formFields>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Box
      component="form"
      encType="multipart/form-data"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="image" // nazwa pliku ze schematu zoda
        control={control} // polaczenie Controllera z konkretnym formularzem
        render={({ field: { onChange, value, ...field } }) => {
          // render tlumaczy RHF jak podlaczyc sie i pobierac wartosci z naszych niestandardowych komponentow
          // field to zestaw narzedzi ktory dostajemy od RHF do pracy z Controller
          // destrukuturyzujac ten obiekt wybieramy narzedzia, ktore chcemy dostosowac pod siebie (onChange, value) a reszte zostawiamy defaultowo (...field)
          // value - to co aktulanie jest w polu TYLKO DO ODCZYTU, nie mozna modyfikowac value
          return (
            <Box>
              <Input
                type="file"
                sx={{ display: "none" }} // Ukrywamy domyślny input bo jest brzydki
                id="file-upload-button" // nadanie unikalnego ID, konieczne do polaczeneie z innym elementem
                {...field}
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    setValue("image", file); // Mówimy RHF: "do pola 'image' wstaw ten plik!"
                  }
                }}
              ></Input>
              {/* Kliknięcie na <label> symuluje kliknięcie na <input>
                Dzięki temu, chodź input jest niewidoczny, jego funkcjonalność nadal działa */}
              <label
                htmlFor="file-upload-button" /* powiazanie z innym elementem o danym ID */
              >
                <Button variant="contained" component="span">
                  {value ? "Zmień plik" : "Wybierz plik"}
                </Button>
              </label>

              {value && <p>Wybrany plik: {value.name}</p>}
            </Box>
          );
        }}
      ></Controller>

      <Button type="submit">klik</Button>

      {mutation.isError && (
        <Typography color="error" variant="body1" sx={{ mt: 2 }}>
          Błąd: {mutation.error?.message || "Wystąpił nieznany błąd."}
        </Typography>
      )}
    </Box>
  );
};

export default ReportFaultPage;
