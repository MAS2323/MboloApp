import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";

export default function ProductEdition() {
  const router = useRouter();
  const { item } = useLocalSearchParams(); // Captura el parámetro `item`
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [editedProduct, setEditedProduct] = useState(null);

  // Parsear el producto cuando el componente se monta
  useEffect(() => {
    if (item) {
      try {
        const parsedProduct = JSON.parse(item); // Parsear el string JSON
        setEditedProduct(parsedProduct);
        setImages(parsedProduct.images.map((img) => img.url)); // Cargar las imágenes del producto
        setLoading(false);
      } catch (error) {
        console.error("Error al parsear el producto:", error);
      }
    }
  }, [item]);

  // Función para solicitar permisos de la cámara y la galería
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

  // Función para seleccionar imágenes desde la galería o la cámara
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
      }
    } catch (error) {
      console.error("Error seleccionando imágenes:", error);
    }
  };

  // Función para tomar una foto
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

  // Función para eliminar una imagen
  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Función para manejar cambios en los campos de entrada
  const handleInputChange = (field, value) => {
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [field]: value,
    }));
  };

  // Función para guardar los cambios
  const handleSave = async () => {
    try {
      // Verificar si el producto tiene un ID válido
      if (!editedProduct?._id) {
        Alert.alert("Error", "El producto no tiene un ID válido.");
        return;
      }

      // Crear un objeto con los datos actualizados
      const updatedData = {
        title: editedProduct.title,
        price: editedProduct.price,
        description: editedProduct.description,
        product_location: editedProduct.product_location,
        phoneNumber: editedProduct.phoneNumber,
        whatsapp: editedProduct.whatsapp,
        images: images.map((url) => ({ url })), // Convertir las imágenes al formato esperado
      };

      // Hacer la solicitud PUT al backend
      const response = await axios.put(
        `${API_BASE_URL}/products/${editedProduct._id}`, // URL de la API
        updatedData // Datos actualizados
      );

      if (response.status === 200) {
        Alert.alert("Éxito", "Producto actualizado correctamente.");
        router.push("/cart/ProductEdition"); // Regresar a la pantalla anterior
      } else {
        Alert.alert("Error", "No se pudo actualizar el producto.");
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      Alert.alert("Error", "Ocurrió un error al actualizar el producto.");
    }
  };

  // Si el producto no se ha cargado, muestra el ActivityIndicator
  if (loading || !editedProduct) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header fijo */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Actualizar producto</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Ionicons name="save-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Contenido desplazable */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Contenedor para seleccionar y mostrar imágenes */}
          <View style={styles.imageSelectionContainer}>
            <TouchableOpacity onPress={showImagePickerOptions}>
              <Ionicons name="add-circle" size={40} color="black" />
            </TouchableOpacity>
            <FlatList
              data={images}
              horizontal
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
          </View>
          <Text style={styles.infoText}>
            Puedes subir un máximo de 6 imágenes
          </Text>

          {/* Campos editables */}
          <View style={styles.details}>
            <View style={styles.titleRow}>
              <TextInput
                style={styles.titleInput}
                value={editedProduct.title}
                onChangeText={(text) => handleInputChange("title", text)}
                placeholder="Título del producto"
              />
            </View>

            <View style={styles.priceWrapper}>
              <TextInput
                style={styles.priceInput}
                value={editedProduct.price.toString()}
                onChangeText={(text) => handleInputChange("price", text)}
                placeholder="Precio"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.descriptionWrapper}>
              <TextInput
                style={styles.descriptionInput}
                value={editedProduct.description}
                onChangeText={(text) => handleInputChange("description", text)}
                placeholder="Descripción del producto"
                multiline
              />
            </View>

            <View style={styles.locationWrapper}>
              <TextInput
                style={styles.locationInput}
                value={editedProduct.product_location.name}
                onChangeText={(text) =>
                  handleInputChange("product_location", { name: text })
                }
                placeholder="Ubicación del producto"
                editable={false}
              />
            </View>

            <View style={styles.contactRow}>
              <TextInput
                style={styles.contactInput}
                value={editedProduct.phoneNumber}
                onChangeText={(text) => handleInputChange("phoneNumber", text)}
                placeholder="Número de teléfono"
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.contactInput}
                value={editedProduct.whatsapp}
                onChangeText={(text) => handleInputChange("whatsapp", text)}
                placeholder="Número de WhatsApp"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginTop: 25,
  },
  saveButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    marginTop: 60, // Ajusta este valor según la altura del header
  },
  container: {
    flex: 1,
    padding: 16,
  },
  imageSelectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 12,
  },
  infoText: {
    textAlign: "center",
    fontSize: 14,
    color: "gray",
    marginBottom: 20,
  },
  details: {
    flex: 1,
  },
  titleRow: {
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
  },
  priceWrapper: {
    marginBottom: 16,
  },
  priceInput: {
    fontSize: 20,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
  },
  descriptionWrapper: {
    marginBottom: 16,
  },
  descriptionInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
  },
  locationWrapper: {
    marginBottom: 16,
  },
  locationInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  contactInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
    width: "48%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
