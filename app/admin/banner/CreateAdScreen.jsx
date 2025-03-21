import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { API_BASE_URL } from "../../../config/Service.Config";
import { COLORS, SIZES } from "../../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CreateAdScreen = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("tecnologia"); // Valor por defecto
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Seleccionar una imagen de la galería
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9], // Proporción de la imagen
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Crear el anuncio
  const handleCreateAd = async () => {
    if (!title || !description || !category || !image) {
      Alert.alert(
        "Error",
        "Todos los campos son obligatorios, incluyendo la imagen"
      );
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("link", link);

    // Añadir la imagen al FormData
    const filename = image.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    formData.append("images", {
      uri: image,
      name: filename,
      type,
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/ads`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Éxito", "Anuncio creado exitosamente", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error creating ad:", error);
      Alert.alert("Error", "No se pudo crear el anuncio. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={30} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crear Anuncio</Text>
          <View style={{ width: 30 }} /> 
        </View> */}

        <View style={styles.formContainer}>
          {/* Imagen */}
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={40} color={COLORS.gray} />
                <Text style={styles.imagePlaceholderText}>
                  Seleccionar Imagen
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Título */}
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Título del anuncio"
            placeholderTextColor={COLORS.gray}
          />

          {/* Descripción */}
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción del anuncio"
            placeholderTextColor={COLORS.gray}
            multiline
            numberOfLines={4}
          />

          {/* Categoría */}
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Tecnología" value="tecnologia" />
              <Picker.Item label="Moda" value="moda" />
              <Picker.Item label="Hogar" value="hogar" />
              <Picker.Item label="Deportes" value="deportes" />
              <Picker.Item label="Salud" value="salud" />
              <Picker.Item label="Otros" value="otros" />
            </Picker>
          </View>

          {/* Enlace (opcional) */}
          <Text style={styles.label}>Enlace (opcional)</Text>
          <TextInput
            style={styles.input}
            value={link}
            onChangeText={setLink}
            placeholder="https://ejemplo.com"
            placeholderTextColor={COLORS.gray}
            keyboardType="url"
          />

          {/* Botón de Crear */}
          <TouchableOpacity
            style={[styles.createButton, loading && styles.disabledButton]}
            onPress={handleCreateAd}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.createButtonText}>Crear Anuncio</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightwhite,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: SIZES.large,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: SIZES.xLarge,
    fontWeight: "bold",
    color: COLORS.black,
  },
  formContainer: {
    padding: SIZES.medium,
  },
  imagePicker: {
    alignItems: "center",
    marginBottom: SIZES.medium,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
  },
  imagePlaceholderText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginTop: SIZES.small,
  },
  label: {
    fontSize: SIZES.medium,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: SIZES.xSmall,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: SIZES.small,
    fontSize: SIZES.medium,
    color: COLORS.black,
    backgroundColor: COLORS.white,
    marginBottom: SIZES.medium,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    marginBottom: SIZES.medium,
    backgroundColor: COLORS.white,
  },
  picker: {
    height: 50,
    color: COLORS.black,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: 8,
    alignItems: "center",
    marginTop: SIZES.medium,
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
  },
  createButtonText: {
    fontSize: SIZES.medium,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default CreateAdScreen;
