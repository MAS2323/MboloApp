import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const SelectSexScreen = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
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
      const parsedId = JSON.parse(id);
      console.log("ID almacenado en AsyncStorage:", parsedId);
      const userKey = `user${parsedId}`;
      const currentUser = await AsyncStorage.getItem(userKey);
      if (currentUser) {
        const parsedUserData = JSON.parse(currentUser);
        setUserData(parsedUserData);
        setUserId(parsedId);
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

  useEffect(() => {
    checkExistingUser();
  }, []);

  // Manejar la selección de sexo
  const handleSelectSex = async (selectedSex) => {
    try {
      console.log("Actualizando sexo para userId:", userId);
      const formData = new FormData();
      formData.append("sex", selectedSex);

      // Actualizar en el backend
      const response = await axios.put(
        `${API_BASE_URL}/user/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Respuesta del backend:", response.data);

      // Actualizar en AsyncStorage
      const updatedUserData = {
        ...userData,
        sex: selectedSex,
      };
      await AsyncStorage.setItem(
        `user${userId}`,
        JSON.stringify(updatedUserData)
      );
      setUserData(updatedUserData);

      // Regresar a la pantalla anterior
      router.back();
    } catch (error) {
      console.error(
        "Error al actualizar el sexo:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        "No se pudo actualizar el sexo. Por favor, intenta de nuevo más tarde."
      );
    }
  };

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
        <Text style={styles.headerText}>Seleccionar sexo</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleSelectSex("Masculino")}
        >
          <Text style={styles.optionText}>Masculino</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleSelectSex("Femenino")}
        >
          <Text style={styles.optionText}>Femenino</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleSelectSex("No especificar")}
        >
          <Text style={styles.optionText}>No especificar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SelectSexScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  optionText: {
    fontSize: 18,
    color: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
