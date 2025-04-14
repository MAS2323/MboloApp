import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";

const SelectCityScreen = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  // Verificar usuario existente y cargar datos desde AsyncStorage
  const checkExistingUser = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (!id) {
        router.navigate("LoginScreen");
        return;
      }
      const userId = `user${JSON.parse(id)}`;
      const currentUser = await AsyncStorage.getItem(userId);
      if (currentUser) {
        const parsedUserData = JSON.parse(currentUser);
        setUserData(parsedUserData);
        setUserId(JSON.parse(id));
        setIsLoggedIn(true);
      } else {
        router.navigate("LoginScreen");
      }
      setLoading(false);
    } catch (error) {
      setIsLoggedIn(false);
      setLoading(false);
      console.error("Error al recuperar tus datos:", error);
      router.navigate("LoginScreen");
    }
  };

  // Cargar las ciudades desde la API
  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/cities`);
      setCities(response.data);
    } catch (error) {
      console.error("Error al obtener ciudades:", error);
      Alert.alert("Error", "No se pudieron cargar las ciudades.");
    }
  };

  useEffect(() => {
    checkExistingUser();
    fetchCities();
  }, []);

  // Manejar la selección de una ciudad
  const handleSelectCity = async (city) => {
    try {
      // Actualizar en el backend
      await axios.put(
        `${API_BASE_URL}/user/${userId}`,
        { ciudad: { id: city._id, name: city.name } },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Actualizar en AsyncStorage
      const updatedUserData = {
        ...userData,
        ciudad: { id: city._id, name: city.name },
      };
      await AsyncStorage.setItem(
        `user${userId}`,
        JSON.stringify(updatedUserData)
      );
      setUserData(updatedUserData);

      Alert.alert("Éxito", "Ubicación actualizada correctamente");
      router.back(); // Regresar a la pantalla anterior
    } catch (error) {
      console.error(
        "Error al actualizar la ubicación:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        "No se pudo actualizar la ubicación. Por favor, intenta de nuevo más tarde."
      );
    }
  };

  const renderCityItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cityItem}
      onPress={() => handleSelectCity(item)}
    >
      <Text style={styles.cityText}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={30} color="#00C853" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Seleccionar ciudad</Text>
      </View>

      <FlatList
        data={cities}
        renderItem={renderCityItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No se encontraron ciudades disponibles.
          </Text>
        }
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default SelectCityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    zIndex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  cityItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  cityText: {
    fontSize: 16,
    color: COLORS.black,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
