import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { API_BASE_URL } from "../../config/Service.Config";
import { useRouter, useFocusEffect } from "expo-router";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

// Componente para el header
const Header = ({ onBack, title }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack}>
      <MaterialIcons name="chevron-left" size={30} color="#00C853" />
    </TouchableOpacity>
    <Text style={styles.headerText}>{title}</Text>
    <TouchableOpacity style={styles.savedButton} disabled>
      <Text style={styles.savedButtonText}>Guardado</Text>
    </TouchableOpacity>
  </View>
);

// Componente para el avatar
const AvatarSection = ({ image, onPickImage }) => (
  <View style={styles.avatarContainer}>
    <TouchableOpacity onPress={onPickImage}>
      <Image
        source={
          image
            ? { uri: image }
            : require("./../../assets/images/placeholderImage.png")
        }
        style={styles.image}
      />
      <View style={styles.editBadge}>
        <Text style={styles.editBadgeText}>EDITAR</Text>
      </View>
    </TouchableOpacity>
    <View style={styles.approvedContainer}>
      <MaterialIcons name="check-circle" size={20} color="#00C853" />
      <Text style={styles.approvedText}>aprobado</Text>
    </View>
  </View>
);

// Componente para los campos de entrada
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  onPress,
  editable = true,
}) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    {editable ? (
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B0BEC5"
      />
    ) : (
      <TouchableOpacity style={styles.dropdown} onPress={onPress}>
        <Text style={styles.dropdownText}>{value || placeholder}</Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#757575" />
      </TouchableOpacity>
    )}
  </View>
);

// Componente para la sección de redes sociales
const SocialMediaSection = ({
  facebookConnected,
  setFacebookConnected,
  googleConnected,
  setGoogleConnected,
}) => (
  <View style={styles.socialMediaSection}>
    <View style={styles.socialMediaMessage}>
      <MaterialIcons name="waving-hand" size={24} color="#000" />
      <Text style={styles.socialMediaText}>
        ¡Conecta tus cuentas de redes sociales para una experiencia más fluida!
      </Text>
    </View>
    <View style={styles.socialMediaItem}>
      <FontAwesome name="facebook" size={24} color="#3b5998" />
      <Text style={styles.socialMediaLabel}>Facebook</Text>
      <Switch
        value={facebookConnected}
        onValueChange={setFacebookConnected}
        trackColor={{ false: "#767577", true: "#00C853" }}
        thumbColor={facebookConnected ? "#fff" : "#f4f3f4"}
      />
    </View>
    <View style={styles.socialMediaItem}>
      <FontAwesome name="google" size={24} color="#DB4437" />
      <Text style={styles.socialMediaLabel}>Google</Text>
      <Switch
        value={googleConnected}
        onValueChange={setGoogleConnected}
        trackColor={{ false: "#767577", true: "#00C853" }}
        thumbColor={googleConnected ? "#fff" : "#f4f3f4"}
      />
    </View>
  </View>
);

