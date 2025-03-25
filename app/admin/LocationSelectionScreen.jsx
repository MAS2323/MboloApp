import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const LocationSelectionScreen = () => {
  const router = useRouter();
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState(null);

  // Cargar provincias al inicio
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const response = await axios.get(
          `${API_BASE_URL}/locations?type=Province`
        );
        setProvinces(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setError("No se pudieron cargar las provincias");
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  // Cargar ciudades cuando se selecciona una provincia
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedProvince) return;

      try {
        setLoadingCities(true);
        const response = await axios.get(
          `${API_BASE_URL}/locations/cities/${selectedProvince._id}`
        );
        setCities(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setError("No se pudieron cargar las ciudades");
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [selectedProvince]);

  const handleProvinceSelect = (province) => {
    setSelectedProvince(province);
    setSelectedCity(null); // Resetear ciudad al cambiar provincia
  };

  const handleCitySelect = async (city) => {
    if (!selectedProvince) return;

    try {
      const locationData = {
        province: selectedProvince.name,
        provinceId: selectedProvince._id,
        city: city.name,
        cityId: city._id,
      };

      await AsyncStorage.setItem(
        "selectedLocation",
        JSON.stringify(locationData)
      );

      // Regresar a la pantalla anterior con los datos seleccionados
      router.back();
    } catch (error) {
      console.error("Error saving location:", error);
      Alert.alert("Error", "No se pudo guardar la ubicación");
    }
  };

  if (loadingProvinces) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text>Cargando provincias...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona una Provincia</Text>
      <FlatList
        data={provinces}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleProvinceSelect(item)}>
            <View
              style={[
                styles.item,
                selectedProvince?._id === item._id && styles.selectedItem,
              ]}
            >
              <Text style={styles.text}>{item.name}</Text>
              {selectedProvince?._id === item._id && (
                <Ionicons name="checkmark-circle" size={24} color="green" />
              )}
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {selectedProvince && (
        <>
          <Text style={styles.title}>Ciudades de {selectedProvince.name}</Text>
          {loadingCities ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" />
              <Text>Cargando ciudades...</Text>
            </View>
          ) : cities.length > 0 ? (
            <FlatList
              data={cities}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleCitySelect(item)}>
                  <View
                    style={[
                      styles.item,
                      selectedCity?._id === item._id && styles.selectedItem,
                    ]}
                  >
                    <Text style={styles.text}>{item.name}</Text>
                    {selectedCity?._id === item._id && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="green"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <Text style={styles.noData}>No hay ciudades disponibles</Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedItem: {
    backgroundColor: "#e3f2fd",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  noData: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default LocationSelectionScreen;
