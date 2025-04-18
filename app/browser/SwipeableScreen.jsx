import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const { height } = Dimensions.get("window");

const SwipeableScreen = ({ children, onClose }) => {
  const translateY = useSharedValue(-height); // Inicialmente oculto arriba
  const gesture = Gesture.Pan()
    .onStart(() => {})
    .onUpdate((event) => {
      translateY.value = Math.max(-height, event.translationY - height);
    })
    .onEnd(() => {
      if (translateY.value > -height / 2) {
        // Si se desliza más de la mitad, cierra la pantalla
        translateY.value = withSpring(0, { damping: 15 });
        onClose();
      } else {
        // Vuelve a la posición inicial
        translateY.value = withSpring(-height, { damping: 15 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.swipeableContainer, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  swipeableContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default SwipeableScreen;
