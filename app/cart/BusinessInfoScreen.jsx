import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";

const BusinessInfoScreen = () => {
  const router = useRouter();

  const menuItems = [
    {
      label: "Nombre de la empresa, descripción y enlaces",
      onPress: () => router.push("/profile/CompanyDetailsScreen"),
    },
    {
      label: "Dirección de la tienda y horarios comerciales",
      onPress: () => router.push("/profile/StoreDetailsScreen"),
    },
    {
      label: "Entrega",
      onPress: () => router.push("/profile/DeliveryDetailsScreen"),
    },
  ];

  const renderMenuItem = (label, onPress) => (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <Text style={styles.menuText}>{label}</Text>
      <MaterialIcons name="chevron-right" size={24} color={COLORS.gray} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={30} color="#00C853" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Detalles del negocio</Text>
      </View>

      {menuItems.map((item, index) => (
        <View key={index}>{renderMenuItem(item.label, item.onPress)}</View>
      ))}
    </SafeAreaView>
  );
};

export default BusinessInfoScreen;

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
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  menuText: {
    fontSize: 16,
    color: COLORS.black,
  },
});
