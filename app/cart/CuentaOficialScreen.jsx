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

// Colores definidos
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

const CuentaOficialScreen = () => {
  const router = useRouter();
  const [cuentasOficiales, setCuentasOficiales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar la cuenta profesional desde la API
  useEffect(() => {
    const loadCuentaProfesional = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Obtener userId desde AsyncStorage
        const userId = await AsyncStorage.getItem("id");
        if (!userId) {
          Alert.alert(
            "Error",
            "Debes iniciar sesión para ver tu cuenta profesional."
          );
          router.navigate("/login");
          return;
        }
        const cleanUserId = userId.replace(/"/g, "");

        // Llamada a la API para obtener la cuenta profesional del usuario
        const response = await axios.get(
          `${API_BASE_URL}/professional/owner/${cleanUserId}`
        );

        // La API devuelve un objeto profesional o null si no existe
        const professional = response.data.professional;
        setCuentasOficiales(professional ? [professional] : []);
      } catch (err) {
        console.error("Error al cargar cuenta profesional:", err.message);
        setError("No se pudo cargar la cuenta profesional. Intenta de nuevo.");
        setCuentasOficiales([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCuentaProfesional();
  }, []);

  // Componente para renderizar la cuenta profesional
  const renderCuentaOficial = ({ item }) => (
    <View style={styles.cuentaCard}>
      {item.avatar?.url ? (
        <Image
          source={{ uri: item.avatar.url }}
          style={styles.cuentaImage}
          onError={(e) =>
            console.error(
              "Error cargando imagen de la cuenta:",
              e.nativeEvent.error
            )
          }
        />
      ) : (
        <View style={[styles.cuentaImage, styles.placeholderImage]}>
          <Ionicons name="business-outline" size={30} color={COLORS.gray} />
        </View>
      )}
      <View style={styles.cuentaInfo}>
        <Text style={styles.cuentaNombre}>{item.name}</Text>
        <Text style={styles.cuentaDescripcion} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
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
        <Text style={styles.headerTitle}>Cuenta Profesional</Text>
        {/* No mostramos el botón de "Agregar" si ya existe una cuenta */}
        {cuentasOficiales.length === 0 && (
          <TouchableOpacity
            onPress={() => router.push("/crear-cuenta-oficial")}
          >
            <Ionicons name="add" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de cuentas profesionales */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : cuentasOficiales.length > 0 ? (
        <FlatList
          data={cuentasOficiales}
          renderItem={renderCuentaOficial}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.cuentasList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No tienes una cuenta profesional aún.
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push("/crear-cuenta-  n")}
          >
            <Text style={styles.createButtonText}>
              Crear Cuenta Profesional
            </Text>
          </TouchableOpacity>
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
  cuentasList: {
    padding: 15,
    paddingBottom: 20,
  },
  cuentaCard: {
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
  cuentaImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  cuentaInfo: {
    flex: 1,
  },
  cuentaNombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  cuentaDescripcion: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
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
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  createButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "bold",
  },
  placeholderImage: {
    backgroundColor: COLORS.lightwhite,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CuentaOficialScreen;
