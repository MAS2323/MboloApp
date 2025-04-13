import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  Linking,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { getCachedData, setCachedData } from "./../../components/Home/Cache";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "./../../config/Service.Config";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

// ======================================================
// Main Component
// ======================================================
const CartScreen = () => {
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ======================================================
  // User ID Functions
  // ======================================================
  const fetchUserId = useCallback(async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      setUserId(id ? id.replace(/\"/g, "") : null);
    } catch (error) {
      console.error("Error retrieving userId:", error);
      setUserId(null);
    }
  }, []);

  // ======================================================
  // Cart Functions
  // ======================================================
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      if (!userId) return;

      const response = await axios.get(`${API_BASE_URL}/cart/${userId}`);

      if (response.status === 200) {
        const cartData = response.data;
        setCart(cartData);
        setCachedData(`cart_${userId}`, cartData);
      } else {
        console.error("Failed to fetch cart, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleRemoveItem = async (cartItemId) => {
    try {
      Alert.alert(
        "Eliminar producto",
        "¿Estás seguro de que quieres eliminar este producto del carrito?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Eliminar",
            onPress: async () => {
              await axios.delete(
                `${API_BASE_URL}/cart/${userId}/${cartItemId}`
              );

              const updatedCartProducts = cart.products.filter(
                (item) => item._id !== cartItemId
              );
              const updatedCart = { ...cart, products: updatedCartProducts };

              setCart(updatedCart);
              setCachedData(`cart_${userId}`, updatedCart);

              Alert.alert(
                "Producto eliminado",
                "El artículo ha sido eliminado del carrito."
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error al eliminar el artículo del carrito:", error);
      Alert.alert("Error", "No se pudo eliminar el producto del carrito");
    }
  };

  // ======================================================
  // Utility Functions
  // ======================================================
  const handleWhatsApp = (phoneNumber) => {
    if (!phoneNumber) {
      Alert.alert("Error", "Número de WhatsApp no disponible");
      return;
    }
    Linking.openURL(`https://wa.me/${phoneNumber}`);
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCart();
    setRefreshing(false);
  }, [fetchCart]);

  // ======================================================
  // Effects
  // ======================================================
  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId, fetchCart]);

  // ======================================================
  // Loading State
  // ======================================================
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c86A8" />
        <Text style={styles.loadingText}>Cargando tu carrito...</Text>
      </SafeAreaView>
    );
  }

  // ======================================================
  // Main Render
  // ======================================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#4c86A8"]}
            tintColor="#4c86A8"
          />
        }
      >
        {cart?.products?.length === 0 ? (
          // ======================================================
          // Empty Cart State
          // ======================================================
          <View style={styles.emptyContainer}>
            <Image
              source={require("../../assets/images/carrito.jpeg")}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
            <Text style={styles.emptyText}>
              Añade productos para verlos aquí
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/cart/ProductList")}
            >
              <FontAwesome name="shopping-cart" size={20} color="white" />
              <Text style={styles.addButtonText}>Explorar productos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              Tus productos ({cart?.products?.length || 0})
            </Text>

            {/* ======================================================
                Product List
            ====================================================== */}
            {cart?.products?.map((product) => (
              <View key={product._id}>
                <View style={styles.card}>
                  {product.images?.[0]?.url ? (
                    <Image
                      source={{ uri: product.images[0].url }}
                      style={styles.image}
                      onError={(e) =>
                        console.error(
                          "Error loading image:",
                          e.nativeEvent.error
                        )
                      }
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <MaterialIcons
                        name="image-not-supported"
                        size={40}
                        color="#ccc"
                      />
                    </View>
                  )}
                  <View style={styles.infoContainer}>
                    <Text style={styles.title} numberOfLines={2}>
                      {product.title}
                    </Text>
                    <Text style={styles.supplier} numberOfLines={1}>
                      {product.supplier || "Proveedor no disponible"}
                    </Text>
                    <Text style={styles.price}>
                      XAF {product.price?.toLocaleString() || "0"}
                    </Text>

                    <View style={styles.actionContainer}>
                      <TouchableOpacity
                        style={styles.whatsappButton}
                        onPress={() => handleWhatsApp(product.whatsapp)}
                      >
                        <FontAwesome name="whatsapp" size={16} color="white" />
                        <Text style={styles.whatsappText}> Contactar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleRemoveItem(product._id)}
                        style={styles.deleteButton}
                      >
                        <MaterialIcons
                          name="delete-outline"
                          size={24}
                          color="#ff4444"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={styles.separator} />
              </View>
            ))}
          </>
        )}

        {/* ======================================================
            Checkout Button
        ====================================================== */}
        {cart?.products?.length > 0 && (
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => router.push("/cart/ProductList")}
          >
            <FontAwesome name="plus" size={20} color="white" />
            <Text style={styles.checkoutText}>Añadir más productos</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CartScreen;

// ======================================================
// Styles
// ======================================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#4c86A8",
  },
  container: {
    flex: 1,
    padding: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    marginLeft: 8,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 0,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 0,
    marginHorizontal: 0,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  supplier: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4c86A8",
    marginBottom: 8,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  whatsappButton: {
    backgroundColor: "#25D366",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
    justifyContent: "center",
  },
  whatsappText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  addButton: {
    backgroundColor: "#4c86A8",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  checkoutButton: {
    backgroundColor: "#4c86A8",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 30,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
