import React from "react";
import { Image, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const SearchSubcategory = ({ item }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        router.push({
          pathname: "/categorias/SubCategoryDetails",
          params: { subcategory: JSON.stringify(item) },
        })
      }
    >
      <Image
        source={{ uri: item.imageUrl || "https://via.placeholder.com/100" }}
        style={styles.subcategoryImg}
      />
      <View style={styles.textContainer}>
        <Text style={styles.subcategoryTitle}>{item.title}</Text>
        <Text style={styles.supplier}>{item.supplier}</Text>
        <Text style={styles.price}>XAF{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  subcategoryImg: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  textContainer: {
    flex: 2,
    paddingLeft: 10,
    justifyContent: "center",
  },
  subcategoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  supplier: {
    fontSize: 14,
    color: "#888",
  },
  price: {
    fontSize: 14,
    color: "#333",
  },
});

export default SearchSubcategory;
