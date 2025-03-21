import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const LocationSelectionScreen = () => {
  const router = useRouter();
  const [provinces, setProvinces] = useState([]); // Provincias (tipo "Province")
  const [cities, setCities] = useState([]); // Ciudades (tipo "City")
  const [selectedProvince, setSelectedProvince] = useState(null); // Provincia seleccionada
  const [selectedCity, setSelectedCity] = useState(null); // Ciudad seleccionada

  // Cargar provincias al inicio
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/locations?type=Province`
        );
        setProvinces(response.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        Alert.alert("Error", "No se pudieron cargar las provincias.");
      }
    };

    fetchProvinces();
  }, []);

  // Cargar ciudades cuando se selecciona una provincia
  useEffect(() => {
    const fetchCities = async () => {
      if (selectedProvince) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/locations/cities/${selectedProvince._id}`
          );
          setCities(response.data);
        } catch (error) {
          console.error("Error fetching cities:", error);
          Alert.alert("Error", "No se pudieron cargar las ciudades.");
        }
      }
    };

    fetchCities();
  }, [selectedProvince]);

  // Manejar la selección de provincia
  const handleProvinceSelect = (province) => {
    setSelectedProvince(province);
    setSelectedCity(null); // Limpiar la ciudad seleccionada al cambiar de provincia
  };

  // Manejar la selección de ciudad
  const handleCitySelect = async (city) => {
    setSelectedCity(city);

    // Guardar la ubicación seleccionada en AsyncStorage
    try {
      await AsyncStorage.setItem(
        "selectedLocation",
        JSON.stringify({
          province: selectedProvince,
          city: city,
        })
      );
      router.back(); // Regresar a la pantalla anterior
    } catch (error) {
      console.error("Error saving location:", error);
      Alert.alert("Error", "No se pudo guardar la ubicación.");
    }
  };

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
          <Text style={styles.title}>Selecciona una Ciudad</Text>
          {cities.length > 0 ? (
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
});

export default LocationSelectionScreen;
