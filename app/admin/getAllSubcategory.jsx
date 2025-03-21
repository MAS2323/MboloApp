import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";
import { COLORS, SIZES } from "../../constants/theme";

const GetAllSubcategory = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener todos los menús y extraer las subcategorías
  useEffect(() => {
    const fetchMenusAndSubcategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/`);
        const menus = response.data;

        // Extraer subcategorías únicas
        const subcategorySet = new Set();
        menus.forEach((menu) => {
          if (menu.subcategory) {
            subcategorySet.add(JSON.stringify(menu.subcategory)); // Usamos JSON.stringify para manejar objetos
          }
        });

        // Convertir el Set a un array de objetos
        const uniqueSubcategories = Array.from(subcategorySet).map((subcat) =>
          JSON.parse(subcat)
        );
        setSubcategories(uniqueSubcategories);
      } catch (error) {
        console.error("Error fetching menus:", error);
        Alert.alert("Error", "No se pudieron cargar las subcategorías.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenusAndSubcategories();
  }, []);

  // Renderizar cada subcategoría
  const renderSubcategory = ({ item }) => (
    <View style={styles.subcategoryItem}>
      <Text style={styles.subcategoryText}>
        {item.name || "Subcategoría sin nombre"}
      </Text>
      <Text style={styles.subcategoryId}>ID: {item._id}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todas las Subcategorías</Text>
      {subcategories.length === 0 ? (
        <Text style={styles.noSubcategoriesText}>
          No se encontraron subcategorías.
        </Text>
      ) : (
        <FlatList
          data={subcategories}
          renderItem={renderSubcategory}
          keyExtractor={(item) => item._id || Math.random().toString()} // Usar _id como clave, o un valor aleatorio si no existe
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default GetAllSubcategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightwhite,
    paddingHorizontal: SIZES.medium,
    paddingTop: SIZES.large,
  },
  title: {
    fontSize: SIZES.xLarge,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: SIZES.medium,
    textAlign: "center",
  },
  subcategoryItem: {
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    marginBottom: SIZES.small,
    borderRadius: 10,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subcategoryText: {
    fontSize: SIZES.medium,
    fontWeight: "600",
    color: COLORS.darkGray,
  },
  subcategoryId: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: SIZES.xSmall,
  },
  listContent: {
    paddingBottom: SIZES.large,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noSubcategoriesText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: "center",
    marginTop: SIZES.large,
  },
});
