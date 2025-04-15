import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../config/Service.Config";

// Header Component
const Header = ({ onBack, title }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack}>
      <MaterialIcons name="chevron-left" size={30} color="#00C853" />
    </TouchableOpacity>
    <Text style={styles.headerText}>{title}</Text>
    <View style={{ width: 30 }} /> 
  </View>
);

// Notification Toggle Component
const NotificationToggle = ({ label, value, onValueChange }) => (
  <View style={styles.toggleContainer}>
    <Text style={styles.toggleLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#767577", true: "#00C853" }}
      thumbColor={value ? "#fff" : "#f4f3f4"}
    />
  </View>
);

const ManageNotificationsScreen = () => {
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState({
    messages: true,
    updates: true,
    promotions: false,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user ID and notification preferences
  const loadUserData = useCallback(async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (!id) {
        Alert.alert(
          "Error",
          "No se encontró el usuario. Por favor, inicia sesión nuevamente."
        );
        router.navigate("LoginScreen");
        return;
      }
      const parsedId = JSON.parse(id);
      setUserId(parsedId);

      // Fetch notification preferences
      const response = await axios.get(`${API_BASE_URL}/user/${parsedId}`, {
        headers: {
          // Authorization: `Bearer ${await AsyncStorage.getItem("token")}`, // Uncomment if auth required
        },
      });
      if (response.data.notifications) {
        setNotifications(response.data.notifications);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar preferencias de notificaciones:", error);
      Alert.alert(
        "Error",
        "No se pudieron cargar las preferencias de notificaciones."
      );
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Update notification preferences
  const handleSaveNotifications = async () => {
    if (!userId) {
      Alert.alert("Error", "No se encontró el usuario.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/user/${userId}/notifications`,
        notifications,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${await AsyncStorage.getItem("token")}`, // Uncomment if auth required
          },
        }
      );
      Alert.alert("Éxito", response.data.message);
      router.back(); // Navigate back to previous screen
    } catch (error) {
      console.error(
        "Error al guardar notificaciones:",
        error.response?.data || error.message
      );
      const message =
        error.response?.data?.message ||
        "No se pudieron guardar las preferencias de notificaciones.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={() => router.back()} title="Gestionar Notificaciones" />
      <View style={styles.content}>
        <NotificationToggle
          label="Mensajes"
          value={notifications.messages}
          onValueChange={(value) =>
            setNotifications({ ...notifications, messages: value })
          }
        />
        <NotificationToggle
          label="Actualizaciones de la aplicación"
          value={notifications.updates}
          onValueChange={(value) =>
            setNotifications({ ...notifications, updates: value })
          }
        />
        <NotificationToggle
          label="Promociones y ofertas"
          value={notifications.promotions}
          onValueChange={(value) =>
            setNotifications({ ...notifications, promotions: value })
          }
        />
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSaveNotifications}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Cargando..." : "Guardar"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ManageNotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 16,
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#00C853",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#A5D6A7",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
