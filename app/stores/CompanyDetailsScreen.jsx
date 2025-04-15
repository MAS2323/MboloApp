import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";

export default function CompanyDetailsScreen() {
  const router = useRouter();
  const menuItems = [
    {
      label: "Crear una tienda",
      href: "/stores/CrearTiendaScreen",
    },
    {
      label: "Crear una cuenta profesional",
      href: "/create-professional-account",
    },
  ];

  const renderMenuItem = (label, href) => (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>{label}</Text>
        <MaterialIcons name="chevron-right" size={24} color={COLORS.gray} />
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={30} color="#00C853" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Opciones de Negocio</Text>
      </View>

      {menuItems.map((item, index) => (
        <View key={index}>{renderMenuItem(item.label, item.href)}</View>
      ))}
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
