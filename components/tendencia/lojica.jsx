import { StyleSheet, Text, View } from "react-native";
import React from "react";

const lojica = () => {
  const [favorites, setFavorites] = useState([]);
  const handleFavoritePress = async (item) => {
    try {
      const newFavorites = [...favorites];
      const index = newFavorites.findIndex((fav) => fav._id === item._id);

      if (index > -1) {
        newFavorites.splice(index, 1); // Remove from favorites
        await axios.delete(`${API_BASE_URL}/favorites/${userId}/${item._id}`);
      } else {
        newFavorites.push(item); // Add to favorites
        await axios.post(`${API_BASE_URL}/favorites/${userId}/${item._id}`, {
          userId: userId,
          subcategoryId: item._id,
        });
      }

      setFavorites(newFavorites);
    } catch (error) {
      console.error("Error updating favorites:", error);
      setFavorites([...favorites]);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => handleFavoritePress(item)}>
        {/* <AntDesign
                      name={
                        favorites.some((fav) => fav._id === item._id)
                          ? "heart"
                          : "hearto"
                      }
                      size={24}
                      color="red"
                      style={styles.heartIcon}
                    /> */}
      </TouchableOpacity>
    </View>
  );
};

export default lojica;

const styles = StyleSheet.create({});
