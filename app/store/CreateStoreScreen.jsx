import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "./../../config/Service.Config";
import { useRouter } from "expo-router";
import Botton from "./../../components/providers/Botton";

export default function CreateStoreScreen() {
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo_url: "",
    banner_url: "",
    phone_number: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "Este campo es obligatorio";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createStore = async () => {
    if (!validateForm()) {
      return;
    }

    setLoader(true);
    try {
      const userId = await AsyncStorage.getItem("id");
      const cleanUserId = userId.replace(/"/g, "");

      const response = await axios.post(`${API_BASE_URL}/tiendas`, {
        ...formData,
        owner: cleanUserId,
      });

      if (response.status === 201) {
        Alert.alert("Éxito", "Tienda creada exitosamente", [
          {
            text: "OK",
            onPress: () => {
              router.replace("/add-product");
            },
          },
        ]);
      } else {
        Alert.alert("Error", "Hubo un problema al crear la tienda.");
      }
    } catch (error) {
      console.error("Error al crear la tienda:", error);
      Alert.alert("Error", "Hubo un error al crear la tienda.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Tienda</Text>
      {[
        "name",
        "description",
        "logo_url",
        "banner_url",
        "phone_number",
        "address",
      ].map((field, index) => (
        <View key={index}>
          <TextInput
            style={styles.input}
            placeholder={capitalizeFirstLetter(field)}
            value={formData[field]}
            onChangeText={(text) => handleInputChange(field, text)}
          />
          {errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
        </View>
      ))}
      <Botton loader={loader} title={"Crear Tienda"} onPress={createStore} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
