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

const PhoneNumbersScreen = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [mobile, setMobile] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAddingNumber, setIsAddingNumber] = useState(false);

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
        setMobile(parsedUserData.mobile || "");
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

  // Validar formato de número de teléfono (básico)
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  // Añadir o actualizar el número de teléfono
  const handleAddPhoneNumber = async () => {
    if (!newPhoneNumber) {
      Alert.alert("Error", "Por favor, ingresa un número de teléfono");
      return;
    }

    if (!validatePhoneNumber(newPhoneNumber)) {
      Alert.alert("Error", "Por favor, ingresa un número de teléfono válido");
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/user/${userId}`,
        { mobile: newPhoneNumber },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedUserData = {
        ...userData,
        mobile: newPhoneNumber,
      };
      await AsyncStorage.setItem(
        `user${userId}`,
        JSON.stringify(updatedUserData)
      );
      setUserData(updatedUserData);
      setMobile(newPhoneNumber);
      setNewPhoneNumber("");
      setIsAddingNumber(false);

      Alert.alert("Éxito", "Número de teléfono actualizado correctamente");
    } catch (error) {
      console.error(
        "Error al actualizar el número de teléfono:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        "No se pudo actualizar el número de teléfono. Por favor, intenta de nuevo más tarde."
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

  if (isAddingNumber) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsAddingNumber(false)}>
            <MaterialIcons name="chevron-left" size={30} color="#00C853" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Añadir número de teléfono</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Número de teléfono</Text>
          <TextInput
            style={styles.input}
            value={newPhoneNumber}
            onChangeText={setNewPhoneNumber}
            placeholder="Ingresa tu número de teléfono"
            keyboardType="phone-pad"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleAddPhoneNumber}
          >
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={30} color="#00C853" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Número de teléfono</Text>
      </View>

      <View style={styles.formContainer}>
        {mobile ? (
          <>
            <Text style={styles.label}>Tu número de teléfono</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currentPhoneText}>{mobile}</Text>
              <MaterialIcons name="check-circle" size={20} color="#00C853" />
            </View>
            <Text style={styles.confirmedText}>Confirmado</Text>

            <Text style={styles.label}>Nuevo número de teléfono</Text>
            <TextInput
              style={styles.input}
              value={newPhoneNumber}
              onChangeText={setNewPhoneNumber}
              placeholder="Ingresa tu nuevo número de teléfono"
              keyboardType="phone-pad"
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddPhoneNumber}
            >
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAddingNumber(true)}
          >
            <MaterialIcons name="add" size={24} color="#00C853" />
            <Text style={styles.addButtonText}>Añadir número de teléfono</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PhoneNumbersScreen;

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
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  addButtonText: {
    fontSize: 16,
    color: COLORS.black,
    marginLeft: 10,
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
  currentPhoneText: {
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
    borderColor: "#00C853", // Borde verde como en la captura
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
