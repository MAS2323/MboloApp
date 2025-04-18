import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import styles from "./../ui/productUI/ProductCardView.Style";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "./../../constants/theme";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "./../../config/Service.Config";
import { useRouter } from "expo-router";

const ProductCardView = ({ item }) => {
  // Verifica los datos que recibe el componente
  if (!item || !item.title || !item.supplier || !item.price || !item._id) {
    return null; // No renderizar si los datos no son válidos
  }

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("id");
        setUserId(id ? id.replace(/\"/g, "") : null);
      } catch (error) {
        console.error("Error retrieving userId:", error);
        setUserId(null);
      }
    };

    getUserId();
  }, []);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/cart/add/${userId}/${item._id}`
      );

      if (response.status === 200) {
        Alert.alert("Success", "Product added to cart");
      } else {
        Alert.alert("Error", "Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
      Alert.alert("Error", "There was an error adding the product to the cart");
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener la primera imagen del array de imágenes
  const firstImage =
    item.images && item.images.length > 0 ? item.images[0].url : null;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/cart/ProductDetails?id=${item._id}`)} // Navigate with id
    >
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {firstImage ? (
            <Image source={{ uri: firstImage }} style={styles.image} />
          ) : (
            <Text style={styles.noImageText}>No hay imagen disponible</Text>
          )}
        </View>
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.supplier} numberOfLines={1}>
            {item.supplier}
          </Text>
          <Text style={styles.price}>XAF {item.price}</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleAddToCart}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Ionicons name="add-circle" size={30} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCardView;
