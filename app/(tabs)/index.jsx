import { View, ScrollView } from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import MainHeader from "../../components/Home/MainHeader";

const HomeScreen = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainHeader />
    </GestureHandlerRootView>
  );
};

export default HomeScreen;
