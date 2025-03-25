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

const CategorySelectionScreen = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Cargar categorías de tipo "menu"
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/categories?type=menu`
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

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setSubcategories([]); // Limpiar subcategorías al cambiar de categoría

    // Guardar la categoría seleccionada en AsyncStorage
    try {
      await AsyncStorage.setItem("selectedCategory", JSON.stringify(category));
    } catch (error) {
      console.error("Error saving category:", error);
      Alert.alert("Error", "No se pudo guardar la categoría.");
    }
  };

  const handleSubcategoryPress = async (subcategory) => {
    try {
      await AsyncStorage.setItem(
        "selectedSubcategory",
        JSON.stringify(subcategory)
      );
      // Navegar de regreso a la pantalla principal
      router.back();
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
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <Text style={styles.noData}>No hay subcategorías disponibles</Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  item: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedItem: {
    backgroundColor: "#e3f2fd",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  noData: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
  },
});

export default CategorySelectionScreen;
