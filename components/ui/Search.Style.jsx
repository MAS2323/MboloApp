import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  searchInput: {
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.small,
  },
  searchIcon: {
    marginHorizontal: 10,
    color: COLORS.gray,
    marginTop: SIZES.small,
  },
  searchIconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    marginVertical: SIZES.medium,
    height: 50,
    marginHorizontal: 12,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    marginRight: SIZES.small,
    borderRadius: SIZES.small,
  },
  searchBtn: {
    width: 50,
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  searchImage: {
    resizeMode: "contain",
    width: SIZES.width - 10,
    height: SIZES.height - 300,
    opacity: 0.9,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
