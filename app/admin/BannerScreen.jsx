import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SIZES } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

const BannerScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestión de Banners</Text>
        <View style={{ width: 30 }} />
      </View> */}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/admin/banner/AllBannersScreen")}
        >
          <Text style={styles.buttonText}>Ver Todos los Banners</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/admin/banner/CreateAdScreen")}
        >
          <Text style={styles.buttonText}>Crear Nuevo Banner</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightwhite,
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
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.medium,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
    marginVertical: SIZES.medium,
  },
  buttonText: {
    fontSize: SIZES.medium,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default BannerScreen;
