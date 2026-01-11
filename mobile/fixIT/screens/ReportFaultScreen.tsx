import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "@tanstack/react-query";
import { addFault } from "../services/addFault";

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
  image: z.any().optional(),
});

type FormFields = z.infer<typeof formSchema>;

const ReportFaultScreen = () => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: "", category: "" as any },
  });

  const mutation = useMutation({
    mutationFn: addFault,
    onSuccess: () => {
      Alert.alert("Sukces", "Usterka została dodana");
      reset();
    },
    onError: (error: any) => {
      Alert.alert("Błąd", error.message || "Wystąpił błąd");
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setValue("image", result.assets[0]);
    }
  };

  //const selectedCategory = watch("category");
  const [modalVisible, setModalVisible] = useState(false);

  const onSubmit = (data: FormFields) => {
    mutation.mutate(data);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Zgłoś Usterkę</Text>

        {/* Opis */}
        <Text style={styles.label}>Opis usterki</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.description && styles.inputError,
              ]}
              placeholder="Opis usterki..."
              multiline
              numberOfLines={4}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.description && (
          <Text style={styles.errorText}>{errors.description.message}</Text>
        )}

        {/* Kategoria - zmieniono onPress na otwarcie Modala */}
        <Text style={styles.label}>Kategoria</Text>
        <TouchableOpacity
          style={[
            styles.input,
            styles.selector,
            errors.category && styles.inputError,
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Text>{getValues("category") || "Wybierz kategorię..."}</Text>
        </TouchableOpacity>
        {errors.category && (
          <Text style={styles.errorText}>{errors.category.message}</Text>
        )}

        {/* MODAL Z LISTĄ KATEGORII */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setModalVisible(false)}
          >
            <View
              style={styles.modalContent}
              onStartShouldSetResponder={() => true}
            >
              <Text style={styles.modalTitle}>Wybierz kategorię</Text>
              <FlatList
                data={categories}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => {
                      setValue("category", item);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.categoryText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Pressable>
        </Modal>

        {/* Zdjęcie */}
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>
            {control._formValues.image ? "Zmień zdjęcie" : "Wybierz zdjęcie"}
          </Text>
        </TouchableOpacity>

        <Controller
          control={control}
          name="image"
          render={({ field: { value } }) =>
            value ? (
              <View style={styles.previewContainer}>
                <Image source={{ uri: value.uri }} style={styles.preview} />
                <Text style={styles.fileName}>Wybrano plik</Text>
              </View>
            ) : (
              <View />
            )
          }
        />

        {/* Przycisk wysyłania */}
        <Pressable
          style={[
            styles.submitButton,
            mutation.isPending && styles.buttonDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Zgłoś</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 5, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    marginBottom: 5,
    fontSize: 16,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  selector: { justifyContent: "center", height: 50 },
  inputError: { borderColor: "red" },
  errorText: { color: "red", fontSize: 12, marginBottom: 10 },
  imageButton: {
    backgroundColor: "#e0e0e0",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  imageButtonText: { fontWeight: "600" },
  previewContainer: { alignItems: "center", marginBottom: 15 },
  preview: { width: 100, height: 100, borderRadius: 5, marginBottom: 5 },
  fileName: { fontSize: 12, color: "#666" },
  submitButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: "#90caf9" },
  submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  categoryItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  categoryText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default ReportFaultScreen;
