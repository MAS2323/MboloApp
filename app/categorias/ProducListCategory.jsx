import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { COLORS, SIZES } from "../../constants/theme";
import ProductCardView from "../../components/Producs/ProductCardView";
import { API_BASE_URL } from "../../config/Service.Config";

const ProducListCategory = () => {
  const { categoryId } = useLocalSearchParams();
  const { subcategoryId } = useLocalSearchParams();
  const [subcategorias, setSubcategorias] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubcategoriesAndProducts = async () => {
      try {
        // Obtener subcategorías
        const subcategoriesResponse = await axios.get(
          `${API_BASE_URL}/subcategories/category/${categoryId}`
        );
        setSubcategorias(subcategoriesResponse.data);

        // Obtener productos de la categoría seleccionada
        const productsResponse = await axios.get(
          `${API_BASE_URL}/subcategories/filter/products?category/${categoryId}/subcategory/${subcategoryId}`
        );
        setProducts(productsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "No se pudieron cargar los datos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubcategoriesAndProducts();
  }, [categoryId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={SIZES.xxLarge} color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* AppBarWrapper para subcategorías */}
      <View style={styles.appBarWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {subcategorias.map((subcategory) => (
            <TouchableOpacity
              key={subcategory._id}
              style={styles.subcategoryButton}
              onPress={
                () => {} /* Puedes agregar funcionalidad aquí si es necesario */
              }
            >
              <Text style={styles.subcategoryText}>{subcategory.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de Productos (Vertical) */}
      <FlatList
        data={products}
        numColumns={2}
        renderItem={({ item }) => <ProductCardView item={item} />}
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
    marginTop: 25,
  },
  subcategoryButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    marginRight: SIZES.small,
    borderRadius: 20,
    backgroundColor: COLORS.softGray,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subcategoryText: {
    fontSize: SIZES.medium,
    color: COLORS.darkGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContent: {
    paddingHorizontal: SIZES.medium,
    paddingTop: SIZES.medium,
  },
  separator: {
    height: SIZES.medium,
  },
});
