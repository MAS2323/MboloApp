import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants/theme";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../../config/Service.Config";
import axios from "axios";

const RelatedProducts = ({ categoryId, subcategoryId, currentProductId }) => {
  const router = useRouter();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        if (!categoryId || !subcategoryId || !currentProductId) {
          setRelatedProducts([]);
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/products`, {
          params: {
            category: categoryId,
            subcategory: subcategoryId,
            _id: { $ne: currentProductId },
            limit: 4,
          },
        });

        setRelatedProducts(response.data);
      } catch (error) {
        console.error("Error al cargar productos relacionados:", error.message);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryId, subcategoryId, currentProductId]);

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() =>
        router.push({
          pathname: "/cart/ProductDetails",
          params: { item: JSON.stringify(item) },
        })
      }
    >
      <Image
        source={{
          uri: item.images?.[0]?.url || "https://via.placeholder.com/150",
        }}
        style={styles.productImage}
      />
      <Text style={styles.productTitle} numberOfLines={2} ellipsizeMode="tail">
        {item.title || "Producto sin título"}
      </Text>
      <Text style={styles.productPrice}>${item.price || "0"}</Text>
      <View style={styles.productRating}>
        <Ionicons name="star" size={14} color={COLORS.tertiary} />
        <Text style={styles.productRatingText}>
          {item.comentarios?.length || 0}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos Relacionados</Text>
      <FlatList
        data={relatedProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: SIZES.medium,
    color: COLORS.black,
    fontWeight: "bold",
    marginBottom: SIZES.medium,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: SIZES.medium,
  },
  productCard: {
    width: (SIZES.width - SIZES.medium * 3) / 2,
    marginBottom: SIZES.medium,
  },
  productImage: {
    width: "100%",
    height: (SIZES.width - SIZES.medium * 3) / 2,
    borderRadius: SIZES.small,
    resizeMode: "cover",
  },
  productTitle: {
    fontSize: SIZES.small,
    color: COLORS.black,
    marginTop: SIZES.xSmall,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  productRatingText: {
    fontSize: SIZES.small - 2,
    color: COLORS.gray,
    marginLeft: 3,
  },
  loadingContainer: {
    padding: SIZES.medium,
    alignItems: "center",
  },
});

export default RelatedProducts;
