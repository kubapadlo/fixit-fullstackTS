import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getFaults from "../services/getFaults";
import FaultCard from "../components/FaultCard";
import deleteFault from "../services/deleteFault";
import { useLoggedUserState } from "../store/userStore";

export const FaultsScreen = () => {
  const logout = useLoggedUserState((state) => state.logout);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["faults"],
    queryFn: getFaults,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faults"] });
      Alert.alert("Sukces", "Usterka została usunięta");
    },
    onError: (err: any) => {
      Alert.alert("Błąd", err.message);
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196f3" />
        <Text style={styles.loadingText}>Pobieranie danych...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Wystąpił błąd</Text>
        <Text style={styles.errorMessage}>
          {error instanceof Error ? error.message : "Błąd"}
        </Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => refetch()}
        >
          <Text style={styles.buttonText}>Spróbuj ponownie</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <FaultCard
            id={item._id}
            category={item.category}
            description={item.description}
            reportedAt={item.reportedAt}
            state={item.state}
            imageURL={item.imageURL}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        )}
        // pull to refresh
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={["#2196f3"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>Brak zgłoszonych usterek.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: { marginTop: 10, color: "#666" },
  errorTitle: { fontSize: 18, fontWeight: "bold", color: "#d32f2f" },
  errorMessage: { color: "#666", textAlign: "center", marginVertical: 10 },

  floatingButton: {
    backgroundColor: "#2196f3",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "#90caf9",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  refreshButton: {
    backgroundColor: "#2196f3",
    padding: 10,
    borderRadius: 5,
  },
});
