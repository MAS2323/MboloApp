import { Image, View, TouchableOpacity, Text } from "react-native";
import React from "react";
import styles from "../../components/ui/SearchTile.Style";
import { useRouter } from "expo-router";

const SearchTile = ({ item }) => {
  const router = useRouter();

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() =>
          router.push({
            pathname: "/cart/ProductDetails",
            params: { item: JSON.stringify(item) }, // Convertir a JSON
          })
        }
      >
        <View style={styles.image}>
          <Image
            source={{ uri: item.images[0].url }}
            style={styles.productImg}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.productTitle}>{item.title}</Text>
          <Text style={styles.supplier}>{item.supplier}</Text>
          <Text style={styles.supplier}>XAF{item.price}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SearchTile;
