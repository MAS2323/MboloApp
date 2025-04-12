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
import { MaterialIcons, AntDesign, Entypo, Feather } from "@expo/vector-icons";
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
        const response = await axios.get(`${API_BASE_URL}/menus`);
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
              <Entypo name="location" size={24} color="#4c86A8" />{" "}
              {item.location
                ? `${item.location.city}, ${item.location.province}`
                : "N/A"}
            </Text>
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
                color="#4c86A8"
                style={styles.callIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.separator} />
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Tendencias</Text>
        <Feather name="trending-up" size={27} color="#4c86A8" />
      </View>
      <FlatList
        data={subcategories}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    // backgroundColor: "#f9f9f9",
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  itemContainer: {
    marginBottom: 0,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 0,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 0,
    marginHorizontal: 0,
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
    // fontWeight: "bold",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
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
    color: "#4c86A8",
    borderWidth: 1,
    borderColor: "#4c86A8",
    borderRadius: 50,
    padding: 4,
    marginRight: 5,
  },
  IconButton: {
    // backgroundColor: "#4c86A8",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  heartIcon: {
    marginRight: 20,
    color: "red",
  },
});
export default TendenciasScreen;
