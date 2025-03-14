import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const SubCategoryMenuScreen = () => {
  const { id } = useLocalSearchParams(); // Obtener el ID de la subcategoría

  return (
    <View style={styles.container}>
      {/* AppBarWrapper como header */}
      <View style={styles.appBarWrapper}>
        <Text style={styles.title}>Subcategoría {id}</Text>
      </View>

      {/* Contenido de la pantalla */}
      <View style={styles.content}>
        <Text>Detalles de la subcategoría {id}</Text>
      </View>
    </View>
  );
};

export default SubCategoryMenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Fondo blanco
  },
  appBarWrapper: {
    paddingTop: 40, // Espaciado superior para evitar que el título quede muy arriba
    paddingBottom: 15, // Espaciado inferior
    paddingHorizontal: 16, // Espaciado horizontal
    backgroundColor: "#fff", // Fondo blanco
    borderBottomWidth: 1, // Línea inferior para separar el header
    borderBottomColor: "#e0e0e0", // Color de la línea
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Color de texto más oscuro
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
