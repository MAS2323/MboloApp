import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../config/Service.Config";
import Botton from "../../components/providers/Botton";
import { COLORS } from "../../constants/theme";
import { router } from "expo-router";

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName || formData.userName.length < 3) {
      newErrors.userName = "El nombre debe tener al menos 3 caracteres.";
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Introduce un email válido.";
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerUser = async () => {
    if (!validateForm()) {
      Alert.alert("Formulario inválido", "Por favor revisa los campos.");
      return;
    }
    setLoading(true);
    try {
      const endpoint = `${API_BASE_URL}/register`;
      const response = await axios.post(endpoint, formData);

      if (response.status === 200) {
        // Guardar el userId y los datos del usuario en AsyncStorage para iniciar sesión automáticamente
        const userId = response.data.userId;
        const userData = {
          userName: formData.userName,
          email: formData.email,
        };
        await AsyncStorage.setItem("id", JSON.stringify(userId));
        await AsyncStorage.setItem(`user${userId}`, JSON.stringify(userData));

        // Redirigir a la pantalla principal
        router.replace("(tabs)");
        Alert.alert(
          "Registro exitoso",
          "Has sido registrado e iniciado sesión automáticamente."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Error al registrarse, intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.mainContainer}>
        <Text style={styles.textHeader}>Registrar</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Usuario"
            style={styles.textInput}
            value={formData.userName}
            onChangeText={(text) => handleInputChange("userName", text)}
          />
          {errors.userName && (
            <Text style={styles.errorText}>{errors.userName}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            style={styles.textInput}
            value={formData.email}
            onChangeText={(text) => handleInputChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Contraseña"
            secureTextEntry
            style={styles.textInput}
            value={formData.password}
            onChangeText={(text) => handleInputChange("password", text)}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>
        <Botton loader={loading} title="REGISTRAR" onPress={registerUser} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  textHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: COLORS.primary,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  textInput: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default RegisterPage;
