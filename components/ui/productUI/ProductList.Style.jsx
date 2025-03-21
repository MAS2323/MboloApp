import { StyleSheet } from "react-native";
import { SIZES, COLORS } from "./../../../constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightwhite,
    marginTop: 30,
  },
  appBarWrapper: {
    paddingVertical: SIZES.small,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  categoryListContainer: {
    paddingHorizontal: SIZES.medium,
  },
  categoryButton: {
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
  selectedCategoryButton: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: SIZES.medium,
    color: COLORS.darkGray,
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: COLORS.white,
  },
  flatListContent: {
    paddingHorizontal: SIZES.medium,
    paddingTop: SIZES.medium,
  },
  separator: {
    height: SIZES.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
