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
        <Stack.Screen name="CompanyDetailsScreen" />
        <Stack.Screen name="StoreDetailsScreen" />
        <Stack.Screen name="DeliveryDetailsScreen" />
        <Stack.Screen name="CreateStoreScreen" />
        <Stack.Screen name="CrearTiendaScreen" />
        <Stack.Screen name="EditarTiendaScreen" />
        {/* Otras rutas */}
      </Stack>
    </GestureHandlerRootView>
  );
}
