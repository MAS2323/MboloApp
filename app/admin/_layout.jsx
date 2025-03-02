import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AddSubcategoryScreen" />
      <Stack.Screen name="UserManagementScreen" />
      <Stack.Screen name="index" />
      {/* Otras rutas */}
    </Stack>
  );
}
