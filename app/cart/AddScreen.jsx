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
  ActivityIndicator,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "./../../config/Service.Config";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";

const COLORS = {
  primary: "#4c86A8",
  secondary: "#DDF0FF",
  tertiary: "#FF7754",
  gray: "#83829A",
  gray2: "#C1C0C8",
  offwhite: "#F3F4F8",
  white: "#FFFFFF",
  black: "#000000",
  red: "#e81e4d",
  green: "#00C135",
  lightwhite: "#FAFAFC",
};

export default function AddScreen() {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tiendaId, setTiendaId] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    supplier: "",
    price: "",
    description: "",
    type: "product",
    tallas: [],
    numeros_calzado: [],
    colores: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoader(true);
        const storedUserId = await AsyncStorage.getItem("id");
        if (storedUserId) {
          const cleanUserId = storedUserId.replace(/"/g, "");
          setUserId(cleanUserId);

          const storeResponse = await axios.get(
            `${API_BASE_URL}/tienda/owner/${cleanUserId}`
          );
          if (storeResponse.data && storeResponse.data._id) {
            setTiendaId(storeResponse.data._id);
          } else {
            Alert.alert(
              "Error",
              "No se encontró una tienda asociada a tu cuenta."
            );
            router.push("/crear-tienda");
          }
        } else {
          Alert.alert(
            "Error",
            "Debes iniciar sesión para agregar un producto."
          );
          router.push("/login");
        }

        const storedFormData = await AsyncStorage.getItem("addProductFormData");
        if (storedFormData) {
          setFormData(JSON.parse(storedFormData));
        }

        const storedImages = await AsyncStorage.getItem("addProductImages");
        if (storedImages) {
          setImages(JSON.parse(storedImages));
        }

        const storedVideos = await AsyncStorage.getItem("addProductVideos");
        if (storedVideos) {
          setVideos(JSON.parse(storedVideos));
        }

        const storedCategory = await AsyncStorage.getItem("selectedCategory");
        if (storedCategory) {
          setSelectedCategory(JSON.parse(storedCategory));
        }

        const storedSubcategory = await AsyncStorage.getItem(
          "selectedSubcategory"
        );
        if (storedSubcategory) {
          setSelectedSubcategory(JSON.parse(storedSubcategory));
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        Alert.alert("Error", "No se pudo cargar la información inicial.");
      } finally {
        setLoader(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const saveFormData = async () => {
      try {
        await AsyncStorage.setItem(
          "addProductFormData",
          JSON.stringify(formData)
        );
        await AsyncStorage.setItem("addProductImages", JSON.stringify(images));
        await AsyncStorage.setItem("addProductVideos", JSON.stringify(videos));
      } catch (error) {
        console.error("Error al guardar datos en AsyncStorage:", error);
      }
    };
    saveFormData();
  }, [formData, images, videos]);

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

  const takePhoto = async () => {
    try {
      const totalFiles = images.length + videos.length;
      if (totalFiles >= 10) {
        Alert.alert("Límite alcanzado", "No puedes agregar más de 10 archivos");
        return;
      }

      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const newImages = result.assets.map((asset) => asset.uri);
        if (totalFiles + newImages.length > 10) {
          Alert.alert("Límite alcanzado", "Máximo 10 archivos en total");
          return;
        }
        setImages((prevImages) => [...prevImages, ...newImages]);
      }
    } catch (error) {
      console.error("Error tomando foto:", error);
    }
  };

  const pickFiles = async () => {
    try {
      const totalFiles = images.length + videos.length;
      if (totalFiles >= 10) {
        Alert.alert("Límite alcanzado", "No puedes agregar más de 10 archivos");
        return;
      }

      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const selectedFiles = result.assets;
        const newImages = [];
        const newVideos = [];

        selectedFiles.forEach((asset) => {
          if (asset.type === "video") {
            newVideos.push(asset.uri);
          } else {
            newImages.push(asset.uri);
          }
        });

        const totalNewFiles = newImages.length + newVideos.length;
        if (totalFiles + totalNewFiles > 10) {
          Alert.alert(
            "Límite excedido",
            `Solo puedes seleccionar ${10 - totalFiles} archivo(s) más.`
          );
          return;
        }

        setImages((prevImages) => [...prevImages, ...newImages]);
        setVideos((prevVideos) => [...prevVideos, ...newVideos]);
      }
    } catch (error) {
      console.error("Error seleccionando archivos:", error);
    }
  };

  const showFilePickerOptions = () => {
    Alert.alert(
      "Seleccionar archivo",
      "Elige una opción",
      [
        { text: "Seleccionar de Galería", onPress: pickFiles },
        { text: "Tomar una foto", onPress: takePhoto },
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const removeImage = (index) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const removeVideo = (index) =>
    setVideos((prev) => prev.filter((_, i) => i !== index));

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearForm = async () => {
    setFormData({
      title: "",
      supplier: "",
      price: "",
      description: "",
      type: "product",
      tallas: [],
      numeros_calzado: [],
      colores: [],
    });
    setImages([]);
    setVideos([]);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setErrors({});
    try {
      await AsyncStorage.removeItem("addProductFormData");
      await AsyncStorage.removeItem("addProductImages");
      await AsyncStorage.removeItem("addProductVideos");
      await AsyncStorage.removeItem("selectedCategory");
      await AsyncStorage.removeItem("selectedSubcategory");
    } catch (error) {
      console.error("Error al limpiar AsyncStorage:", error);
    }
    setMenuVisible(false);
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["title", "supplier", "price", "description"];

    requiredFields.forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "Este campo es obligatorio";
      }
    });

    if (!selectedCategory) {
      newErrors.category = "Debes seleccionar una categoría";
    }

    if (!selectedSubcategory) {
      newErrors.subcategory = "Debes seleccionar una subcategoría";
    }

    if (images.length === 0 && videos.length === 0) {
      newErrors.files = "Debes agregar al menos un archivo (imagen o video)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const AddPost = async () => {
    if (!validateForm()) {
      return;
    }

    setLoader(true);
    try {
      const endpoint = `${API_BASE_URL}/products/${userId}`;
      console.log("Sending request to:", endpoint);

      const formDataToSend = new FormData();

      // Add form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          if (Array.isArray(formData[key])) {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      formDataToSend.append("category", selectedCategory._id);
      formDataToSend.append("subcategory", selectedSubcategory._id);
      formDataToSend.append("tienda", tiendaId);

      // Add files
      images.forEach((uri, index) => {
        const fileExtension = uri.split(".").pop().toLowerCase();
        const mimeType = `image/${
          fileExtension === "jpg" ? "jpeg" : fileExtension
        }`;
        console.log(`Appending image ${index}:`, { uri, mimeType });
        formDataToSend.append("images", {
          uri,
          name: `image-${Date.now()}-${index}.${fileExtension}`,
          type: mimeType,
        });
      });

      videos.forEach((uri, index) => {
        const fileExtension = uri.split(".").pop().toLowerCase();
        console.log(`Appending video ${index}:`, {
          uri,
          type: `video/${fileExtension}`,
        });
        formDataToSend.append("videos", {
          uri,
          name: `video-${Date.now()}-${index}.${fileExtension}`,
          type: `video/${fileExtension}`,
        });
      });

      // Log FormData entries
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`FormData - ${key}:`, value);
      }

      const response = await axios.post(endpoint, formDataToSend, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle success
      if (response.status === 201) {
        const productId = response.data.product._id;
        await axios.patch(`${API_BASE_URL}/tienda/${tiendaId}/add-product`, {
          productId,
        });
        await clearForm();
        await AsyncStorage.removeItem("products_data");
        Alert.alert("Éxito", "Producto agregado exitosamente", [
          {
            text: "OK",
            onPress: () => router.replace("(tabs)"),
          },
        ]);
      }
    } catch (error) {
      console.error("Error al agregar el producto:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error al agregar el producto."
      );
    } finally {
      setLoader(false);
    }
  };
  if (!userId || !tiendaId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loaderContainer}>
          {loader ? (
            <ActivityIndicator size="large" color={COLORS.green} />
          ) : (
            <Text style={styles.message}>
              Debes iniciar sesión y tener una tienda para agregar un producto.
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar Producto</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Categoría *</Text>
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
                {selectedSubcategory?.name || "Seleccionar categoría"}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
            </TouchableOpacity>
            {errors.category && (
              <Text style={styles.errorText}>{errors.category}</Text>
            )}
            {errors.subcategory && (
              <Text style={styles.errorText}>{errors.subcategory}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Imágenes y Videos</Text>
            <View style={styles.imageSelectionContainer}>
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={showFilePickerOptions}
              >
                <Ionicons name="add" size={24} color={COLORS.green} />
              </TouchableOpacity>
              {(images.length > 0 || videos.length > 0) && (
                <FlatList
                  data={[...images, ...videos]}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `${item}-${index}`}
                  initialNumToRender={3}
                  windowSize={5}
                  renderItem={({ item, index }) => {
                    const isVideo = videos.includes(item);
                    return (
                      <View style={styles.imageWrapper}>
                        {isVideo ? (
                          <Video
                            source={{ uri: item }}
                            style={styles.image}
                            resizeMode="cover"
                            useNativeControls={false}
                            isLooping={false}
                            shouldPlay={false}
                          />
                        ) : (
                          <Image source={{ uri: item }} style={styles.image} />
                        )}
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => {
                            if (isVideo) {
                              removeVideo(videos.indexOf(item));
                            } else {
                              removeImage(images.indexOf(item));
                            }
                          }}
                        >
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color={COLORS.red}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                  contentContainerStyle={{ paddingHorizontal: 10 }}
                />
              )}
            </View>
            <Text style={styles.infoText}>
              La primera imagen será la principal. Máximo 10 archivos (imágenes
              o videos).{"\n"}
              Formatos soportados: jpg, gif, png, mp4, mpeg, mov. Cada archivo
              no debe exceder 10 Mb.
            </Text>
            {errors.files && (
              <Text style={styles.errorText}>{errors.files}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              placeholder="Título del producto"
              value={formData.title}
              onChangeText={(text) => handleInputChange("title", text)}
            />
            {errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descripción *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe tu producto..."
              value={formData.description}
              onChangeText={(text) => handleInputChange("description", text)}
              multiline
              numberOfLines={4}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del proveedor"
              value={formData.supplier}
              onChangeText={(text) => handleInputChange("supplier", text)}
            />
            {errors.supplier && (
              <Text style={styles.errorText}>{errors.supplier}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Precio *</Text>
            <TextInput
              style={styles.input}
              placeholder="Precio del producto"
              value={formData.price}
              onChangeText={(text) => handleInputChange("price", text)}
              keyboardType="numeric"
            />
            {errors.price && (
              <Text style={styles.errorText}>{errors.price}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tallas (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: S, M, L (separar por comas)"
              value={formData.tallas.join(", ")}
              onChangeText={(text) =>
                handleInputChange(
                  "tallas",
                  text.split(",").map((t) => t.trim())
                )
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Números de calzado (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 38, 39, 40 (separar por comas)"
              value={formData.numeros_calzado.join(", ")}
              onChangeText={(text) =>
                handleInputChange(
                  "numeros_calzado",
                  text
                    .split(",")
                    .map((n) => parseInt(n.trim()))
                    .filter((n) => !isNaN(n))
                )
              }
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Colores (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Rojo, Azul, Verde (separar por comas)"
              value={formData.colores.join(", ")}
              onChangeText={(text) =>
                handleInputChange(
                  "colores",
                  text.split(",").map((c) => c.trim())
                )
              }
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loader && styles.submitButtonDisabled]}
            onPress={AddPost}
            disabled={loader}
          >
            {loader ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>Publicar Producto</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                clearForm();
              }}
            >
              <Text style={styles.menuItemText}>Eliminar todo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.back();
              }}
            >
              <Text style={styles.menuItemText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
  },
  cancelButton: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 5,
  },
  selectorButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 8,
    padding: 12,
    backgroundColor: COLORS.white,
  },
  selectorText: {
    fontSize: 16,
    color: COLORS.black,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.white,
    color: COLORS.black,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imageSelectionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addImageButton: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.lightwhite,
    marginRight: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  imageWrapper: {
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: 5,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 5,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.red,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: COLORS.green,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.gray2,
  },
  submitButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 50,
    paddingRight: 15,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    width: 150,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.black,
  },
});
