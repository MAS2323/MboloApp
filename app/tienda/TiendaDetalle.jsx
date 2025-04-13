// app/tienda-detalle/[id].jsx
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "../../config/Service.Config";
import axios from "axios";

const TiendaDetalle = () => {
  const { id } = useLocalSearchParams(); // Get the dynamic id parameter from the URL
  const [tienda, setTienda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTienda = async () => {
      try {
        const url = `${API_BASE_URL}/tienda/${id}`; // Fetch the specific store by ID

        if (!API_BASE_URL) {
          throw new Error(
            "API_BASE_URL is undefined. Check Service.Config.js."
          );
        }

        const response = await axios.get(url);
        const data = response.data;

        if (response.status !== 200) {
          throw new Error(data.message || "Error fetching store details");
        }

        setTienda(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching store details:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTienda();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c86A8" />
      </View>
    );
  }

  if (error || !tienda) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || "No se pudo cargar la tienda."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Banner Image */}
      {tienda.banner_url && (
        <Image
          source={{ uri: tienda.banner_url }}
          style={styles.tiendaBanner}
          resizeMode="cover"
        />
      )}

      {/* Store Name and Description */}
      <View style={styles.tiendaInfoContainer}>
        <Text style={styles.tiendaNombre}>{tienda.name}</Text>
        <Text style={styles.tiendaDescripcion}>{tienda.description}</Text>
      </View>

      {/* Store Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailLabel}>Teléfono:</Text>
        <Text style={styles.detailText}>
          {tienda.phone_number || "No disponible"}
        </Text>

        <Text style={styles.detailLabel}>Propietario:</Text>
        <Text style={styles.detailText}>
          {tienda.owner?.userName || "Desconocido"} (
          {tienda.owner?.email || "No disponible"})
        </Text>

        <Text style={styles.detailLabel}>Dirección:</Text>
        <Text style={styles.detailText}>
          {tienda.address ? "ID: " + tienda.address : "No disponible"}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff4d4f",
    textAlign: "center",
  },
  tiendaBanner: {
    width: "100%",
    height: 200, // Larger banner image for the detail page
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  tiendaInfoContainer: {
    padding: 15,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginTop: -10, // Overlap the banner slightly
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tiendaNombre: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  tiendaDescripcion: {
    fontSize: 16,
    color: "#666",
  },
  detailsContainer: {
    padding: 15,
    marginHorizontal: 10,
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4c86A8",
    marginTop: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});

export default TiendaDetalle;
