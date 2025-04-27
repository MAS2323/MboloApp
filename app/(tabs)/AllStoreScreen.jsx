import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { API_BASE_URL } from "../../config/Service.Config";
import axios from "axios";

const AllStoreScreen = () => {
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Cuentas Oficiales");
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  // Calcular dimensiones responsive
  const NUM_COLUMNS = width < 600 ? 2 : 3;
  const ITEM_MARGIN = width * 0.01;
  const ITEM_WIDTH =
    (width - ITEM_MARGIN * (NUM_COLUMNS * 2 + 2)) / NUM_COLUMNS;

  // Cargar las tiendas al montar el componente
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
      } catch (error) {
        console.error("Error fetching stores:", error.message);
        Alert.alert("Error", "No se pudieron cargar las tiendas");
      } finally {
        setLoading(false);
      }
    };
    fetchTiendas();
  }, []);

  // Asegurarse de que al regresar se muestre "Cuentas Oficiales"
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setActiveTab("Cuentas Oficiales");
    });

    return unsubscribe;
  }, [navigation]);

  const renderTiendaItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.tiendaItem, { width: ITEM_WIDTH, margin: ITEM_MARGIN }]}
      onPress={() => router.push(`/tienda-detalle/${item._id}`)}
    >
      <Image
        source={{ uri: item.banner?.url }}
        style={styles.tiendaBanner}
        resizeMode="cover"
      />
      <View style={styles.tiendaInfo}>
        <Text style={styles.tiendaNombre} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.tiendaDescripcion} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c86A8" />
      </View>
    );
  }

  const tabs = ["Cuentas Oficiales", "AppCenter"];

  return (
    <View style={styles.container}>
      {/* Menú de navegación */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.menuNavContainer}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.menuItem,
              activeTab === tab && styles.menuItemActive,
            ]}
            onPress={() => {
              setActiveTab(tab);
              if (tab === "AppCenter") {
                router.push("/cart/AppCenter");
              }
            }}
          >
            <Text
              style={[
                styles.menuItemText,
                activeTab === tab && styles.menuItemTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de tiendas para Cuentas Oficiales */}
      {activeTab === "Cuentas Oficiales" && (
        <FlatList
          data={tiendas}
          renderItem={renderTiendaItem}
          keyExtractor={(item) => item._id}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={{ justifyContent: "flex-start" }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay tiendas disponibles</Text>
            </View>
          }
        />
      )}
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
  menuNavContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
    minWidth: "100%",
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
  },
  menuItemActive: {
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
    padding: 5,
  },
  tiendaItem: {
    backgroundColor: "#DDF0FF99",
    borderRadius: 8,
    overflow: "hidden",
    height: 200,
  },
  tiendaBanner: {
    width: "100%",
    height: "70%",
  },
  tiendaInfo: {
    padding: 10,
    height: "30%",
    justifyContent: "center",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});

export default AllStoreScreen;
