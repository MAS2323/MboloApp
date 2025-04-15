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
        <Stack.Screen name="CrearTiendaScreen" />
        <Stack.Screen name="EditarTiendaScreen" />
        <Stack.Screen name="CreateProfessionalAccount" />
        <Stack.Screen name="CategorySelectionScreen" />
        {/* Otras rutas */}
      </Stack>
    </GestureHandlerRootView>
  );
}
