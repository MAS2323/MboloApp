import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { COLORS } from "./../../constants/theme";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../config/Service.Config";
import { useRouter } from "expo-router";

const ArchivoScreen = () => {
  const [userProducts, setUserProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleEditProduct = (product) => {
    router.push({
      pathname: "/cart/ProductEdition",
      params: { item: JSON.stringify(product) },
    });
  };

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("id");
        setUserId(id?.replace(/\"/g, "") || null);
      } catch (error) {
        console.error("Error getting user ID:", error);
        setUserId(null);
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchUserProducts = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_BASE_URL}/products`);
          const currentUserProducts = response.data.filter(
            (product) => product.user === userId
          );
          setUserProducts(currentUserProducts);
        } catch (error) {
          console.error("Error fetching user products:", error);
          Alert.alert("Error", "No se pudieron cargar los productos");
        } finally {
          setLoading(false);
        }
      };
      fetchUserProducts();
    }
  }, [userId]);

  const onDelete = async (productId) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${productId}`);
      setUserProducts(
        userProducts.filter((product) => product._id !== productId)
      );
      Alert.alert("Éxito", "Producto eliminado correctamente");
    } catch (error) {
      console.error("Error deleting product:", error);
      Alert.alert("Error", "No se pudo eliminar el producto");
    }
  };

  const confirmDelete = (productId) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar este producto?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => onDelete(productId),
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.card}>
        {/* Contenido izquierdo (imagen y detalles) */}
        <TouchableOpacity
          style={styles.contentContainer}
          onPress={() => handleEditProduct(item)}
          activeOpacity={0.7}
        >
          <View style={styles.imageContainer}>
            {item.images?.[0]?.url ? (
              <Image
                source={{ uri: item.images[0].url }}
                style={styles.image}
                onError={(e) =>
                  console.log("Error loading image:", e.nativeEvent.error)
                }
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <MaterialIcons
                  name="image-not-supported"
                  size={30}
                  color="#ccc"
                />
              </View>
            )}
          </View>
          <View style={styles.details}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.supplier} numberOfLines={1}>
              {item.supplier || "Proveedor no disponible"}
            </Text>
            <Text style={styles.price}>
              XAF {item.price?.toLocaleString() || "0"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Botón de eliminar a la derecha */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => confirmDelete(item._id)}
        >
          <MaterialIcons
            name="delete-outline"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
    </View>
  );
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando tus productos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {userProducts.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../../assets/images/productos.jpeg")}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyTitle}>No hay productos registrados</Text>
          <Text style={styles.emptyText}>
            Comienza añadiendo tu primer producto para verlo aquí
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/cart/ProductCreation")}
            activeOpacity={0.8}
          >
            <MaterialIcons name="add" size={20} color="white" />
            <Text style={styles.addButtonText}>Añadir Primer Producto</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <FlatList
          data={userProducts}
          renderItem={renderItem}
          keyExtractor={(item) =>
            item._id ? item._id.toString() : Math.random().toString()
          }
          ListHeaderComponent={
            <Text style={styles.listHeader}>
              Tus Productos ({userProducts.length})
            </Text>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default ArchivoScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    marginBottom: 0,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.primary,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 16,
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 2,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 0,
    alignItems: "center", // Alinea verticalmente los elementos
    justifyContent: "space-between", // Distribuye el espacio entre los elementos
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 0,
    marginHorizontal: 0,
  },
  contentContainer: {
    flexDirection: "row",
    flex: 1, // Ocupa todo el espacio disponible excepto el botón de eliminar
  },
  imageContainer: {
    marginLeft: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    justifyContent: "space-between",
  },
  deleteBtn: {
    padding: 10,
    marginLeft: 10, // Espacio entre el contenido y el botón de eliminar
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 4,
  },
  supplier: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyImage: {
    width: 250,
    height: 250,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
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
});
