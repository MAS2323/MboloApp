import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"; // Importar MaterialIcons

const SubcategoriesScreen = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Cargar categorías al inicio
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/categories?type=product`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        Alert.alert("Error", "No se pudieron cargar las categorías.");
      }
    };

    fetchCategories();
  }, []);

  // Manejar parámetros recibidos
  useEffect(() => {
    const { selectedCategory: categoryParam } = router.params || {};
    if (categoryParam) {
      try {
        const parsedCategory = JSON.parse(categoryParam);
        setSelectedCategoryId(parsedCategory._id);
        fetchSubcategories(parsedCategory._id);
      } catch (error) {
        console.error("Error parsing selected category:", error);
      }
    }
  }, [router.params]);

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subcategories/category/${categoryId}`
      );
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      Alert.alert("Error", "No se pudieron cargar las subcategorías.");
    }
  };

  const handleCategorySelect = async (category) => {
    if (selectedCategoryId === category._id) {
      // Si la categoría ya está seleccionada, la deseleccionamos
      setSelectedCategoryId(null);
      setSubcategories([]);
    } else {
      // Seleccionamos la nueva categoría y cargamos sus subcategorías
      setSelectedCategoryId(category._id);
      setSubcategories([]);
      fetchSubcategories(category._id);

      // Guardar la categoría seleccionada en AsyncStorage
      try {
        await AsyncStorage.setItem(
          "selectedCategory",
          JSON.stringify(category)
        );
      } catch (error) {
        console.error("Error saving category:", error);
        Alert.alert("Error", "No se pudo guardar la categoría.");
      }
    }
  };

  const handleSubcategoryPress = async (subcategory) => {
    try {
      await AsyncStorage.setItem(
        "selectedSubcategory",
        JSON.stringify(subcategory)
      );
      router.push("/cart/AddScreen");
    } catch (error) {
      console.error("Error saving subcategory:", error);
      Alert.alert("Error", "No se pudo guardar la subcategoría.");
    }
  };

  // Combinamos categorías y subcategorías en una sola lista para el FlatList
  const renderData = () => {
    let data = [];
    categories.forEach((category) => {
      data.push({ type: "category", data: category });
      if (selectedCategoryId === category._id && subcategories.length > 0) {
        subcategories.forEach((subcategory) => {
          data.push({ type: "subcategory", data: subcategory });
        });
      }
    });
    return data;
  };

  const handleBackPress = () => {
    router.back(); // Navegar hacia atrás
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header fijo con botón de retroceso */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Selecciona una Categoría</Text>
      </View>

      {/* Lista de categorías y subcategorías */}
      <FlatList
        data={renderData()}
        keyExtractor={(item) => `${item.type}-${item.data._id}`}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <>
            {item.type === "category" ? (
              <TouchableOpacity onPress={() => handleCategorySelect(item.data)}>
                <View style={styles.item}>
                  <Text style={styles.text}>{item.data.name}</Text>
                  <MaterialIcons name="chevron-right" size={24} color="#000" />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => handleSubcategoryPress(item.data)}
              >
                <View style={[styles.item, styles.subcategoryItem]}>
                  <Text style={styles.text}>{item.data.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          </>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.noData}>No hay categorías disponibles</Text>
        )}
      />
    </SafeAreaView>
  );
};

export default SubcategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#E6F0FA", // Fondo claro como en la imagen
  },
  header: {
    // backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E4E7",
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
  },
  backText: {
    fontSize: 18,
    color: "#00C853", // Verde como en la imagen
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000", // Texto negro
    flex: 1,
    textAlign: "center", // Centrar el título
  },
  listContent: {
    paddingTop: 60, // Espacio para el header fijo
    paddingBottom: 20,
  },
  item: {
    // backgroundColor: "#E6F0FA", // Fondo claro
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E4E7", // Línea divisoria
  },
  subcategoryItem: {
    paddingLeft: 40, // Indentación para subcategorías
    backgroundColor: "#F5F7FA", // Fondo ligeramente más claro para subcategorías
  },
  text: {
    fontSize: 16,
    color: "#000", // Texto negro
    fontWeight: "400",
  },
  noData: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "400",
  },
});
