import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const ImageGalleryScreen = () => {
  const router = useRouter();
  const { images, index } = useLocalSearchParams();
  const [imageList, setImageList] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    try {
      const parsedImages =
        typeof images === "string" ? JSON.parse(images) : images;
      if (Array.isArray(parsedImages)) {
        setImageList(parsedImages);
        setStartIndex(index ? parseInt(index, 10) : 0);
        setCurrentIndex(index ? parseInt(index, 10) : 0);
      } else {
        console.warn("No se pudieron cargar las imágenes");
      }
    } catch (error) {
      console.error("Error al parsear imágenes:", error);
    }
  }, [images, index]);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {/* Botón para cerrar */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: 40,
          left: 20,
          zIndex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: 10,
          borderRadius: 20,
        }}
      >
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>

      {/* FlatList para navegar entre imágenes */}
      {imageList.length > 0 ? (
        <>
          <FlatList
            data={imageList}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={startIndex}
            keyExtractor={(item, i) => i.toString()}
            getItemLayout={(data, i) => ({
              length: width,
              offset: width * i,
              index: i,
            })}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setCurrentIndex(index);
            }}
            renderItem={({ item }) => (
              <View
                style={{
                  width,
                  height,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: item.url }}
                  style={{
                    width: width,
                    height: height * 0.8,
                    resizeMode: "contain",
                  }}
                />
              </View>
            )}
          />

          {/* Contador de imágenes */}
          <View
            style={{
              position: "absolute",
              bottom: 20,
              alignSelf: "center",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              padding: 8,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>
              {currentIndex + 1} / {imageList.length}
            </Text>
          </View>
        </>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Ionicons name="image-outline" size={50} color="white" />
        </View>
      )}
    </View>
  );
};

export default ImageGalleryScreen;
