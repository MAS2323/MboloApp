import React from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "./../../constants/theme";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/Service.Config";
import ProductList from "./../../app/cart/ProductList";
import styles from "./NewRivals.style";
import { useRouter } from "expo-router";

// Función para obtener los productos desde la API
const fetchProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error("Error al cargar los productos");
  }
  return response.json();
};

const NewRivals = () => {
  const router = useRouter();

  // Usar React Query para obtener los productos
  const {
    data: products,
    isLoading,
    error,
  } = useQuery(["products"], fetchProducts);

  // Renderizar el componente ProductList con los productos
  const renderItem = () => <ProductList products={products} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.upperRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="chevron-back-circle"
              size={30}
              color={COLORS.lightwhite}
            />
          </TouchableOpacity>
          <Text style={styles.heading}>Productos</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : error ? (
          <Text style={styles.errorText}>Error al cargar los productos</Text>
        ) : (
          <FlatList
            data={[{ key: "ProductList" }]} // Data para renderizar un solo componente
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.scrollContainer}
            nestedScrollEnabled={true}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default NewRivals;
