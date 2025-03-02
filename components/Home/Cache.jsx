import AsyncStorage from "@react-native-async-storage/async-storage";

export const getCachedData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error fetching data from cache", e);
    return null;
  }
};

export const setCachedData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error("Error saving data to cache", e);
  }
};
