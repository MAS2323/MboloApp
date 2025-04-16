import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "../../config/Service.Config";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Home/Header";

// Colores definidos (usando la paleta original proporcionada)
const COLORS = {
  primary: "#4c86A8",
  secondary: "#DDF0FF",
  tertiary: "#FF7754",
  gray: "#83829A",
  gray2: "#C1C0C8",
  offwhite: "#F3F4F8",
  white: "#FFFFFF",
  black: "#000000",
  red: "#e81e4d",
  green: "#00C135",
  lightwhite: "#FAFAFC",
};

const TiendaDetalle = () => {
  const { id } = useLocalSearchParams();
  const [tienda, setTienda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pestañaActiva, setPestañaActiva] = useState("recomendados");
  const [productos, setProductos] = useState([]);
  const [visibleProductos, setVisibleProductos] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Cargar datos de la tienda
  useEffect(() => {
    const cargarTienda = async () => {
      try {
        const url = `${API_BASE_URL}/tienda/${id}`;
        const response = await axios.get(url);
        const data = response.data;

        const tiendaData = {
          banner: { url: data.banner?.url },
          logo: { url: data.logo?.url },
          name: data.name,
          descripcion: data.description,
          telefono: data.phone_number,
          direccion: data.address?.name || "No disponible",
          specific_location: data.specific_location,
          propietario: data.owner?.userName || "Anónimo",
          owner: data.owner,
        };

        setTienda(tiendaData);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar la tienda:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    cargarTienda();
  }, [id]);

  // Simulación de carga inicial de productos
  useEffect(() => {
    const cargarProductosIniciales = async () => {
      try {
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
        setVisibleProductos(productosIniciales.slice(0, 2));
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
      setTimeout(() => {
        const nextProductos = productos.slice(
          visibleProductos.length,
          visibleProductos.length + 2
        );
        setVisibleProductos((prev) => [...prev, ...nextProductos]);
        setIsLoadingMore(false);
      }, 1000);
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

  const renderFooter = useCallback(() => {
    return isLoadingMore ? (
      <View style={styles.contenedorCarga}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    ) : null;
  }, [isLoadingMore]);

  const ListHeader = () => (
    <>
      {/* Banner de la tienda */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        {tienda?.banner?.url ? (
          <Image source={{ uri: tienda.banner.url }} style={styles.banner} />
        ) : (
          <View style={[styles.banner, styles.placeholderImage]}>
            <Ionicons name="panorama-outline" size={40} color={COLORS.gray} />
          </View>
        )}
      </TouchableOpacity>

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
        <ActivityIndicator size="large" color={COLORS.primary} />
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
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={5}
        removeClippedSubviews={true}
        onEndReached={loadMoreProductos}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />

      {/* Modal para mostrar el banner y los detalles */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {tienda?.banner?.url ? (
            <Image
              source={{ uri: tienda.banner.url }}
              style={styles.modalBannerBackground}
              blurRadius={5}
            />
          ) : (
            <View
              style={[styles.modalBannerBackground, styles.placeholderImage]}
            >
              <Ionicons name="panorama-outline" size={40} color={COLORS.gray} />
            </View>
          )}
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalLogoContainer}>
                {tienda?.logo?.url && (
                  <Image
                    source={{ uri: tienda.logo.url }}
                    style={styles.modalLogo}
                  />
                )}
                <Text style={styles.modalTitle}>{tienda.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalDetailsContainer}>
              <View style={styles.tiendaDetails}>
                <Text style={styles.tiendaLabel}>Descripción:</Text>
                <Text style={styles.tiendaText}>{tienda.descripcion}</Text>
                <Text style={styles.tiendaLabel}>Teléfono:</Text>
                <Text style={styles.tiendaText}>{tienda.telefono}</Text>
                <Text style={styles.tiendaLabel}>Dirección:</Text>
                <Text style={styles.tiendaText}>{tienda.direccion}</Text>
                {tienda.specific_location && (
                  <>
                    <Text style={styles.tiendaLabel}>
                      Ubicación Específica:
                    </Text>
                    <Text style={styles.tiendaText}>
                      {tienda.specific_location}
                    </Text>
                  </>
                )}
                <Text style={styles.tiendaLabel}>Propietario:</Text>
                <Text style={styles.tiendaText}>{tienda.propietario}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORS.offwhite, // Usando offwhite de la paleta original
    marginTop: 30,
  },
  contenedorCarga: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.offwhite,
  },
  contenedorError: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.offwhite,
  },
  textoError: {
    fontSize: 16,
    color: COLORS.red,
    textAlign: "center",
  },
  encabezado: {
    padding: 15,
    backgroundColor: COLORS.white, // Fondo blanco semi-transparente
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTienda: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: COLORS.primary, // Borde usando primary (azul)
  },
  datosTienda: {
    flex: 1,
  },
  nombreTienda: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 5,
  },
  propietarioTienda: {
    fontSize: 14,
    color: COLORS.gray,
  },
  estadisticas: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  itemEstadistica: {
    alignItems: "center",
  },
  valorEstadistica: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 3,
  },
  etiquetaEstadistica: {
    fontSize: 12,
    color: COLORS.gray,
  },
  banner: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
    borderRadius: 10,
    marginVertical: 10,
  },
  contenedorPestañas: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 5,
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },
  pestaña: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  pestañaActiva: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary, // Línea usando primary (azul)
  },
  textoPestaña: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: "600",
  },
  textoPestañaActiva: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  listaProductos: {
    paddingBottom: 20,
  },
  tarjetaProducto: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
    marginHorizontal: 10,
    shadowColor: COLORS.black,
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
    color: COLORS.black,
    marginBottom: 4,
  },
  descripcionProducto: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 8,
  },
  etiquetaNuevo: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary, // Usando primary (azul)
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  textoEtiquetaNuevo: {
    fontSize: 10,
    color: COLORS.white,
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
    color: COLORS.red,
    marginBottom: 4,
  },
  envioRapido: {
    fontSize: 11,
    color: COLORS.green,
  },
  precioProducto: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.red,
  },
  valoracionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  textoValoracion: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 4,
  },
  placeholderImage: {
    backgroundColor: COLORS.lightwhite,
    justifyContent: "center",
    alignItems: "center",
  },
  // Estilos para el modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBannerBackground: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fondo semi-transparente
    borderRadius: 12,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  modalLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: COLORS.primary, // Borde usando primary (azul)
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
  },
  modalDetailsContainer: {
    padding: 15,
  },
  tiendaDetails: {
    padding: 10,
  },
  tiendaLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginTop: 10,
    marginBottom: 5,
  },
  tiendaText: {
    fontSize: 16,
    color: COLORS.gray,
    lineHeight: 22,
  },
});

export default TiendaDetalle;
