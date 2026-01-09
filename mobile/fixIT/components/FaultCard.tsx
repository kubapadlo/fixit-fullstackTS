import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

interface FaultCardProps {
  id: string;
  category: string;
  description: string;
  reportedAt?: string;
  state?: string;
  imageURL?: string;
  onDelete: (id: string) => void;
}

const FaultCard = ({
  id,
  category,
  description,
  reportedAt,
  state,
  imageURL,
  onDelete,
}: FaultCardProps) => {
  const date = reportedAt
    ? new Date(reportedAt).toLocaleDateString()
    : "Brak daty";

  const getStatusColor = (status?: string) => {
    if (status === "fixed") return "#4caf50"; 
    if (status === "assigned") return "#2196f3"; 
    return "#ff9800";
  };

  return (
    <View style={styles.card}>
      {imageURL && <Image source={{ uri: imageURL }} style={styles.image} />}

      <View style={styles.content}>
        <Text style={styles.category}>Kategoria: {category}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.date}>Zgłoszono: {date}</Text>

        {state && (
          <View
            style={[styles.badge, { backgroundColor: getStatusColor(state) }]}
          >
            <Text style={styles.badgeText}>{state}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(id)}
      >
        <Text style={styles.deleteText}>Usuń</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 15,
    overflow: "hidden",
    elevation: 3, // cień na Androidzie
    shadowColor: "#000", // cień na iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: { width: "100%", height: 150 },
  content: { padding: 15 },
  category: { fontWeight: "bold", fontSize: 18, marginBottom: 5 },
  description: { color: "#666", marginBottom: 10 },
  date: { fontSize: 12, color: "#999" },
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  badgeText: { color: "white", fontWeight: "bold", fontSize: 12 },
  deleteButton: {
    borderTopWidth: 1,
    borderColor: "#eee",
    padding: 10,
    alignItems: "center",
  },
  deleteText: { color: "red", fontWeight: "bold" },
});

export default FaultCard;
