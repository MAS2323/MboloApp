import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";
const SubCategoryMenuScreen = () => {
  const router = useRouter();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subcategoryInfo, setSubcategoryInfo] = useState(null);
  const { id } = useLocalSearchParams();
  // Función para cargar los menús de la subcategoría
  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError(null);

      // Opción 1: Usar la ruta existente para menús por categoría
      const response = await axios.get(
        `${API_BASE_URL}/menus/subcategory/${id}`
      );

      // Opción 2: Filtrar por subcategoría en el frontend si recibes todos los menús
      // const response = await axios.get(`${API_BASE_URL}/menus`);
      // const filtered = response.data.filter(menu => menu.subcategory === id);
      // setMenus(filtered);

      setMenus(response.data);

      // Obtener info de subcategoría si es necesario
      try {
        const subcatResponse = await axios.get(
          `${API_BASE_URL}/subcategories/${id}`
        );
        setSubcategoryInfo(subcatResponse.data);
      } catch (subcatError) {
        console.warn("No se pudo obtener info de subcategoría:", subcatError);
      }
    } catch (err) {
      console.error("Error fetching menus:", err);
      setError("No se pudieron cargar los menús. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [id]);

  // Función para renderizar cada ítem del menú
  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() =>
        router.push({
          pathname: "/categorias/MenuItemDetails",
          params: {
            id: item._id,
          },
        })
      }
    >
      <Image
        source={{
          uri: item.images?.[0]?.url || "https://via.placeholder.com/150",
        }}
        style={styles.menuImage}
      />
      <View style={styles.menuInfo}>
        <Text style={styles.menuName}>{item.name}</Text>
        <Text style={styles.menuDescription} numberOfLines={2}>
          {item.description}
        </Text>
        {item.location && (
          <Text style={styles.menuLocation}>
            {item.location.city}, {item.location.province}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header con nombre de la subcategoría */}
      <View style={styles.appBarWrapper}>
        <Text style={styles.title}>
          {subcategoryInfo?.name || "Subcategoría"}
        </Text>
        {subcategoryInfo?.description && (
          <Text style={styles.subtitle}>{subcategoryInfo.description}</Text>
        )}
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : menus.length > 0 ? (
          <FlatList
            data={menus}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={() => (
              <Text style={styles.sectionTitle}>Menús disponibles</Text>
            )}
          />
        ) : (
          <Text style={styles.noData}>No hay menús disponibles</Text>
        )}
      </View>
    </View>
  );
};

export default SubCategoryMenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  appBarWrapper: {
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  menuInfo: {
    flex: 1,
    justifyContent: "center",
  },
  menuName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  menuDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  menuLocation: {
    fontSize: 13,
    color: "#888",
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 15,
  },
  noData: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#999",
  },
  errorText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#ff3333",
  },
});
