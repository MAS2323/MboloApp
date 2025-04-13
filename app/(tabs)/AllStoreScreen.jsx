import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { API_BASE_URL } from "../../config/Service.Config";
import axios from "axios";

// Get the screen width for calculating item width
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const NUM_COLUMNS = 2;
const ITEM_MARGIN = 5; // Margin on each side of the item
const TOTAL_HORIZONTAL_MARGIN = ITEM_MARGIN * 2 * NUM_COLUMNS + 10; // Margins + listContainer paddingHorizontal
const ITEM_WIDTH = (SCREEN_WIDTH - TOTAL_HORIZONTAL_MARGIN) / NUM_COLUMNS;

const AllStoreScreen = () => {
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        const url = `${API_BASE_URL}/tienda`;

        if (!API_BASE_URL) {
          throw new Error(
            "API_BASE_URL is undefined. Check Service.Config.js."
          );
        }

        const response = await axios.get(url);
        const data = response.data;

        if (response.status !== 200) {
          throw new Error(data.message || "Error fetching stores");
        }

        setTiendas(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stores:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
        setLoading(false);
      }
    };

    fetchTiendas();
  }, []);

  const renderTiendaItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.tiendaItem, { width: ITEM_WIDTH }]} // Set fixed width
      onPress={() => router.push(`/tienda-detalle/${item._id}`)}
    >
      {/* Banner Image */}
      <Image
        source={{ uri: item.banner?.url }} // Updated to access item.banner.url
        style={styles.tiendaBanner}
        resizeMode="cover"
      />
      {/* Store Name */}
      <Text style={styles.tiendaNombre} numberOfLines={2}>
        {item.name}
      </Text>
      {/* Store Description */}
      <Text style={styles.tiendaDescripcion} numberOfLines={2}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c86A8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Menú de navegación */}
      <View style={styles.menuNav}>
        <TouchableOpacity style={styles.menuItemActive}>
          <Text style={styles.menuItemTextActive}>Recomendado</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Amigos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Global</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de tiendas en 2 columnas */}
      <FlatList
        data={tiendas}
        renderItem={renderTiendaItem}
        keyExtractor={(item) => item._id}
        numColumns={NUM_COLUMNS} // Two-column layout
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper} // Updated to align items to the start
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuNav: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  menuItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  menuItemActive: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#4c86A8",
  },
  menuItemText: {
    fontSize: 14,
    color: "#666",
  },
  menuItemTextActive: {
    fontSize: 14,
    color: "#4c86A8",
    fontWeight: "bold",
  },
  listContainer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  columnWrapper: {
    justifyContent: "flex-start", // Align items to the start instead of space-between
    marginBottom: 5,
  },
  tiendaItem: {
    margin: ITEM_MARGIN, // Margin on all sides
    padding: 10,
    backgroundColor: "#DDF0FF99",
    borderRadius: 8,
    height: 200, // Fixed height
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  tiendaBanner: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  tiendaNombre: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  tiendaDescripcion: {
    fontSize: 12,
    color: "#666",
  },
});

export default AllStoreScreen;
