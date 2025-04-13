import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "./../../../constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.lightwhite,
    marginTop: 25,
  },
  upperRow: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: SIZES.xxLarge,
    width: SIZES.width - 44,
    zIndex: 999,
  },
  imageContainer: {
    width: SIZES.width, // Ancho igual al ancho de la pantalla
    height: SIZES.width, // Altura igual al ancho de la pantalla (para imágenes cuadradas)
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Ajusta la imagen para cubrir el contenedor
  },
  details: {
    flex: 1,
    marginTop: -SIZES.large,
    backgroundColor: COLORS.lightwhite,
    width: SIZES.width,
    borderTopLeftRadius: SIZES.medium,
    borderTopRightRadius: SIZES.medium,
    padding: SIZES.medium,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.small,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: "bold",
  },
  priceWrapper: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.large,
    paddingHorizontal: SIZES.small,
  },
  price: {
    paddingHorizontal: 10,
    fontSize: SIZES.large,
    padding: 10,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: SIZES.small,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: SIZES.xSmall,
    color: COLORS.gray,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  descriptionWrapper: {
    marginVertical: SIZES.large,
  },
  description: {
    fontSize: SIZES.medium,
    textAlign: "justify",
  },
  locationWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    padding: SIZES.small,
    borderRadius: SIZES.large,
    marginBottom: SIZES.small,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartBtn: {
    width: SIZES.width * 0.7,
    backgroundColor: COLORS.black,
    padding: SIZES.small / 2,
    borderRadius: SIZES.large,
    marginLeft: 12,
  },
  cartTitle: {
    fontSize: SIZES.medium,
    color: COLORS.lightwhite,
    marginLeft: SIZES.small,
  },
  counterText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  addCart: {
    width: 37,
    height: 37,
    borderRadius: SIZES.large,
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SIZES.large,
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactText: {
    marginLeft: SIZES.small,
    color: COLORS.blue,
    fontSize: SIZES.medium,
  },
});

export default styles;
