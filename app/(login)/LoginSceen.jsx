import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../constants/theme";
import Botton from "../../components/providers/Botton";
import { API_BASE_URL } from "../../config/Service.Config";
import * as WebBrowser from "expo-web-browser";
import styles from "../../components/ui/login/Register.Style";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import PerfilHeader from "../../components/perfil/PerfilHeader";

WebBrowser.maybeCompleteAuthSession();

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [obsecureText, setObsecureText] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email) {
      Alert.alert(
        "Error",
        "El campo de correo electrónico no puede estar vacío."
      );
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Error", "Introduzca un correo electrónico válido.");
      return;
    }
    if (!password) {
      Alert.alert("Error", "El campo de contraseña no puede estar vacío.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    // setLoader(true);
    const endpoint = `${API_BASE_URL}/login`;

    try {
      const response = await axios.post(endpoint, { email, password });
      if (response.status === 200) {
        const responseData = response.data;
        if (responseData && responseData._id) {
          await AsyncStorage.setItem(
            `user${responseData._id}`,
            JSON.stringify(responseData)
          );
          await AsyncStorage.setItem("id", JSON.stringify(responseData._id));
          setLoading(true);
          router.replace("(tabs)");
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Error de inicio de sesión. Inténtalo de nuevo.");
    } finally {
      // setLoader(false);
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <PerfilHeader />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.container}>
          <View style={styles.mboloContainer}>
            <Text style={styles.mboloText}>MBOLO</Text>
          </View>
          <View style={styles.loginContainer}>
            <Text style={styles.text_header}>Login !!</Text>
          </View>
          <View style={styles.wrapper}>
            <View
              style={styles.action(email ? COLORS.primary : COLORS.offwhite)}
            >
              <FontAwesome
                name="user-o"
                size={24}
                color="#4c86A8"
                style={styles.smallIcon}
              />
              <TextInput
                placeholder="Correo electrónico"
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View
              style={styles.action(password ? COLORS.primary : COLORS.offwhite)}
            >
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color="#4c86A8"
                style={styles.smallIcon}
              />
              <TextInput
                secureTextEntry={obsecureText}
                placeholder="Contraseña"
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setObsecureText(!obsecureText)}>
                <MaterialCommunityIcons
                  name={obsecureText ? "eye-outline" : "eye-off-outline"}
                  size={18}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <Botton
                loader={loading}
                title="L O G I N"
                onPress={handleLogin}
              />
            </View>
            <Text
              style={styles.registration}
              onPress={() => router.push("RegisterScreen")}
            >
              ¿No tiene una cuenta? Regístrate
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginPage;

/**
 * 
 * 
 *    try {
      // Solicitar el login al backend
      const res = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });
      if (res.data && res.data.token) {
        await AsyncStorage.setItem("token", res.data.token);
        await AsyncStorage.setItem("userId", res.data.userId);
        console.log("userId guardado en AsyncStorage:", res.data.userId);
        setLoading(true);
        router.replace("(tabs)");
      } else {
        console.error("Respuesta incorrecta:", res.data);
      }
    } catch (error) {
      console.error("Error en el login:", error);
    }
 */
