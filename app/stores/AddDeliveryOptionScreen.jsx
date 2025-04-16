import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

const AddDeliveryOptionScreen = () => {
  const router = useRouter();
  const [deliveryName, setDeliveryName] = useState("");
  const [daysFrom, setDaysFrom] = useState("");
  const [daysTo, setDaysTo] = useState("");

  const handleSave = () => {
    // Aquí puedes agregar la lógica para guardar los datos
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header mejorado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#00C853" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Opción de Entrega</Text>
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Formulario */}
      <View style={styles.form}>
        {/* Nombre de la entrega */}
        <Text style={styles.label}>Nombra esta entrega *</Text>
        <TextInput
          style={styles.input}
          placeholder="Todos mis productos 1"
          value={deliveryName}
          onChangeText={setDeliveryName}
        />

        {/* Región */}
        <Text style={styles.label}>Región</Text>
        <TouchableOpacity style={styles.selectInput}>
          <Ionicons name="location-outline" size={20} color="#333" />
          <Text style={styles.selectText}>Selecciona una región</Text>
          <Ionicons name="chevron-down" size={20} color="#333" />
        </TouchableOpacity>

        {/* Días de entrega */}
        <Text style={styles.label}>¿Cuántos días falta para entregar? *</Text>
        <View style={styles.daysContainer}>
          <TextInput
            style={[styles.input, styles.daysInput]}
            placeholder="De"
            value={daysFrom}
            onChangeText={setDaysFrom}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.daysInput]}
            placeholder="A"
            value={daysTo}
            onChangeText={setDaysTo}
            keyboardType="numeric"
          />
        </View>

        {/* Facturación de gastos de envío */}
        <Text style={styles.label}>¿Facturar los gastos de envío?</Text>
        <TouchableOpacity style={styles.selectInput}>
          <Text style={styles.selectText}>Selecciona una opción</Text>
          <Ionicons name="chevron-down" size={20} color="#333" />
        </TouchableOpacity>

        {/* Botón de guardar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddDeliveryOptionScreen;

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
  form: {
    padding: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  selectText: {
    flex: 1,
    fontSize: 16,
    color: "#666",
    marginLeft: 10,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  daysInput: {
    width: "48%",
  },
  saveButton: {
    backgroundColor: "#D3D3D3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
});
