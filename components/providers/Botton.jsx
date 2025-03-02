import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { COLORS } from "./../../constants/theme";

const Botton = ({ title, onPress, isValid, loader }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.btnStyle(isValid === false ? COLORS.gray : COLORS.primary)}
    >
      <View>
        {loader === false ? (
          <Text style={styles.btnTxt}>{title}</Text>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    </TouchableOpacity>
  );
};
export default Botton;

const styles = StyleSheet.create({
  btnTxt: {
    color: COLORS.white,
    fontSize: 18,
  },
  btnStyle: (backgroundColor) => ({
    height: 50,
    width: "80%",
    marginVertical: 20,
    backgroundColor: backgroundColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    margin: 35,
  }),
});
