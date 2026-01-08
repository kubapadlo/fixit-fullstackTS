import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Button,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { login } from "../services/login";

const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(4, "Hasło musi mieć min. 6 znaków"),
});

type formFields = z.infer<typeof loginFormSchema>;

export default function LoginScreen({ navigation }: { navigation: any }) {
  const {
    handleSubmit,
    control,
    formState: { errors }, // Dodano obsługę błędów walidacji
  } = useForm<formFields>({
    resolver: zodResolver(loginFormSchema),
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      Alert.alert("Git");
    },
    onError: (error) => {
      Alert.alert("Błąd logowania", error.message);
    },
  });

  const onSubmit = (data: formFields) => {
    mutation.mutate(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Logowanie</Text>

        {/* EMAIL INPUT */}
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        {/* PASSWORD INPUT */}
        <Text style={styles.label}>Hasło</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Hasło"
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title={mutation.isPending ? "Logowanie..." : "Zaloguj"}
            onPress={handleSubmit(onSubmit)}
            disabled={mutation.isPending}
          />
        </View>

        {mutation.isError && (
          <Text style={styles.serverError}>{mutation.error.message}</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// POPRAWKA 2: Style są konieczne, aby widzieć inputy
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    justifyContent: "center",
    flexGrow: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  serverError: {
    color: "red",
    marginTop: 15,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 20,
  },
});
