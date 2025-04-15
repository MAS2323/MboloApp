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
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";

const CategorySelectionScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

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
    const { selectedCategory: categoryParam } = params || {};
    if (categoryParam) {
      try {
        const parsedCategory = JSON.parse(categoryParam);
        setSelectedCategory(parsedCategory);
        fetchSubcategories(parsedCategory._id);
      } catch (error) {
        console.error("Error parsing selected category:", error);
      }
    }
  }, [params]);

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
    setSelectedSubcategory(null); // Limpiar subcategoría seleccionada
  };

  const handleSubcategoryPress = (subcategory) => {
    setSelectedSubcategory(subcategory);
    // Reemplazar la pantalla actual con /stores/CreateProfessionalAccount y pasar las selecciones
    router.replace({
      pathname: "/stores/CreateProfessionalAccount",
      params: {
        categoryId: selectedCategory._id,
        categoryName: selectedCategory.name,
        subcategoryId: subcategory._id,
        subcategoryName: subcategory.name,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={30} color="#00C853" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Selecciona una Categoría</Text>
      </View>
      <View style={styles.container}>
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
                <MaterialIcons name="chevron-right" size={24} color="#666" />
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />

        {selectedCategory && (
          <>
            <Text style={styles.sectionTitle}>
              Subcategorías de {selectedCategory.name}
            </Text>
            {subcategories.length > 0 ? (
              <FlatList
                data={subcategories}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSubcategoryPress(item)}
                  >
                    <View
                      style={[
                        styles.item,
                        selectedSubcategory?._id === item._id &&
                          styles.selectedItem,
                      ]}
                    >
                      <Text style={styles.text}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <Text style={styles.noData}>
                No hay subcategorías disponibles
              </Text>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerText: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginRight: 30, // Compensar el espacio del ícono de retroceso
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedItem: {
    backgroundColor: "#e3f2fd",
  },
  text: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  noData: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
    fontStyle: "italic",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
  },
});

export default CategorySelectionScreen;
