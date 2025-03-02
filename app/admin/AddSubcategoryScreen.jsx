import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  Switch,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { API_BASE_URL } from "../../config/Service.Config";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
const AddSubcategoryScreen = ({ subcategoryId }) => {
  const [images, setImages] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loader, setLoader] = useState(false);

  // Campos del formulario
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [socialMedia, setSocialMedia] = useState([""]);
  const [horarios, setHorarios] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Estados para el selector de fecha y hora
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  // Solicitar permisos para la galería y la cámara
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

  useFocusEffect(
    React.useCallback(() => {
      const getSelectedSubcategory = async () => {
        const storedSubcategory = await AsyncStorage.getItem(
          "selectedSubcategory"
        );
        if (storedSubcategory) {
          const parsedSubcategory = JSON.parse(storedSubcategory);
          setSelectedSubcategory(parsedSubcategory);
          await AsyncStorage.removeItem("selectedSubcategory");
        }
      };

      getSelectedSubcategory();
    }, [])
  );

  // Obtener categorías al cargar el componente
  useEffect(() => {
    const fetchCategories = async (id) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories/${id}`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Seleccionar imágenes de la galería
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
      Alert.alert("Error", "Hubo un problema al seleccionar las imágenes");
    }
  };

  // Seleccionar un archivo PDF
  const pickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (result.type === "success") {
        setPdf(result.uri);
      }
    } catch (error) {
      console.error("Error seleccionando PDF:", error);
      Alert.alert("Error", "Hubo un problema al seleccionar el PDF");
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async () => {
    setLoader(true);

    try {
      // Validar campos obligatorios
      // if (
      //   !name ||
      //   !description ||
      //   !location ||
      //   !phoneNumber ||
      //   !whatsapp ||
      //   !selectedCategory
      // ) {
      //   Alert.alert("Error", "Todos los campos son obligatorios");
      //   return;
      // }

      // Crear un objeto FormData
      const formData = new FormData();

      // Agregar campos de texto
      formData.append("name", name);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("phoneNumber", phoneNumber);
      formData.append("whatsapp", whatsapp);
      formData.append("category", selectedCategory);

      // Agregar imágenes
      images.forEach((imageUri, index) => {
        const uriParts = imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("images", {
          uri: imageUri,
          name: `image-${index + 1}.${fileType}`,
          type: `image/${fileType}`,
        });
      });

      // Agregar PDF (si existe)
      if (pdf) {
        formData.append("pdf", {
          uri: pdf.uri,
          type: "application/pdf",
          name: "document.pdf",
        });
      }

      // Enviar la solicitud al backend
      const endpoint = `${API_BASE_URL}/subcategories/category/${selectedCategory}`;
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        Alert.alert("Éxito", "Subcategoría creada exitosamente");
        // Reiniciar formulario
        setName("");
        setDescription("");
        setLocation("");
        setSocialMedia([""]);
        setHorarios([]);
        setPhoneNumber("");
        setWhatsapp("");
        setImages([]);
        setPdf(null);
        setSelectedCategory("");
        setIsActive(true);
      }
    } catch (error) {
      console.error(
        "Error creating subcategory:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Hubo un problema al crear la subcategoría"
      );
    } finally {
      setLoader(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Agregar Subcategoría</Text>

      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
      >
        <Picker.Item label="Selecciona una categoría" value="" />
        {categories.map((category) => (
          <Picker.Item
            key={category._id}
            label={category.name}
            value={category._id}
          />
        ))}
      </Picker>

      <TouchableOpacity onPress={pickImages}>
        {images.length > 0 ? (
          <FlatList
            horizontal
            data={images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.imagePreview} />
            )}
          />
        ) : (
          <Image
            source={require("./../../assets/images/placeholderImage.png")}
            style={styles.imagePlaceholder}
          />
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Ubicación"
        value={location}
        onChangeText={setLocation}
      />

      {socialMedia.map((link, index) => (
        <View key={index} style={styles.socialMediaContainer}>
          <TextInput
            style={[styles.input, styles.socialMediaInput]}
            placeholder={`Red social ${index + 1}`}
            value={link}
            onChangeText={(text) => {
              const newSocialMedia = [...socialMedia];
              newSocialMedia[index] = text;
              setSocialMedia(newSocialMedia);
            }}
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              const newSocialMedia = socialMedia.filter((_, i) => i !== index);
              setSocialMedia(newSocialMedia);
            }}
          >
            <Ionicons name="trash" size={20} color="red" />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setSocialMedia([...socialMedia, ""])}
      >
        <Text style={styles.addButtonText}>Agregar Red Social</Text>
      </TouchableOpacity>

      {horarios.map((horario, index) => (
        <View key={index} style={styles.horarioContainer}>
          <Text style={styles.horarioText}>{horario}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              const newHorarios = horarios.filter((_, i) => i !== index);
              setHorarios(newHorarios);
            }}
          >
            <Ionicons name="trash" size={20} color="red" />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowStartPicker(true)}
      >
        <Text style={styles.addButtonText}>Agregar Horario</Text>
      </TouchableOpacity>

      {showStartPicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) {
              setStartTime(selectedDate);
              setShowEndPicker(true);
            }
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) {
              setEndTime(selectedDate);
              const formattedStartTime = startTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const formattedEndTime = selectedDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              setHorarios([
                ...horarios,
                `${formattedStartTime} - ${formattedEndTime}`,
              ]);
            }
          }}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Teléfono de contacto"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="WhatsApp de contacto"
        value={whatsapp}
        onChangeText={setWhatsapp}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.addButton} onPress={pickPdf}>
        <Text style={styles.addButtonText}>
          {pdf ? "Cambiar PDF" : "Subir PDF"}
        </Text>
      </TouchableOpacity>

      <View style={styles.switchContainer}>
        <Text>Activo:</Text>
        <Switch
          value={isActive}
          onValueChange={(value) => setIsActive(value)}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addButtonText}>Agregar Subcategoría</Text>
      </TouchableOpacity>

      {loader && <ActivityIndicator size="large" color="#0000ff" />}
    </KeyboardAvoidingView>
  );
};
const styles = {
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#28a745",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginVertical: 10,
    marginRight: 10,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: "#ccc",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  socialMediaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  socialMediaInput: {
    flex: 1,
    marginRight: 10,
  },
  horarioContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  horarioText: {
    flex: 1,
    fontSize: 16,
  },
  removeButton: {
    padding: 10,
  },
};

export default AddSubcategoryScreen;
