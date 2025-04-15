import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";

const CreateProfessionalAccount = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    description: "",
    owner: "",
    category: "",
    categoryName: "",
    subcategory: "",
    subcategoryName: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingAccount, setExistingAccount] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");

  // Cargar selecciones previas desde AsyncStorage al montar el componente
  useEffect(() => {
    const loadSelections = async () => {
      try {
        const storedCategory = await AsyncStorage.getItem("selectedCategory");
        const storedSubcategory = await AsyncStorage.getItem(
          "selectedSubcategory"
        );
        if (storedCategory && storedSubcategory) {
          const category = JSON.parse(storedCategory);
          const subcategory = JSON.parse(storedSubcategory);
          setFormData((prev) => ({
            ...prev,
            category: category._id,
            categoryName: category.name,
            subcategory: subcategory._id,
            subcategoryName: subcategory.name,
          }));
        }
      } catch (error) {
        console.error("Error al cargar selecciones previas:", error);
      }
    };
    loadSelections();
  }, []);

  // Actualizar formData con los valores de categoría y subcategoría desde params
  useEffect(() => {
    if (
      params?.categoryId &&
      params?.categoryName &&
      params?.subcategoryId &&
      params?.subcategoryName &&
      // Evitar actualizaciones redundantes
      (formData.category !== params.categoryId ||
        formData.categoryName !== params.categoryName ||
        formData.subcategory !== params.subcategoryId ||
        formData.subcategoryName !== params.subcategoryName)
    ) {
      setFormData((prev) => ({
        ...prev,
        category: params.categoryId,
        categoryName: params.categoryName,
        subcategory: params.subcategoryId,
        subcategoryName: params.subcategoryName,
      }));

      // Guardar en AsyncStorage para persistencia (usamos una función async para evitar problemas)
      const saveSelections = async () => {
        try {
          await AsyncStorage.setItem(
            "selectedCategory",
            JSON.stringify({
              _id: params.categoryId,
              name: params.categoryName,
            })
          );
          await AsyncStorage.setItem(
            "selectedSubcategory",
            JSON.stringify({
              _id: params.subcategoryId,
              name: params.subcategoryName,
            })
          );
        } catch (error) {
          console.error("Error al guardar selecciones en AsyncStorage:", error);
        }
      };
      saveSelections();
    }
  }, [params, formData]); // Agregamos formData como dependencia para comparar valores

  // Función para verificar la existencia de una cuenta profesional
  const checkAccount = async (userId, forceFetch = false) => {
    try {
      if (!forceFetch) {
        const storedData = await AsyncStorage.getItem("professional_data");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (
            parsedData &&
            parsedData.id &&
            parsedData.name &&
            parsedData.email &&
            parsedData.phone_number &&
            parsedData.description &&
            parsedData.owner === userId
          ) {
            setExistingAccount(parsedData);
            setIsLoading(false);
            return;
          }
        }
      }

      const response = await axios.get(
        `${API_BASE_URL}/professional/owner/${userId}`
      );
      if (response.data) {
        const accountData = {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          phone_number: response.data.phone_number,
          description: response.data.description,
          owner: userId,
          ownerName: response.data.owner?.userName || userName || "",
          avatar: response.data.avatar?.url,
          category: response.data.category?.id || "",
          categoryName: response.data.category?.name || "",
          subcategory: response.data.subcategory?.id || "",
          subcategoryName: response.data.subcategory?.name || "",
        };
        setExistingAccount(accountData);
        await AsyncStorage.setItem(
          "professional_data",
          JSON.stringify(accountData)
        );
      } else {
        setExistingAccount(null);
        await AsyncStorage.removeItem("professional_data");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setExistingAccount(null);
        await AsyncStorage.removeItem("professional_data");
      } else if (error.response?.status === 400) {
        Alert.alert("Error", "El ID del usuario no es válido.");
        await AsyncStorage.removeItem("id");
        router.navigate("LoginScreen");
      } else {
        console.error("Error al verificar cuenta profesional:", error);
        Alert.alert(
          "Error",
          "No se pudo verificar si tienes una cuenta profesional. Intenta de nuevo."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar userId y datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const id = await AsyncStorage.getItem("id");
        if (!id) {
          Alert.alert(
            "Error",
            "Debes iniciar sesión para crear una cuenta profesional."
          );
          router.navigate("LoginScreen");
          return;
        }
        const parsedId = JSON.parse(id);
        if (!parsedId || typeof parsedId !== "string") {
          await AsyncStorage.removeItem("id");
          Alert.alert(
            "Error",
            "Sesión inválida. Por favor, inicia sesión de nuevo."
          );
          router.navigate("LoginScreen");
          return;
        }
        setUserId(parsedId);
        setFormData((prev) => ({ ...prev, owner: parsedId }));

        const userData = await AsyncStorage.getItem(`user${parsedId}`);
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUserName(parsedUserData.userName || "");
          setFormData((prev) => ({
            ...prev,
            email: parsedUserData.email || "",
          }));
        } else {
          Alert.alert("Error", "Datos de usuario no encontrados.");
          router.navigate("LoginScreen");
          return;
        }

        await checkAccount(parsedId);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        Alert.alert("Error", "No se pudieron cargar los datos iniciales.");
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Verificar cuenta cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        setIsLoading(true);
        checkAccount(userId, params?.accountDeleted === "true");
      }
    }, [userId, userName, params?.accountDeleted])
  );

  // Verificar si la cuenta fue eliminada
  useEffect(() => {
    if (params?.accountDeleted === "true") {
      setExistingAccount(null);
      AsyncStorage.removeItem("professional_data");
    }
  }, [params?.accountDeleted]);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const pickImage = async () => {
    if (avatar) {
      Alert.alert("Límite alcanzado", "Solo se permite subir un avatar.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      try {
        await new Promise((resolve, reject) => {
          Image.getSize(
            uri,
            () => resolve(),
            (error) => reject(error)
          );
        });
        setAvatar(uri);
      } catch (error) {
        console.error("Error al validar imagen:", error);
        Alert.alert("Error", "No se pudo cargar la imagen seleccionada.");
      }
    }
  };

  const removeImage = () => {
    setAvatar(null);
  };

  const handleSubmit = async () => {
    const missingFields = [];
    if (!formData.name) missingFields.push("Nombre");
    if (!formData.email) missingFields.push("Email");
    if (!formData.phone_number) missingFields.push("Teléfono");
    if (!formData.description) missingFields.push("Descripción");
    if (!formData.owner) missingFields.push("Propietario");
    if (!formData.category) missingFields.push("Categoría");
    if (!formData.subcategory) missingFields.push("Subcategoría");
    if (!avatar) missingFields.push("Avatar");

    if (missingFields.length > 0) {
      Alert.alert(
        "Campos obligatorios",
        `Los siguientes campos son requeridos: ${missingFields.join(", ")}`
      );
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone_number", formData.phone_number);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("owner", userId);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("subcategory", formData.subcategory);

      if (avatar) {
        formDataToSend.append("avatar", {
          uri: avatar,
          name: `avatar_${userId}.jpg`,
          type: "image/jpeg",
        });
      }

      const response = await axios.post(
        `${API_BASE_URL}/professional`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const accountData = {
        id: response.data.professional._id,
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        description: formData.description,
        owner: userId,
        ownerName: userName,
        avatar: response.data.professional.avatar?.url,
        category: formData.category,
        categoryName: formData.categoryName,
        subcategory: formData.subcategory,
        subcategoryName: formData.subcategoryName,
      };
      await AsyncStorage.setItem(
        "professional_data",
        JSON.stringify(accountData)
      );
      setExistingAccount(accountData);

      // Limpiar el formulario y AsyncStorage de selecciones
      setFormData({
        name: "",
        email: formData.email,
        phone_number: "",
        description: "",
        owner: userId,
        category: "",
        categoryName: "",
        subcategory: "",
        subcategoryName: "",
      });
      setAvatar(null);
      await AsyncStorage.removeItem("selectedCategory");
      await AsyncStorage.removeItem("selectedSubcategory");

      Alert.alert("Éxito", "Cuenta profesional creada correctamente");
    } catch (error) {
      console.error(
        "Error al crear cuenta profesional:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "No se pudo crear la cuenta profesional. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  // Componente para mostrar los detalles de la cuenta profesional
  const AccountCard = ({ account }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        router.push({
          pathname: "/professionals/EditProfessionalAccount",
          params: { account: JSON.stringify(account) },
        })
      }
    >
      <Text style={styles.cardTitle}>{account.name}</Text>
      {account.avatar && (
        <Image source={{ uri: account.avatar }} style={styles.imagePreview} />
      )}
      <Text style={styles.cardLabel}>Propietario:</Text>
      <Text style={styles.cardText}>{account.ownerName}</Text>
      <Text style={styles.cardLabel}>Email:</Text>
      <Text style={styles.cardText}>{account.email}</Text>
      <Text style={styles.cardLabel}>Teléfono:</Text>
      <Text style={styles.cardText}>{account.phone_number}</Text>
      <Text style={styles.cardLabel}>Categoría:</Text>
      <Text style={styles.cardText}>{account.categoryName}</Text>
      <Text style={styles.cardLabel}>Subcategoría:</Text>
      <Text style={styles.cardText}>{account.subcategoryName}</Text>
      <Text style={styles.cardLabel}>Descripción:</Text>
      <Text style={styles.cardText}>{account.description}</Text>
    </TouchableOpacity>
  );

  // Mostrar loader centrado mientras se verifica
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#00C853" />
        </View>
      </SafeAreaView>
    );
  }

  // Renderizar AccountCard si existe una cuenta profesional
  if (existingAccount) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="chevron-left" size={30} color="#00C853" />
          </TouchableOpacity>
          <Text style={styles.headerText}>
            Detalles de la Cuenta Profesional
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          <AccountCard account={existingAccount} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Renderizar formulario si no hay cuenta profesional
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={30} color="#00C853" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Crear Cuenta Profesional</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Propietario*</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={userName}
            editable={false}
            placeholder="Nombre del propietario"
            placeholderTextColor="#A0A0A0"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Categoría y Subcategoría*</Text>
          <TouchableOpacity
            style={[
              styles.categoryPicker,
              formData.categoryName &&
                formData.subcategoryName &&
                styles.categoryPickerSelected,
            ]}
            onPress={() =>
              router.push({
                pathname: "/stores/CategorySelectionScreen",
                params: { returnScreen: "CreateProfessionalAccount" },
              })
            }
          >
            <Text
              style={[
                styles.categoryPickerText,
                formData.categoryName &&
                  formData.subcategoryName &&
                  styles.categoryPickerTextSelected,
              ]}
            >
              {formData.categoryName && formData.subcategoryName
                ? `${formData.categoryName} - ${formData.subcategoryName}`
                : "Seleccionar Categoría y Subcategoría"}
            </Text>
            <MaterialIcons name="chevron-right" size={24} color="#A0A0A0" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre profesional*</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
            placeholder="Ej: Juan Pérez Profesional"
            placeholderTextColor="#A0A0A0"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email*</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            placeholder="Ej: profesional@ejemplo.com"
            placeholderTextColor="#A0A0A0"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono de contacto*</Text>
          <TextInput
            style={styles.input}
            value={formData.phone_number}
            onChangeText={(text) => handleChange("phone_number", text)}
            placeholder="Ej: +24022255555"
            placeholderTextColor="#A0A0A0"
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción*</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={formData.description}
            onChangeText={(text) => handleChange("description", text)}
            placeholder="Describe tus servicios profesionales"
            placeholderTextColor="#A0A0A0"
            multiline
            numberOfLines={4}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Avatar*</Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => pickImage()}
          >
            {avatar ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: avatar }}
                  style={styles.imagePreview}
                  key={avatar}
                  onError={(e) => {
                    console.error(
                      "Error cargando avatar:",
                      e.nativeEvent.error
                    );
                    Alert.alert("Error", "No se pudo cargar el avatar.");
                  }}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeImage()}
                >
                  <MaterialIcons name="delete" size={24} color="#FF0000" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <MaterialIcons name="image" size={40} color="#A0A0A0" />
                <Text style={styles.imagePickerText}>
                  Seleccionar Avatar (1:1)
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <MaterialIcons name="work" size={24} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>
            {loading ? "Creando..." : "Crear Cuenta Profesional"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    marginTop: 30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
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
    color: "#1A1A1A",
  },
  container: {
    padding: 15,
    paddingTop: 60,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  disabledInput: {
    backgroundColor: "#F5F5F5",
    color: "#666",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  categoryPicker: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryPickerSelected: {
    backgroundColor: "#e3f2fd",
    borderColor: "#00C853",
  },
  categoryPickerText: {
    fontSize: 16,
    color: "#1A1A1A",
  },
  categoryPickerTextSelected: {
    color: "#00C853",
    fontWeight: "500",
  },
  imagePicker: {
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerText: {
    color: "#666",
    fontSize: 14,
    marginTop: 8,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: "contain",
  },
  deleteButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 2,
  },
  submitButton: {
    backgroundColor: "#00C853",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#A0A0A0",
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    color: "#1A1A1A",
  },
});

export default CreateProfessionalAccount;
