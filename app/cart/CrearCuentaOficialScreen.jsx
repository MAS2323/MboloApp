import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; // Agregar para selección de imágenes

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

const CrearCuentaOficialScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [category, setCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [city, setCity] = useState("");
  const [cityName, setCityName] = useState("");
  const [province, setProvince] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [images, setImages] = useState([]);
  const [loader, setLoader] = useState(false);

  const professionalName = "MAS ONEWE";

  // Cargar selecciones previas desde AsyncStorage
  useEffect(() => {
    const loadSelections = async () => {
      try {
        const storedCategory = await AsyncStorage.getItem(
          "selectedMenuCategory"
        );
        const storedSubcategory = await AsyncStorage.getItem(
          "selectedMenuSubcategory"
        );
        const storedCity = await AsyncStorage.getItem("selectedMenuCity");
        const storedProvince = await AsyncStorage.getItem(
          "selectedMenuProvince"
        );
        const storedImages = await AsyncStorage.getItem("selectedMenuImages");

        if (storedCategory) {
          const category = JSON.parse(storedCategory);
          setCategory(category.id);
          setCategoryName(category.name);
        }
        if (storedSubcategory) {
          const subcategory = JSON.parse(storedSubcategory);
          setSubcategory(subcategory.id);
          setSubcategoryName(subcategory.name);
        }
        if (storedCity) {
          const city = JSON.parse(storedCity);
          setCity(city.name);
          setCityName(city.name);
        }
        if (storedProvince) {
          const province = JSON.parse(storedProvince);
          setProvince(province.name);
          setProvinceName(province.name);
        }
        if (storedImages) {
          setImages(JSON.parse(storedImages));
        }
      } catch (error) {
        console.error("Error al cargar selecciones previas:", error);
      }
    };
    loadSelections();
  }, []);

  // Actualizar formData con los valores desde params
  useEffect(() => {
    const updateFormDataFromParams = async () => {
      try {
        if (
          params?.categoryId &&
          params?.categoryName &&
          category !== params.categoryId
        ) {
          setCategory(params.categoryId);
          setCategoryName(params.categoryName);
          await AsyncStorage.setItem(
            "selectedMenuCategory",
            JSON.stringify({ id: params.categoryId, name: params.categoryName })
          );
        }
        if (
          params?.subcategoryId &&
          params?.subcategoryName &&
          subcategory !== params.subcategoryId
        ) {
          setSubcategory(params.subcategoryId);
          setSubcategoryName(params.subcategoryName);
          await AsyncStorage.setItem(
            "selectedMenuSubcategory",
            JSON.stringify({
              id: params.subcategoryId,
              name: params.subcategoryName,
            })
          );
        }
        if (params?.city && city !== params.city) {
          setCity(params.city);
          setCityName(params.city);
          await AsyncStorage.setItem(
            "selectedMenuCity",
            JSON.stringify({ name: params.city })
          );
        }
        if (params?.province && province !== params.province) {
          setProvince(params.province);
          setProvinceName(params.province);
          await AsyncStorage.setItem(
            "selectedMenuProvince",
            JSON.stringify({ name: params.province })
          );
        }
        if (params?.selectedImages) {
          const selectedImages = JSON.parse(params.selectedImages);
          setImages(selectedImages);
          await AsyncStorage.setItem(
            "selectedMenuImages",
            JSON.stringify(selectedImages)
          );
        }
      } catch (error) {
        console.error("Error al actualizar datos desde params:", error);
      }
    };
    updateFormDataFromParams();
  }, [params]);

  // Solicitar permisos para cámara y galería
  const requestPermissions = async () => {
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

      setLoader(true);
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
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        await AsyncStorage.setItem(
          "selectedMenuImages",
          JSON.stringify(updatedImages)
        );
      }
    } catch (error) {
      console.error("Error tomando foto:", error);
      Alert.alert("Error", "No se pudo tomar la foto.");
    } finally {
      setLoader(false);
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

      setLoader(true);
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

        const updatedImages = [...images, ...selectedImages];
        setImages(updatedImages);
        await AsyncStorage.setItem(
          "selectedMenuImages",
          JSON.stringify(updatedImages)
        );
      }
    } catch (error) {
      console.error("Error seleccionando imágenes:", error);
      Alert.alert("Error", "No se pudieron seleccionar las imágenes.");
    } finally {
      setLoader(false);
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
  const removeImage = async (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    await AsyncStorage.setItem(
      "selectedMenuImages",
      JSON.stringify(updatedImages)
    );
  };

  // Guardar la cuenta oficial
  const handleGuardar = async () => {
    const requiredFields = {
      nombre,
      descripcion,
      category,
      subcategory,
      "location.city": city,
      "location.province": province,
      phoneNumber,
    };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length) {
      Alert.alert(
        "Error",
        `Faltan campos obligatorios: ${missingFields.join(", ")}`
      );
      return;
    }

    if (images.length === 0) {
      Alert.alert("Error", "Debes subir al menos una imagen.");
      return;
    }

    const nuevaCuenta = {
      id: `simulada-${Date.now()}`,
      name: nombre,
      description: descripcion,
      category,
      subcategory,
      location: { city, province },
      contact: { phoneNumber, whatsapp: whatsapp || null },
      images: images.map((url, index) => ({
        url,
        public_id: `simulada_${index}`,
      })),
      pdf: null,
      socialMedia: [],
      horario: [],
    };

    await AsyncStorage.multiRemove([
      "selectedMenuCategory",
      "selectedMenuSubcategory",
      "selectedMenuCity",
      "selectedMenuProvince",
      "selectedMenuImages",
    ]);

    params.onCuentaCreada?.(nuevaCuenta);
    Alert.alert("Éxito", "Cuenta oficial creada (simulada).");
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Cuenta Oficial</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Formulario */}
      <ScrollView style={styles.formContainer}>
        {/* Categoría */}
        <Text style={styles.label}>
          Categoría <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.selectionPicker,
            categoryName && styles.selectionPickerSelected,
          ]}
          onPress={() =>
            router.push({
              pathname: "/stores/CategorySelectionScreen",
              params: { returnScreen: "CrearCuentaOficialScreen" },
            })
          }
        >
          <Text
            style={[
              styles.selectionPickerText,
              categoryName && styles.selectionPickerTextSelected,
            ]}
          >
            {categoryName || "Seleccionar Categoría"}
          </Text>
          <MaterialIcons name="chevron-right" size={24} color={COLORS.gray} />
        </TouchableOpacity>

        {/* Subcategoría */}
        <Text style={styles.label}>
          Subcategoría <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.selectionPicker,
            subcategoryName && styles.selectionPickerSelected,
          ]}
          onPress={() =>
            router.push({
              pathname: "/stores/SubcategorySelectionScreen",
              params: {
                returnScreen: "CrearCuentaOficialScreen",
                categoryId: category,
              },
            })
          }
        >
          <Text
            style={[
              styles.selectionPickerText,
              subcategoryName && styles.selectionPickerTextSelected,
            ]}
          >
            {subcategoryName || "Seleccionar Subcategoría"}
          </Text>
          <MaterialIcons name="chevron-right" size={24} color={COLORS.gray} />
        </TouchableOpacity>

        {/* Imágenes */}
        <Text style={styles.label}>
          Imágenes <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.imageSelectionContainer}>
          <TouchableOpacity
            style={styles.addImageButton}
            onPress={showImagePickerOptions}
            disabled={loader}
          >
            {loader ? (
              <ActivityIndicator size="small" color={COLORS.green} />
            ) : (
              <Ionicons name="add" size={24} color={COLORS.green} />
            )}
          </TouchableOpacity>
          {images.length > 0 && (
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
        <Text style={styles.imageInstructions}>
          La primera imagen será la principal. Arrastra para cambiar el orden.
          {"\n"}
          Formatos soportados: jpg, gif y png. Cada imagen no debe exceder 5 Mb.
        </Text>

        {/* Título */}
        <Text style={styles.label}>
          Título <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ingrese el título"
          placeholderTextColor={COLORS.gray}
        />

        {/* Ciudad */}
        <Text style={styles.label}>
          Ciudad <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.selectionPicker,
            cityName && styles.selectionPickerSelected,
          ]}
          onPress={() =>
            router.push({
              pathname: "/stores/SelectCityScreen",
              params: { returnScreen: "CrearCuentaOficialScreen" },
            })
          }
        >
          <Text
            style={[
              styles.selectionPickerText,
              cityName && styles.selectionPickerTextSelected,
            ]}
          >
            {cityName || "Seleccionar Ciudad"}
          </Text>
          <MaterialIcons name="chevron-right" size={24} color={COLORS.gray} />
        </TouchableOpacity>

        {/* Provincia */}
        <Text style={styles.label}>
          Provincia <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.selectionPicker,
            provinceName && styles.selectionPickerSelected,
          ]}
          onPress={() =>
            router.push({
              pathname: "/stores/SelectProvinceScreen",
              params: { returnScreen: "CrearCuentaOficialScreen" },
            })
          }
        >
          <Text
            style={[
              styles.selectionPickerText,
              provinceName && styles.selectionPickerTextSelected,
            ]}
          >
            {provinceName || "Seleccionar Provincia"}
          </Text>
          <MaterialIcons name="chevron-right" size={24} color={COLORS.gray} />
        </TouchableOpacity>

        {/* Descripción */}
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Ingrese una descripción"
          placeholderTextColor={COLORS.gray}
          multiline
          numberOfLines={4}
        />

        {/* Nombre del Profesional */}
        <Text style={styles.label}>Nombre</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={professionalName}
            editable={false}
          />
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={COLORS.green}
            style={styles.checkmark}
          />
        </View>

        {/* Teléfono */}
        <Text style={styles.label}>
          Número de teléfono <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Ingrese el número de teléfono"
          placeholderTextColor={COLORS.gray}
          keyboardType="phone-pad"
        />

        {/* WhatsApp */}
        <Text style={styles.label}>WhatsApp (opcional)</Text>
        <TextInput
          style={styles.input}
          value={whatsapp}
          onChangeText={setWhatsapp}
          placeholder="Ingrese el número de WhatsApp"
          placeholderTextColor={COLORS.gray}
          keyboardType="phone-pad"
        />

        {/* Botón Guardar */}
        <TouchableOpacity style={styles.guardarButton} onPress={handleGuardar}>
          <Text style={styles.guardarButtonText}>Crear Cuenta Oficial</Text>
        </TouchableOpacity>

        {/* Términos */}
        <Text style={styles.termsText}>
          Al hacer clic en "Crear Cuenta Oficial", aceptas los términos de uso.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
  },
  cancelText: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  formContainer: {
    padding: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 8,
  },
  required: {
    color: COLORS.red,
  },
  selectionPicker: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  selectionPickerSelected: {
    backgroundColor: COLORS.lightwhite,
    borderColor: COLORS.green,
  },
  selectionPickerText: {
    fontSize: 16,
    color: COLORS.black,
  },
  selectionPickerTextSelected: {
    color: COLORS.green,
    fontWeight: "500",
  },
  imageSelectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
  imageInstructions: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 15,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    marginBottom: 15,
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: "top",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 8,
    marginBottom: 15,
  },
  inputDisabled: {
    flex: 1,
    borderWidth: 0,
    color: COLORS.gray,
  },
  checkmark: {
    marginRight: 10,
  },
  guardarButton: {
    backgroundColor: COLORS.green,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },
  guardarButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "bold",
  },
  termsText: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default CrearCuentaOficialScreen;
