import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Botton from "./../../components/providers/Botton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Picker from "react-native-picker-select";
import { API_BASE_URL } from "./../../config/Service.Config";
import { useRouter } from "expo-router";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons"; // Importar íconos

export default function AddScreen() {
  const [loader, setLoader] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    supplier: "",
    price: "",
    product_location: "",
    description: "",
    phoneNumber: "",
    whatsapp: "",
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    const getUserId = async () => {
      const token = await AsyncStorage.getItem("token");
      setUserId(token?.replace(/\"/g, "") || "");
    };
    getUserId();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/categories?type=product`
        );
        setCategories(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("No se pudieron cargar las categorías. Inténtalo de nuevo.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const getSelectedSubcategory = async () => {
      const storedSubcategory = await AsyncStorage.getItem(
        "selectedSubcategory"
      );
      if (storedSubcategory) {
        setSelectedCategory(JSON.parse(storedSubcategory));
      }
    };
    getSelectedSubcategory();
  }, []);

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

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status: galleryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();

      if (galleryStatus !== "granted" || cameraStatus !== "granted") {
        Alert.alert(
          "Permisos necesarios",
          "Necesitamos permisos para acceder a la galería y la cámara."
        );
        return false;
      }
    }
    return true;
  };

  const pickImages = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const selectedImages = result.assets.map((asset) => asset.uri);
        setImages((prevImages) => [...prevImages, ...selectedImages]);
      } else {
        console.log("Selección cancelada o sin imágenes");
      }
    } catch (error) {
      console.error("Error seleccionando imágenes:", error);
    }
  };

  const takePhoto = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImages((prevImages) => [
          ...prevImages,
          ...result.assets.map((asset) => asset.uri),
        ]);
      }
    } catch (error) {
      console.error("Error tomando foto:", error);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      "Seleccionar imagen",
      "Elige una opción",
      [
        { text: "Seleccionar de Galería", onPress: pickImages },
        { text: "Tomar una foto", onPress: takePhoto },
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
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
  const AddPost = async () => {
    if (!validateForm()) {
      return;
    }

    setLoader(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert(
          "Error",
          "No se encontró el token de autenticación. Inicia sesión nuevamente."
        );
        return;
      }

      const endpoint = `${API_BASE_URL}/products`;

      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (userId) {
        // formDataToSend.append("user", userId);
        // formDataToSend.append("token", token);
      } else {
        Alert.alert(
          "Error",
          "No se pudo obtener el ID del usuario. Por favor, asegúrate de estar logueado."
        );
        return;
      }

      if (selectedCategory) {
        formDataToSend.append("category", selectedCategory._id);
      }

      images.forEach((imageUri, index) => {
        const uriParts = imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formDataToSend.append("images", {
          uri: imageUri,
          name: `image-${index + 1}.${fileType}`,
          type: `image/${fileType}`,
        });
      });

      console.log("Form Data to Send:", formDataToSend);

      const response = await axios.post(endpoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
        transformResponse: (res) => {
          console.log("Raw Server Response:", res); // Log the raw response
          return res; // Let Axios handle the JSON parsing
        },
      });

      console.log("Server Response:", response.data);

      if (response.headers["content-type"].includes("application/json")) {
        if (response.status === 201) {
          Alert.alert("Éxito", "Producto agregado exitosamente", [
            {
              text: "OK",
              onPress: () => {
                setFormData({
                  title: "",
                  supplier: "",
                  price: "",
                  product_location: "",
                  description: "",
                  phoneNumber: "",
                  whatsapp: "",
                });
                setImages([]);
                AsyncStorage.removeItem("selectedSubcategory");
                router.replace("(tabs)");
              },
            },
          ]);
        }
      } else {
        console.error("La respuesta no es JSON:", response.data);
        Alert.alert("Error", "La respuesta del servidor no es válida");
      }
    } catch (error) {
      console.error("Error al agregar el producto:", error);

      if (error.response) {
        if (
          error.response.headers["content-type"].includes("application/json")
        ) {
          console.error("Server Error (JSON):", error.response.data);
          Alert.alert(
            "Error",
            error.response.data.message || "Error desconocido"
          );
        } else {
          console.error("Server Error (Non-JSON):", error.response.data);
          Alert.alert("Error", "El servidor devolvió una respuesta no válida.");
        }
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor:", error.request);
        Alert.alert("Error", "No se pudo conectar al servidor.");
      } else {
        console.error("Error en la solicitud:", error.message);
        Alert.alert("Error", "Hubo un error al agregar el producto.");
      }
    } finally {
      setLoader(false);
    }
  };

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Debes iniciar sesión para agregar un producto
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="location-outline" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.location}>Agregar Productos</Text>
        <TouchableOpacity onPress={() => router.push("/cart/CartScreen")}>
          <SimpleLineIcons name="bag" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => router.push("/categorias/SubcategoriesScreen")}
            >
              <Text style={styles.selectorText}>
                {selectedCategory
                  ? selectedCategory.name
                  : "Seleccionar categoría"}
              </Text>
              <View>
                <Text style={styles.arrow}>▼</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Picker
              placeholder={{ label: "Selecciona una ciudad", value: null }}
              style={pickerSelectStyles}
              onValueChange={(value) =>
                handleInputChange("product_location", value)
              }
              items={cities.map((city) => ({
                label: city.name,
                value: city._id,
              }))}
            />
            {errors.product_location && (
              <Text style={styles.errorText}>{errors.product_location}</Text>
            )}
          </View>
          <View>
            <View style={styles.imageSelectionContainer}>
              {/* Botón para seleccionar imágenes */}
              <TouchableOpacity onPress={showImagePickerOptions}>
                {images.length === 0 ? (
                  // Mostrar la imagen de placeholder si no hay imágenes
                  <Image
                    source={require("./../../assets/images/placeholderImage.png")}
                    style={styles.image}
                  />
                ) : (
                  <Ionicons name="add-circle" size={40} color="black" />
                )}
              </TouchableOpacity>

              {/* Lista de imágenes */}
              {images.length > 0 && (
                <FlatList
                  data={images}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <View style={styles.imageWrapper}>
                      <Image source={{ uri: item }} style={styles.image} />
                      {/* Botón para eliminar la imagen */}
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeImage(index)}
                      >
                        <Ionicons name="close-circle" size={24} color="red" />
                      </TouchableOpacity>
                    </View>
                  )}
                  contentContainerStyle={{ paddingHorizontal: 10 }}
                />
              )}
            </View>
            <Text style={styles.infoText}>
              Puedes subir un máximo de 6 imágenes
            </Text>
          </View>

          {[
            "title",
            "supplier",
            "description",
            "price",
            "phoneNumber",
            "whatsapp",
          ].map((field, index) => (
            <View key={index}>
              <TextInput
                style={styles.input}
                placeholder={capitalizeFirstLetter(field)}
                value={formData[field]}
                onChangeText={(text) => handleInputChange(field, text)}
              />
              {errors[field] && (
                <Text style={styles.error}>{errors[field]}</Text>
              )}
            </View>
          ))}
          <Botton loader={loader} title={"Agregar"} onPress={AddPost} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  imageSelectionContainer: {
    flexDirection: "row", // Alinea el botón y las imágenes horizontalmente
    alignItems: "center", // Alinea verticalmente al centro
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
    marginHorizontal: 22,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 5,
    padding: 10,
  },
  imageWrapper: {
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 12,
  },
  message: {
    textAlign: "center",
    fontSize: 16,
    color: "#000",
    marginTop: 20,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  infoText: {
    textAlign: "center",
    fontSize: 14,
    color: "gray",
    marginBottom: 8,
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#ddd", // Color de fondo para el botón
    borderRadius: 10,
  },
  imageWrapper: {
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 5,
    borderRadius: 50,
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
