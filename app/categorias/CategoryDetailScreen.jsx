import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

const CategoryDetailScreen = ({ route }) => {
  const { categoryId } = route.params;
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await axios.get(
          `http://192.168.228.50:3000/categories/${categoryId}`
        );
        setCategoryDetails(response.data);
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    };

    fetchCategoryDetails();
  }, [categoryId]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(
          `http://192.168.228.50:3000/subcategories/category/${categoryId}`
        );
        setSubCategories(response.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubCategories();
  }, [categoryId]);

  const handleSubCategoryPress = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };

  if (!categoryDetails || subCategories.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: categoryDetails.image }}
        style={styles.categoryImage}
      />
      <View style={styles.categoryInfoContainer}>
        <Text style={styles.categoryName}>{categoryDetails.name}</Text>
        <Text style={styles.categoryDescription}>
          {categoryDetails.description}
        </Text>
      </View>
      <View style={styles.subCategoriesContainer}>
        <Text style={styles.sectionTitle}>Subcategorías</Text>
        {subCategories.map((subCategory) => (
          <TouchableOpacity
            key={subCategory._id}
            style={styles.subCategoryRow}
            onPress={() => handleSubCategoryPress(subCategory)}
          >
            <Image
              source={{ uri: subCategory.image }}
              style={styles.subCategoryImage}
            />
            <Text style={styles.subCategoryName}>{subCategory.name}</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              style={styles.clickableIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
      {selectedSubCategory && (
        <View style={styles.subCategoryDetailsContainer}>
          <Image
            source={{ uri: selectedSubCategory.image }}
            style={styles.subCategoryDetailImage}
          />
          <Text style={styles.subCategoryDetailName}>
            {selectedSubCategory.name}
          </Text>
          <Text style={styles.subCategoryDetailDescription}>
            {selectedSubCategory.description}
          </Text>
          <Text style={styles.subCategoryDetailLocation}>
            {`Ubicación: ${selectedSubCategory.location}`}
          </Text>
          <Text style={styles.subCategoryDetailContact}>
            {`Teléfono: ${selectedSubCategory.contact.phoneNumber}`}
          </Text>
          <Text style={styles.subCategoryDetailContact}>
            {`WhatsApp: ${selectedSubCategory.contact.whatsapp}`}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default CategoryDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryImage: {
    width: "100%",
    height: 200,
  },
  categoryInfoContainer: {
    padding: 20,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoryDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  subCategoriesContainer: {
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  subCategoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  subCategoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  subCategoryName: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  clickableIcon: {
    color: "#007AFF",
  },
  subCategoryDetailsContainer: {
    padding: 20,
  },
  subCategoryDetailImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  subCategoryDetailName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subCategoryDetailDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  subCategoryDetailLocation: {
    fontSize: 16,
    marginBottom: 10,
  },
  subCategoryDetailContact: {
    fontSize: 16,
    marginBottom: 10,
  },
});
