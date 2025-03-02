import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import BackBtn from "../../components/providers/BackBtn";
const PerfilHeader = () => {
  const router = useRouter();
  return (
    <View>
      <BackBtn onPress={() => router.back()} style={{ marginTop: 10 }} />
      <View style={[styles.topImageContainer, { marginTop: 51 }]}>
        <Image
          source={require("./../../assets/images/BACKGROUNDStrabajo1.png")}
          style={styles.topImage}
        />
      </View>
    </View>
  );
};

export default PerfilHeader;

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
