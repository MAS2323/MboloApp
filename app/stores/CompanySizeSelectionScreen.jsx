import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const companySizeOptions = [
  { value: "Microempresa", display: "Microempresa" },
  { value: "Pequeña empresa", display: "Pequeña empresa" },
  { value: "Mediana empresa", display: "Mediana empresa" },
  { value: "Gran empresa", display: "Gran empresa" },
];

const CompanySizeSelectionScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { returnScreen } = params;

  const handleSelectOption = (option) => {
    router.push({
      pathname: `/stores/${returnScreen}`,
      params: {
        companySizeValue: option.value,
        companySizeDisplay: option.display,
      },
    });
  };

  const renderOptionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleSelectOption(item)}
    >
      <Text style={styles.itemText}>{item.display}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={30} color="#00C853" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Seleccionar Tamaño de la Empresa</Text>
      </View>
      <FlatList
        data={companySizeOptions}
        renderItem={renderOptionItem}
        keyExtractor={(item) => item.value}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
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
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  listContainer: {
    padding: 15,
  },
  itemContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  itemText: {
    fontSize: 16,
    color: "#1A1A1A",
  },
});

export default CompanySizeSelectionScreen;
