import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

const SubCategoryDetails = () => {
  const router = useRouter();
  const { subcategory, subcategories } = useLocalSearchParams();

  // Parsea los parámetros si es necesario
  const parsedSubcategory = subcategory ? JSON.parse(subcategory) : null;
  const parsedSubcategories = subcategories ? JSON.parse(subcategories) : [];

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsApp = (phoneNumber) => {
    Linking.openURL(`https://wa.me/${phoneNumber}`);
  };

  const renderHeader = () => (
    <View>
      <View style={styles.upperRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-circle" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <Image
        source={{
          uri:
            parsedSubcategory?.images[0].url ||
            "https://via.placeholder.com/150",
        }}
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.title}>
          {parsedSubcategory?.name || "Producto"}
        </Text>
        <Text style={styles.description}>
          {parsedSubcategory?.description || "Descripción no disponible."}
        </Text>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={24} color="black" />
          <Text style={styles.infoText}>
            {parsedSubcategory?.location || "N/A"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.infoRow}
          onPress={() => handleCall(parsedSubcategory?.phoneNumber)}
        >
          <Ionicons name="call-outline" size={24} color="black" />
          <Text style={styles.infoText}>
            {parsedSubcategory?.phoneNumber || "N/A"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.infoRow}
          onPress={() => handleWhatsApp(parsedSubcategory?.whatsapp)}
        >
          <Ionicons name="logo-whatsapp" size={24} color="black" />
          <Text style={styles.infoText}>
            {parsedSubcategory?.whatsapp || "N/A"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        router.push({
          pathname: "/categorias/SubCategoryDetails",
          params: {
            subcategory: JSON.stringify(item),
            subcategories: JSON.stringify(parsedSubcategories),
          },
        });
      }}
    >
      <Image
        source={{
          uri: item.images[0].url || "https://via.placeholder.com/150",
        }}
        style={styles.itemImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="black" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={parsedSubcategories}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  upperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  details: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
});

export default SubCategoryDetails;
