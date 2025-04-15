import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
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

// Notification Item Component
const NotificationItem = ({ message, type, read, timestamp, onMarkAsRead }) => {
  const getIconAndColor = () => {
    switch (type) {
      case "message":
        return { icon: "message", color: "#00C853" };
      case "update":
        return { icon: "update", color: "#FF9500" };
      case "promotion":
        return { icon: "local-offer", color: "#FF3D00" };
      default:
        return { icon: "notifications", color: "#757575" };
    }
  };

  const { icon, color } = getIconAndColor();
  const formattedDate = new Date(timestamp).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={[styles.notificationCard, !read && styles.unreadNotification]}>
      <View style={styles.notificationContent}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <MaterialIcons name={icon} size={24} color={COLORS.white} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.messageText}>{message}</Text>
          <Text style={styles.timestampText}>{formattedDate}</Text>
        </View>
      </View>
      {!read && (
        <TouchableOpacity onPress={onMarkAsRead} style={styles.readButton}>
          <Text style={styles.readButtonText}>Marcar como leído</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const NotificacionesScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  // Fetch user ID and notifications
  const fetchNotifications = useCallback(async () => {
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

      const response = await axios.get(
        `${API_BASE_URL}/notifications/${parsedId}`,
        {
          headers: {
            // Authorization: `Bearer ${await AsyncStorage.getItem("token")}`, // Uncomment if auth required
          },
        }
      );
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
      Alert.alert("Error", "No se pudieron cargar las notificaciones.");
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            // Authorization: `Bearer ${await AsyncStorage.getItem("token")}`, // Uncomment if auth required
          },
        }
      );
      Alert.alert("Éxito", response.data.message);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error);
      Alert.alert("Error", "No se pudo marcar la notificación como leída.");
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
      <Header onBack={() => router.back()} title="Notificaciones" />
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="notifications-none" size={50} color="#757575" />
          <Text style={styles.emptyText}>No tienes notificaciones</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <NotificationItem
              message={item.message}
              type={item.type}
              read={item.read}
              timestamp={item.createdAt}
              onMarkAsRead={() => markAsRead(item._id)}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

export default NotificacionesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: COLORS.black,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  notificationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: "#00C853",
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 5,
  },
  timestampText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  readButton: {
    marginTop: 10,
    alignSelf: "flex-end",
    backgroundColor: "#00C853",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  readButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
});
