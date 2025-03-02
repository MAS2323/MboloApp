import React, { useState, useEffect } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { API_BASE_URL } from "../../config/Service.Config";

const UpdateProfile = () => {
  const [userId, setUserId] = useState(null);
  const [image, setImage] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(true);

  // Obtener el ID del usuario al cargar el componente
  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem("id");
      console.log("User ID:", id);
      setUserId(id ? id.replace(/\"/g, "") : null);
    };
    getUserId();
  }, []);

  // Cargar los datos del usuario desde el backend
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
      console.log("API Response:", response.data); // Log the response
      const userData = response.data; // Access the user data directly
      if (userData) {
        setUserName(userData.userName);
        setEmail(userData.email);
        setLocation(userData.ciudad.name);
        setMobile(userData.mobile);
        setImage(userData.image?.url || "");
      } else {
        Alert.alert("Error", "User data not found.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Failed to load user data. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);
  // Seleccionar una imagen de la galería
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
    }
  };

  // Actualizar el perfil del usuario
  const handleUpdateProfile = async () => {
    if (!userName || !email || !password || !location || !mobile) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("location", location);
    formData.append("mobile", mobile);

    if (image) {
      const filename = image.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("image", {
        uri: image,
        name: filename,
        type,
      });
    }

    try {
      await axios.put(`${API_BASE_URL}/user/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Failed to update profile. Please try again later.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <TouchableOpacity onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Image
                source={require("./../../assets/images/placeholderImage.png")}
                style={styles.image}
              />
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Enter your name"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="Enter your email"
            // editable={false} // Deshabilita la edición del email
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter your password"
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter your location"
          />

          <Text style={styles.label}>Mobile</Text>
          <TextInput
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            placeholder="Enter your mobile number"
          />

          <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    width: "100%",
  },
  button: {
    backgroundColor: "#0066cc",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderColor: "#ddd",
    borderWidth: 1,
    alignSelf: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
