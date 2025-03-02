import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import BackBtn from "../providers/BackBtn";
const RegisterHeader = () => {
  const router = useRouter();
  return (
    <View>
      <BackBtn onPress={() => router.back()} />
      <View style={[styles.topImageContainer, { marginTop: 51 }]}>
        <Image
          source={require("./../../assets/images/BACKGROUNDS-02.png")}
          style={styles.topImage}
        />
      </View>
    </View>
  );
};

export default RegisterHeader;

const styles = StyleSheet.create({
  topImageContainer: {
    position: "absolute",
    top: 2,
    padding: 7,
  },
  topImage: {
    width: "100%",
    height: 150,
    resizeMode: "stretch",
  },
});
