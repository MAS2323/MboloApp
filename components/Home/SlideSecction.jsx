import React from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import styles from "../ui/SlideSecction.Style";
import { useRouter } from "expo-router";

const SlideSecction = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={{
            textAlign: "center",
            marginTop: 7,
            letterSpacing: 4,
            marginBottom: 5,
            color: "gray",
            fontSize: 20,
          }}
        >
          Vende y Compra!
        </Text>
        <TouchableOpacity onPress={() => router.push("/cart/ProductList")}>
          <Ionicons name="grid" size={24} color="#4c86A8" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SlideSecction;
