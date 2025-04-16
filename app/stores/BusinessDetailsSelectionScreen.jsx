import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../constants/theme";

const BusinessDetailsSelectionScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { returnScreen } = params;

  // Estado para almacenar las selecciones
  const [selections, setSelections] = useState({
    capitalOwnership: params?.capitalOwnershipValue || "",
    capitalOwnershipDisplay: params?.capitalOwnershipDisplay || "",
    companySize: params?.companySizeValue || "",
    companySizeDisplay: params?.companySizeDisplay || "",
    legalForm: params?.legalFormValue || "",
    legalFormDisplay: params?.legalFormDisplay || "",
    economicSector: params?.economicSectorValue || "",
    economicSectorDisplay: params?.economicSectorDisplay || "",
    operationScope: params?.operationScopeValue || "",
    operationScopeDisplay: params?.operationScopeDisplay || "",
  });

  // Opciones para cada campo (según el esquema del backend)
  const capitalOwnershipOptions = [
    { value: "Privadas", display: "Privadas" },
    { value: "Públicas", display: "Públicas" },
    { value: "Mixtas", display: "Mixtas" },
  ];

  const companySizeOptions = [
    { value: "Microempresa", display: "Microempresa" },
    { value: "Pequeña empresa", display: "Pequeña empresa" },
    { value: "Mediana empresa", display: "Mediana empresa" },
    { value: "Gran empresa", display: "Gran empresa" },
  ];

  const legalFormOptions = [
    { value: "Empresario individual", display: "Empresario individual" },
    { value: "Sociedad Anónima", display: "Sociedad Anónima" },
    {
      value: "Sociedad de Responsabilidad Limitada",
      display: "Sociedad de Responsabilidad Limitada",
    },
    { value: "Cooperativas", display: "Cooperativas" },
    { value: "Sociedad Colectiva", display: "Sociedad Colectiva" },
    { value: "Sociedad Comanditaria", display: "Sociedad Comanditaria" },
  ];

  const economicSectorOptions = [
    { value: "Primarias", display: "Primarias" },
    { value: "Secundarias", display: "Secundarias" },
    { value: "Terciarias", display: "Terciarias" },
    { value: "Cuaternarias", display: "Cuaternarias" },
  ];

  const operationScopeOptions = [
    { value: "Locales", display: "Locales" },
    { value: "Nacionales", display: "Nacionales" },
    { value: "Multinacionales", display: "Multinacionales" },
  ];

  const handleSelectOption = (field, option) => {
    setSelections((prev) => ({
      ...prev,
      [field]: option.value,
      [`${field}Display`]: option.display,
    }));
  };

  const handleConfirm = async () => {
    const missingFields = [];
    if (!selections.capitalOwnership)
      missingFields.push("Propiedad del Capital");
    if (!selections.companySize) missingFields.push("Tamaño de la Empresa");
    if (!selections.legalForm) missingFields.push("Forma Jurídica");
    if (!selections.economicSector) missingFields.push("Sector Económico");
    if (!selections.operationScope) missingFields.push("Ámbito de Actuación");

    if (missingFields.length > 0) {
      Alert.alert(
        "Campos obligatorios",
        `Por favor selecciona: ${missingFields.join(", ")}`
      );
      return;
    }

    // Guardar selecciones en AsyncStorage
    try {
      await AsyncStorage.setItem(
        "selectedCapitalOwnership",
        JSON.stringify({
          value: selections.capitalOwnership,
          display: selections.capitalOwnershipDisplay,
        })
      );
      await AsyncStorage.setItem(
        "selectedCompanySize",
        JSON.stringify({
          value: selections.companySize,
          display: selections.companySizeDisplay,
        })
      );
      await AsyncStorage.setItem(
        "selectedLegalForm",
        JSON.stringify({
          value: selections.legalForm,
          display: selections.legalFormDisplay,
        })
      );
      await AsyncStorage.setItem(
        "selectedEconomicSector",
        JSON.stringify({
          value: selections.economicSector,
          display: selections.economicSectorDisplay,
        })
      );
      await AsyncStorage.setItem(
        "selectedOperationScope",
        JSON.stringify({
          value: selections.operationScope,
          display: selections.operationScopeDisplay,
        })
      );
    } catch (error) {
      console.error("Error al guardar selecciones en AsyncStorage:", error);
    }

    // Regresar a la pantalla anterior con los datos seleccionados
    router.push({
      pathname: `/stores/${returnScreen}`,
      params: {
        capitalOwnershipValue: selections.capitalOwnership,
        capitalOwnershipDisplay: selections.capitalOwnershipDisplay,
        companySizeValue: selections.companySize,
        companySizeDisplay: selections.companySizeDisplay,
        legalFormValue: selections.legalForm,
        legalFormDisplay: selections.legalFormDisplay,
        economicSectorValue: selections.economicSector,
        economicSectorDisplay: selections.economicSectorDisplay,
        operationScopeValue: selections.operationScope,
        operationScopeDisplay: selections.operationScopeDisplay,
      },
    });
  };

  const renderOptionItem = (option, field) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        selections[field] === option.value && styles.optionItemSelected,
      ]}
      onPress={() => handleSelectOption(field, option)}
    >
      <Text
        style={[
          styles.optionText,
          selections[field] === option.value && styles.optionTextSelected,
        ]}
      >
        {option.display}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={30} color="#00C853" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Detalles del Negocio</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Propiedad del Capital*</Text>
          <FlatList
            data={capitalOwnershipOptions}
            renderItem={({ item }) =>
              renderOptionItem(item, "capitalOwnership")
            }
            keyExtractor={(item) => item.value}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.optionsContainer}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tamaño de la Empresa*</Text>
          <FlatList
            data={companySizeOptions}
            renderItem={({ item }) => renderOptionItem(item, "companySize")}
            keyExtractor={(item) => item.value}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.optionsContainer}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forma Jurídica*</Text>
          <FlatList
            data={legalFormOptions}
            renderItem={({ item }) => renderOptionItem(item, "legalForm")}
            keyExtractor={(item) => item.value}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.optionsContainer}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sector Económico*</Text>
          <FlatList
            data={economicSectorOptions}
            renderItem={({ item }) => renderOptionItem(item, "economicSector")}
            keyExtractor={(item) => item.value}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.optionsContainer}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ámbito de Actuación*</Text>
          <FlatList
            data={operationScopeOptions}
            renderItem={({ item }) => renderOptionItem(item, "operationScope")}
            keyExtractor={(item) => item.value}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.optionsContainer}
          />
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirmar Selecciones</Text>
        </TouchableOpacity>
      </ScrollView>
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
    color: COLORS.black,
  },
  container: {
    padding: 15,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 10,
  },
  optionsContainer: {
    paddingVertical: 5,
  },
  optionItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  optionItemSelected: {
    backgroundColor: "#e3f2fd",
    borderColor: "#00C853",
  },
  optionText: {
    fontSize: 14,
    color: COLORS.black,
  },
  optionTextSelected: {
    color: "#00C853",
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: "#00C853",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BusinessDetailsSelectionScreen;
