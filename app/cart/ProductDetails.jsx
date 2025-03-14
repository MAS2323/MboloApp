import {
  Text,
  View,
  Image,
  Linking,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Share,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
  Fontisto,
} from "@expo/vector-icons";
import styles from "./../../components/ui/productUI/ProductDetails.style";
import { COLORS } from "./../../constants/theme";
import { useRouter, useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "../../config/Service.Config";
import axios from "axios";

export default function ProductDetails() {
  const router = useRouter();
  const { item } = useLocalSearchParams();
  const product = typeof item === "string" ? JSON.parse(item) : item;
  const [loading, setLoading] = useState(true);

  // Abrir WhatsApp
  const openWhatsApp = () => {
    const url = `whatsapp://send?phone=${product.whatsapp}`;
    Linking.openURL(url).catch(() => alert("No se puede abrir WhatsApp"));
  };

  // Abrir el marcador telefónico
  const openPhoneDialer = () => {
    const url = `tel:${product.phoneNumber}`;
    Linking.openURL(url).catch(() =>
      alert("No se puede abrir el marcador telefónico")
    );
  };

  // Función para compartir el producto
  const handleShare = async () => {
    try {
      // Verifica que `product.id` esté definido y sea válido
      if (!product?.id) {
        throw new Error("ID de producto no válido");
      }

      // URL para generar el enlace corto
      const productUrl = `${API_BASE_URL}/products/generate-link/${product.id}`;

      // Hacer la solicitud al servidor
      const response = await axios.get(productUrl);

      // Verifica que la respuesta contenga el enlace corto
      if (!response.data?.shortLink) {
        throw new Error("No se pudo generar el enlace corto");
      }

      const shortLink = response.data.shortLink;

      // Mensaje para compartir
      const message = `Mira este producto: ${product.title}\n\n${product.description}\n\nPrecio: XAF ${product.price}\n\nEnlace: ${shortLink}`;

      // Compartir el enlace
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

  useEffect(() => {
    if (product) {
      setLoading(false);
    }
  }, [product]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.upperRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back-circle" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <FontAwesome name="share-square" size={30} color={COLORS.black} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={product.images}
          renderItem={({ item, index }) => (
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
                <Image source={{ uri: item.url }} style={styles.image} />
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(image, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
        />

        <View style={styles.details}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {product.title || "Producto sin título"}
            </Text>
            <View style={styles.priceWrapper}>
              <Text style={styles.price}>XAF {product.price || "0"}</Text>
            </View>
          </View>

          <View style={styles.descriptionWrapper}>
            <Text style={styles.description}>
              {product.description || "Sin descripción"}
            </Text>
          </View>

          <View style={styles.locationWrapper}>
            <View style={styles.location}>
              <Ionicons name="location-outline" size={24} color="black" />
              <Text>
                {product.product_location?.name || "Ubicación no disponible"}
              </Text>
              <Text>
                , {product.domicilio || "Barrio, zona, calle no disponible"}
              </Text>
            </View>
            <View style={styles.location}>
              <MaterialCommunityIcons
                name="truck-delivery-outline"
                size={24}
                color="black"
              />
            </View>
          </View>

          <View style={styles.cartRow}>
            <TouchableOpacity onPress={() => {}} style={styles.cartBtn}>
              <Text style={styles.cartTitle}>Contactanos y compra</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.navigate("/cart/CartScreen")}
              style={styles.addCart}
            >
              <Fontisto
                name="shopping-bag"
                size={22}
                color={COLORS.lightwhite}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.contactRow}>
            <TouchableOpacity
              onPress={openPhoneDialer}
              style={styles.contactBtn}
            >
              <Ionicons name="call" size={24} color={COLORS.blue} />
              <Text>{product.phoneNumber || "Sin teléfono"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={openWhatsApp} style={styles.contactBtn}>
              <Fontisto name="whatsapp" size={24} color={COLORS.blue} />
              <Text>{product.whatsapp || "Sin WhatsApp"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
