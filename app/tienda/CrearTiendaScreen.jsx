import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

const CrearTiendaScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone_number: "",
    address: "",
    owner: "", // En una app real, esto vendría del usuario autenticado
  });
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const pickImage = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "logo" ? [1, 1] : [4, 1],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === "logo") {
        setLogo(result.assets[0].uri);
      } else {
        setBanner(result.assets[0].uri);
      }
    }
  };

  const handleSubmit = async () => {
    // Validación de campos
    const missingFields = [];
    if (!formData.name) missingFields.push("Nombre");
    if (!formData.description) missingFields.push("Descripción");
    if (!formData.phone_number) missingFields.push("Teléfono");
    if (!formData.address) missingFields.push("Dirección");
    if (!logo) missingFields.push("Logo");
    if (!banner) missingFields.push("Banner");

    if (missingFields.length > 0) {
      Alert.alert(
        "Campos obligatorios",
        `Los siguientes campos son requeridos: ${missingFields.join(", ")}`
      );
      return;
    }

    setLoading(true);

    try {
      // Aquí iría la llamada a tu API para crear la tienda
      // Necesitarías implementar la subida de imágenes a tu backend
      // const formDataToSend = new FormData();
      // formDataToSend.append('name', formData.name);
      // ... otros campos
      // formDataToSend.append('logo', { uri: logo, name: 'logo.jpg', type: 'image/jpg' });
      // formDataToSend.append('banner', { uri: banner, name: 'banner.jpg', type: 'image/jpg' });

      // const response = await fetch('tu-api/tiendas', {
      //   method: 'POST',
      //   body: formDataToSend,
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      // Simulación de éxito
      Alert.alert("Éxito", "Tienda creada correctamente");
      navigation.goBack();
    } catch (error) {
      console.error("Error al crear tienda:", error);
      Alert.alert("Error", "No se pudo crear la tienda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Nueva Tienda</Text>

      {/* Campo Nombre */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre de la tienda*</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleChange("name", text)}
          placeholder="Ej: GD Tienda"
        />
      </View>

      {/* Campo Descripción */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descripción*</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={formData.description}
          onChangeText={(text) => handleChange("description", text)}
          placeholder="Describe tu tienda"
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Campo Teléfono */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Teléfono de contacto*</Text>
        <TextInput
          style={styles.input}
          value={formData.phone_number}
          onChangeText={(text) => handleChange("phone_number", text)}
          placeholder="Ej: +123456789"
          keyboardType="phone-pad"
        />
      </View>

      {/* Campo Dirección */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Dirección*</Text>
        <TextInput
          style={styles.input}
          value={formData.address}
          onChangeText={(text) => handleChange("address", text)}
          placeholder="Dirección física o ID de ubicación"
        />
      </View>

      {/* Subir Logo */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Logo de la tienda*</Text>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => pickImage("logo")}
        >
          {logo ? (
            <Image source={{ uri: logo }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePickerText}>Seleccionar Logo (1:1)</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Subir Banner */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Banner de la tienda*</Text>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => pickImage("banner")}
        >
          {banner ? (
            <Image
              source={{ uri: banner }}
              style={[styles.imagePreview, styles.bannerPreview]}
            />
          ) : (
            <Text style={styles.imagePickerText}>Seleccionar Banner (4:1)</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Botón de enviar */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Creando..." : "Crear Tienda"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  imagePickerText: {
    color: "#666",
  },
  imagePreview: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  bannerPreview: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  submitButton: {
    backgroundColor: "#ff6600",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CrearTiendaScreen;
