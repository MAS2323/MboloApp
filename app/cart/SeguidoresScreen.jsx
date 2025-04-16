import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";

// Colores definidos (usando la paleta proporcionada)
const COLORS = {
  primary: "#4c86A8",
  secondary: "#DDF0FF",
  tertiary: "#FF7754",
  gray: "#83829A",
  gray2: "#C1C0C8",
  offwhite: "#F3F4F8",
  white: "#FFFFFF",
  black: "#000000",
  red: "#e81e4d",
  green: "#00C135",
  lightwhite: "#FAFAFC",
};

const SeguidoresScreen = () => {
  const router = useRouter();
  const [seguidores, setSeguidores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar los datos de los seguidores
  useEffect(() => {
    const loadSeguidores = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Obtener userId desde AsyncStorage
        const userId = await AsyncStorage.getItem("id");
        if (!userId) {
          Alert.alert("Error", "Debes iniciar sesión para ver tus seguidores.");
          router.navigate("LoginScreen");
          return;
        }
        const cleanUserId = userId.replace(/"/g, "");

        // Intentar cargar datos desde AsyncStorage primero
        const storedSeguidoresData = await AsyncStorage.getItem(
          "seguidores_data"
        );
        if (storedSeguidoresData) {
          const parsedSeguidoresData = JSON.parse(storedSeguidoresData);
          if (parsedSeguidoresData && Array.isArray(parsedSeguidoresData)) {
            setSeguidores(parsedSeguidoresData);
            setIsLoading(false);
            return;
          }
        }

        // Si no hay datos en AsyncStorage, consultar la API
        const response = await axios.get(
          `${API_BASE_URL}/seguidores/${cleanUserId}`
        );
        if (response.data && Array.isArray(response.data)) {
          const seguidoresData = response.data.map((seguidor) => ({
            id: seguidor._id,
            userName: seguidor.userName || "Usuario Anónimo",
            profilePicture: seguidor.profilePicture?.url || null,
          }));
          setSeguidores(seguidoresData);
          // Guardar datos en AsyncStorage
          await AsyncStorage.setItem(
            "seguidores_data",
            JSON.stringify(seguidoresData)
          );
        } else {
          setSeguidores([]);
          await AsyncStorage.removeItem("seguidores_data");
        }
      } catch (err) {
        console.error("Error al cargar seguidores:", err.message);
        setError("No se pudo cargar la lista de seguidores. Intenta de nuevo.");
        setSeguidores([]);
        await AsyncStorage.removeItem("seguidores_data");
      } finally {
        setIsLoading(false);
      }
    };

    loadSeguidores();
  }, []);

  // Componente para renderizar cada seguidor
  const renderSeguidor = ({ item }) => (
    <View style={styles.seguidorCard}>
      {item.profilePicture ? (
        <Image
          source={{ uri: item.profilePicture }}
          style={styles.seguidorImage}
          onError={(e) =>
            console.error(
              "Error cargando imagen del seguidor:",
              e.nativeEvent.error
            )
          }
        />
      ) : (
        <View style={[styles.seguidorImage, styles.placeholderImage]}>
          <Ionicons name="person-outline" size={30} color={COLORS.gray} />
        </View>
      )}
      <Text style={styles.seguidorName}>{item.userName}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seguidores</Text>
        <View style={{ width: 24 }} /> {/* Espacio para mantener simetría */}
      </View>

      {/* Lista de seguidores */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : seguidores.length > 0 ? (
        <FlatList
          data={seguidores}
          renderItem={renderSeguidor}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.seguidoresList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes seguidores aún.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offwhite,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.black,
  },
  seguidoresList: {
    padding: 15,
    paddingBottom: 20,
  },
  seguidorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  seguidorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  seguidorName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.offwhite,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.offwhite,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.red,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: COLORS.offwhite,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
  },
  placeholderImage: {
    backgroundColor: COLORS.lightwhite,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SeguidoresScreen;
