import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../../config/Service.Config";

const UserManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      console.log("Fetching users from:", `${API_BASE_URL}/users`);
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);

      if (error.response) {
        console.error("Server response:", error.response.data);
        setError(
          `Error: ${error.response.status} - ${error.response.data.message}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        setError("No se recibió respuesta del servidor.");
      } else {
        console.error("Error:", error.message);
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/user/${userId}`);
      if (response.status === 200) {
        Alert.alert("Éxito", "Usuario eliminado correctamente");
        // Refrescar la lista de usuarios después de eliminar
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Alert.alert("Error", "No se pudo eliminar el usuario");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c86A8" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuarios</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <Text style={styles.userLocation}>{item.location}</Text>
            <Text style={styles.userMobile}>{item.mobile}</Text>
            <Text style={styles.userType}>{item.userType}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteUser(item._id)}
            >
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  userItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  userLocation: {
    fontSize: 14,
    color: "#666",
  },
  userMobile: {
    fontSize: 14,
    color: "#666",
  },
  userType: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    marginTop: 8,
    backgroundColor: "#FF6347",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF6347",
  },
});

export default UserManagementScreen;
