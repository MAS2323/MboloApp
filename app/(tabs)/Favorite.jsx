import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
  FlatList,
} from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "./../../config/Service.Config";
import { useRouter } from "expo-router";

const Favorite = () => {
  const [userId, setUserId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("id");
        if (id) {
          setUserId(id.replace(/\"/g, ""));
        }
      } catch (error) {
        console.error("Error retrieving userId from AsyncStorage:", error);
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/favorites/${userId}`);

      // Asegúrate de que siempre haya un objeto con subcategories
      const favoritesData = response.data?.subcategories || [];
      setFavorites(favoritesData);
    } catch (error) {
      console.error(
        "Error fetching favorites:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        "Failed to fetch favorites. Please try again later."
      );
      setFavorites([]);
    }
  };

  const handleRemoveFavorite = async (subcategoryId) => {
    try {
      const userId = await AsyncStorage.getItem("id");
      const cleanedUserId = userId ? userId.replace(/\"/g, "") : null;

      await axios.delete(
        `${API_BASE_URL}/favorites/${userId}/${subcategoryId}`,
        {
          data: { userId: cleanedUserId, subcategoryId },
        }
      );
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav._id !== subcategoryId)
      );
      Alert.alert("Removed", "The item has been removed from favorites.");
    } catch (error) {
      console.error(
        "Error removing favorite:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        "Failed to remove favorite. Please try again later."
      );
    }
  };

  const handlePressItem = async (favorite) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subcategories/${favorite._id}`
      );
      const selectedSubcategory = response.data;
      router.push("/cart/DetallesScreen", {
        item: selectedSubcategory,
      });
    } catch (error) {
      console.error("Error fetching subcategory details:", error);
      Alert.alert("Error", "Failed to fetch subcategory details.");
    }
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePressItem(item)}>
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Remove from Favorites",
              `Are you sure you want to remove this item from favorites?`,
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Remove",
                  onPress: () => handleRemoveFavorite(item._id),
                  style: "destructive",
                },
              ]
            )
          }
        >
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item._id}
        renderItem={renderFavoriteItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await fetchFavorites();
              setRefreshing(false);
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={require("./../../assets/images/faraitos.jpeg")}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>Aún no hay favoritos.</Text>
          </View>
        }
      />
    </View>
  );
};

export default Favorite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 32,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyImage: {
    width: 200,
    height: 200,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#000",
    marginTop: 20,
  },
});
