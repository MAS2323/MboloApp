import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SectionList,
} from "react-native";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import {
  AntDesign,
  MaterialIcons,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { COLORS } from "./../../constants/theme";
import { API_BASE_URL } from "./../../config/Service.Config";
import { useRouter } from "expo-router";

// Header Component
const Header = ({ onBack, title }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack}>
      <MaterialIcons name="chevron-left" size={30} color="#00C853" />
    </TouchableOpacity>
    <Text style={styles.headerText}>{title}</Text>
    <View style={{ width: 30 }} />
  </View>
);

// Menu Item Component
const MenuItem = ({
  icon,
  label,
  onPress,
  additionalInfo,
  iconColor,
  iconBackgroundColor,
}) => (
  <TouchableOpacity onPress={onPress} style={styles.menuItem}>
    <View style={styles.menuItemInner}>
      <View
        style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}
      >
        {React.cloneElement(icon, { color: iconColor || COLORS.white })}
      </View>
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

const SettingsScreen = () => {
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

  const deleteAccount = async () => {
    try {
      const userId = await AsyncStorage.getItem("id");
      if (!userId) {
        console.log("ID del usuario no encontrado en AsyncStorage");
        return;
      }
      Alert.alert(
        "Eliminar mi cuenta",
        "¿Estás seguro de que quieres eliminar tu cuenta permanentemente?",
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
                const endpoint = `${API_BASE_URL}/user/${JSON.parse(userId)}`;
                const response = await axios.delete(endpoint);
                if (response.status === 200) {
                  console.log("Cuenta eliminada");
                  await AsyncStorage.removeItem("id");
                  router.push("(login)");
                }
              } catch (error) {
                console.error("Error al eliminar la cuenta:", error);
                Alert.alert(
                  "Error",
                  "No se pudo eliminar la cuenta. Intenta de nuevo."
                );
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

  const sections = [
    {
      title: "Cuenta",
      data: [
        {
          icon: <Ionicons name="person" size={24} />,
          label: "Información personal",
          onPress: () => router.push("/cart/PersonalInfoScreen"),
          iconColor: COLORS.white,
          iconBackgroundColor: "#FF9500", // Matches "Información de negocio"
        },
        {
          icon: <MaterialIcons name="business" size={24} />,
          label: "Información de negocio",
          onPress: () => router.push("/cart/BusinessInfoScreen"),
          iconColor: COLORS.white,
          iconBackgroundColor: "#FF9500",
        },
        {
          icon: <MaterialIcons name="phone" size={24} />,
          label: "Teléfono",
          onPress: () => router.push("/cart/PhoneNumbersScreen"),
          additionalInfo: "Añadir",
          iconColor: COLORS.white,
          iconBackgroundColor: "#00C853",
        },
        {
          icon: <MaterialIcons name="email" size={24} />,
          label: "Correo",
          onPress: () => router.push("/cart/ChangeEmailScreen"),
          additionalInfo: userData?.email || "mboloapp@mbolo.com",
          iconColor: COLORS.white,
          iconBackgroundColor: "#FF9500",
        },
        {
          icon: <MaterialIcons name="lock" size={24} />,
          label: "Cambiar contraseña",
          onPress: () => router.push("/cart/ChangePasswordScreen"),
          iconColor: COLORS.gray,
          iconBackgroundColor: "#E0E0E0",
        },
      ],
    },
    {
      title: "Preferencias",
      data: [
        {
          icon: <MaterialIcons name="chat" size={24} />,
          label: "Desactivar chat",
          onPress: () => router.push("/cart/DisableChatScreen"),
          additionalInfo: "Habilitado",
          iconColor: COLORS.white,
          iconBackgroundColor: "#00C853",
        },
        {
          icon: <MaterialIcons name="feedback" size={24} />,
          label: "Desactivar comentarios",
          onPress: () => router.push("/cart/DisableFeedbackScreen"),
          additionalInfo: "Habilitado",
          iconColor: COLORS.white,
          iconBackgroundColor: "#FF9500",
        },
        {
          icon: <MaterialIcons name="notifications" size={24} />,
          label: "Gestionar notificaciones",
          onPress: () => router.push("/cart/ManageNotificationsScreen"),
          iconColor: COLORS.white,
          iconBackgroundColor: "#FF3D00",
        },
      ],
    },
    {
      title: "General",
      data: [
        {
          icon: <MaterialIcons name="info" size={24} />,
          label: "Sobre MboloApp",
          onPress: () => router.push("/cart/SobreNosotrosScreen"),
          iconColor: COLORS.white,
          iconBackgroundColor: "#212121",
        },
        {
          icon: <FontAwesome name="star" size={24} />,
          label: "Califícanos",
          onPress: () => router.push("/profile/RateUsScreen"),
          iconColor: COLORS.white,
          iconBackgroundColor: "#212121",
        },
        {
          icon: <MaterialIcons name="delete" size={24} />,
          label: "Eliminar mi cuenta",
          onPress: deleteAccount,
          iconColor: COLORS.gray,
          iconBackgroundColor: "#E0E0E0",
        },
        {
          icon: <AntDesign name="logout" size={24} />,
          label: "Cerrar sesión",
          onPress: logout,
          iconColor: COLORS.gray,
          iconBackgroundColor: "#E0E0E0",
        },
      ],
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
      <Header onBack={() => router.back()} title="Configuración" />
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.label + index}
        renderItem={({ item }) => (
          <MenuItem
            icon={item.icon}
            label={item.label}
            onPress={item.onPress}
            additionalInfo={item.additionalInfo}
            iconColor={item.iconColor}
            iconBackgroundColor={item.iconBackgroundColor}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        contentContainerStyle={styles.sectionListContent}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;

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
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
  },
  sectionListContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  sectionHeader: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginTop: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray,
    textTransform: "uppercase",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingHorizontal: 10,
  },
  menuItemInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
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
