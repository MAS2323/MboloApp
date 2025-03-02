import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "./../../../constants/theme";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    justifyContent: "center", // Centra el contenido verticalmente
    alignItems: "center", // Centra el contenido horizontalmente
    paddingHorizontal: 20,
  },
  mboloText: {
    textAlign: "center",
    fontSize: 70,
    fontWeight: "500",
    color: "#4c86A8",
    marginTop: 0, // Elimina el margen superior para centrar mejor
  },
  text_header: {
    color: "#4c86A8",
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 20,
  },
  wrapper: {
    width: "100%",
    maxWidth: 400,
  },
  action: (borderColor) => ({
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: borderColor,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
    backgroundColor: COLORS.lightwhite,
  }),
  textInput: {
    flex: 1,
    color: "#4c86A8",
    marginLeft: 10,
  },
  smallIcon: {
    marginRight: 10,
    fontSize: 24,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  registration: {
    marginTop: 20,
    textAlign: "center",
    color: COLORS.gray,
    fontSize: 16,
  },
  keyboardAvoidingView: {
    flex: 1, // Ocupa toda la pantalla
    justifyContent: "center", // Centra el contenido verticalmente
  },
});

export default styles;
