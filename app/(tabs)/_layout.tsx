import { Tabs } from "expo-router";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "@/constants/theme";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary, // Color cuando está activo
        tabBarInactiveTintColor: "#95a5a6", // Color cuando está inactivo
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="AddScreen"
        options={{
          title: "Nuevo Producto",
          headerTitleAlign: "center",
          // headerShown: true,
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="add-circle" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Favorite"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="heart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
