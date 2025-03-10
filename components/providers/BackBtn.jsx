import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "./../../constants/theme";
import { useNavigation } from "@react-navigation/native";

const BackBtn = (onPress) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.backbtn}
    >
      <Ionicons name="chevron-back-circle" size={32} color={COLORS.secondary} />
    </TouchableOpacity>
  );
};

export default BackBtn;

const styles = StyleSheet.create({
  backbtn: {
    alignItems: "center",
    position: "absolute",
    zIndex: 999,
    top: SIZES.large + 30,
    marginHorizontal: 10,
  },
});
