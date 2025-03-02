import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SubcategoriesScreen = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

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
        setSelectedCategory(parsedCategory);
        fetchSubcategories(parsedCategory._id);
      } catch (error) {
        console.error("Error parsing selected category:", error);
      }
    }
  }, [router.params]);

  // Cargar subcategorías cuando se selecciona una categoría
  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory._id);
    }
  }, [selectedCategory]);

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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSubcategories([]); // Limpiar subcategorías al cambiar de categoría
  };

  const handleSubcategoryPress = async (subcategory) => {
    try {
      await AsyncStorage.setItem(
        "selectedSubcategory",
        JSON.stringify(subcategory)
      );

      // Navegar de regreso a AddScreen
      router.push("/AddScreen");
    } catch (error) {
      console.error("Error saving subcategory:", error);
      Alert.alert("Error", "No se pudo guardar la subcategoría.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona una Categoría</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCategorySelect(item)}>
            <View
              style={[
                styles.item,
                selectedCategory?._id === item._id && styles.selectedItem,
              ]}
            >
              <Text style={styles.text}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {selectedCategory && (
        <>
          <Text style={styles.title}>
            Subcategorías de {selectedCategory.name}
          </Text>
          {subcategories.length > 0 ? (
            <FlatList
              data={subcategories}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSubcategoryPress(item)}>
                  <View style={styles.item}>
                    <Text style={styles.text}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.noData}>No hay subcategorías disponibles</Text>
          )}
        </>
      )}
    </View>
  );
};

export default SubcategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  selectedItem: {
    backgroundColor: "#d1e7dd",
  },
  text: {
    fontSize: 16,
  },
  noData: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});
