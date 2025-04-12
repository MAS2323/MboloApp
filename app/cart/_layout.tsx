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
        <Stack.Screen name="SobreNosotrosScreen" />
        <Stack.Screen name="ArchivoScreen" />
        <Stack.Screen name="UpdateProfile" />
        <Stack.Screen name="SearchTile" />
        <Stack.Screen name="ProductEdition" />
        <Stack.Screen name="tendenciaGalleryScreen" />
        {/* Otras rutas */}
      </Stack>
    </GestureHandlerRootView>
  );
}
