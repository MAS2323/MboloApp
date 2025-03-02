import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightwhite,
  },
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.lightwhite,
  },
  upperRow: {
    width: SIZES.width - 50,
    marginHorizontal: SIZES.large,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "absolute",
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.large,
    top: SIZES.large,
    zIndex: 999,
    padding: SIZES.small,
  },
  heading: {
    fontSize: SIZES.medium,
    color: COLORS.lightwhite,
    marginLeft: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: SIZES.large + 50, // Ajusta este valor según sea necesario para que el contenido no quede oculto detrás de `upperRow`
  },
});

export default styles;
