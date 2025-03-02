import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
const AdminScreen = ({ navigation }) => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Button
        title="Manage Users"
        onPress={() => router.push("/admin/UserManagementScreen")}
      />
      <Button
        title="Manage Subcategory"
        onPress={() => router.push("/admin/AddSubcategoryScreen")}
      />
      <Button
        title="
      BannerScreen"
        onPress={() => router.push("BannerScreen")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default AdminScreen;
