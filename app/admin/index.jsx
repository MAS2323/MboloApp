import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const options = [
  {
    name: "Manage Users",
    icon: "people",
    screen: "/admin/UserManagementScreen",
    color: "#F4B7B2",
  },
  {
    name: "Subcategory",
    icon: "layers",
    screen: "/admin/AddSubcategoryScreen",
    color: "#C2E7FF",
  },
  {
    name: "All Subcategories",
    icon: "grid",
    screen: "/admin/getAllSubcategory",
    color: "#FFD700",
  },
  {
    name: "Banner",
    icon: "image",
    screen: "/admin/BannerScreen",
    color: "#A3D9A5",
  },
];

const AdminScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <View style={styles.grid}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: option.color }]}
            onPress={() => router.push(option.screen)}
          >
            <Ionicons name={option.icon} size={32} color="#333" />
            <Text style={styles.cardText}>{option.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    width: 120,
    height: 120,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AdminScreen;
