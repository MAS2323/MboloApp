import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="CartScreen" />
        <Stack.Screen name="DetallesScreen" />
        <Stack.Screen name="ProductDetails" />
        <Stack.Screen name="ProductList" />
        <Stack.Screen name="SearchScreen" />
        <Stack.Screen name="ChangeEmailScreen" />
        <Stack.Screen name="BusinessInfoScreen" />
        <Stack.Screen name="PhoneNumbersScreen" />
        <Stack.Screen name="CrearCuentaOficialScreen" />
        <Stack.Screen name="RelatedProducts" />
        <Stack.Screen name="MiTiendaScreenAdmin" />
        <Stack.Screen name="AppCenter" />
        <Stack.Screen name="StoreCard" />
        <Stack.Screen name="MiniAppWebView" options={{ headerShown: false }} />
        <Stack.Screen
          name="SobreNosotrosScreen"
          options={{
            headerShown: true,
            title: "Sobre MboloApp",
            headerTitleAlign: "center",
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#4c86A8" },
            headerTitleStyle: { fontSize: 20 },
          }}
        />
        <Stack.Screen
          name="ArchivoScreen"
          options={{
            headerShown: true,
            title: "Productos subidos",
            headerTitleAlign: "center",
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#4c86A8" },
            headerTitleStyle: { fontSize: 20 },
          }}
        />
        <Stack.Screen name="PersonalInfoScreen" />
        <Stack.Screen name="SelectSexScreen" />
        <Stack.Screen name="SearchTile" />
        <Stack.Screen name="ProductEdition" />
        <Stack.Screen name="tendenciaGalleryScreen" />
        <Stack.Screen name="AddScreen" />
        {/* Otras rutas */}
      </Stack>
    </GestureHandlerRootView>
  );
}
