import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { COLORS, SIZES } from "../../constants/theme";
import ProductCardView from "../../components/Producs/ProductCardView";
import { API_BASE_URL } from "../../config/Service.Config";
import styles from "./styles/ProducListCategory.styles"; // Importamos los estilos desde archivo separado

const ProducListCategory = () => {
  const { categoryId } = useLocalSearchParams();
  const [subcategoryId, setSubcategoryId] = useState(null);
  const [subcategorias, setSubcategorias] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { width } = useWindowDimensions();

  // Configuración responsive
  const isLargeScreen = width >= 768;
  const numColumns = isLargeScreen ? 3 : 2;
  const productMargin = isLargeScreen ? SIZES.medium : SIZES.small;
  const subcategoryPadding = isLargeScreen ? SIZES.large : SIZES.medium;

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
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      fetchSubcategories();
    }
  }, [categoryId]);

  // Obtener productos filtrados por categoría y subcategoría
  useEffect(() => {
    const fetchProducts = async () => {
      if (!subcategoryId) return;

      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/products/filter/products?category=${categoryId}&subcategory=${subcategoryId}`
        );
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        Alert.alert("Error", "No se pudieron cargar los productos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [subcategoryId, categoryId]);

  if (isLoading && !subcategoryId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de subcategorías */}
      <View
        style={[
          styles.appBarWrapper,
          { paddingHorizontal: isLargeScreen ? SIZES.large : SIZES.small },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subcategoryListContainer}
        >
          {subcategorias.map((subcategory) => (
            <TouchableOpacity
              key={subcategory._id}
              style={[
                styles.subcategoryButton,
                subcategoryId === subcategory._id && styles.selectedSubcategory,
                {
                  paddingHorizontal: subcategoryPadding
                    ? SIZES.large
                    : SIZES.medium,
                },
              ]}
              onPress={() => setSubcategoryId(subcategory._id)}
            >
              <Text
                style={[
                  styles.subcategoryText,
                  subcategoryId === subcategory._id &&
                    styles.selectedSubcategoryText,
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {subcategory.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de productos */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          numColumns={numColumns}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1 / numColumns,
                margin: productMargin,
                maxWidth: isLargeScreen ? "33.33%" : "50%",
              }}
            >
              <ProductCardView
                item={item}
                cardStyle={{
                  height: isLargeScreen ? 280 : 220,
                  borderRadius: isLargeScreen ? SIZES.medium : SIZES.small,
                }}
              />
            </View>
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={[
            styles.flatListContent,
            { paddingHorizontal: isLargeScreen ? SIZES.large : SIZES.small },
          ]}
          ItemSeparatorComponent={() => (
            <View style={{ height: productMargin }} />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No hay productos disponibles en esta subcategoría
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default ProducListCategory;
