import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CategoryDetailScreen" />
      <Stack.Screen name="CategoryFormScreen" />
      <Stack.Screen name="CategoryListScreen" />
      <Stack.Screen name="ScrollSubcategoris" />
      <Stack.Screen name="SearchSubcategory" />
      <Stack.Screen name="SubcategoriesScreen" />
      <Stack.Screen name="SubCategoryDetails" />
      <Stack.Screen name="CategoryMenuScreen" />
      <Stack.Screen name="SubCategoryMenuScreen" />
      {/* Otras rutas */}
    </Stack>
  );
}
