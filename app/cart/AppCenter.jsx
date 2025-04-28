import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions, // Added for responsive design
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { WebView } from "react-native-webview"; // Import WebView
import { API_BASE_URL } from "../../config/Service.Config";

// Calculate item width for 4 columns dynamically
const { width: screenWidth } = Dimensions.get("window");
const numColumns = 4;
const itemWidth = (screenWidth - 40 - (numColumns - 1) * 10) / numColumns; // 40 for horizontal padding/margins, 10 for gap between items

const AppCenter = () => {
  // Estados para almacenar los datos de las categorías
  const [entryUtilities, setEntryUtilities] = useState([]);
  const [urbanTransport, setUrbanTransport] = useState([]);
  const [travel, setTravel] = useState([]);
  const [convenienceAndLife, setConvenienceAndLife] = useState([]);
  const [error, setError] = useState(null);
  const [fundServices, setFundServices] = useState([]);
  const [charity, setCharity] = useState([]);
  const [loading, setLoading] = useState(true);
  // Estado para manejar la URL seleccionada y los datos del WebView
  const [selectedApp, setSelectedApp] = useState(null);

  // Obtener datos del backend al montar el componente
  useEffect(() => {
    const fetchApps = async () => {
      try {
        if (!API_BASE_URL) {
          throw new Error(
            "API_BASE_URL is undefined. Check Service.Config.js."
          );
        }

        const categories = [
          "Entry Utilities",
          "Urban Transport",
          "Travel",
          "Convenience & Life",
          "Fund Services",
          "Charity",
        ];

        const requests = categories.map((category) =>
          axios
            .get(`${API_BASE_URL}/api/apps/${category}`)
            .then((response) => response.data)
            .catch((error) => {
              if (error.response && error.response.status === 404) {
                return [];
              }
              throw error;
            })
        );

        const responses = await Promise.all(requests);

        setEntryUtilities(responses[0] || []);
        setUrbanTransport(responses[1] || []);
        setTravel(responses[2] || []);
        setConvenienceAndLife(responses[3] || []);
        setFundServices(responses[4] || []);
        setCharity(responses[5] || []);
      } catch (error) {
        console.error("Error al obtener las apps:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  const renderItem = ({ item }) => {
    const normalizedUrl = item.url?.startsWith("http")
      ? item.url
      : `https://${item.url}`;
    const webViewData = item.webViewData ?? "";
    // console.log("Item:", item);
    // console.log("Normalized URL:", normalizedUrl, "WebViewData:", webViewData);

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          const webViewDataString =
            typeof webViewData === "object"
              ? JSON.stringify(webViewData)
              : webViewData;
          //   console.log("Navigating with webViewData:", webViewDataString);
          try {
            router.navigate(
              `/cart/MiniAppWebView?webViewData=${encodeURIComponent(
                webViewDataString
              )}`
            );
            // console.log("Navigation initiated successfully");
          } catch (error) {
            console.error("Navigation error:", error);
          }
        }}
      >
        <MaterialIcons
          name={item.icon}
          size={40}
          color="#666"
          style={styles.icon}
        />
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  // Si hay una app seleccionada, mostrar el WebView
  if (selectedApp) {
    const injectedJavaScript = `
      window.webViewData = ${JSON.stringify(selectedApp.webViewData)};
      true;
    `;

    return (
      <SafeAreaView style={styles.safeContainer}>
        {/* Header con botón para cerrar el WebView */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedApp(null)}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AppCenter</Text>
          {/* Commented out search button */}
          {/* <TouchableOpacity>
            <MaterialIcons name="search" size={24} color="#000" />
          </TouchableOpacity> */}
        </View>
        {/* WebView para mostrar el contenido web */}
        <WebView
          source={{ uri: selectedApp.url }}
          style={styles.webView}
          injectedJavaScript={injectedJavaScript}
          javaScriptEnabled={true}
          startInLoadingState={true}
          onMessage={(event) => {
            console.log("Message from WebView:", event.nativeEvent.data);
          }}
        />
      </SafeAreaView>
    );
  }

  // Mostrar la lista de aplicaciones si no hay ninguna seleccionada
  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Header fija */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AppCenter</Text>
        {/* Commented out search button */}
        {/* <TouchableOpacity>
          <MaterialIcons name="search" size={24} color="#000" />
        </TouchableOpacity> */}
      </View>

      {/* Contenido desplazable */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sección Home Apps */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Home Apps</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.homeAppsContainer}>
            <MaterialIcons
              name="star"
              size={40}
              color="#666"
              style={styles.homeAppIcon}
            />
            <MaterialIcons
              name="flight"
              size={40}
              color="#666"
              style={styles.homeAppIcon}
            />
            <MaterialIcons
              name="hotel"
              size={40}
              color="#666"
              style={styles.homeAppIcon}
            />
          </View>
        </View>

        {/* Sección Entry Utilities */}
        {entryUtilities.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Entry Utilities</Text>
            <FlatList
              data={entryUtilities}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              numColumns={numColumns}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContent} // Added to align items to the left
            />
          </View>
        )}

        {/* Sección Urban Transport */}
        {urbanTransport.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Urban Transport</Text>
            <FlatList
              data={urbanTransport}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              numColumns={numColumns}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContent} // Added to align items to the left
            />
          </View>
        )}

        {/* Sección Travel */}
        {travel.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Travel</Text>
            <FlatList
              data={travel}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              numColumns={numColumns}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContent} // Added to align items to the left
            />
          </View>
        )}

        {/* Sección Convenience & Life */}
        {convenienceAndLife.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Convenience & Life</Text>
            <FlatList
              data={convenienceAndLife}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              numColumns={numColumns}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContent} // Added to align items to the left
            />
          </View>
        )}

        {/* Sección Fund Services */}
        {fundServices.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Fund Services</Text>
            <FlatList
              data={fundServices}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              numColumns={numColumns}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContent} // Added to align items to the left
            />
          </View>
        )}

        {/* Sección Charity */}
        {charity.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Charity</Text>
            <FlatList
              data={charity}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              numColumns={numColumns}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContent} // Added to align items to the left
            />
          </View>
        )}

        {/* Texto final */}
        <Text style={styles.footerText}>
          Disfruta de servicios encantadores en MboloApp
        </Text>

        {/* Espacio adicional para evitar que el contenido se corte */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    // backgroundColor: "#f5f7fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between", // Changed to space-between to balance back button and title
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    // backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    flex: 1, // Allow title to take remaining space
    textAlign: "center", // Center the text
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  sectionContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  editButton: {
    backgroundColor: "#4c86A8",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  homeAppsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  homeAppIcon: {
    marginRight: 15,
  },
  flatListContent: {
    alignItems: "flex-start", // Align items to the left
  },
  itemContainer: {
    width: itemWidth, // Dynamic width for responsiveness
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 5,
  },
  icon: {
    marginBottom: 5,
  },
  itemText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
  },
  bottomSpacer: {
    height: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webView: {
    flex: 1,
  },
});

export default AppCenter;
