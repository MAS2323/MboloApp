import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "./../../constants/theme";
import TendenciasScreen from "./../../components/Home/TendenciaScreen";
import { useLocalSearchParams, useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const DetallesScreen = () => {
  const router = useRouter();
  const { item } = useLocalSearchParams();
  const subcategory = item ? JSON.parse(item) : null;
  const images = subcategory?.images || [];

  const handleImagePress = (index) => {
    router.push({
      pathname: "/cart/tendenciaGalleryScreen",
      params: {
        images: JSON.stringify(images),
        index: index.toString(),
      },
    });
  };

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsApp = (phoneNumber) => {
    Linking.openURL(`https://wa.me/${phoneNumber}`);
  };

  if (!subcategory) {
    return (
      <View style={styles.container}>
        <Text>No se encontraron detalles para este producto.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <FlatList
            horizontal
            data={images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => handleImagePress(index)}
                activeOpacity={0.8}
              >
                <Image
                  source={{
                    uri: item.url || "https://via.placeholder.com/150",
                  }}
                  style={styles.image}
                />
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageList}
          />
        </View>

        <View style={styles.details}>
          <Text style={styles.title}>{subcategory.name || "Producto"}</Text>
          <Text style={styles.supplier}>
            {subcategory.description || "Descripción no disponible."}
          </Text>
          <Text style={styles.price}>
            Precio: ${subcategory.price || "N/A"}
          </Text>
          <View style={styles.contactContainer}>
            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={() => handleWhatsApp(subcategory.whatsapp)}
            >
              <Text style={styles.whatsappText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.IconButton}
              onPress={() => handleCall(subcategory.phoneNumber)}
            >
              <Ionicons name="call" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <FlatList
        data={[{}]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => <TendenciasScreen />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: 200,
  },
  image: {
    width: width * 1, // 80% del ancho de la pantalla
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  details: {
    padding: SIZES.small,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  supplier: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    color: "#FF6347",
    marginBottom: 10,
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  whatsappButton: {
    backgroundColor: "#25D366",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  whatsappText: {
    color: "#fff",
    fontSize: 14,
  },
  IconButton: {
    backgroundColor: "#4c86A8",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 17,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo oscuro semitransparente
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  fullImage: {
    width: width * 1, // 90% del ancho de la pantalla
    height: width * 1, // Misma altura que el ancho para mantener la proporción
  },
  detail: {
    fontSize: 14,
    marginBottom: 8,
  },
  imageList: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default DetallesScreen;
