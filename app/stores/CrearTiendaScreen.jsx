import React, { useState, useEffect, useCallback } from "react";
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
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";

const CrearTiendaScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone_number: "",
    address: "",
    specific_location: "",
    owner: "",
  });
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingStore, setExistingStore] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");

  // Función para verificar la existencia de una tienda
  const checkStore = async (userId, forceFetch = false) => {
    try {
      // Intentar cargar datos locales si no se fuerza una consulta al backend
      if (!forceFetch) {
        const storedData = await AsyncStorage.getItem("store_data");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          // Validar que los datos locales tengan todos los campos necesarios
          if (
            parsedData &&
            parsedData.id &&
            parsedData.name &&
            parsedData.description &&
            parsedData.phone_number &&
            parsedData.address &&
            parsedData.specific_location &&
            parsedData.owner === userId
          ) {
            setExistingStore(parsedData);
            setIsLoading(false);
            return;
          }
        }
      }

      // Si no hay datos locales válidos o se fuerza la consulta, consultar el backend
      const response = await axios.get(
        `${API_BASE_URL}/tienda/owner/${userId}`
      );
      if (response.data) {
        const storeData = {
          id: response.data._id,
          name: response.data.name,
          description: response.data.description,
          phone_number: response.data.phone_number,
          address: response.data.address?.name || "",
          specific_location: response.data.specific_location,
          owner: userId,
          ownerName: response.data.owner?.userName || userName || "",
          logo: response.data.logo?.url,
          banner: response.data.banner?.url,
        };
        setExistingStore(storeData);
        await AsyncStorage.setItem("store_data", JSON.stringify(storeData));
      } else {
        setExistingStore(null);
        await AsyncStorage.removeItem("store_data");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setExistingStore(null);
        await AsyncStorage.removeItem("store_data");
      } else if (error.response?.status === 400) {
        Alert.alert("Error", "El ID del usuario no es válido.");
        await AsyncStorage.removeItem("id");
        router.navigate("LoginScreen");
      } else {
        console.error("Error al verificar tienda:", error);
        Alert.alert(
          "Error",
          "No se pudo verificar si tienes una tienda. Intenta de nuevo."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar userId y datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        // Cargar userId
        const id = await AsyncStorage.getItem("id");
        if (!id) {
          Alert.alert("Error", "Debes iniciar sesión para crear una tienda.");
          router.navigate("LoginScreen");
          return;
        }
        const parsedId = JSON.parse(id);
        if (!parsedId || typeof parsedId !== "string") {
          await AsyncStorage.removeItem("id");
          Alert.alert(
            "Error",
            "Sesión inválida. Por favor, inicia sesión de nuevo."
          );
          router.navigate("LoginScreen");
          return;
        }
        setUserId(parsedId);
        setFormData((prev) => ({ ...prev, owner: parsedId }));

        // Cargar userName y ciudad
        const userData = await AsyncStorage.getItem(`user${parsedId}`);
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUserName(parsedUserData.userName || "");
          if (parsedUserData?.ciudad?.name) {
            setFormData((prev) => ({
              ...prev,
              address: parsedUserData.ciudad.name,
            }));
          }
        } else {
          Alert.alert("Error", "Datos de usuario no encontrados.");
          router.navigate("LoginScreen");
          return;
        }

        // Verificar tienda
        await checkStore(parsedId);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        Alert.alert("Error", "No se pudieron cargar los datos iniciales.");
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Verificar tienda cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        setIsLoading(true);
        // Forzar consulta al backend solo si la tienda fue eliminada
        checkStore(userId, params?.storeDeleted === "true");
      }
    }, [userId, userName, params?.storeDeleted])
  );

  // Verificar si la tienda fue eliminada
  useEffect(() => {
    if (params?.storeDeleted === "true") {
      setExistingStore(null);
      AsyncStorage.removeItem("store_data");
    }
  }, [params?.storeDeleted]);

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

  const handleSubmit = async () => {
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

    setLoading(true);

    try {
      const userData = await AsyncStorage.getItem(`user${userId}`);
      if (!userData) {
        throw new Error("Datos de usuario no encontrados.");
      }
      const parsedUserData = JSON.parse(userData);
      const addressId = parsedUserData?.ciudad?.id;
      if (!addressId) {
        throw new Error("No se ha seleccionado una ciudad válida.");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("phone_number", formData.phone_number);
      formDataToSend.append("address", addressId);
      formDataToSend.append("specific_location", formData.specific_location);
      formDataToSend.append("owner", userId);

      if (logo) {
        formDataToSend.append("logo", {
          uri: logo,
          name: `logo_${userId}.jpg`,
          type: "image/jpeg",
        });
      }
      if (banner) {
        formDataToSend.append("banner", {
          uri: banner,
          name: `banner_${userId}.jpg`,
          type: "image/jpeg",
        });
      }

      const response = await axios.post(
        `${API_BASE_URL}/tienda`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const storeData = {
        id: response.data.tienda._id,
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
      await AsyncStorage.setItem("store_data", JSON.stringify(storeData));
      setExistingStore(storeData);

      // Limpiar el formulario
      setFormData({
        name: "",
        description: "",
        phone_number: "",
        address: formData.address,
        specific_location: "",
        owner: userId,
      });
      setLogo(null);
      setBanner(null);

      Alert.alert("Éxito", "Tienda creada correctamente");
    } catch (error) {
      console.error(
        "Error al crear tienda:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "No se pudo crear la tienda. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  // Componente para mostrar los detalles de la tienda
  const StoreCard = ({ store }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        router.push({
          pathname: "/stores/EditarTiendaScreen",
          params: { store: JSON.stringify(store) },
        })
      }
    >
      <Text style={styles.cardTitle}>{store.name}</Text>
      {store.banner && (
        <Image source={{ uri: store.banner }} style={styles.bannerPreview} />
      )}
      {store.logo && (
        <Image source={{ uri: store.logo }} style={styles.imagePreview} />
      )}
      <Text style={styles.cardLabel}>Propietario:</Text>
      <Text style={styles.cardText}>{store.ownerName}</Text>
      <Text style={styles.cardLabel}>Descripción:</Text>
      <Text style={styles.cardText}>{store.description}</Text>
      <Text style={styles.cardLabel}>Teléfono:</Text>
      <Text style={styles.cardText}>{store.phone_number}</Text>
      <Text style={styles.cardLabel}>Dirección:</Text>
      <Text style={styles.cardText}>{store.address}</Text>
      <Text style={styles.cardLabel}>Ubicación específica:</Text>
      <Text style={styles.cardText}>{store.specific_location}</Text>
    </TouchableOpacity>
  );

  // Mostrar loader centrado mientras se verifica
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#00C853" />
        </View>
      </SafeAreaView>
    );
  }

  // Renderizar StoreCard si existe una tienda
  if (existingStore) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="chevron-left" size={30} color="#00C853" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Detalles de la Tienda</Text>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          <StoreCard store={existingStore} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Renderizar formulario si no hay tienda
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={30} color="#00C853" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Crear Nueva Tienda</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
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
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dirección*</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={formData.address}
            editable={false}
            placeholder="Guinea Ecuatorial"
            placeholderTextColor="#A0A0A0"
          />
        </View>
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
                  key={banner}
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
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <MaterialIcons name="store" size={24} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>
            {loading ? "Creando..." : "Crear Tienda"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    marginTop: 30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  submitButton: {
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
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    color: "#1A1A1A",
  },
});

export default CrearTiendaScreen;
