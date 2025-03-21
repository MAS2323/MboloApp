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
      <Stack.Screen name="CategorySelectionScreen" />
      <Stack.Screen name="LocationSelectionScreen" />
      <Stack.Screen name="getAllSubcategory" />
      <Stack.Screen name="index" />
      {/* Otras rutas */}
    </Stack>
  );
}
