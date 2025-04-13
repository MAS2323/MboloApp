import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";

const TiendaScreen = () => {
  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.tiendaNombre}>GD Tienda</Text>
        <Text style={styles.seguidores}>3368 seguidores</Text>
      </View>

      {/* Menú de navegación */}
      <View style={styles.menuNav}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Recomendados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Productos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Categorías</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Novedades</Text>
        </TouchableOpacity>
      </View>

      {/* Sección de destacados */}
      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>Productos Destacados</Text>
        <Text style={styles.seccionSubtitulo}>
          Lo más vendido | Mejor valorados | Imprescindibles
        </Text>
        <Text style={styles.seccionInfo}>52 personas ya compraron</Text>
      </View>

      <ScrollView>
        {/* Lista de productos */}
        <ProductoItem
          nombre="Nuevas sandalias de verano"
          precio="11.9€"
          info="41 personas compraron"
        />

        <ProductoItem nombre="Chanclas unisex Duck" precio="8.9€" />

        <ProductoItem nombre="SUPERS Nuevas de verano" precio="11€" />

        <ProductoItem nombre="Shushi de tela Shibuya" precio="8.9€" />

        <ProductoItem nombre="Chanclas Shibuya para hombre" precio="11.9€" />

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Artículos imprescindibles</Text>
          <ProductoItem
            nombre="Nuevas sandalias de baño para verano"
            precio="11€"
          />
        </View>
      </ScrollView>

      {/* Menú inferior */}
      <View style={styles.menuInferior}>
        <TouchableOpacity style={styles.menuInferiorItem}>
          <Text style={styles.menuInferiorText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuInferiorItem}>
          <Text style={styles.menuInferiorText}>Productos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuInferiorItem}>
          <Text style={styles.menuInferiorText}>Reseñas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuInferiorItem}>
          <Text style={styles.menuInferiorText}>Atención al cliente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Componente para cada producto
const ProductoItem = ({ nombre, precio, info }) => {
  return (
    <TouchableOpacity style={styles.productoContainer}>
      <View style={styles.productoInfo}>
        <Text style={styles.productoNombre}>{nombre}</Text>
        {info && <Text style={styles.productoInfoExtra}>{info}</Text>}
      </View>
      <Text style={styles.productoPrecio}>{precio}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tiendaNombre: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  seguidores: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  menuNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItem: {
    paddingHorizontal: 10,
  },
  menuItemText: {
    fontSize: 14,
    color: "#333",
  },
  seccion: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  seccionSubtitulo: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  seccionInfo: {
    fontSize: 12,
    color: "#ff6600",
  },
  productoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productoInfo: {
    flex: 1,
  },
  productoNombre: {
    fontSize: 14,
    color: "#333",
  },
  productoInfoExtra: {
    fontSize: 12,
    color: "#ff6600",
    marginTop: 5,
  },
  productoPrecio: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff6600",
  },
  menuInferior: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  menuInferiorItem: {
    paddingHorizontal: 10,
  },
  menuInferiorText: {
    fontSize: 12,
    color: "#666",
  },
});

export default TiendaScreen;