const PersonalInfoScreen = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [birthday, setBirthday] = useState("");
  const [sex, setSex] = useState("No especificar");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFacebookConnected, setIsFacebookConnected] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const router = useRouter();

  // Cargar datos desde AsyncStorage
  const loadUserData = useCallback(async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (!id) {
        router.navigate("LoginScreen");
        return;
      }
      const parsedId = JSON.parse(id);
      const userKey = `user${parsedId}`;
      const currentUser = await AsyncStorage.getItem(userKey);
      if (currentUser) {
        const parsedUserData = JSON.parse(currentUser);
        setUserData(parsedUserData);
        setUserId(parsedId);
        const fullName = parsedUserData.userName || "";
        const nameParts = fullName.split(" ");
        setFirstName(nameParts[0] || "");
        setLastName(
          parsedUserData.lastName || nameParts.slice(1).join(" ") || ""
        );
        setLocation(
          parsedUserData.ciudad?.name || parsedUserData.location || ""
        );
        setBirthday(parsedUserData.birthday || "");
        setSex(parsedUserData.sex || "No especificar");
        setImage(parsedUserData.image?.url || "");
        setIsLoggedIn(true);
      } else {
        router.navigate("LoginScreen");
      }
      setLoading(false);
    } catch (error) {
      setIsLoggedIn(false);
      setLoading(false);
      router.navigate("LoginScreen");
    }
  }, [router]);

  // Cargar datos al montar y al volver a enfocar
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [loadUserData])
  );

  // Seleccionar imagen
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Manejar cambio de fecha
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      setBirthday(formattedDate);
    }
  };

  // Actualizar perfil
  const handleUpdateProfile = async () => {
    // Validaciones
    if (!firstName.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }
    if (!lastName.trim()) {
      Alert.alert("Error", "El apellido es obligatorio");
      return;
    }
    if (birthday && !/^\d{2}\/\d{2}\/\d{4}$/.test(birthday)) {
      Alert.alert(
        "Error",
        "La fecha de nacimiento debe tener el formato DD/MM/YYYY"
      );
      return;
    }

    const formData = new FormData();
    formData.append("userName", firstName.trim());
    formData.append("lastName", lastName.trim());
    formData.append("location", location || "");
    formData.append("birthday", birthday || "");
    formData.append("sex", sex || "No especificar");

    if (image && image.startsWith("file://")) {
      const filename = image.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";
      formData.append("image", { uri: image, name: filename, type });
    }

    try {
      console.log("Enviando datos al backend:", {
        userName: firstName.trim(),
        lastName: lastName.trim(),
        location,
        birthday,
        sex,
      });
      const response = await axios.put(
        `${API_BASE_URL}/user/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Respuesta del backend:", response.data);

      const updatedUser = response.data.user;
      if (updatedUser) {
        setUserData(updatedUser);
        setFirstName(updatedUser.userName?.split(" ")[0] || "");
        setLastName(updatedUser.lastName || "");
        setLocation(updatedUser.ciudad?.name || updatedUser.location || "");
        setBirthday(updatedUser.birthday || "");
        setSex(updatedUser.sex || "No especificar");
        setImage(updatedUser.image?.url || "");
        await AsyncStorage.setItem(
          `user${userId}`,
          JSON.stringify(updatedUser)
        );
      }

      Alert.alert("Éxito", "Perfil actualizado correctamente");
    } catch (error) {
      console.error(
        "Error al actualizar el perfil:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        "No se pudo actualizar el perfil. Por favor, intenta de nuevo más tarde."
      );
    }
  };

  // Renderizar estados de carga o no autenticado
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={() => router.back()} title="Detalles personales" />
      <KeyboardAvoidingView
        style={styles.scrollWrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <AvatarSection image={image} onPickImage={pickImage} />
          <View style={styles.formContainer}>
            <InputField
              label="Nombre*"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Ingresa tu nombre"
            />
            <InputField
              label="Apellido*"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Ingresa tu apellido"
            />
            <InputField
              label="Ubicación"
              value={location || userData?.ciudad?.name}
              placeholder="Seleccionar ubicación"
              onPress={() => router.push("/cart/SelectCityScreen")} // Ruta corregida
              editable={false}
            />
            <InputField
              label="Fecha de nacimiento"
              value={birthday}
              placeholder="Selecciona tu fecha de nacimiento"
              onPress={() => setShowDatePicker(true)}
              editable={false}
            />
            {showDatePicker && (
              <DateTimePicker
                value={
                  birthday
                    ? new Date(birthday.split("/").reverse().join("-"))
                    : new Date()
                }
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
            <InputField
              label="Sexo"
              value={sex}
              placeholder="Seleccionar sexo"
              onPress={() => router.push("/cart/SelectSexScreen")} // Ruta corregida
              editable={false}
            />
            <SocialMediaSection
              facebookConnected={isFacebookConnected}
              setFacebookConnected={setIsFacebookConnected}
              googleConnected={isGoogleConnected}
              setGoogleConnected={setIsGoogleConnected}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PersonalInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    color: "#000",
  },
  savedButton: {
    backgroundColor: "#E0F7FA",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  savedButtonText: {
    color: "#00C853",
    fontSize: 14,
    fontWeight: "bold",
  },
  scrollWrapper: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  editBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  approvedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  approvedText: {
    color: "#00C853",
    fontSize: 14,
    marginLeft: 5,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#B0BEC5",
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#000",
  },
  inputText: {
    fontSize: 16,
    color: "#000",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B0BEC5",
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  dropdownText: {
    fontSize: 16,
    color: "#000",
  },
  socialMediaSection: {
    marginVertical: 20,
  },
  socialMediaMessage: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F7FA",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  socialMediaText: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    marginLeft: 10,
  },
  socialMediaItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  socialMediaLabel: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#00C853",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
