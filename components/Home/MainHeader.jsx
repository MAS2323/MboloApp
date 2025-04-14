import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  const [visibleItems, setVisibleItems] = useState([]);
  const flatListRef = useRef(null);
  const scrollPosition = useRef(0);

  // Definir todos los elementos disponibles
  const allItems = useMemo(
    () => [
      { key: "header", component: <Header title="EXPLORAR" /> },
      { key: "menu", component: <MenuScreen /> },
      { key: "slide", component: <SlideSecction /> },
      { key: "product", component: <ProductRow /> },
      { key: "tendencia", component: <TendenciaScreen /> },
    ],
    []
  );

  useEffect(() => {
    checkExistingUser();
    // Cargar solo los primeros elementos al inicio
    setVisibleItems(allItems.slice(0, 2)); // Carga inicial: header y menu
  }, [allItems]);

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
    scrollPosition.current = flatListRef.current?.contentOffset?.y || 0;
    setRefreshing(true);

    try {
      await checkExistingUser();
      setVisibleItems(allItems.slice(0, 2)); // Reiniciar a carga inicial
    } finally {
      setRefreshing(false);
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

  // Cargar más elementos cuando se llegue al final
  const loadMoreItems = useCallback(() => {
    if (visibleItems.length < allItems.length) {
      const nextItems = allItems.slice(
        visibleItems.length,
        visibleItems.length + 1
      ); // Cargar 1 elemento a la vez
      setVisibleItems((prev) => [...prev, ...nextItems]);
    }
  }, [visibleItems, allItems]);

  // Renderizado optimizado de elementos
  const renderItem = useCallback(
    ({ item }) => <View style={{ marginBottom: 20 }}>{item.component}</View>,
    []
  );

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

      {/* Scrollable content con carga progresiva */}
      <FlatList
        ref={flatListRef}
        data={visibleItems}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={50}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={{
          paddingBottom: 30,
        }}
        // Optimizaciones para carga progresiva
        initialNumToRender={2} // Renderiza solo 2 elementos inicialmente
        maxToRenderPerBatch={1} // Renderiza 1 elemento por lote
        windowSize={5} // Mantiene 5 elementos en memoria alrededor de la vista
        removeClippedSubviews={true} // Elimina elementos fuera de pantalla
        onEndReached={loadMoreItems} // Carga más cuando se llega al final
        onEndReachedThreshold={0.5} // Dispara loadMoreItems cuando está al 50% del final
        // Configuración para scroll suave
        overScrollMode="always"
        bounces={true}
        nestedScrollEnabled={true}
        decelerationRate="normal"
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 0,
        }}
        onScroll={(event) => {
          scrollPosition.current = event.nativeEvent.contentOffset.y;
        }}
      />
    </View>
  );
}

export default MainHeader;
