import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../../../config/Service.Config";
import { COLORS, SIZES } from "../../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const AllBannersScreen = () => {
  const router = useRouter();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Añadimos estado para manejar errores

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError(null); // Reseteamos el error
        console.log("Fetching banners from:", `${API_BASE_URL}/ads`); // Log para depurar la URL
        const response = await axios.get(`${API_BASE_URL}/ads`);
        console.log("Response data:", response.data); // Log para depurar la respuesta
        setBanners(response.data);
      } catch (error) {
        console.error("Error fetching banners:", error);
        setError(error.message); // Guardamos el error
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const renderBanner = ({ item }) => (
    <TouchableOpacity style={styles.bannerContainer}>
      <Image source={{ uri: item.image.url }} style={styles.bannerImage} />
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.bannerCategory}>Categoría: {item.category}</Text>
        <Text style={styles.bannerStatus}>
          Estado: {item.isActive ? "Activo" : "Inactivo"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error al cargar los banners: {error}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchBanners()}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Todos los Banners</Text>
        <View style={{ width: 30 }} />
      </View> */}

      {banners.length === 0 ? (
        <Text style={styles.noBannersText}>No hay banners disponibles</Text>
      ) : (
        <FlatList
          data={banners}
          renderItem={renderBanner}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightwhite,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: SIZES.xLarge,
    fontWeight: "bold",
    color: COLORS.black,
  },
  bannerContainer: {
    marginHorizontal: SIZES.medium,
    marginVertical: SIZES.small,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  bannerContent: {
    padding: SIZES.medium,
  },
  bannerTitle: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: SIZES.xSmall,
  },
  bannerDescription: {
    fontSize: SIZES.medium,
    color: COLORS.darkGray,
    marginBottom: SIZES.xSmall,
  },
  bannerCategory: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: SIZES.xSmall,
  },
  bannerStatus: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  flatListContent: {
    paddingVertical: SIZES.medium,
    paddingBottom: SIZES.large,
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
    padding: SIZES.medium,
  },
  errorText: {
    fontSize: SIZES.medium,
    color: COLORS.red,
    textAlign: "center",
    marginBottom: SIZES.medium,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontWeight: "bold",
  },
  noBannersText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: "center",
    marginTop: SIZES.large,
  },
});

export default AllBannersScreen;
