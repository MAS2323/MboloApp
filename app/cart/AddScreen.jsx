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

// Colores definidos
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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tiendaId, setTiendaId] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false); // Estado para el menú de opciones
  const [formData, setFormData] = useState({
    title: "",
    supplier: "",
    price: "",
    address: "", // Cambiado de product_location a address
    description: "",
    phoneNumber: "",
    domicilio: "",
    whatsapp: "",
    type: "product",
  });
  const [errors, setErrors] = useState({});

  // Cargar userId, tiendaId y datos del formulario desde AsyncStorage
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoader(true);
        // Cargar userId
        const storedUserId = await AsyncStorage.getItem("id");
        if (storedUserId) {
          const cleanUserId = storedUserId.replace(/"/g, "");
          setUserId(cleanUserId);

          // Obtener la tienda del usuario para obtener la dirección
          const storeResponse = await axios.get(
            `${API_BASE_URL}/tienda/owner/${cleanUserId}`
          );
          if (storeResponse.data && storeResponse.data._id) {
            setTiendaId(storeResponse.data._id);
            const storeAddress = storeResponse.data.address?.name || "";
            setFormData((prev) => ({
              ...prev,
              address: storeAddress, // Establecer la dirección desde la tienda
            }));
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

        // Cargar datos del formulario desde AsyncStorage
        const storedFormData = await AsyncStorage.getItem("addProductFormData");
        if (storedFormData) {
          const parsedFormData = JSON.parse(storedFormData);
          setFormData(parsedFormData);
        }

        const storedImages = await AsyncStorage.getItem("addProductImages");
        if (storedImages) {
          setImages(JSON.parse(storedImages));
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

  // Guardar datos del formulario en AsyncStorage al cambiar
  useEffect(() => {
    const saveFormData = async () => {
      try {
        await AsyncStorage.setItem(
          "addProductFormData",
          JSON.stringify(formData)
        );
        await AsyncStorage.setItem("addProductImages", JSON.stringify(images));
      } catch (error) {
        console.error("Error al guardar datos en AsyncStorage:", error);
      }
    };
    saveFormData();
  }, [formData, images]);

  // Cargar categorías
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

  // Solicitar permisos para cámara y galería
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

  // Tomar foto
  const takePhoto = async () => {
    try {
      if (images.length >= 6) {
        Alert.alert("Límite alcanzado", "No puedes agregar más de 6 imágenes");
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
        if (images.length + newImages.length > 6) {
          Alert.alert("Límite alcanzado", "Máximo 6 imágenes en total");
          return;
        }
        setImages((prevImages) => [...prevImages, ...newImages]);
      }
    } catch (error) {
      console.error("Error tomando foto:", error);
    }
  };

  // Seleccionar imágenes de la galería
  const pickImages = async () => {
    try {
      if (images.length >= 6) {
        Alert.alert("Límite alcanzado", "No puedes agregar más de 6 imágenes");
        return;
      }

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
        const totalImages = images.length + selectedImages.length;

        if (totalImages > 6) {
          Alert.alert(
            "Límite excedido",
            `Solo puedes seleccionar ${6 - images.length} imagen(es) más.`
          );
          return;
        }

        setImages((prevImages) => [...prevImages, ...selectedImages]);
      }
    } catch (error) {
      console.error("Error seleccionando imágenes:", error);
    }
  };

  // Mostrar opciones para seleccionar imagen
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

  // Eliminar imagen
  const removeImage = (index) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  // Manejar cambios en los campos del formulario
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Limpiar el formulario y AsyncStorage
  const clearForm = async () => {
    setFormData({
      title: "",
      supplier: "",
      price: "",
      address: formData.address, // Mantener la dirección de la tienda
      description: "",
      phoneNumber: "",
      domicilio: "",
      whatsapp: "",
      type: "product",
    });
    setImages([]);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setErrors({});
    try {
      await AsyncStorage.removeItem("addProductFormData");
      await AsyncStorage.removeItem("addProductImages");
      await AsyncStorage.removeItem("selectedCategory");
      await AsyncStorage.removeItem("selectedSubcategory");
    } catch (error) {
      console.error("Error al limpiar AsyncStorage:", error);
    }
    setMenuVisible(false);
  };

  // Validar el formulario
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "title",
      "supplier",
      "domicilio",
      "price",
      "address",
      "description",
      "phoneNumber",
      "whatsapp",
    ];

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

    if (images.length === 0) {
      newErrors.images = "Debes agregar al menos una imagen";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar el producto
  const AddPost = async () => {
    if (!validateForm()) {
      return;
    }

    setLoader(true);
    try {
      const endpoint = `${API_BASE_URL}/products/${userId}`;
      const formDataToSend = new FormData();

      // Agregar campos del formulario
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          // Enviar address como product_location para cumplir con el modelo del backend
          if (key === "address") {
            formDataToSend.append("product_location", formData[key]);
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Agregar categoría y subcategoría
      formDataToSend.append("category", selectedCategory._id);
      formDataToSend.append("subcategory", selectedSubcategory._id);

      // Agregar ID de la tienda
      formDataToSend.append("tienda", tiendaId);

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

      // Enviar la solicitud para crear el producto
      const response = await axios.post(endpoint, formDataToSend, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        // Actualizar la tienda para agregar el producto a su lista de products
        const productId = response.data._id;
        await axios.patch(`${API_BASE_URL}/tienda/${tiendaId}/add-product`, {
          productId,
        });

        // Limpiar AsyncStorage y formulario
        await clearForm();
        await AsyncStorage.removeItem("products_data"); // Invalidar caché de productos

        Alert.alert("Éxito", "Producto agregado exitosamente", [
          {
            text: "OK",
            onPress: () => {
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
      {/* Header */}
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
          {/* Selector de categoría */}
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

          {/* Selector de imágenes */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Imágenes</Text>
            <View style={styles.imageSelectionContainer}>
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={showImagePickerOptions}
              >
                <Ionicons name="add" size={24} color={COLORS.green} />
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
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color={COLORS.red}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  contentContainerStyle={{ paddingHorizontal: 10 }}
                />
              )}
            </View>
            <Text style={styles.infoText}>
              La primera imagen será la principal. Arrastra para cambiar el
              orden.{"\n"}
              Formatos soportados: jpg, gif y png. Cada imagen no debe exceder 5
              Mb.
            </Text>
            {errors.images && (
              <Text style={styles.errorText}>{errors.images}</Text>
            )}
          </View>

          {/* Campos del formulario */}
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
            <Text style={styles.label}>Dirección *</Text>
            <TextInput
              style={styles.input}
              placeholder="Dirección del producto"
              value={formData.address}
              onChangeText={(text) => handleInputChange("address", text)}
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
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
            <Text style={styles.label}>Teléfono *</Text>
            <TextInput
              style={styles.input}
              placeholder="Número de teléfono"
              value={formData.phoneNumber}
              onChangeText={(text) => handleInputChange("phoneNumber", text)}
              keyboardType="phone-pad"
            />
            {errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>WhatsApp *</Text>
            <TextInput
              style={styles.input}
              placeholder="Número de WhatsApp"
              value={formData.whatsapp}
              onChangeText={(text) => handleInputChange("whatsapp", text)}
              keyboardType="phone-pad"
            />
            {errors.whatsapp && (
              <Text style={styles.errorText}>{errors.whatsapp}</Text>
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
            <Text style={styles.label}>Domicilio *</Text>
            <TextInput
              style={styles.input}
              placeholder="Domicilio de entrega"
              value={formData.domicilio}
              onChangeText={(text) => handleInputChange("domicilio", text)}
            />
            {errors.domicilio && (
              <Text style={styles.errorText}>{errors.domicilio}</Text>
            )}
          </View>

          {/* Botón de enviar */}
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

      {/* Modal para el menú de opciones */}
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
  // Estilos para el menú
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
