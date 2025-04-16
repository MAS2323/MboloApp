import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

const DeliveryDetailsScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header mejorado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#00C853" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Entrega</Text>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Botón para agregar opción de entrega */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/stores/AddDeliveryOptionScreen")}
      >
        <Ionicons name="add" size={20} color="#00C853" />
        <Text style={styles.addButtonText}>Agregar opción de entrega</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DeliveryDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#E8F0FE",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    // backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    margin: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D3D3D3",
  },
  addButtonText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
});
