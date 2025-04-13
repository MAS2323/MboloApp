import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TiendaScreen" />
      <Stack.Screen name="TiendaDetalle" />
      {/* Otras rutas */}
    </Stack>
  );
}
