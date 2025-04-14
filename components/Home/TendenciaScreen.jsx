import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Linking,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Entypo, Feather } from "@expo/vector-icons";
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
  const [visibleItems, setVisibleItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Estado para el loading
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
        setVisibleItems(shuffledSubcategories.slice(0, 5)); // Carga inicial: 5 elementos
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, []);

  // Cargar más elementos cuando se llegue al final
  const loadMoreItems = useCallback(() => {
    if (visibleItems.length < subcategories.length && !isLoadingMore) {
      setIsLoadingMore(true); // Mostrar el spinner
      // Simular un pequeño retraso para que el loading sea visible (opcional)
      setTimeout(() => {
        const nextItems = subcategories.slice(
          visibleItems.length,
          visibleItems.length + 3
        ); // Cargar 3 elementos a la vez
        setVisibleItems((prev) => [...prev, ...nextItems]);
        setIsLoadingMore(false); // Ocultar el spinner
      }, 500); // Retraso de 500ms para simular carga
    }
  }, [visibleItems, subcategories, isLoadingMore]);

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

  // Renderizado optimizado de elementos
  const renderItem = useCallback(
    ({ item }) => (
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
              {item.description ||
                "Descripción corta del producto o tendencia."}
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
    ),
    []
  );

  // Memoizar keyExtractor para evitar recreaciones
  const keyExtractor = useCallback((item) => item._id, []);

  // Componente para el indicador de carga
  const renderFooter = useCallback(() => {
    return isLoadingMore ? (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4c86A8" />
      </View>
    ) : null;
  }, [isLoadingMore]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Tendencias</Text>
        <Feather name="trending-up" size={27} color="#4c86A8" />
      </View>
      <FlatList
        data={visibleItems}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        nestedScrollEnabled={true}
        // Optimizaciones para carga progresiva
        initialNumToRender={5} // Renderiza solo 5 elementos inicialmente
        maxToRenderPerBatch={3} // Renderiza 3 elementos por lote
        windowSize={7} // Mantiene 7 elementos en memoria alrededor de la vista
        removeClippedSubviews={true} // Elimina elementos fuera de pantalla
        onEndReached={loadMoreItems} // Carga más cuando se llega al final
        onEndReachedThreshold={0.5} // Dispara loadMoreItems cuando está al 50% del final
        // Configuración para scroll suave
        showsVerticalScrollIndicator={false}
        overScrollMode="always"
        bounces={true}
        decelerationRate="normal"
        // Indicador de carga
        ListFooterComponent={renderFooter}
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
    paddingBottom: 20, // Espacio extra para el footer
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
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default TendenciasScreen;
