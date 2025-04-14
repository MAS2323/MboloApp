import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
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

const ChangeEmailScreen = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
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
        setCurrentEmail(parsedUserData.email || "masoneweernesto@gmail.com");
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

  // Validar formato de correo electrónico
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Actualizar el correo electrónico del usuario
  const handleUpdateEmail = async () => {
    if (!newEmail) {
      Alert.alert("Error", "Por favor, ingresa un nuevo correo electrónico");
      return;
    }

    if (!validateEmail(newEmail)) {
      Alert.alert("Error", "Por favor, ingresa un correo electrónico válido");
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/user/${userId}`,
        { email: newEmail },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedUserData = {
        ...userData,
        email: newEmail,
      };
      await AsyncStorage.setItem(
        `user${userId}`,
        JSON.stringify(updatedUserData)
      );
      setUserData(updatedUserData);
      setCurrentEmail(newEmail);
      setNewEmail("");

      Alert.alert("Éxito", "Correo electrónico actualizado correctamente");
    } catch (error) {
      console.error(
        "Error al actualizar el correo electrónico:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        "No se pudo actualizar el correo electrónico. Por favor, intenta de nuevo más tarde."
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
        <Text style={styles.headerText}>Cambiar correo electrónico</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Tu correo electrónico</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.currentEmailText}>{currentEmail}</Text>
          <MaterialIcons name="check-circle" size={20} color="#00C853" />
        </View>
        <Text style={styles.confirmedText}>Confirmado</Text>

        <Text style={styles.label}>Nuevo correo electrónico</Text>
        <TextInput
          style={styles.input}
          value={newEmail}
          onChangeText={setNewEmail}
          placeholder="Ingresa tu nuevo correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleUpdateEmail}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChangeEmailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: "#fff",
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
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B0BEC5",
    borderRadius: 5,
    padding: 12,
    marginBottom: 5,
    backgroundColor: "#F5F5F5",
  },
  currentEmailText: {
    fontSize: 16,
    color: COLORS.black,
  },
  confirmedText: {
    fontSize: 14,
    color: "#00C853",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#B0BEC5",
    borderRadius: 5,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
    fontSize: 16,
    color: COLORS.black,
  },
  saveButton: {
    backgroundColor: "#00C853",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
