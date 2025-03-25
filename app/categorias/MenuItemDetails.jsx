import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";
import * as Linking from "expo-linking";

const MenuItemDetails = () => {
  const { id } = useLocalSearchParams(); // Obtiene el id desde la navegación
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener los detalles del menú por ID
  useEffect(() => {
    const fetchMenuDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/menus/${id}`);
        setMenuItem(response.data);
      } catch (err) {
        setError("Error al obtener los detalles del menú.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMenuDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Sección de imagen principal */}
      {menuItem && menuItem.images && menuItem.images.length > 0 && (
        <Image
          source={{ uri: menuItem.images[0]?.uri }}
          style={styles.mainImage}
        />
      )}

      {/* Información del menú */}
      <View style={styles.infoContainer}>
        {/* Título */}
        <Text style={styles.title}>{menuItem.name}</Text>

        {/* Ubicación */}
        <Text style={styles.location}>
          📍 {menuItem.location?.city}, {menuItem.location?.province}
        </Text>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <Button
            title="Llamar"
            onPress={() => Linking.openURL(`tel:${menuItem.phoneNumber}`)}
          />
          <Button
            title="WhatsApp"
            onPress={() =>
              Linking.openURL(`https://wa.me/${menuItem.whatsapp}`)
            }
          />
        </View>
      </View>

      {/* Descripción */}
      <Text style={styles.description}>{menuItem.description}</Text>

      {/* Horarios */}
      <Text style={styles.subtitle}>🕒 Horarios:</Text>
      {menuItem.schedule?.map((item, index) => (
        <Text key={index} style={styles.schedule}>
          {item.day}: {item.open} - {item.close}
        </Text>
      ))}

      {/* Más imágenes */}
      <FlatList
        data={menuItem.images.slice(1)} // Excluimos la primera imagen ya mostrada
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.image} />
        )}
      />
    </ScrollView>
  );
};

// Componente Button personalizado
const Button = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

export default MenuItemDetails;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  mainImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    marginBottom: 16,
  },
  infoContainer: {
    marginVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    width: "45%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  schedule: {
    fontSize: 14,
    color: "#444",
    marginBottom: 5,
  },
  image: {
    width: 200,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
