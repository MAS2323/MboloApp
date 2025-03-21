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
  ScrollView,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { API_BASE_URL } from "../../config/Service.Config";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const daysOfWeek = [
  { key: "weekdays", label: "Lunes - Viernes" },
  { key: "saturday", label: "Sábado" },
];

const AddSubcategoryScreen = ({ subcategoryId, onSave }) => {
  const [images, setImages] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [socialMedia, setSocialMedia] = useState([""]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // Estados para manejo de horarios
  const [showScheduleOptions, setShowScheduleOptions] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSelectingStart, setIsSelectingStart] = useState(true);
  const [currentDay, setCurrentDay] = useState(null);
  const [tempStartTime, setTempStartTime] = useState(new Date());
  const [tempEndTime, setTempEndTime] = useState(new Date());

  const router = useRouter();

  useFocusEffect(() => {
    const loadData = async () => {
      try {
        const [category, subcategory, location] = await Promise.all([
          AsyncStorage.getItem("selectedCategory"),
          AsyncStorage.getItem("selectedSubcategory"),
          AsyncStorage.getItem("selectedLocation"),
        ]);

        if (category) setSelectedCategory(JSON.parse(category));
        if (subcategory) setSelectedSubcategory(JSON.parse(subcategory));
        if (location) setSelectedLocation(JSON.parse(location));
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  });

  const navigateToSelection = () =>
    router.push("/admin/CategorySelectionScreen");
  const navigateToLocationSelection = () =>
    router.push("/admin/LocationSelectionScreen");

  const requestPermissions = async () => {
    if (Platform.OS === "web") return true;
    const [gallery, camera] = await Promise.all([
      ImagePicker.requestMediaLibraryPermissionsAsync(),
      ImagePicker.requestCameraPermissionsAsync(),
    ]);
    if (gallery.status !== "granted" || camera.status !== "granted") {
      Alert.alert(
        "Permisos necesarios",
        "Se requieren permisos para galería y cámara"
      );
      return false;
    }
    return true;
  };

  const handleSelectDay = (dayKey) => {
    setCurrentDay(dayKey);
    setShowTimePicker(true);
    setIsSelectingStart(true);
    setTempStartTime(new Date());
    setTempEndTime(new Date());
  };

  const handleTimeChange = (event, selectedDate) => {
    if (selectedDate) {
      if (isSelectingStart) {
        setTempStartTime(selectedDate);
      } else {
        setTempEndTime(selectedDate);
      }
    }
  };

  const confirmTime = () => {
    if (isSelectingStart) {
      setIsSelectingStart(false);
    } else {
      const formattedOpen = tempStartTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const formattedClose = tempEndTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newSchedule = [
        ...schedule,
        {
          day: currentDay === "weekdays" ? "Lunes - Viernes" : "Sábado",
          open: formattedOpen,
          close: formattedClose,
        },
      ];

      setSchedule(newSchedule);
      setShowTimePicker(false);
      setCurrentDay(null);
      if (onSave) onSave(newSchedule);
    }
  };

  const removeSchedule = (index) => {
    setSchedule((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleScheduleOptions = () => {
    setShowScheduleOptions((prev) => !prev);
  };

  const showImagePickerOptions = async () => {
    if (!(await requestPermissions())) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const newImages = result.assets.map((asset) => asset.uri);
      if (images.length + newImages.length > 6) {
        Alert.alert("Límite alcanzado", "Máximo 6 imágenes");
        return;
      }
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const pickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (result.type === "success") setPdf(result);
    } catch (error) {
      console.error("Error seleccionando PDF:", error);
      Alert.alert("Error", "Problema al seleccionar PDF");
    }
  };

  const handleSubmit = async () => {
    setLoader(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("phoneNumber", phoneNumber);
      formData.append("whatsapp", whatsapp);
      formData.append("category", selectedCategory);
      formData.append("schedule", JSON.stringify(schedule));

      images.forEach((imageUri, index) => {
        const fileType = imageUri.split(".").pop();
        formData.append("images", {
          uri: imageUri,
          name: `image-${index + 1}.${fileType}`,
          type: `image/${fileType}`,
        });
      });

      if (pdf) {
        formData.append("pdf", {
          uri: pdf.uri,
          type: "application/pdf",
          name: "document.pdf",
        });
      }

      const response = await axios.post(
        `${API_BASE_URL}/subcategories/category/${selectedCategory}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        Alert.alert("Éxito", "Subcategoría creada exitosamente");
        setName("");
        setDescription("");
        setLocation("");
        setSocialMedia([""]);
        setSchedule([]);
        setPhoneNumber("");
        setWhatsapp("");
        setImages([]);
        setPdf(null);
        setSelectedCategory("");
        setIsActive(true);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error al crear subcategoría"
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Agregar Subcategoría</Text>

        <TouchableOpacity
          style={styles.selectButton}
          onPress={navigateToSelection}
        >
          <Text style={styles.selectButtonText}>
            {selectedCategory && selectedSubcategory
              ? `Categoría: ${selectedCategory.name}, Subcategoría: ${selectedSubcategory.name}`
              : "Seleccionar Categoría y Subcategoría"}
          </Text>
        </TouchableOpacity>

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
          <FlatList
            data={images}
            horizontal
            scrollEnabled={true} // Desactiva el scroll del FlatList
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
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
            style={styles.imageFlatList} // Altura fija
          />
        </View>
        <Text style={styles.infoText}>Máximo 6 imágenes</Text>

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

        <TouchableOpacity
          style={styles.selectButton}
          onPress={navigateToLocationSelection}
        >
          <Text style={styles.selectButtonText}>
            {selectedLocation
              ? `Provincia: ${selectedLocation.province.name}, Ciudad: ${selectedLocation.city.name}`
              : "Seleccionar Provincia y Ciudad"}
          </Text>
        </TouchableOpacity>

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
            {socialMedia.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() =>
                  setSocialMedia(socialMedia.filter((_, i) => i !== index))
                }
              >
                <Ionicons name="trash" size={20} color="red" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setSocialMedia([...socialMedia, ""])}
        >
          <Text style={styles.addButtonText}>Agregar Red Social</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleScheduleOptions}>
          <Text style={styles.subtitle}>
            Horarios {showScheduleOptions ? "▼" : "►"}
          </Text>
        </TouchableOpacity>

        {showScheduleOptions && (
          <View style={styles.scheduleOptionsContainer}>
            <FlatList
              data={daysOfWeek}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dayButton}
                  onPress={() => handleSelectDay(item.key)}
                >
                  <Text style={styles.dayText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {showTimePicker && (
          <View style={styles.timePickerContainer}>
            <Text style={styles.timeLabel}>
              {isSelectingStart ? "Hora de apertura" : "Hora de cierre"}
            </Text>
            <DateTimePicker
              value={isSelectingStart ? tempStartTime : tempEndTime}
              mode="time"
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "clock"}
              onChange={handleTimeChange}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={confirmTime}
            >
              <Text style={styles.confirmButtonText}>
                {isSelectingStart ? "Confirmar apertura" : "Confirmar cierre"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {schedule.length > 0 && (
          <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleTitle}>Horarios seleccionados:</Text>
            {schedule.map((item, index) => (
              <View key={index} style={styles.horarioContainer}>
                <Text style={styles.scheduleText}>
                  {`${item.day}: ${item.open} - ${item.close}`}
                </Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeSchedule(index)}
                >
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="WhatsApp"
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
          <Switch value={isActive} onValueChange={setIsActive} />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          <Text style={styles.addButtonText}>Agregar Subcategoría</Text>
        </TouchableOpacity>

        {loader && <ActivityIndicator size="large" color="#0000ff" />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#28a745",
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
  selectButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginVertical: 5,
  },
  selectButtonText: {
    color: "#333",
  },
  imageSelectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  imageFlatList: {
    height: 120, // Altura fija para evitar conflicto con ScrollView
    flexGrow: 0,
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
    padding: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  socialMediaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  socialMediaInput: {
    flex: 1,
    marginRight: 10,
  },
  scheduleOptionsContainer: {
    marginLeft: 20,
    marginBottom: 10,
  },
  scheduleContainer: {
    marginVertical: 10,
  },
  scheduleTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  horarioContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  scheduleText: {
    fontSize: 16,
  },
  dayButton: {
    padding: 10,
    backgroundColor: "#ddd",
    marginVertical: 5,
    borderRadius: 5,
  },
  dayText: {
    fontSize: 16,
    textAlign: "center",
  },
  timePickerContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 14,
    marginVertical: 5,
  },
  confirmButton: {
    backgroundColor: "#28a745",
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
};

export default AddSubcategoryScreen;
