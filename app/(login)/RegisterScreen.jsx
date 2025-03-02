import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";
import { Ionicons } from "@expo/vector-icons";
import Picker from "react-native-picker-select";
import Botton from "../../components/providers/Botton";
import { COLORS } from "../../constants/theme";
import { router } from "expo-router";
function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    mobile: "",
    ciudad: "",
    password: "",
  });
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/locations/cities`);
        setCities(response.data);
      } catch (error) {
        console.error("Error al obtener ciudades:", error);
        Alert.alert("Error", "No se pudieron cargar las ciudades.");
      }
    };

    fetchCities();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName || formData.userName.length < 3) {
      newErrors.userName = "El nombre debe tener al menos 3 caracteres.";
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Introduce un email válido.";
    }
    if (!formData.mobile || formData.mobile.length < 9) {
      newErrors.mobile =
        "Introduce un número de móvil válido (mínimo 9 dígitos).";
    }
    if (!formData.ciudad) {
      newErrors.ciudad = "Por favor selecciona una ciudad.";
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
        router.push("LoginSceen");
        Alert.alert("Registro exitoso", "Ahora puedes iniciar sesión.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Error al registrarse, intentelo de nuevo."
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
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Telefono"
            style={styles.textInput}
            value={formData.mobile}
            onChangeText={(text) => handleInputChange("mobile", text)}
          />
          {errors.mobile && (
            <Text style={styles.errorText}>{errors.mobile}</Text>
          )}
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
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={24} color="#4c86A8" />
          <Picker
            placeholder={{ label: "Selecciona una ciudad", value: null }}
            style={pickerSelectStyles}
            onValueChange={(value) => handleInputChange("ciudad", value)}
            items={cities.map((city) => ({
              label: city.name,
              value: city._id,
            }))}
          />
          {errors.ciudad && (
            <Text style={styles.errorText}>{errors.ciudad}</Text>
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#f0f0f0",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#f0f0f0",
  },
});

export default RegisterPage;
