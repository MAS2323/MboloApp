import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";

const EditarTiendaScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const storeData = params.store ? JSON.parse(params.store) : {};

  const [formData, setFormData] = useState({
    id: storeData.id || "",
    name: storeData.name || "",
    description: storeData.description || "",
    phone_number: storeData.phone_number || "",
    address: storeData.address || "",
    specific_location: storeData.specific_location || "",
    owner: storeData.owner || "",
  });
  const [logo, setLogo] = useState(storeData.logo || null);
  const [banner, setBanner] = useState(storeData.banner || null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(storeData.ownerName || "");

  // Cargar userId
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("id");
        if (!id) {
          Alert.alert("Error", "Debes iniciar sesión para editar la tienda.");
          router.navigate("LoginScreen");
          return;
        }
        setUserId(JSON.parse(id));
      } catch (error) {
        console.error("Error al cargar userId:", error);
        Alert.alert("Error", "No se pudo cargar la sesión.");
      }
    };
    loadUserId();
  }, []);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const pickImage = async (type) => {
    if (type === "logo" && logo) {
      Alert.alert("Límite alcanzado", "Solo se permite subir un logo.");
      return;
    }
    if (type === "banner" && banner) {
      Alert.alert("Límite alcanzado", "Solo se permite subir un banner.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "logo" ? [1, 1] : [4, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      try {
        await new Promise((resolve, reject) => {
          Image.getSize(
            uri,
            () => resolve(),
            (error) => reject(error)
          );
        });
        if (type === "logo") {
          setLogo(uri);
        } else {
          setBanner(uri);
        }
      } catch (error) {
        console.error("Error al validar imagen:", error);
        Alert.alert("Error", "No se pudo cargar la imagen seleccionada.");
      }
    }
  };

  const removeImage = (type) => {
    if (type === "logo") {
      setLogo(null);
    } else {
      setBanner(null);
    }
  };

  const handleUpdate = async () => {
    const missingFields = [];
    if (!formData.name) missingFields.push("Nombre");
    if (!formData.description) missingFields.push("Descripción");
    if (!formData.phone_number) missingFields.push("Teléfono");
    if (!formData.address) missingFields.push("Dirección");
    if (!formData.specific_location) missingFields.push("Ubicación específica");
    if (!formData.owner) missingFields.push("Propietario");
    if (!logo) missingFields.push("Logo");
    if (!banner) missingFields.push("Banner");

    if (missingFields.length > 0) {
      Alert.alert(
        "Campos obligatorios",
        `Los siguientes campos son requeridos: ${missingFields.join(", ")}`
      );
      return;
    }

    if (!formData.id) {
      Alert.alert("Error", "No se encontró el ID de la tienda.");
      return;
    }

    setLoading(true);

    try {
      // Obtener addressId desde AsyncStorage
      const userData = await AsyncStorage.getItem(`user${userId}`);
      if (!userData) {
        throw new Error("Datos de usuario no encontrados.");
      }
      const parsedUserData = JSON.parse(userData);
      const addressId = parsedUserData?.ciudad?.id;
      if (!addressId) {
        throw new Error("No se ha seleccionado una ciudad válida.");
      }

      // Preparar datos para el backend
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("phone_number", formData.phone_number);
      formDataToSend.append("address", addressId);
      formDataToSend.append("specific_location", formData.specific_location);
      formDataToSend.append("owner", userId);

      if (logo && logo !== storeData.logo) {
        formDataToSend.append("logo", {
          uri: logo,
          name: `logo_${userId}.jpg`,
          type: "image/jpeg",
        });
      }
      if (banner && banner !== storeData.banner) {
        formDataToSend.append("banner", {
          uri: banner,
          name: `banner_${userId}.jpg`,
          type: "image/jpeg",
        });
      }

      // Enviar al backend
      const response = await axios.put(
        `${API_BASE_URL}/tienda/${formData.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Actualizar AsyncStorage
      const updatedStore = {
        id: formData.id,
        name: formData.name,
        description: formData.description,
        phone_number: formData.phone_number,
        address: formData.address,
        specific_location: formData.specific_location,
        owner: userId,
        ownerName: userName,
        logo: response.data.tienda.logo.url,
        banner: response.data.tienda.banner.url,
      };
      await AsyncStorage.setItem("store_data", JSON.stringify(updatedStore));

      Alert.alert("Éxito", "Tienda actualizada correctamente");
      router.push("/create-store");
    } catch (error) {
      console.error(
        "Error al actualizar tienda:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "No se pudo actualizar la tienda. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) {
      Alert.alert("Error", "No se encontró el ID de la tienda.");
      return;
    }

    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar la tienda? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete(`${API_BASE_URL}/tienda/${formData.id}`);
              await AsyncStorage.removeItem("store_data");
              Alert.alert("Éxito", "Tienda eliminada correctamente");
              router.push({
                pathname: "/stores/CrearTiendaScreen",
                params: { storeDeleted: "true" },
              });
            } catch (error) {
              console.error(
                "Error al eliminar tienda:",
                error.response?.data || error.message
              );
              Alert.alert(
                "Error",
                error.response?.data?.message ||
                  "No se pudo eliminar la tienda. Intenta de nuevo."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={30} color="#00C853" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Editar Tienda</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Campo Propietario (primer campo, no editable) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Propietario*</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={userName}
            editable={false}
            placeholder="Nombre del propietario"
            placeholderTextColor="#A0A0A0"
          />
        </View>

        {/* Campo Nombre */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre de la tienda*</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
            placeholder="Ej: GD Tienda"
            placeholderTextColor="#A0A0A0"
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
            placeholderTextColor="#A0A0A0"
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
            placeholder="Ej: +24022255555"
            placeholderTextColor="#A0A0A0"
            keyboardType="phone-pad"
          />
        </View>

        {/* Campo Dirección (no editable) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dirección*</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={formData.address}
            editable={false}
            placeholder="Selecciona una ciudad"
            placeholderTextColor="#A0A0A0"
          />
        </View>

        {/* Campo Ubicación Específica */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Ubicación específica (barrio, calle, zona)*
          </Text>
          <TextInput
            style={styles.input}
            value={formData.specific_location}
            onChangeText={(text) => handleChange("specific_location", text)}
            placeholder="Ej: Barrio Central, Calle Principal"
            placeholderTextColor="#A0A0A0"
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
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: logo }}
                  style={styles.imagePreview}
                  key={logo}
                  onError={(e) => {
                    console.error("Error cargando logo:", e.nativeEvent.error);
                    Alert.alert("Error", "No se pudo cargar el logo.");
                  }}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeImage("logo")}
                >
                  <MaterialIcons name="delete" size={24} color="#FF0000" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <MaterialIcons name="image" size={40} color="#A0A0A0" />
                <Text style={styles.imagePickerText}>
                  Seleccionar Logo (1:1)
                </Text>
              </View>
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
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: banner }}
                  style={styles.bannerPreview}
                  key={banner + Date.now()}
                  onError={(e) => {
                    console.error(
                      "Error cargando banner:",
                      e.nativeEvent.error
                    );
                    Alert.alert("Error", "No se pudo cargar el banner.");
                  }}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeImage("banner")}
                >
                  <MaterialIcons name="delete" size={24} color="#FF0000" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <MaterialIcons name="panorama" size={40} color="#A0A0A0" />
                <Text style={styles.imagePickerText}>
                  Seleccionar Banner (4:1)
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.updateButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleUpdate}
            disabled={loading}
          >
            <MaterialIcons name="update" size={24} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>
              {loading ? "Actualizando..." : "Actualizar Tienda"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.deleteStoreButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleDelete}
            disabled={loading}
          >
            <MaterialIcons name="delete-forever" size={24} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Eliminar Tienda</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
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
    color: "#1A1A1A",
  },
  container: {
    padding: 15,
    paddingTop: 60,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
  },
  disabledInput: {
    backgroundColor: "#F5F5F5",
    color: "#666",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  imagePicker: {
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerText: {
    color: "#666",
    fontSize: 14,
    marginTop: 8,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: "contain",
  },
  bannerPreview: {
    width: "100%",
    aspectRatio: 4 / 1,
    resizeMode: "contain",
  },
  deleteButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: "#00C853",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    flex: 1,
    marginRight: 10,
  },
  deleteStoreButton: {
    backgroundColor: "#FF0000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    flex: 1,
  },
  submitButtonDisabled: {
    backgroundColor: "#A0A0A0",
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default EditarTiendaScreen;
