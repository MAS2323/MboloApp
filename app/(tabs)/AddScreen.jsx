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
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
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

  useEffect(() => {
    const getSelectedCategoryAndSubcategory = async () => {
      try {
        // Recuperar la categoría seleccionada
        const storedCategory = await AsyncStorage.getItem("selectedCategory");
        if (storedCategory) {
          const category = JSON.parse(storedCategory);
          setSelectedCategory(category);
        }

        // Recuperar la subcategoría seleccionada
        const storedSubcategory = await AsyncStorage.getItem(
          "selectedSubcategory"
        );
        if (storedSubcategory) {
          const subcategory = JSON.parse(storedSubcategory);
          setSelectedSubcategory(subcategory);
        }
      } catch (error) {
        console.error("Error parsing stored category or subcategory:", error);
      }
    };

    getSelectedCategoryAndSubcategory();
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
      const cleanUserId = userId.replace(/"/g, "");
      const endpoint = `${API_BASE_URL}/products/${cleanUserId}`;
      const formDataToSend = new FormData();

      // Agregar campos del formulario
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Agregar categoría y subcategoría
      if (selectedCategory) {
        formDataToSend.append("category", selectedCategory._id);
      } else {
        Alert.alert("Error", "Debes seleccionar una categoría.");
        return;
      }

      if (selectedSubcategory) {
        formDataToSend.append("subcategory", selectedSubcategory._id);
      } else {
        Alert.alert("Error", "Debes seleccionar una subcategoría.");
        return;
      }

      // Agregar imágenes
      images.forEach((imageUri, index) => {
        const uriParts = imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formDataToSend.append("images", {
          uri: imageUri,
          name: `image-${index + 1}.${fileType}`,
          type: `image/${fileType}`,
        });
      });

      // Enviar la solicitud
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
              AsyncStorage.removeItem("selectedCategory");
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
        Alert.alert(
          "Error",
          error.response.data.message || "Error desconocido"
        );
      } else if (error.request) {
        Alert.alert("Error", "No se pudo conectar al servidor.");
      } else {
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
              <Ionicons name="chevron-down" size={20} color="black" />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginTop: 30,
  },
  location: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  inputContainer: {
    marginBottom: 20,
  },
  selectorButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#fff",
  },
  selectorText: {
    fontSize: 16,
    color: "#333",
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
  imageSelectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  imageWrapper: {
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
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
    borderRadius: 10,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#fff",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#fff",
  },
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * 
 * import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const getSelectedSubcategory = async () => {
      const storedSubcategory = await AsyncStorage.getItem(
        "selectedSubcategory"
      );
      if (storedSubcategory) {
        try {
          const subcategory = JSON.parse(storedSubcategory);
          setSelectedCategory(subcategory);
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
      const cleanUserId = userId.replace(/"/g, "");
      const endpoint = `${API_BASE_URL}/products/${cleanUserId}`;
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (selectedCategory) {
        formDataToSend.append("subcategory", selectedCategory._id);
      } else {
        Alert.alert("Error", "Debes seleccionar una subcategoría.");
        return;
      }

      formDataToSend.append("user", userId);

      images.forEach((imageUri, index) => {
        const uriParts = imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formDataToSend.append("images", {
          uri: imageUri,
          name: `image-${index + 1}.${fileType}`,
          type: `image/${fileType}`,
        });
      });

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
        Alert.alert("Error", error.response.data.message || "Error desconocido");
      } else if (error.request) {
        Alert.alert("Error", "No se pudo conectar al servidor.");
      } else {
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
              <Ionicons name="chevron-down" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => {
                // Aquí puedes abrir el selector de ciudades
              }}
            >
              <Text style={styles.selectorText}>
                {formData.product_location
                  ? cities.find((city) => city._id === formData.product_location)
                      ?.name || "Selecciona una ciudad"
                  : "Selecciona una ciudad"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="black" />
            </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  location: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  inputContainer: {
    marginBottom: 20,
  },
  selectorButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#fff",
  },
  selectorText: {
    fontSize: 16,
    color: "#333",
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
  imageSelectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  imageWrapper: {
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
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
    borderRadius: 10,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#fff",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#fff",
  },
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
 */
