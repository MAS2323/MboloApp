import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Linking,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../config/Service.Config";
import { useRouter } from "expo-router";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const TendenciasScreen = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("id");
        if (id) {
          setUserId(id.replace(/\"/g, ""));
        } else {
          console.error("Error: userId is null");
        }
      } catch (error) {
        console.error("Error getting userId from AsyncStorage:", error);
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/menu`);
        const shuffledSubcategories = shuffleArray(response.data);
        setSubcategories(shuffledSubcategories);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, []);

  const handlePress = (subcategory) => {
    router.push({
      pathname: "/cart/DetallesScreen",
      params: { item: JSON.stringify(subcategory) },
    });
  };

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsApp = (phoneNumber) => {
    Linking.openURL(`https://wa.me/${phoneNumber}`);
  };

  const handleFavoritePress = async (item) => {
    try {
      const newFavorites = [...favorites];
      const index = newFavorites.findIndex((fav) => fav._id === item._id);

      if (index > -1) {
        newFavorites.splice(index, 1); // Remove from favorites
        await axios.delete(`${API_BASE_URL}/favorites/${userId}/${item._id}`);
      } else {
        newFavorites.push(item); // Add to favorites
        await axios.post(`${API_BASE_URL}/favorites/${userId}/${item._id}`, {
          userId: userId,
          subcategoryId: item._id,
        });
      }

      setFavorites(newFavorites);
    } catch (error) {
      console.error("Error updating favorites:", error);
      setFavorites([...favorites]);
    }
  };

  const renderItem = ({ item }) => (
    <View key={item._id}>
      <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
        <Image
          source={{
            uri: item.images?.[0]?.url || "https://via.placeholder.com/150",
          }}
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <View style={styles.locationContainer}>
            <Text style={styles.location}>
              Ubicación: {item.location || "N/A"}
            </Text>
            <TouchableOpacity onPress={() => handleFavoritePress(item)}>
              <AntDesign
                name={
                  favorites.some((fav) => fav._id === item._id)
                    ? "heart"
                    : "hearto"
                }
                size={24}
                color="red"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.price}>Precio: ${item.price || "N/A"}</Text>
          <Text style={styles.description}>
            {item.description || "Descripción corta del producto o tendencia."}
          </Text>
          <View style={styles.contactContainer}>
            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={() => handleWhatsApp(item.whatsapp)}
            >
              <Text style={styles.whatsappText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.IconButton}
              onPress={() => handleCall(item.phoneNumber)}
            >
              <MaterialIcons
                name="call"
                size={24}
                color="#007AFF"
                style={styles.callIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tendencias</Text>
      <FlatList
        data={subcategories}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        // contentContainerStyle={styles.listContainer}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
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
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  location: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    color: "#FF6347",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  whatsappButton: {
    backgroundColor: "#25D366",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  whatsappText: {
    color: "#fff",
    fontSize: 14,
  },
  phoneNumber: {
    fontSize: 14,
    color: "#000",
    textDecorationLine: "underline",
  },
  title: {
    textAlign: "left",
    marginTop: 7,
    letterSpacing: 4,
    marginBottom: 5,
    color: "gray",
    fontSize: 20,
  },
  callIcon: {
    color: "#000000",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 50,
    padding: 5,
  },
  IconButton: {
    backgroundColor: "#4c86A8",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
export default TendenciasScreen;
