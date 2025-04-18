import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, SIZES } from "../../constants/theme";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../../config/Service.Config";
import axios from "axios";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const RelatedProducts = ({
  categoryId,
  subcategoryId,
  currentProductId,
  tiendaId,
}) => {
  const router = useRouter();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Clave única para AsyncStorage
  const cacheKey = `relatedProducts_${categoryId}_${
    subcategoryId || ""
  }_${currentProductId}_${tiendaId || ""}`;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Verificar caché
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
          console.log("Cargando productos relacionados desde AsyncStorage");
          setRelatedProducts(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        // Si no hay caché, obtener de la API
        if (!categoryId || !currentProductId) {
          console.warn(
            "Faltan parámetros requeridos para productos relacionados"
          );
          setRelatedProducts([]);
          setLoading(false);
          return;
        }

        const params = {
          category: categoryId,
          _id: { $ne: currentProductId },
          limit: 6, // 6 productos para 2 filas x 3 columnas
        };
        if (subcategoryId) {
          params.subcategory = subcategoryId;
        }

        const response = await axios.get(`${API_BASE_URL}/products`, {
          params,
        });
        let products = response.data.products || response.data || [];

        if (products.length === 0 && tiendaId) {
          console.log(
            "Sin coincidencias de categoría, obteniendo productos de la tienda"
          );
          const storeResponse = await axios.get(`${API_BASE_URL}/products`, {
            params: {
              tienda: tiendaId,
              _id: { $ne: currentProductId },
              limit: 6,
            },
          });
          products = storeResponse.data.products || storeResponse.data || [];
        }

        // Guardar en AsyncStorage
        await AsyncStorage.setItem(cacheKey, JSON.stringify(products));
        setRelatedProducts(products);
      } catch (error) {
        console.error("Error al cargar productos relacionados:", error.message);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId, subcategoryId, currentProductId, tiendaId, cacheKey]);

  const renderProductItem = useCallback(({ item }) => {
    if (!item._id) {
      // Placeholder para celdas vacías
      return <View style={styles.placeholderCard} />;
    }

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.replace(`/cart/ProductDetails?id=${item._id}`)}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: item.images?.[0]?.url || "https://via.placeholder.com/150",
            }}
            style={styles.productImage}
          />
        </View>
        <Text
          style={styles.productTitle}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.title || "Producto sin título"}
        </Text>
        <Text style={styles.productPrice}>${item.price || "0"}</Text>
      </TouchableOpacity>
    );
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Productos relacionados</Text>
        <Text style={styles.noProductsText}>No hay productos relacionados</Text>
      </View>
    );
  }

  // Crear columnas de 2 productos (para 2 filas)
  const columns = [];
  for (let i = 0; i < Math.ceil(relatedProducts.length / 2); i++) {
    const colProducts = relatedProducts.slice(i * 2, (i + 1) * 2);
    // Completar con placeholders si hay menos de 2 productos
    while (colProducts.length < 2) {
      colProducts.push({});
    }
    columns.push(colProducts);
  }

  // Asegurar al menos 3 columnas para permitir scroll
  while (columns.length < 3) {
    columns.push([{}, {}]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos relacionados</Text>
      <FlatList
        data={columns}
        renderItem={({ item: column }) => (
          <View style={styles.column}>
            {column.map((product, index) => (
              <View
                key={product._id || `empty-${index}`}
                style={styles.productWrapper}
              >
                {renderProductItem({ item: product })}
              </View>
            ))}
          </View>
        )}
        keyExtractor={(_, index) => `column-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.xSmall,
    backgroundColor: COLORS.white,
    marginVertical: SIZES.xSmall,
  },
  title: {
    fontSize: SIZES.medium,
    color: COLORS.black,
    fontWeight: "600",
    marginBottom: SIZES.small,
    marginLeft: SIZES.xSmall,
  },
  flatListContent: {
    paddingHorizontal: SIZES.xSmall,
  },
  column: {
    flexDirection: "column",
    marginRight: SIZES.xSmall,
    width: (SCREEN_WIDTH - SIZES.xSmall * 4) / 3,
  },
  productWrapper: {
    padding: SIZES.xSmall / 2,
  },
  productCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.xSmall,
    padding: SIZES.xSmall,
    alignItems: "center",
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  placeholderCard: {
    width: (SCREEN_WIDTH - SIZES.xSmall * 4) / 3 - SIZES.xSmall * 2,
    height: (SCREEN_WIDTH - SIZES.xSmall * 4) / 3 + SIZES.medium, // Aproximar altura
  },
  imageContainer: {
    width: (SCREEN_WIDTH - SIZES.xSmall * 4) / 3 - SIZES.xSmall * 2,
    height: (SCREEN_WIDTH - SIZES.xSmall * 4) / 3 - SIZES.xSmall * 2,
    marginBottom: SIZES.xSmall / 2,
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: SIZES.xSmall,
    resizeMode: "contain",
  },
  productTitle: {
    fontSize: SIZES.small - 2,
    color: COLORS.black,
    textAlign: "center",
    marginBottom: SIZES.xSmall / 2,
    lineHeight: SIZES.small,
    width: "100%",
  },
  productPrice: {
    fontSize: SIZES.small - 2,
    color: "#FF6200", // Naranja
    fontWeight: "600",
  },
  loadingContainer: {
    padding: SIZES.medium,
    alignItems: "center",
  },
  noProductsText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: "center",
    marginVertical: SIZES.medium,
  },
});

export default RelatedProducts;
