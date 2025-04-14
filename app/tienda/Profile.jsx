import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Image,
} from "react-native";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import {
  AntDesign,
  MaterialCommunityIcons,
  SimpleLineIcons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { COLORS } from "./../../constants/theme";
import { API_BASE_URL } from "./../../config/Service.Config";
import { useRouter } from "expo-router";

export default function PerfilScreen() {
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
      console.error("Error recuperando tus datos:", error);
    }
  };

  const userLogout = async () => {
    try {
      // Obtener el ID del usuario desde AsyncStorage
      const id = await AsyncStorage.getItem("id");

      // Verificar si el ID existe antes de continuar
      if (!id) {
        console.log("El ID de usuario no está disponible");
        return;
      }

      const userId = `user${JSON.parse(id)}`;

      // Eliminar las claves de AsyncStorage
      await AsyncStorage.multiRemove([userId, "id"]);

      // Redirigir al login
      router.replace({
        index: 0,
        routes: [{ name: "(login)" }],
      });

      console.log("Sesión cerrada con éxito");
    } catch (error) {
      console.error("Error cerrando sesión:", error.message || error);
    }
  };

  const logout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que quieres cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Continuar", onPress: userLogout },
    ]);
  };

  const clearCache = async () => {
    try {
      const confirmed = await new Promise((resolve) => {
        Alert.alert(
          "Limpiar la Caché",
          "¿Estás seguro que quieres eliminar todos los datos guardados en tu dispositivo?",
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
      const userId = await AsyncStorage.getItem("id"); // Obtén el ID del usuario almacenado
      if (!userId) {
        console.log("ID del usuario no encontrado en AsyncStorage");
        return;
      }

      Alert.alert(
        "Eliminar mi cuenta",
        "¿Estás seguro que quieres eliminar tu cuenta?",
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
                  // Opcional: limpiar AsyncStorage o redirigir al usuario
                  await AsyncStorage.removeItem("id");
                  router.push("(login)"); // O redirige a la pantalla de login u otra pantalla apropiada
                }
              } catch (error) {
                console.error("Error al eliminar la cuenta", error);
                // Manejar el error aquí, por ejemplo, mostrar un mensaje al usuario
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting user", error);
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

  const renderMenuItem = (icon, label, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.menuItem}>
        {icon}
        <Text style={styles.menuText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  const menuItems = [
    {
      icon: <SimpleLineIcons name="bag" color={COLORS.primary} size={24} />,
      label: "Carrito",
      onPress: () => router.push("/cart/CartScreen"),
    },
    {
      icon: <MaterialIcons name="source" size={24} color={COLORS.primary} />,
      label: "Archivos",
      onPress: () => router.push("/cart/ArchivoScreen"),
    },
    {
      icon: <FontAwesome5 name="users" size={24} color={COLORS.primary} />,
      label: "Sobre nosotros",
      onPress: () => router.push("/cart/SobreNosotrosScreen"),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="cached"
          color={COLORS.primary}
          size={24}
        />
      ),
      label: "Limpiar la Caché",
      onPress: clearCache,
    },
    {
      icon: <AntDesign name="deleteuser" color={COLORS.primary} size={24} />,
      label: "Eliminar mi Cuenta",
      onPress: deleteAccount,
    },
    {
      icon: <AntDesign name="logout" color={COLORS.primary} size={24} />,
      label: "Cerrar Sesión",
      onPress: logout,
    },
    {
      icon: (
        <MaterialIcons
          name="admin-panel-settings"
          size={27}
          color={COLORS.primary}
        />
      ),
      label: "AdminScreen",
      onPress: () => router.push("admin"),
    },
  ];
  if (!isLoggedIn) {
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push("/cart/UpdateProfile")}
    >
      {/* <Avatar.Image
            size={80}
            style={styles.avatar}
            source={
              userData?.image?.url
                ? { uri: userData.image.url }
                : require("./../../assets/images/Avatar22.webp")
            }
          /> */}
      <Image
        style={{ width: 80, height: 80, borderRadius: 40 }}
        source={
          userData?.image?.url
            ? { uri: userData?.image?.url }
            : require("./../../assets/images/Avatar22.webp")
        }
      />
      <View style={styles.userInfo}>
        <Text style={styles.userInfoText}>{userData?.userName}</Text>
        <Text style={styles.userInfoText}>{userData?.email}</Text>
        <Text style={styles.userInfoText}>{userData?.mobile}</Text>
      </View>
    </TouchableOpacity>;
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} />
      <View style={[styles.header, { marginTop: 43 }]}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/cart/UpdateProfile")}
        >
          <Image
            style={{ width: 80, height: 80, borderRadius: 40 }}
            source={
              userData?.image?.url
                ? { uri: userData?.image?.url }
                : require("./../../assets/images/Avatar22.webp")
            }
          />
          <View style={styles.userInfo}>
            <Text style={styles.userInfoText}>{userData?.userName}</Text>
            <Text style={styles.userInfoText}>{userData?.email}</Text>
            <Text style={styles.userInfoText}>{userData?.mobile}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={isLoggedIn ? menuItems : []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          renderMenuItem(item.icon, item.label, item.onPress)
        }
        contentContainerStyle={styles.menuWrapper}
        ListEmptyComponent={
          !isLoggedIn && (
            <TouchableOpacity
              onPress={() => router.push("/(login)/LoginSceen")}
            >
              <View style={styles.loginBtn}>
                <Text style={styles.menuText}>L O G I N</Text>
              </View>
            </TouchableOpacity>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
    alignItems: "center",
  },
  userInfoText: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 5,
    textAlign: "center",
  },
  menuWrapper: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f4",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 20,
    color: COLORS.black,
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
