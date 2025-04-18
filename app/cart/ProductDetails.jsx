import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import styles from "./../../components/ui/productUI/ProductDetails.style";
import { COLORS, SIZES } from "./../../constants/theme";
import { useRouter, useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "../../config/Service.Config";
import axios from "axios";
import RelatedProducts from "./RelatedProducts";
import StoreCard from "./StoreCard";
import HeaderScreen from "../../components/Home/Header";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState(null);
  const [showHeader, setShowHeader] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) {
          throw new Error("ID de producto no proporcionado");
        }
        const response = await axios.get(`${API_BASE_URL}/products/${id}`);
        console.log("Product API response:", response.data);
        setProduct(response.data);
      } catch (error) {
        console.error("Error al cargar el producto:", error.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch store data
  useEffect(() => {
    const loadStoreData = async () => {
      try {
        if (!product) {
          setStore(null);
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
            banner: product.tienda.banner?.url,
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
            banner: data.banner?.url,
          });
        } else {
          setStore(null);
        }
      } catch (error) {
        console.error("Error al cargar datos de la tienda:", error.message);
        setStore(null);
      }
    };

    loadStoreData();
  }, [product]);

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

  // Handle scroll to show/hide HeaderScreen
  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const imageSectionHeight = SIZES.height * 0.4; // Height of image section
    const triggerPoint = imageSectionHeight / 2; // Show header after half the image

    setShowHeader(scrollY > triggerPoint);
  };

  // Handle header click
  const handleHeaderPress = (event) => {
    event.stopPropagation(); // Prevent event bubbling to FlatList
    router.push("/home"); // Navigate to home screen (adjust as needed)
  };

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
    { type: "images", data: product.images || [] },
    { type: "details", data: product },
    { type: "store", data: store },
    {
      type: "related",
      data: {
        categoryId: product.category,
        subcategoryId: product.subcategory?._id,
        currentProductId: product._id,
        tiendaId: product.tienda?._id || product.tienda,
      },
    },
  ];

  console.log("Passing to RelatedProducts:", sections[3].data);

  const renderSection = ({ item }) => {
    switch (item.type) {
      case "images":
        return (
          <View style={styles.sectionContainer}>
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
          <View style={styles.sectionContainer}>
            <View style={styles.details}>
              <View style={styles.priceRow}>
                <Text style={styles.price}>XFA{item.data.price || "0"}</Text>
              </View>
              <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                {item.data.title || "Producto sin título"}
              </Text>
              <View style={styles.detailsWrapper}>
                <Text style={styles.detailItem}>
                  Categoría:{" "}
                  {item.data.subcategory?.category?.name || "No especificada"}
                </Text>
                <Text style={styles.detailItem}>
                  Subcategoría:{" "}
                  {item.data.subcategory?.name || "No especificada"}
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
          </View>
        );

      case "store":
        return (
          <StoreCard store={item.data} productComments={product.comentarios} />
        );

      case "related":
        return (
          <RelatedProducts
            categoryId={item.data.categoryId}
            subcategoryId={item.data.subcategoryId}
            currentProductId={item.data.currentProductId}
            tiendaId={item.data.tiendaId}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {showHeader && (
        <TouchableOpacity
          style={styles.header}
          onPress={handleHeaderPress}
          activeOpacity={0.7}
        >
          <HeaderScreen />
        </TouchableOpacity>
      )}
      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
}
