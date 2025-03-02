import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";

const styles = StyleSheet.create({
  searchBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
    alignContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    borderRadius: 10,
    color: "black",
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  appBarWrapper: {
    marginHorizontal: 22,
    marginTop: SIZES.small,
  },
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartCount: {
    position: "absolute",
    bottom: 16,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "green",
    justifyContent: "center",
    zIndex: 99,
  },
  cartNumber: {
    fontWeight: "600",
    fontSize: 10,
    color: COLORS.lightwhite,
  },
  location: {
    textAlign: "center",
    marginTop: 7,
    letterSpacing: 4,
    marginBottom: 5,
    color: "gray",
    fontSize: 20,
  },
});

export default styles;
