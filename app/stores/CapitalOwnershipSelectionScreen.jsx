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

const capitalOwnershipOptions = [
  { value: "Privadas", display: "Privadas" },
  { value: "Públicas", display: "Públicas" },
  { value: "Mixtas", display: "Mixtas" },
];

const CapitalOwnershipSelectionScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { returnScreen } = params;

  const handleSelectOption = (option) => {
    router.push({
      pathname: `/stores/${returnScreen}`,
      params: {
        capitalOwnershipValue: option.value,
        capitalOwnershipDisplay: option.display,
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
        <Text style={styles.headerText}>Seleccionar Propiedad del Capital</Text>
      </View>
      <FlatList
        data={capitalOwnershipOptions}
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

export default CapitalOwnershipSelectionScreen;
