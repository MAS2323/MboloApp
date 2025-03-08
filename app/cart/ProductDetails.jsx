import {
  Text,
  View,
  Image,
  Linking,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  Ionicons,
  SimpleLineIcons,
  MaterialCommunityIcons,
  Fontisto,
} from "@expo/vector-icons";
import styles from "./../../components/ui/productUI/ProductDetails.style";
import { COLORS } from "./../../constants/theme";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ProductDetails() {
  const router = useRouter();
  const { item } = useLocalSearchParams();
  const product = typeof item === "string" ? JSON.parse(item) : item;
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(true);

  // Incrementar y decrementar la cantidad de productos
  const handleIncrement = () => setCount((prevCount) => prevCount + 1);
  const handleDecrement = () =>
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : prevCount));

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
          <TouchableOpacity onPress={() => router.navigate("/cart/CartScreen")}>
            <Fontisto name="shopping-bag" size={24} color={COLORS.black} />
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

          <View style={styles.ratingRow}>
            <View style={styles.rating}>
              {[1, 2, 3, 4, 5].map((index) => (
                <Ionicons key={index} name="star" size={24} color="gold" />
              ))}
              <Text style={styles.ratingText}>(4.9)</Text>
            </View>
            <View style={styles.quantityControl}>
              <TouchableOpacity onPress={handleIncrement}>
                <SimpleLineIcons name="plus" size={20} color="black" />
              </TouchableOpacity>
              <Text style={styles.ratingText}>{count}</Text>
              <TouchableOpacity onPress={handleDecrement}>
                <SimpleLineIcons name="minus" size={20} color="black" />
              </TouchableOpacity>
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
              {/* <Text>Entrega gratis</Text> */}
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
