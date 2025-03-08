import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { COLORS, SIZES } from "../../constants/theme";
import ProductCardView from "../../components/Producs/ProductCardView";
import { API_BASE_URL } from "../../config/Service.Config";

const ProducListCategory = () => {
  const { categoryId } = useLocalSearchParams();
  const [subcategoryId, setSubcategoryId] = useState(null);
  const [subcategorias, setSubcategorias] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener subcategorías de la categoría seleccionada
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/subcategories/category/${categoryId}`
        );
        setSubcategorias(response.data);

        // Seleccionar la primera subcategoría automáticamente
        if (response.data.length > 0) {
          setSubcategoryId(response.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        Alert.alert("Error", "No se pudieron cargar las subcategorías.");
      }
    };

    if (categoryId) {
      fetchSubcategories();
    }
  }, [categoryId]);

  // Obtener productos filtrados por categoría y subcategoría
  useEffect(() => {
    const fetchProducts = async () => {
      if (!subcategoryId) return; // No hacer la solicitud si no hay subcategoría seleccionada

      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/products/filter/products?category=${categoryId}&subcategory=${subcategoryId}`
        );
        setProducts(response.data.products || []); // Asegúrate de que sea un array
      } catch (error) {
        console.error("Error fetching products:", error);
        Alert.alert("Error", "No se pudieron cargar los productos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [subcategoryId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de subcategorías */}
      <View style={styles.appBarWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {subcategorias.map((subcategory) => (
            <TouchableOpacity
              key={subcategory._id}
              style={[
                styles.subcategoryButton,
                subcategoryId === subcategory._id && styles.selectedSubcategory,
              ]}
              onPress={() => setSubcategoryId(subcategory._id)}
            >
              <Text
                style={[
                  styles.subcategoryText,
                  subcategoryId === subcategory._id &&
                    styles.selectedSubcategoryText,
                ]}
              >
                {subcategory.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de productos */}
      <FlatList
        data={products}
        numColumns={2}
        renderItem={({ item }) => {
          return <ProductCardView item={item} />;
        }}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.flatListContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ProducListCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightwhite,
    marginTop: 25,
  },
  appBarWrapper: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  subcategoryButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    marginRight: SIZES.small,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedSubcategory: {
    backgroundColor: COLORS.primary,
  },
  subcategoryText: {
    fontSize: SIZES.medium,
    color: COLORS.darkGray,
  },
  flatListContent: {
    paddingHorizontal: SIZES.medium,
    paddingTop: SIZES.medium,
  },
  separator: {
    height: SIZES.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
