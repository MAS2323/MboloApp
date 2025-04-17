import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Share,
} from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import styles from "./../../components/ui/productUI/ProductDetails.style";
import { COLORS } from "./../../constants/theme";
import { useRouter, useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "../../config/Service.Config";
import axios from "axios";
import RelatedProducts from "./RelatedProducts";

export default function ProductDetails() {
  const router = useRouter();
  const { item } = useLocalSearchParams();

  // Memoize product parsing to prevent re-creation
  const product = useMemo(() => {
    try {
      return typeof item === "string" ? JSON.parse(item) : item;
    } catch (error) {
      console.error("Error parsing product item:", error);
      return null;
    }
  }, [item]);

  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState(null);

  // Función para compartir el producto
  const handleShare = async () => {
    try {
      if (!product?._id) {
        throw new Error("ID de producto no válido");
      }

      const productUrl = `${API_BASE_URL}/products/shortLink/${product._id}`;
      const response = await axios.post(productUrl);

      if (!response.data?.shortLink) {
        throw new Error("No se pudo generar el enlace corto");
      }

      const shortLink = response.data.shortLink;
      const message = `Mira este producto: ${product.title}\n\n${product.description}\n\nPrecio: ${product.price}\n\nEnlace: ${shortLink}`;

      const result = await Share.share({
        message,
        url: shortLink,
        title: product.title,
      });

      if (result.action === Share.sharedAction) {
        console.log("Compartido con éxito");
      } else if (result.action === Share.dismissedAction) {
        console.log("Compartir cancelado");
      }
    } catch (error) {
      console.error("Error al compartir:", error);
      alert("Hubo un problema al generar el enlace.");
    }
  };

  // Cargar datos de la tienda
  useEffect(() => {
    const loadStoreData = async () => {
      try {
        if (!product) {
          setStore(null);
          setLoading(false);
          return;
        }

        if (product.tienda?._id) {
          setStore({
            id: product.tienda._id,
            name: product.tienda.name,
            logo: product.tienda.logo?.url,
            description: product.tienda.description,
            phone_number: product.tienda.phone_number,
            address: product.tienda.address?.name || "No disponible",
            specific_location: product.tienda.specific_location,
            owner: product.tienda.owner?.userName || "Anónimo",
          });
        } else if (product.tienda && typeof product.tienda === "string") {
          const response = await axios.get(
            `${API_BASE_URL}/tienda/${product.tienda}`
          );
          const data = response.data;
          setStore({
            id: data._id,
            name: data.name,
            logo: data.logo?.url,
            description: data.description,
            phone_number: data.phone_number,
            address: data.address?.name || "No disponible",
            specific_location: data.specific_location,
            owner: data.owner?.userName || "Anónimo",
          });
        } else {
          setStore(null);
        }
      } catch (error) {
        console.error("Error al cargar datos de la tienda:", error.message);
        setStore(null);
      } finally {
        setLoading(false);
      }
    };

    loadStoreData();
  }, [product]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.storeError}>Error: Producto no disponible</Text>
      </View>
    );
  }

  // Definir las secciones para el FlatList
  const sections = [
    { type: "images", data: product.images || [] }, // Sección de imágenes
    { type: "details", data: product }, // Sección de detalles
    { type: "store", data: store }, // Sección de tienda
    {
      type: "related",
      data: {
        categoryId: product.category?._id,
        subcategoryId: product.subcategory?._id,
        currentProductId: product._id,
      },
    }, // Sección de productos relacionados
  ];

  const renderSection = ({ item }) => {
    switch (item.type) {
      case "images":
        return (
          <View>
            <View style={styles.upperRow}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons
                  name="chevron-back-circle"
                  size={30}
                  color={COLORS.black}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare}>
                <FontAwesome
                  name="share-square"
                  size={30}
                  color={COLORS.black}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={item.data}
              renderItem={({ item: image, index }) => (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/cart/ImageGalleryScreen",
                      params: {
                        images: JSON.stringify(product.images),
                        index: index.toString(),
                      },
                    })
                  }
                >
                  <View style={styles.imageContainer}>
                    <Image
                      source={{
                        uri: image.url || "https://via.placeholder.com/300",
                      }}
                      style={styles.image}
                    />
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(image, index) => `image-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
            />
          </View>
        );

      case "details":
        return (
          <View style={styles.details}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>${item.data.price || "0"}</Text>
            </View>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {item.data.title || "Producto sin título"}
            </Text>
            <View style={styles.detailsWrapper}>
              <Text style={styles.detailItem}>
                Categoría: {item.data.category?.name || "No especificada"}
              </Text>
              <Text style={styles.detailItem}>
                Subcategoría: {item.data.subcategory?.name || "No especificada"}
              </Text>
              {item.data.tallas?.length > 0 && (
                <Text style={styles.detailItem}>
                  Tallas disponibles: {item.data.tallas.join(", ")}
                </Text>
              )}
              {item.data.numeros_calzado?.length > 0 && (
                <Text style={styles.detailItem}>
                  Números de calzado: {item.data.numeros_calzado.join(", ")}
                </Text>
              )}
              {item.data.colores?.length > 0 && (
                <Text style={styles.detailItem}>
                  Colores disponibles: {item.data.colores.join(", ")}
                </Text>
              )}
            </View>
            <View style={styles.descriptionWrapper}>
              <Text style={styles.descriptionTitle}>Descripción</Text>
              <Text style={styles.description}>
                {item.data.description || "Sin descripción"}
              </Text>
            </View>
            {item.data.comentarios?.length > 0 && (
              <View style={styles.commentsWrapper}>
                <Text style={styles.commentsTitle}>
                  Comentarios ({item.data.comentarios.length})
                </Text>
                {item.data.comentarios.slice(0, 3).map((comment, index) => (
                  <View key={index} style={styles.commentItem}>
                    <Text style={styles.commentUser}>
                      {comment.user?.userName || "Anónimo"}
                    </Text>
                    <Text style={styles.commentText}>{comment.comment}</Text>
                    <Text style={styles.commentDate}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
                {item.data.comentarios.length > 3 && (
                  <TouchableOpacity>
                    <Text style={styles.viewMoreComments}>
                      Ver más comentarios
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        );

      case "store":
        return (
          <View style={styles.storeContainer}>
            <Text style={styles.storeTitle}>Tienda</Text>
            {item.data ? (
              <TouchableOpacity
                style={styles.storeCard}
                onPress={() =>
                  router.push({
                    pathname: "/tienda/TiendaDetalle",
                    params: { id: item.data.id },
                  })
                }
              >
                {item.data.logo ? (
                  <Image
                    source={{ uri: item.data.logo }}
                    style={styles.storeLogo}
                  />
                ) : (
                  <View style={[styles.storeLogo, styles.placeholderImage]}>
                    <Ionicons
                      name="storefront-outline"
                      size={20}
                      color={COLORS.gray}
                    />
                  </View>
                )}
                <View style={styles.storeInfo}>
                  <View style={styles.storeHeader}>
                    <Text style={styles.storeName}>
                      {item.data.name || "Tienda sin nombre"}
                    </Text>
                    <View style={styles.storeRating}>
                      <Ionicons name="star" size={14} color={COLORS.tertiary} />
                      <Text style={styles.storeRatingText}>
                        {product.comentarios?.length || 0} comentarios
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.storeStats}>
                    Dirección: {item.data.address}{" "}
                    {item.data.specific_location || ""}
                  </Text>
                </View>
                <TouchableOpacity style={styles.storeButton}>
                  <Text style={styles.storeButtonText}>Seguir</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ) : (
              <Text style={styles.storeError}>
                No se encontraron detalles de la tienda.
              </Text>
            )}
          </View>
        );

      case "related":
        return (
          <RelatedProducts
            categoryId={item.data.categoryId}
            subcategoryId={item.data.subcategoryId}
            currentProductId={item.data.currentProductId}
          />
        );

      default:
        return null;
    }
  };

  return (
    <FlatList
      data={sections}
      renderItem={renderSection}
      keyExtractor={(item, index) => `${item.type}-${index}`}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    />
  );
}
