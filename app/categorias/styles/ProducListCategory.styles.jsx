import { StyleSheet } from "react-native";
import { SIZES, COLORS } from "../../../constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.lightWhite,
    marginTop: 30,
  },
  appBarWrapper: {
    paddingVertical: SIZES.small,
    // backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  subcategoryListContainer: {
    // alignItems: "center",
    paddingBottom: SIZES.medium,
  },
  subcategoryButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    marginRight: SIZES.small,
    borderRadius: 20, // BorderRadius más pronunciado
    backgroundColor: COLORS.softGray, // Color de fondo suave (gris claro)
    shadowColor: COLORS.gray, // Sombra suave
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedSubcategory: {
    backgroundColor: COLORS.primary,
  },
  subcategoryText: {
    fontSize: SIZES.medium,
    color: COLORS.darkGray,
    fontWeight: "500",
    // textAlign: "center",
  },
  selectedSubcategoryText: {
    color: COLORS.white,
  },
  flatListContent: {
    paddingTop: SIZES.medium,
    paddingBottom: SIZES.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.xxLarge,
    width: "100%",
  },
  emptyText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: "center",
  },
});

export default styles;
