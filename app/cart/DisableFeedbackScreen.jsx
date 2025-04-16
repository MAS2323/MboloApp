import { StyleSheet, Text, View, Switch, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

const DisableFeedbackScreen = () => {
  const router = useRouter();
  const [isFeedbackEnabled, setIsFeedbackEnabled] = useState(true);

  const handleSave = () => {
    // Aquí puedes agregar la lógica para guardar la configuración
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#00C853" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Desactivar Comentarios</Text>
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.description}>
          Puedes desactivar los comentarios si no deseas recibir
          retroalimentación de los usuarios. Esto aplicará a todos tus pedidos y
          servicios.
        </Text>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Permitir comentarios</Text>
          <Switch
            value={isFeedbackEnabled}
            onValueChange={(value) => setIsFeedbackEnabled(value)}
            trackColor={{ false: "#D3D3D3", true: "#00C853" }}
            thumbColor={isFeedbackEnabled ? "#fff" : "#fff"}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DisableFeedbackScreen;

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
  content: {
    padding: 15,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    lineHeight: 22,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#D3D3D3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
});
