import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";
import { useRouter } from "expo-router";

const MenuScreen = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const formatData = (categories, numColumns) => {
    const numberOfFullRows = Math.floor(categories.length / numColumns);

    let numberOfElementsLastRow =
      categories.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      categories.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }

    return categories;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Aquí estamos pasando el tipo como parámetro en la query string.
        const response = await axios.get(
          `${API_BASE_URL}/categories?type=menu`
        );
        setCategories(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("No se pudieron cargar las categorías. Inténtalo de nuevo.");
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryPress = async (categoryId, categoryName) => {
    console.log("Category ID sent from frontend:", categoryId);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subcategories/category/${categoryId}`
      );
      router.push({
        pathname: "/categorias/CategoryMenuScreen",
        params: {
          subcategories: JSON.stringify(response.data),
          categoryName: categoryName,
        },
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Si no hay subcategorías, redirige con un array vacío
        router.push({
          pathname: "/categorias/CategoryMenuScreen",
          params: {
            subcategories: JSON.stringify([]),
            categoryName: categoryName,
          },
        });
      } else {
        console.error("Error fetching subcategories:", error);
      }
    }
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item._id, item.name)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.categoryImage} />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );
  const numColumns = 3;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorías</Text>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={formatData(categories, numColumns)}
          renderItem={renderItem}
          numColumns={numColumns}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "left",
    marginTop: 7,
    letterSpacing: 4,
    marginBottom: 5,
    color: "gray",
    fontSize: 20,
  },
  categoryItem: {
    flex: 1,
    margin: 4,
    padding: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MenuScreen;
