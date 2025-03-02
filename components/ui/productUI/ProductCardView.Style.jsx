import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "./../../../constants/theme";

const styles = StyleSheet.create({
  container: {
    width: 182,
    height: 240,
    marginEnd: 22,
    borderRadius: SIZES.medium,
    backgroundColor: COLORS.secondary,
  },
  imageContainer: {
    flex: 1,
    width: 170,
    marginLeft: SIZES.small / 2,
    marginTop: SIZES.small / 2,
    borderRadius: SIZES.small,
    overflow: "hidden",
  },
  image: {
    aspectRatio: 1,
    resizeMode: "cover",
  },
  details: {
    padding: SIZES.small,
  },
  title: {
    fontSize: SIZES.large,
    marginBottom: 2,
  },
  supplier: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  price: {
    fontSize: SIZES.medium,
  },
  addBtn: {
    position: "absolute",
    bottom: SIZES.xSmall,
    right: SIZES.xSmall,
  },
});

export default styles;

// const styles = StyleSheet.create({
//   container: {
//     width: 182,
//     height: 240,
//     marginEnd: 22,
//     borderRadius: SIZES.medium,
//     backgroundColor: COLORS.secondary,
//     overflow: "hidden", // Asegura que el contenido no se desborde
//   },
//   imageContainer: {
//     width: "100%",
//     height: 150, // Altura fija para la imagen
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: COLORS.lightGray, // Color de fondo si no hay imagen
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover", // Ajusta la imagen para cubrir el contenedor
//   },
//   noImageText: {
//     fontSize: SIZES.small,
//     color: COLORS.gray,
//     textAlign: "center",
//   },
//   details: {
//     padding: SIZES.small,
//   },
//   title: {
//     fontSize: SIZES.large,
//     marginBottom: 2,
//     fontWeight: "bold", // Añade negrita al título
//   },
//   supplier: {
//     fontSize: SIZES.small,
//     color: COLORS.gray,
//     marginBottom: 4, // Espacio adicional entre el proveedor y el precio
//   },
//   price: {
//     fontSize: SIZES.medium,
//     fontWeight: "bold", // Añade negrita al precio
//     color: COLORS.primary, // Cambia el color del precio
//   },
//   addBtn: {
//     position: "absolute",
//     bottom: SIZES.xSmall,
//     right: SIZES.xSmall,
//   },
// });

// export default styles;
