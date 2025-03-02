import { StyleSheet } from "react-native";
import { SIZES, COLORS } from "./../../../constants/theme";

const styles = StyleSheet.create({
  // // Contenedor principal
  // container: {
  //   flex: 1,
  //   backgroundColor: COLORS.lightwhite, // Fondo claro para mejor contraste
  //   paddingHorizontal: SIZES.small, // Padding horizontal para evitar que el contenido toque los bordes
  //   paddingTop: SIZES.xxLarge, // Espacio superior para el botón de retroceso
  // },

  // // Contenedor de carga
  // loadingContainer: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: COLORS.lightwhite, // Fondo claro para consistencia
  // },

  // // Fila superior (botón de retroceso)
  // upperRow: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   paddingVertical: SIZES.small, // Padding vertical para mejor espaciado
  //   paddingHorizontal: SIZES.medium, // Padding horizontal para mejor espaciado
  //   backgroundColor: COLORS.secondary, // Color de fondo para destacar la barra
  //   borderRadius: SIZES.small, // Bordes redondeados
  //   marginBottom: SIZES.medium, // Margen inferior para separar del contenido
  //   shadowColor: COLORS.black, // Sombra para dar profundidad
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 3, // Sombra en Android
  //   marginTop: 20,
  // },

  // // Separador entre elementos de la lista
  // separator: {
  //   height: SIZES.medium, // Espaciado vertical entre productos
  // },

  // // Estilo para el FlatList
  // flatListContent: {
  //   paddingBottom: SIZES.xxLarge, // Padding inferior para evitar que el contenido se corte
  // },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightwhite,
    marginTop: 25,
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
