import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "../../config/Service.Config";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Home/Header";

const TiendaDetalle = () => {
  const { id } = useLocalSearchParams();
  const [tienda, setTienda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pestañaActiva, setPestañaActiva] = useState("recomendados");
  const [productos, setProductos] = useState([]);
  const [visibleProductos, setVisibleProductos] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Para el loading de más productos

  // Cargar datos de la tienda
  useEffect(() => {
    const cargarTienda = async () => {
      try {
        const url = `${API_BASE_URL}/tienda/${id}`;
        const response = await axios.get(url);
        setTienda(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar la tienda:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    cargarTienda();
  }, [id]);

  // Simulación de carga inicial de productos (reemplazar con API real si existe)
  useEffect(() => {
    const cargarProductosIniciales = async () => {
      try {
        // Simulación de datos iniciales (puedes reemplazar con una llamada a la API)
        const productosIniciales = [
          {
            id: 1,
            nombre: "Silla Plegable",
            descripcion: "Producto premium de exportación",
            precio: 39,
            ventas: 100,
            imagen: "https://via.placeholder.com/150",
            categoria: "hogar",
            nuevo: false,
            valoracion: 4.5,
            envioRapido: true,
          },
          {
            id: 2,
            nombre: "Sandalias",
            descripcion: "Las más vendidas este verano",
            precio: 25,
            ventas: 350,
            imagen: "https://via.placeholder.com/150",
            categoria: "calzado",
            nuevo: true,
            valoracion: 4.8,
            envioRapido: true,
          },
        ];
        setProductos(productosIniciales);
        setVisibleProductos(productosIniciales.slice(0, 2)); // Carga inicial: 2 productos
      } catch (err) {
        console.error("Error al cargar productos iniciales:", err.message);
      }
    };

    cargarProductosIniciales();
  }, []);

  // Cargar más productos progresivamente
  const loadMoreProductos = useCallback(() => {
    if (visibleProductos.length < productos.length && !isLoadingMore) {
      setIsLoadingMore(true);
      // Simulación de carga desde la base de datos (reemplazar con API real si existe)
      setTimeout(() => {
        const nextProductos = productos.slice(
          visibleProductos.length,
          visibleProductos.length + 2
        ); // Cargar 2 productos a la vez
        setVisibleProductos((prev) => [...prev, ...nextProductos]);
        setIsLoadingMore(false);
      }, 1000); // Retraso para simular llamada a la API
    }
  }, [visibleProductos, productos, isLoadingMore]);

  const renderizarProducto = useCallback(
    ({ item }) => (
      <TouchableOpacity style={styles.tarjetaProducto}>
        <Image source={{ uri: item.imagen }} style={styles.imagenProducto} />
        <View style={styles.infoProducto}>
          <Text style={styles.tituloProducto}>{item.nombre}</Text>
          <Text style={styles.descripcionProducto}>{item.descripcion}</Text>

          {item.nuevo && (
            <View style={styles.etiquetaNuevo}>
              <Text style={styles.textoEtiquetaNuevo}>NUEVO</Text>
            </View>
          )}

          <View style={styles.metaProducto}>
            <View style={styles.datosProducto}>
              <Text style={styles.ventasProducto}>
                🔥 {item.ventas}+ vendidos
              </Text>
              {item.envioRapido && (
                <Text style={styles.envioRapido}>Envío rápido</Text>
              )}
            </View>
            <Text style={styles.precioProducto}>${item.precio}</Text>
          </View>

          <View style={styles.valoracionContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.textoValoracion}>{item.valoracion}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    []
  );

  // Componente para el indicador de carga en el footer
  const renderFooter = useCallback(() => {
    return isLoadingMore ? (
      <View style={styles.contenedorCarga}>
        <ActivityIndicator size="large" color="#4c86A8" />
      </View>
    ) : null;
  }, [isLoadingMore]);

  // Componente para el encabezado de la lista
  const ListHeader = () => (
    <>
      {/* Banner de la tienda */}
      {tienda?.banner?.url && (
        <Image source={{ uri: tienda.banner.url }} style={styles.banner} />
      )}

      {/* Encabezado con logo y nombre */}
      <View style={styles.encabezado}>
        <View style={styles.infoTienda}>
          {tienda?.logo?.url && (
            <Image source={{ uri: tienda.logo.url }} style={styles.logo} />
          )}
          <View style={styles.datosTienda}>
            <Text style={styles.nombreTienda}>{tienda.name}</Text>
            <Text style={styles.propietarioTienda}>
              Vendedor: {tienda.owner?.userName || "Anónimo"}
            </Text>
          </View>
        </View>

        {/* Estadísticas de la tienda */}
        <View style={styles.estadisticas}>
          <View style={styles.itemEstadistica}>
            <Text style={styles.valorEstadistica}>🔥 16.0K</Text>
            <Text style={styles.etiquetaEstadistica}>seguidores</Text>
          </View>
          <View style={styles.itemEstadistica}>
            <Text style={styles.valorEstadistica}>6K</Text>
            <Text style={styles.etiquetaEstadistica}>reseñas</Text>
          </View>
          <View style={styles.itemEstadistica}>
            <Text style={styles.valorEstadistica}>20h</Text>
            <Text style={styles.etiquetaEstadistica}>envío</Text>
          </View>
        </View>
      </View>

      {/* Pestañas de navegación */}
      <View style={styles.contenedorPestañas}>
        {["Recomendados", "Productos", "Categorías", "Nuevos"].map(
          (pestaña) => (
            <TouchableOpacity
              key={pestaña}
              style={[
                styles.pestaña,
                pestañaActiva === pestaña.toLowerCase() && styles.pestañaActiva,
              ]}
              onPress={() => setPestañaActiva(pestaña.toLowerCase())}
            >
              <Text
                style={[
                  styles.textoPestaña,
                  pestañaActiva === pestaña.toLowerCase() &&
                    styles.textoPestañaActiva,
                ]}
              >
                {pestaña}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </>
  );

  if (loading) {
    return (
      <View style={styles.contenedorCarga}>
        <ActivityIndicator size="large" color="#4c86A8" />
      </View>
    );
  }

  if (error || !tienda) {
    return (
      <View style={styles.contenedorError}>
        <Text style={styles.textoError}>
          {error || "No se pudo cargar la tienda."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Header title="Tienda" />
      <FlatList
        data={visibleProductos}
        renderItem={renderizarProducto}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listaProductos}
        showsVerticalScrollIndicator={false}
        // Carga progresiva
        initialNumToRender={2} // Renderiza solo 2 productos inicialmente
        maxToRenderPerBatch={2} // Renderiza 2 productos por lote
        windowSize={5} // Mantiene 5 elementos en memoria
        removeClippedSubviews={true} // Elimina elementos fuera de pantalla
        onEndReached={loadMoreProductos} // Carga más al llegar al final
        onEndReachedThreshold={0.5} // Dispara carga al 50% del final
        ListFooterComponent={renderFooter} // Indicador de carga
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    marginTop: 30,
  },
  contenedorCarga: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contenedorError: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  textoError: {
    fontSize: 16,
    color: "#ff4d4f",
    textAlign: "center",
  },
  encabezado: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoTienda: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  datosTienda: {
    flex: 1,
  },
  nombreTienda: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  propietarioTienda: {
    fontSize: 14,
    color: "#666",
  },
  estadisticas: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 20,
  },
  itemEstadistica: {
    alignItems: "center",
  },
  valorEstadistica: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff4d4f",
  },
  etiquetaEstadistica: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  banner: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  contenedorPestañas: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginHorizontal: 10,
  },
  pestaña: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  pestañaActiva: {
    borderBottomColor: "#ff4d4f",
  },
  textoPestaña: {
    fontSize: 14,
    color: "#666",
  },
  textoPestañaActiva: {
    color: "#ff4d4f",
    fontWeight: "bold",
  },
  listaProductos: {
    paddingBottom: 20,
  },
  tarjetaProducto: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imagenProducto: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  infoProducto: {
    flex: 1,
    justifyContent: "space-between",
  },
  tituloProducto: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  descripcionProducto: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  etiquetaNuevo: {
    alignSelf: "flex-start",
    backgroundColor: "#ff4d4f",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  textoEtiquetaNuevo: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  metaProducto: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  datosProducto: {
    flex: 1,
  },
  ventasProducto: {
    fontSize: 12,
    color: "#ff4d4f",
    marginBottom: 4,
  },
  envioRapido: {
    fontSize: 11,
    color: "#4CAF50",
  },
  precioProducto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff4d4f",
  },
  valoracionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  textoValoracion: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
});

export default TiendaDetalle;
