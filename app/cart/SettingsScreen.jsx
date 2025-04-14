import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { COLORS } from "./../../constants/theme";
import { API_BASE_URL } from "./../../config/Service.Config";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (!id) {
        router.navigate("LoginSceen");
        return;
      }
      const userId = `user${JSON.parse(id)}`;
      const currentUser = await AsyncStorage.getItem(userId);
      if (currentUser) {
        setUserData(JSON.parse(currentUser));
        setIsLoggedIn(true);
      } else {
        router.navigate("LoginSceen");
      }
    } catch (error) {
      setIsLoggedIn(false);
      console.error("Error al recuperar tus datos:", error);
    }
  };

  const userLogout = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (!id) {
        console.log("El ID de usuario no está disponible");
        return;
      }
      const userId = `user${JSON.parse(id)}`;
      await AsyncStorage.multiRemove([userId, "id"]);
      router.replace({
        index: 0,
        routes: [{ name: "(login)" }],
      });
      console.log("Sesión cerrada con éxito");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message || error);
    }
  };

  const logout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Continuar", onPress: userLogout },
      ]
    );
  };

  const clearCache = async () => {
    try {
      const confirmed = await new Promise((resolve) => {
        Alert.alert(
          "Limpiar la caché",
          "¿Estás seguro de que quieres eliminar todos los datos guardados en tu dispositivo?",
          [
            {
              text: "Cancelar",
              style: "cancel",
              onPress: () => resolve(false),
            },
            { text: "Continuar", onPress: () => resolve(true) },
          ]
        );
      });
      if (confirmed) {
        await AsyncStorage.clear();
        console.log("Caché eliminada");
      }
    } catch (error) {
      console.error("Error al limpiar la caché:", error);
    }
  };

  const deleteAccount = async () => {
    try {
      const userId = await AsyncStorage.getItem("id");
      if (!id) {
        console.log("ID del usuario no encontrado en AsyncStorage");
        return;
      }
      Alert.alert(
        "Eliminar mi cuenta",
        "¿Estás seguro de que quieres eliminar tu cuenta?",
        [
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => console.log("Eliminación de cuenta cancelada"),
          },
          {
            text: "Continuar",
            onPress: async () => {
              try {
                const endpoint = `${API_BASE_URL}/user/${userId}`;
                const response = await axios.delete(endpoint);
                if (response.status === 200) {
                  console.log("Cuenta eliminada");
                  await AsyncStorage.removeItem("id");
                  router.push("(login)");
                }
              } catch (error) {
                console.error("Error al eliminar la cuenta:", error);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error al eliminar la cuenta:", error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      Toast.show({
        type: "success",
        text1: "Bienvenido",
        text2: "Usuario de Mbolo App",
        visibilityTime: 5000,
      });
    }, 2000);
  }, []);

  const renderMenuItem = (icon, label, onPress, additionalInfo = null) => (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <View style={styles.menuItemInner}>
        {icon}
        <Text style={styles.menuText}>{label}</Text>
      </View>
      <View style={styles.rightContainer}>
        {additionalInfo && (
          <Text style={styles.additionalInfo}>{additionalInfo}</Text>
        )}
        <MaterialIcons name="chevron-right" size={24} color={COLORS.gray} />
      </View>
    </TouchableOpacity>
  );

  const menuItems = [
    {
      icon: <Ionicons name="person" size={24} color={COLORS.black} />,
      label: "Información personal",
      onPress: () => router.push("/cart/PersonalInfoScreen"),
    },
    {
      icon: <MaterialIcons name="business" size={24} color="#FF9500" />,
      label: "Información de negocio",
      onPress: () => router.push("/cart/BusinessInfoScreen"),
    },
    {
      icon: <MaterialIcons name="phone" size={24} color="#00C853" />,
      label: "Teléfono",
      onPress: () => router.push("/cart/PhoneNumbersScreen"),
      additionalInfo: "Añadir",
    },
    {
      icon: <MaterialIcons name="email" size={24} color="#FF9500" />,
      label: "Correo",
      onPress: () => router.push("/cart/ChangeEmailScreen"),
      additionalInfo: userData?.email || "masoneweernesto@gmail.com",
    },
    {
      icon: <MaterialIcons name="chat" size={24} color="#00C853" />,
      label: "Desactivar chat",
      onPress: () => router.push("/profile/DisableChatScreen"),
      additionalInfo: "Habilitado",
    },
    {
      icon: <MaterialIcons name="feedback" size={24} color="#FF9500" />,
      label: "Desactivar comentarios",
      onPress: () => router.push("/profile/DisableFeedbackScreen"),
      additionalInfo: "Habilitado",
    },
    {
      icon: <MaterialIcons name="notifications" size={24} color="#FF3D00" />,
      label: "Gestionar notificaciones",
      onPress: () => router.push("/profile/ManageNotificationsScreen"),
    },
    {
      icon: <MaterialIcons name="info" size={24} color="#000" />,
      label: "Sobre MboloApp",
      onPress: () => router.push("/cart/SobreNosotrosScreen"),
    },
    {
      icon: <FontAwesome name="star" size={24} color="#000" />,
      label: "Califícanos",
      onPress: () => router.push("/profile/RateUsScreen"),
    },
    {
      icon: <MaterialIcons name="lock" size={24} color="#757575" />,
      label: "Cambiar contraseña",
      onPress: () => router.push("/profile/ChangePasswordScreen"),
    },
    {
      icon: <MaterialIcons name="delete" size={24} color="#757575" />,
      label: "Eliminar cuenta",
      onPress: deleteAccount,
    },
    {
      icon: <AntDesign name="logout" size={24} color="#757575" />,
      label: "Cerrar sesión",
      onPress: logout,
    },
  ];

  if (!isLoggedIn) {
    return (
      <TouchableOpacity onPress={() => router.push("/(login)/LoginSceen")}>
        <View style={styles.loginBtn}>
          <Text style={styles.menuText}>INICIAR SESIÓN</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={30} color="#00C853" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Configuración</Text>
      </View>

      <FlatList
        data={isLoggedIn ? menuItems : []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          renderMenuItem(
            item.icon,
            item.label,
            item.onPress,
            item.additionalInfo
          )
        }
        contentContainerStyle={styles.menuWrapper}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
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
    color: COLORS.black,
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
  menuWrapper: {
    paddingHorizontal: 15,
    paddingTop: 20, // Añadir padding para evitar solapamiento con el encabezado fijo
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  menuItemInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: COLORS.black,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  additionalInfo: {
    fontSize: 14,
    color: COLORS.gray,
    marginRight: 5,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
  },
});
