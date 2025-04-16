import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

const MisPedidosScreen = () => {
  const router = useRouter();

  // Datos simulados de pedidos
  const pedidos = [
    {
      id: "PED001",
      fecha: "15 de abril de 2025",
      estado: "Entregado",
      total: 150.0,
      items: [
        { nombre: "Producto 1", cantidad: 2 },
        { nombre: "Producto 2", cantidad: 1 },
      ],
    },
    {
      id: "PED002",
      fecha: "10 de abril de 2025",
      estado: "En tránsito",
      total: 89.99,
      items: [{ nombre: "Producto 3", cantidad: 1 }],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#00C853" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Pedidos</Text>
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Lista de pedidos */}
      <ScrollView style={styles.content}>
        {pedidos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes pedidos realizados</Text>
          </View>
        ) : (
          pedidos.map((pedido) => (
            <View key={pedido.id} style={styles.pedidoCard}>
              <View style={styles.pedidoHeader}>
                <Text style={styles.pedidoId}>Pedido #{pedido.id}</Text>
                <Text
                  style={[
                    styles.estado,
                    pedido.estado === "Entregado"
                      ? styles.estadoEntregado
                      : styles.estadoEnTransito,
                  ]}
                >
                  {pedido.estado}
                </Text>
              </View>
              <Text style={styles.fecha}>Fecha: {pedido.fecha}</Text>
              <Text style={styles.total}>
                Total: ${pedido.total.toFixed(2)}
              </Text>
              <View style={styles.itemsContainer}>
                <Text style={styles.itemsTitle}>Artículos:</Text>
                {pedido.items.map((item, index) => (
                  <Text key={index} style={styles.item}>
                    - {item.nombre} (Cant.: {item.cantidad})
                  </Text>
                ))}
              </View>
              <TouchableOpacity style={styles.verDetallesButton}>
                <Text style={styles.verDetallesText}>Ver detalles</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MisPedidosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#E8F0FE",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    // backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  pedidoCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#D3D3D3",
  },
  pedidoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  pedidoId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  estado: {
    fontSize: 14,
    fontWeight: "600",
    padding: 5,
    borderRadius: 5,
  },
  estadoEntregado: {
    backgroundColor: "#E8F5E9",
    color: "#4CAF50",
  },
  estadoEnTransito: {
    backgroundColor: "#FFF3E0",
    color: "#FF9800",
  },
  fecha: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  total: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    marginBottom: 10,
  },
  itemsContainer: {
    marginBottom: 10,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  item: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
  },
  verDetallesButton: {
    backgroundColor: "#E8F0FE",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  verDetallesText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
});
