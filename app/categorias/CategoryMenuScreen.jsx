import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

const CategoryMenuScreen = () => {
  const { categoryName, subcategories } = useLocalSearchParams();
  const parsedSubcategories = subcategories ? JSON.parse(subcategories) : [];
  const router = useRouter(); // Hook para navegación

  return (
    <View style={styles.container}>
      {/* AppBarWrapper como header */}
      <View style={styles.appBarWrapper}>
        <Text style={styles.title}>{categoryName}</Text>
      </View>

      {/* Lista de subcategorías */}
      {parsedSubcategories.length > 0 ? (
        <FlatList
          data={parsedSubcategories}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push(`./SubCategoryMenuScreen/${item._id}`)} // Ruta relativa
            >
              {/* Imagen de la subcategoría */}
              <Image
                source={{
                  uri: item.imageUrl || "https://via.placeholder.com/50",
                }} // Imagen por defecto si no hay URL
                style={styles.image}
              />
              {/* Texto de la subcategoría */}
              <View style={styles.textContainer}>
                <Text style={styles.text}>{item.name}</Text>
                {item.description && ( // Descripción opcional
                  <Text style={styles.description}>{item.description}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.flatListContent} // Estilo para el contenido del FlatList
          style={styles.flatList} // Estilo para el contenedor del FlatList
        />
      ) : (
        <Text style={styles.noData}>No hay subcategorías disponibles</Text>
      )}
    </View>
  );
};

export default CategoryMenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Fondo blanco
  },
  appBarWrapper: {
    paddingTop: 40, // Espaciado superior para evitar que el título quede muy arriba
    paddingBottom: 15, // Espaciado inferior
    backgroundColor: "#fff", // Fondo blanco
    borderBottomWidth: 1, // Línea inferior para separar el header
    borderBottomColor: "#e0e0e0", // Color de la línea
    justifyContent: "center", // Centrar verticalmente
    alignItems: "center", // Centrar horizontalmente
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Color de texto más oscuro
  },
  flatList: {
    flex: 1, // Ocupa todo el espacio disponible
  },
  flatListContent: {
    paddingBottom: 20, // Espaciado inferior para evitar que el último elemento quede pegado al borde
  },
  item: {
    flexDirection: "row", // Alinear imagen y texto horizontalmente
    alignItems: "center", // Centrar verticalmente
    padding: 10, // Espaciado interno
    borderBottomWidth: 1, // Línea inferior para separar ítems
    borderBottomColor: "#e0e0e0", // Color de la línea
  },
  image: {
    width: 50, // Ancho de la imagen
    height: 50, // Alto de la imagen
    borderRadius: 25, // Bordes redondeados para la imagen
    marginRight: 10, // Espaciado a la derecha de la imagen
  },
  textContainer: {
    flex: 1, // Ocupa todo el espacio restante
  },
  text: {
    fontSize: 16,
    color: "#333", // Color de texto principal
  },
  description: {
    fontSize: 14,
    color: "#777", // Color de texto secundario
    marginTop: 4, // Espaciado superior para la descripción
  },
  noData: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});
