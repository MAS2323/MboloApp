import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "./../../config/Service.Config";
// import { apiUrl } from "@env";

const CategoryListScreen = () => {
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        const categoriesWithSubcategories = await Promise.all(
          response.data.map(async (category) => {
            const subcategoriesResponse = await axios.get(
              `http:// 192.168.0.119:3000/subcategories/category/${category._id}`
            );
            return {
              ...category,
              subcategories: subcategoriesResponse.data,
            };
          })
        );
        setCategories(categoriesWithSubcategories);
      } catch (error) {
        console.error("Error fetching categories and subcategories:", error);
      }
    };

    fetchCategories();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate("CategoryForm", { category: item })}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  categoryItem: {
    padding: 16,
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 18,
  },
});

export default CategoryListScreen;
