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
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { SIZES } from "../../constants/theme";

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
    type: "product",
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("id");
        if (storedUserId) {
          const cleanUserId = storedUserId.replace(/"/g, ""); // Eliminar comillas adicionales
          setUserId(cleanUserId);
          // console.log("UserId limpio:", cleanUserId);
        } else {
          console.error("No se encontró userId en AsyncStorage");
        }
      } catch (error) {
        console.error("Error al obtener userId:", error);
      }
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
  // En useEffect para obtener la subcategoría seleccionada
  useEffect(() => {
    const getSelectedSubcategory = async () => {
      const storedSubcategory = await AsyncStorage.getItem(
        "selectedSubcategory"
      );
      if (storedSubcategory) {
        try {
          const subcategory = JSON.parse(storedSubcategory);
          setSelectedCategory(subcategory);
          console.log("Subcategoría seleccionada:", subcategory.name);
        } catch (error) {
          console.error("Error parsing stored subcategory:", error);
        }
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
  // Función para mostrar las opciones de selección de imágenes
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
  const AddPost = async () => {
    if (!validateForm()) {
      return;
    }

    setLoader(true);
    try {
      const userId = await AsyncStorage.getItem("id");

      // Limpiar el userId (eliminar comillas si existen)
      const cleanUserId = userId.replace(/"/g, "");

      console.log("UserId limpio:", cleanUserId);

      if (!cleanUserId) {
        Alert.alert(
          "Error",
          "No se encontró el ID del usuario. Inicia sesión nuevamente."
        );
        return;
      }

      const endpoint = `${API_BASE_URL}/products/${cleanUserId}`;
      const formDataToSend = new FormData();

      // Append form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append subcategory
      if (selectedCategory) {
        formDataToSend.append("subcategory", selectedCategory._id);
        console.log(`Selected Subcategory ID: ${selectedCategory._id}`);
      } else {
        console.error("No subcategory selected");
        Alert.alert("Error", "Debes seleccionar una subcategoría.");
        return;
      }

      // Append user ID
      formDataToSend.append("user", userId); // Ensure this is correct

      // Append images
      images.forEach((imageUri, index) => {
        const uriParts = imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formDataToSend.append("images", {
          uri: imageUri,
          name: `image-${index + 1}.${fileType}`,
          type: `image/${fileType}`,
        });
      });

      // Log FormData for debugging
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`FormData Key: ${key}, Value: ${value}`);
      }

      // Send POST request
      const response = await axios.post(endpoint, formDataToSend, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

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
      } else {
        Alert.alert("Error", "Hubo un problema al agregar el producto.");
      }
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      if (error.response) {
        console.error("Server Error:", error.response.data);
        Alert.alert(
          "Error",
          error.response.data.message || "Error desconocido"
        );
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
    <SafeAreaView style={[styles.safeArea, { marginTop: 30 }]}>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => {}}>
          <Ionicons name="location-outline" size={30} color="black" />
        </TouchableOpacity> */}
        <Text style={styles.location}>Agregar Productos</Text>
        <TouchableOpacity onPress={() => router.push("/cart/ArchivoScreen")}>
          <Ionicons name="storefront-sharp" size={30} color="black" />
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
              onPress={() => {
                router.push({
                  pathname: "/categorias/SubcategoriesScreen",
                  params: {
                    selectedCategory: selectedCategory
                      ? JSON.stringify(selectedCategory)
                      : null,
                  },
                });
              }}
            >
              <Text style={styles.selectorText}>
                {selectedCategory?.name || "Seleccionar categoría"}
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
              <TouchableOpacity onPress={showImagePickerOptions}>
                {images.length === 0 ? (
                  <Image
                    source={require("./../../assets/images/placeholderImage.png")}
                    style={styles.image}
                  />
                ) : (
                  <Ionicons name="add-circle" size={40} color="black" />
                )}
              </TouchableOpacity>
              {images.length > 0 && (
                <FlatList
                  data={images}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <View style={styles.imageWrapper}>
                      <Image source={{ uri: item }} style={styles.image} />
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
  location: {
    textAlign: "center",
    marginTop: 7,
    letterSpacing: 4,
    marginBottom: 5,
    color: "gray",
    fontSize: 20,
  },
  imageSelectionContainer: {
    flexDirection: "row", // Alinea el botón y las imágenes horizontalmente
    alignItems: "center", // Alinea verticalmente al centro
    marginBottom: 10,
  },
  appBarWrapper: {
    marginHorizontal: 22,
    marginTop: SIZES.small,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 22,
    marginTop: SIZES.small,
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
