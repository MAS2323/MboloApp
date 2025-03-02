import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const CategoryMenuScreen = () => {
  const { categoryName, subcategories } = useLocalSearchParams();
  const parsedSubcategories = subcategories ? JSON.parse(subcategories) : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subcategorías de {categoryName}</Text>
      {parsedSubcategories.length > 0 ? (
        <FlatList
          data={parsedSubcategories}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.text}>{item.name}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noData}>No hay subcategorías disponibles</Text>
      )}
    </View>
  );
};

export default CategoryMenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  text: {
    fontSize: 16,
  },
  noData: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});
