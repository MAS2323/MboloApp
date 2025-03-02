import { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from "react-native";
import styles from "../ui/mainHome.Style";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "./Header";
import MenuScreen from "./MenuScreen";
import SlideSecction from "./SlideSecction";
import TendenciaScreen from "./TendenciaScreen";
import ProductRow from "./../Producs/ProductRow";
import { useRouter } from "expo-router";

function MainHeader() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userLogin, setUserLogin] = useState(false);

  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    const id = await AsyncStorage.getItem("id");
    const useId = `user${JSON.parse(id)}`;

    try {
      const currentUser = await AsyncStorage.getItem(useId);
      if (currentUser !== null) {
        const parsedData = JSON.parse(currentUser);
        setUserData(parsedData);
        setUserLogin(true);
      }
    } catch (error) {
      console.log("Error recuperando tus datos:", error);
    }
  };

  // const onRefresh = async () => {
  //   setRefreshing(true);
  //   // Aquí puedes agregar la lógica de actualización, como volver a cargar los datos
  //   await checkExistingUser();
  //   setRefreshing(false);
  // };

  const onRefresh = () => {
    setRefreshing(true);
    // Simula una carga de datos
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // Lista de componentes a renderizar
  const components = [
    { key: "header", component: <Header title="EXPLORAR" /> },
    { key: "menu", component: <MenuScreen /> },
    { key: "slide", component: <SlideSecction /> },
    { key: "product", component: <ProductRow /> },
    { key: "tendencia", component: <TendenciaScreen /> },
  ];

  return (
    <View>
      <View style={[styles.appBarWrapper, { marginTop: 53 }]}>
        <View style={styles.appBar}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="location-outline" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.location}>
            {userData ? userData?.ciudad?.name : "Guinea Ecuatorial"}
          </Text>

          <View style={{ alignItems: "flex-end" }}>
            {/* <View style={styles.cartCount}>
                  <Text style={styles.cartNumber}> 8 </Text>
                </View> */}

            <TouchableOpacity onPress={() => router.push("/cart/CartScreen")}>
              <Fontisto name="shopping-bag" size={24} color={COLORS.black} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={components}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => item.component}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

export default MainHeader;
