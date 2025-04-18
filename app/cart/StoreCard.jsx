import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS, SIZES } from "../../constants/theme";
import { useRouter } from "expo-router";

const StoreCard = ({ store, productComments }) => {
  const router = useRouter();

  if (!store) {
    return (
      <View style={styles.container}>
        <Text style={styles.storeError}>No hay información de la tienda</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.storeTitle}>Tienda</Text>
      <TouchableOpacity
        style={styles.storeCard}
        onPress={() => router.push(`/cart/MiTiendaScreen?id=${store.id}`)}
      >
        {store.logo ? (
          <Image source={{ uri: store.logo }} style={styles.storeLogo} />
        ) : (
          <View style={[styles.storeLogo, styles.placeholderImage]}>
            <Ionicons name="storefront-outline" size={16} color={COLORS.gray} />
          </View>
        )}
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>
            {store.name || "Tienda sin nombre"}
          </Text>
          <Text style={styles.storeStats}>
            Calificación: {store.rating || "4.7"} ({store.reviews || "3000+"})
          </Text>
        </View>
        <TouchableOpacity style={styles.storeButton}>
          <Text style={styles.storeButtonText}>Visitar tienda</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SIZES.xSmall,
    paddingHorizontal: SIZES.small,
    backgroundColor: COLORS.white,
    marginVertical: SIZES.xSmall,
  },
  storeTitle: {
    fontSize: SIZES.medium,
    color: COLORS.black,
    fontWeight: "600",
    marginBottom: SIZES.xSmall,
  },
  storeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: SIZES.xSmall,
    elevation: 0,
  },
  storeLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.xSmall,
    resizeMode: "contain",
  },
  placeholderImage: {
    backgroundColor: COLORS.lightwhite,
    justifyContent: "center",
    alignItems: "center",
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: SIZES.small,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: SIZES.xSmall / 2,
  },
  storeStats: {
    fontSize: SIZES.small - 2,
    color: COLORS.gray,
  },
  storeButton: {
    backgroundColor: "#FF6200",
    borderRadius: 4,
    paddingVertical: SIZES.xSmall / 2,
    paddingHorizontal: SIZES.xSmall,
  },
  storeButtonText: {
    fontSize: SIZES.small - 2,
    color: COLORS.white,
    fontWeight: "600",
  },
  storeError: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: "center",
  },
});

export default StoreCard;
