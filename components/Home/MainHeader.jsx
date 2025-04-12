import { useState, useEffect, useRef } from "react";
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
  const flatListRef = useRef(null);
  const scrollPosition = useRef(0);

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

  const onRefresh = async () => {
    // Guardar posición actual del scroll
    scrollPosition.current = flatListRef.current?.contentOffset?.y || 0;

    setRefreshing(true);

    try {
      await checkExistingUser();
    } finally {
      setRefreshing(false);

      // Restaurar posición del scroll después de un breve retraso
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToOffset({
            offset: scrollPosition.current,
            animated: false,
          });
        }
      }, 100);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Fixed header section */}
      <View style={[styles.appBarWrapper, { marginTop: 53 }]}>
        <View style={styles.appBar}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="location-outline" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.location}>
            {userData ? userData?.ciudad?.name : "Guinea Ecuatorial"}
          </Text>
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity onPress={() => router.push("/cart/CartScreen")}>
              <Fontisto name="shopping-bag" size={24} color={COLORS.black} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Scrollable content */}
      <FlatList
        ref={flatListRef}
        data={[
          { key: "header", component: <Header title="EXPLORAR" /> },
          { key: "menu", component: <MenuScreen /> },
          { key: "slide", component: <SlideSecction /> },
          { key: "product", component: <ProductRow /> },
          { key: "tendencia", component: <TendenciaScreen /> },
        ]}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>{item.component}</View>
        )}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            // Estos props ayudan con la animación
            progressViewOffset={50}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={{
          paddingBottom: 30,
        }}
        // Configuración para un scroll más suave
        overScrollMode="always"
        bounces={true}
        nestedScrollEnabled={true}
        // Mantener el scroll position
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        onScroll={(event) => {
          scrollPosition.current = event.nativeEvent.contentOffset.y;
        }}
      />
    </View>
  );
}

export default MainHeader;
