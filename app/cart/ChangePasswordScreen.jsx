import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../config/Service.Config";

// Header Component
const Header = ({ onBack, title }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack}>
      <MaterialIcons name="chevron-left" size={30} color="#00C853" />
    </TouchableOpacity>
    <Text style={styles.headerText}>{title}</Text>
    <View style={{ width: 30 }} />
  </View>
);

// Input Field Component
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#B0BEC5"
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
    />
  </View>
);

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load user ID from AsyncStorage
  const getUserId = useCallback(async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (!id) {
        Alert.alert(
          "Error",
          "No se encontró el usuario. Por favor, inicia sesión nuevamente."
        );
        router.navigate("LoginScreen");
        return null;
      }
      return JSON.parse(id);
    } catch (error) {
      console.error("Error al recuperar el ID del usuario:", error);
      Alert.alert("Error", "No se pudo cargar la información del usuario.");
      return null;
    }
  }, [router]);

  // Handle password change
  const handleChangePassword = async () => {
    // Validations
    if (!currentPassword) {
      Alert.alert("Error", "Por favor, ingresa tu contraseña actual.");
      return;
    }
    if (!newPassword) {
      Alert.alert("Error", "Por favor, ingresa una nueva contraseña.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert(
        "Error",
        "La nueva contraseña debe tener al menos 6 caracteres."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const userId = await getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/user/${userId}/password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Add Authorization header if authMiddleware requires a token
            // Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
        }
      );

      Alert.alert("Éxito", response.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.back(); // Navigate back to previous screen
    } catch (error) {
      console.error(
        "Error al cambiar la contraseña:",
        error.response?.data || error.message
      );
      const message =
        error.response?.data?.message ||
        "No se pudo cambiar la contraseña. Por favor, intenta de nuevo.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={() => router.back()} title="Cambiar Contraseña" />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 100 })}
      >
        <View style={styles.formContainer}>
          <InputField
            label="Contraseña Actual*"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Ingresa tu contraseña actual"
            secureTextEntry
          />
          <InputField
            label="Nueva Contraseña*"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Ingresa tu nueva contraseña"
            secureTextEntry
          />
          <InputField
            label="Confirmar Nueva Contraseña*"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirma tu nueva contraseña"
            secureTextEntry
          />
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Cargando..." : "Guardar"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  content: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#B0BEC5",
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#00C853",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#A5D6A7",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
