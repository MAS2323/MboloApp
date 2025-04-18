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
  Dimensions,
} from "react-native";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Octicons from "@expo/vector-icons/Octicons";
import { COLORS } from "./../../constants/theme";
import { useRouter } from "expo-router";

export default function PerfilScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [numColumns, setNumColumns] = useState(2); // Valor inicial

  useEffect(() => {
    checkExistingUser();
  }, []);

  // Calcular número de columnas dinámicamente según el ancho de la pantalla
  useEffect(() => {
    const updateColumns = () => {
      const screenWidth = Dimensions.get("window").width;
      const minItemWidth = 150; // Ancho mínimo por elemento
      const calculatedColumns = Math.floor(screenWidth / minItemWidth);
      setNumColumns(Math.max(1, calculatedColumns)); // Mínimo 1 columna
    };

    updateColumns();
    // Escuchar cambios en las dimensiones (por ejemplo, al rotar la pantalla)
    const subscription = Dimensions.addEventListener("change", updateColumns);
    return () => subscription?.remove();
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
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <View style={styles.menuItemInner}>
        {icon}
        <Text style={styles.menuText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  const menuItems = [
    {
      icon: (
        <MaterialIcons name="shopping-cart" size={24} color={COLORS.black} />
      ),
      label: "Carrito",
      onPress: () => router.push("/cart/CartScreen"),
    },
    {
      icon: (
        <MaterialIcons name="notifications" size={24} color={COLORS.black} />
      ),
      label: "Notificaciones",
      onPress: () => router.push("/cart/NotificacionesScreen"),
    },
    {
      icon: (
        <MaterialIcons name="manage-accounts" size={24} color={COLORS.black} />
      ),
      label: "Cuenta Oficial",
      onPress: () => router.push("/cart/CuentaOficialScreen"),
    },
    {
      icon: (
        <MaterialIcons
          name="store-mall-directory"
          size={24}
          color={COLORS.black}
        />
      ),
      label: "Mi Tienda",
      onPress: () => router.push("/cart/MiTiendaScreenAdmin"),
    },
    {
      icon: <MaterialIcons name="reorder" size={24} color={COLORS.black} />,
      label: "Pedidos",
      onPress: () => router.push("/cart/MisPedidosScreen"),
    },
    {
      icon: <MaterialIcons name="people" size={24} color={COLORS.black} />,
      label: "Seguidores",
      onPress: () => router.push("/cart/SeguidoresScreen"),
    },
  ];

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.loginPromptText}>
            Por favor, inicia sesión para continuar
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(login)/LoginSceen")}
            style={styles.loginBtn}
          >
            <Text style={styles.loginBtnText}>INICIAR SESIÓN</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent />
      <View style={[styles.header, { marginTop: 30 }]}>
        <View style={styles.userContainer}>
          <Image
            style={styles.avatar}
            source={
              userData?.image?.url
                ? { uri: userData?.image?.url }
                : require("./../../assets/images/Avatar22.webp")
            }
          />
          <Text style={styles.userNameText}>
            {userData?.userName || "MAS ONEWE"}
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/cart/SettingsScreen")}>
          <MaterialIcons name="settings" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={isLoggedIn ? menuItems : []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          renderMenuItem(item.icon, item.label, item.onPress)
        }
        contentContainerStyle={styles.menuWrapper}
        numColumns={numColumns}
        key={numColumns} // Forzar re-render cuando cambian las columnas
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loginPromptText: {
    fontSize: 18,
    color: COLORS.black,
    marginBottom: 20,
    textAlign: "center",
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginBtnText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "bold",
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
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userNameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
    textTransform: "uppercase",
  },
  menuWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  menuItem: {
    flex: 1,
    margin: 10,
    minWidth: 150, // Ancho mínimo para cada elemento
  },
  menuItemInner: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: COLORS.black,
  },
});
