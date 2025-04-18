import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";

// Colores definidos (usando la paleta proporcionada)
const COLORS = {
  primary: "#4c86A8",
  secondary: "#DDF0FF",
  tertiary: "#FF7754",
  gray: "#83829A",
  gray2: "#C1C0C8",
  offwhite: "#F3F4F8",
  white: "#FFFFFF",
  black: "#000000",
  red: "#e81e4d",
  green: "#00C135",
  lightwhite: "#FAFAFC",
};

const MiTiendaScreen = () => {
  const router = useRouter();
  const [tienda, setTienda] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Cargar los datos de la tienda y los productos
  useEffect(() => {
    const loadStoreAndProducts = async () => {
      try {
        setIsLoading(true);
        const userId = await AsyncStorage.getItem("id");
        if (!userId) {
          Alert.alert("Error", "Debes iniciar sesión para ver tu tienda.");
          router.navigate("LoginScreen");
          return;
        }
        const cleanUserId = userId.replace(/"/g, "");

        // Check cached data
        const storedStoreData = await AsyncStorage.getItem("store_data");
        const storedProductsData = await AsyncStorage.getItem("products_data");

        if (storedStoreData && storedProductsData) {
          const parsedStoreData = JSON.parse(storedStoreData);
          const parsedProductsData = JSON.parse(storedProductsData);
          if (
            parsedStoreData &&
            parsedStoreData.owner === cleanUserId &&
            parsedStoreData.id &&
            parsedProductsData
          ) {
            setTienda(parsedStoreData);
            setProducts(parsedProductsData);
            setIsLoading(false);
            return;
          }
        }

        // Fetch store details
        let tiendaId = null;
        try {
          const storeResponse = await axios.get(
            `${API_BASE_URL}/tienda/owner/${cleanUserId}`
          );
          if (storeResponse.data) {
            const storeData = {
              id: storeResponse.data._id,
              nombre: storeResponse.data.name,
              descripcion: storeResponse.data.description,
              telefono: storeResponse.data.phone_number,
              direccion: storeResponse.data.address?.name || "",
              specific_location: storeResponse.data.specific_location,
              propietario: storeResponse.data.owner?.userName || "",
              logo: storeResponse.data.logo?.url,
              banner: storeResponse.data.banner?.url,
              owner: cleanUserId,
            };
            setTienda(storeData);
            tiendaId = storeData.id;
            await AsyncStorage.setItem("store_data", JSON.stringify(storeData));
          } else {
            setTienda(null);
            await AsyncStorage.removeItem("store_data");
            setProducts([]);
            await AsyncStorage.removeItem("products_data");
            setIsLoading(false);
            return;
          }
        } catch (storeError) {
          if (storeError.response?.status === 404) {
            setTienda(null);
            await AsyncStorage.removeItem("store_data");
            setProducts([]);
            await AsyncStorage.removeItem("products_data");
          } else {
            console.error("Error al obtener la tienda:", storeError);
            Alert.alert(
              "Error",
              "No se pudo cargar la información de tu tienda. Intenta de nuevo."
            );
          }
          setIsLoading(false);
          return;
        }

        // Fetch products by tiendaId
        try {
          const productsResponse = await axios.get(
            `${API_BASE_URL}/products/tienda/${tiendaId}`
          );
          const fetchedProducts = productsResponse.data.products || [];
          setProducts(fetchedProducts);
          await AsyncStorage.setItem(
            "products_data",
            JSON.stringify(fetchedProducts)
          );
        } catch (productsError) {
          console.error("Error al obtener los productos:", productsError);
          setProducts([]);
          await AsyncStorage.removeItem("products_data");
          Alert.alert(
            "Error",
            "No se pudieron cargar los productos. Intenta de nuevo."
          );
        }
      } catch (error) {
        console.error("Error general al cargar datos:", error);
        setTienda(null);
        setProducts([]);
        Alert.alert(
          "Error",
          "Ocurrió un error al cargar los datos. Por favor, intenta de nuevo."
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadStoreAndProducts();
  }, []);
  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/cart/ProductDetails?id=${item._id}`)} // Use id instead of productId
    >
      {item.images && item.images.length > 0 && item.images[0].url ? (
        <Image
          source={{ uri: item.images[0].url }}
          style={styles.productImage}
          onError={(e) =>
            console.error(
              "Error cargando imagen del producto:",
              e.nativeEvent.error
            )
          }
        />
      ) : (
        <View style={[styles.productImage, styles.placeholderImage]}>
          <Ionicons name="image-outline" size={40} color={COLORS.gray} />
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Tienda</Text>
        <TouchableOpacity onPress={() => router.push("/cart/AddScreen")}>
          <Ionicons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Detalles de la tienda y productos */}
      {tienda ? (
        <ScrollView style={styles.content}>
          {/* Detalles de la tienda */}
          <View style={styles.tiendaCard}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              {tienda.banner ? (
                <Image
                  source={{ uri: tienda.banner }}
                  style={styles.tiendaBanner}
                  onError={(e) =>
                    console.error("Error cargando banner:", e.nativeEvent.error)
                  }
                />
              ) : (
                <View style={[styles.tiendaBanner, styles.placeholderImage]}>
                  <Ionicons
                    name="panorama-outline"
                    size={40}
                    color={COLORS.gray}
                  />
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.tiendaHeader}>
              {tienda.logo ? (
                <Image
                  source={{ uri: tienda.logo }}
                  style={styles.tiendaLogo}
                  onError={(e) =>
                    console.error("Error cargando logo:", e.nativeEvent.error)
                  }
                />
              ) : (
                <View style={[styles.tiendaLogo, styles.placeholderImage]}>
                  <Ionicons
                    name="storefront-outline"
                    size={40}
                    color={COLORS.gray}
                  />
                </View>
              )}
              <Text style={styles.tiendaTitle}>{tienda.nombre}</Text>
            </View>
          </View>

          {/* Lista de productos */}
          <Text style={styles.productsHeader}>Productos Publicados</Text>
          {products.length > 0 ? (
            <FlatList
              data={products}
              renderItem={renderProduct}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
              style={styles.productsList}
            />
          ) : (
            <Text style={styles.emptyProductsText}>
              No hay productos publicados aún.
            </Text>
          )}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No has creado una tienda aún.</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push("/crear-tienda")}
          >
            <Text style={styles.createButtonText}>Crear Tienda</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal para mostrar el banner y los detalles */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {tienda?.banner ? (
            <Image
              source={{ uri: tienda.banner }}
              style={styles.modalBannerBackground}
              blurRadius={5}
            />
          ) : (
            <View
              style={[styles.modalBannerBackground, styles.placeholderImage]}
            >
              <Ionicons name="panorama-outline" size={40} color={COLORS.gray} />
            </View>
          )}
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalLogoContainer}>
                {tienda?.logo && (
                  <Image
                    source={{ uri: tienda.logo }}
                    style={styles.modalLogo}
                  />
                )}
                <Text style={styles.modalTitle}>{tienda?.nombre}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalDetailsContainer}>
              <View style={styles.tiendaDetails}>
                <Text style={styles.tiendaLabel}>Descripción:</Text>
                <Text style={styles.tiendaText}>{tienda?.descripcion}</Text>
                <Text style={styles.tiendaLabel}>Teléfono:</Text>
                <Text style={styles.tiendaText}>{tienda?.telefono}</Text>
                <Text style={styles.tiendaLabel}>Dirección:</Text>
                <Text style={styles.tiendaText}>{tienda?.direccion}</Text>
                {tienda?.specific_location && (
                  <>
                    <Text style={styles.tiendaLabel}>
                      Ubicación Específica:
                    </Text>
                    <Text style={styles.tiendaText}>
                      {tienda.specific_location}
                    </Text>
                  </>
                )}
                <Text style={styles.tiendaLabel}>Propietario:</Text>
                <Text style={styles.tiendaText}>{tienda?.propietario}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offwhite,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.black,
  },
  content: {
    padding: 15,
  },
  tiendaCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  tiendaBanner: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
    borderRadius: 10,
    marginVertical: 10,
  },
  tiendaHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  tiendaLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: COLORS.primary,
    resizeMode: "contain",
  },
  tiendaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
    flex: 1,
  },
  productsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 15,
  },
  productsList: {
    marginBottom: 20,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.red,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  emptyProductsText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: COLORS.offwhite,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  createButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.offwhite,
  },
  placeholderImage: {
    backgroundColor: COLORS.lightwhite,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBannerBackground: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  modalLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
  },
  modalDetailsContainer: {
    padding: 15,
  },
  tiendaDetails: {
    padding: 10,
  },
  tiendaLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginTop: 10,
    marginBottom: 5,
  },
  tiendaText: {
    fontSize: 16,
    color: COLORS.gray,
    lineHeight: 22,
  },
});

export default MiTiendaScreen;
