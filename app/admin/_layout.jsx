import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      {/* Pantalla principal */}
      <Stack.Screen name="index" options={{ title: "Inicio" }} />
      {/* Pantallas dentro de admin */}
      <Stack.Screen name="admin" options={{ title: "Gestión de Banners" }} />
      <Stack.Screen
        name="admin/AddSubcategoryScreen"
        options={{ title: "Añadir Subcategoría" }}
      />
      <Stack.Screen
        name="admin/CategorySelectionScreen"
        options={{ title: "Seleccionar Categoría" }}
      />
      <Stack.Screen
        name="admin/LocationSelectionScreen"
        options={{ title: "Seleccionar Ubicación" }}
      />
      <Stack.Screen
        name="admin/UserManagementScreen"
        options={{ title: "Gestión de Usuarios" }}
      />
      <Stack.Screen
        name="admin/getAllSubcategory"
        options={{ title: "Todas las Subcategorías" }}
      />
      <Stack.Screen name="admin/nnn" options={{ title: "NNN" }} />{" "}
      {/* Ajusta el título según corresponda */}
      <Stack.Screen
        name="admin/banner/AllBannersScreen"
        // options={{ title: "Todos los Banners" }}
      />
      <Stack.Screen
        name="admin/banner/CreateAdScreen"
        // options={{ title: "Crear Anuncio" }}
      />
    </Stack>
  );
};

export default Layout;
