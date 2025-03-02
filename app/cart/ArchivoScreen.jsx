import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "./../../constants/theme";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../config/Service.Config";
import { useRouter } from "expo-router";
const ArchivoScreen = () => {
  const [userProducts, setUserProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem("id");
      setUserId(id.replace(/\"/g, ""));
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchUserProducts = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/products`);
          // Filtrar los productos del usuario actual
          const currentUserProducts = response.data.filter(
            (product) => product.user === userId
          );
          setUserProducts(currentUserProducts);
        } catch (error) {
          console.error("Error fetching user products:", error);
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
    } catch (error) {
      console.error("Error deleting product:", error);
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
          text: "Aceptar",
          onPress: () => onDelete(productId),
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push("/cart/ProductEdition", { item })}
    >
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.images[0].url }} style={styles.image} />
        </View>
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.supplier} numberOfLines={1}>
            {item.supplier}
          </Text>
          <Text style={styles.price}>XAF{item.price}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => confirmDelete(item._id)}
        >
          <MaterialIcons name="delete" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={userProducts}
        renderItem={renderItem}
        keyExtractor={(item) =>
          item._id ? item._id.toString() : Math.random().toString()
        }
      />
    </View>
  );
};

export default ArchivoScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 10,
    marginTop: 45,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    margin: 10,
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
  },
  supplier: {
    fontSize: 14,
    color: COLORS.gray,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  deleteBtn: {
    padding: 5,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.red,
  },
});
